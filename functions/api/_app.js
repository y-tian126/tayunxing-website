import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import bcrypt from 'bcryptjs'

/* ========== JWT 工具 ========== */

function base64UrlEncode(str) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) str += '='
  return atob(str)
}

async function hmacSha256(key, data) {
  const enc = new TextEncoder()
  const cryptoKey = await crypto.subtle.importKey(
    'raw', enc.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(data))
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
}

async function jwtSign(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const h = base64UrlEncode(JSON.stringify(header))
  const p = base64UrlEncode(JSON.stringify(payload))
  const signature = await hmacSha256(secret, `${h}.${p}`)
  return `${h}.${p}.${base64UrlEncode(signature)}`
}

async function jwtVerify(token, secret) {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [h, p, s] = parts
  const expected = await hmacSha256(secret, `${h}.${p}`)
  if (base64UrlEncode(expected) !== s.replace(/=+$/, '')) return null
  try {
    const payload = JSON.parse(base64UrlDecode(p))
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch { return null }
}

/* ========== 辅助函数 ========== */

const ok = (data, message = 'success') => ({ code: 200, message, data })
const fail = (message, code = 400) => ({ code, message, data: null })

const CATEGORY_MAP = { company: '公司动态', insight: '行业洞察', event: '活动回顾' }

function mapCase(row) {
  if (!row) return null
  let highlights = []
  try { highlights = JSON.parse(row.data_highlights || '[]') } catch (e) { highlights = [] }
  return {
    id: row.id, title: row.title, brand: row.brand_name,
    industry: row.industry, industryLabel: row.industry_label,
    cover: row.cover, image: row.image, summary: row.summary,
    challenge: row.challenge, solution: row.solution,
    result: row.result, testimonial: row.testimonial, highlights,
  }
}

/* ========== Auth 中间件 ========== */

async function authMiddleware(c, next) {
  const auth = c.req.header('Authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!token) throw new HTTPException(401, { message: '未登录' })
  const payload = await jwtVerify(token, c.env.JWT_SECRET)
  if (!payload) throw new HTTPException(401, { message: '登录已过期' })
  c.set('adminId', payload.id)
  c.set('adminName', payload.username)
  await next()
}

/* ========== App ========== */

const app = new Hono()

app.use('/api/*', async (c, next) => {
  const origin = c.env.CORS_ORIGIN || '*'
  return cors({
    origin, allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'], maxAge: 86400,
  })(c, next)
})

// ---- 前台 API ----
app.get('/api/v1/stats', async (c) => {
  const rows = await c.env.DB.prepare('SELECT value, label FROM stats ORDER BY sort_order').all()
  return c.json(ok(rows.results))
})

app.get('/api/v1/partners', async (c) => {
  const rows = await c.env.DB.prepare('SELECT name, logo_url AS logoUrl FROM partners WHERE is_visible=1 ORDER BY sort_order').all()
  return c.json(ok(rows.results))
})

app.get('/api/v1/articles', async (c) => {
  const category = c.req.query('category')
  const page = Number(c.req.query('page') || 1)
  const size = Number(c.req.query('size') || 10)
  let where = "status='published'"
  const params = []
  if (category && category !== 'all') { where += ' AND category=?'; params.push(category) }
  const countRow = await c.env.DB.prepare(`SELECT COUNT(*) AS c FROM articles WHERE ${where}`).bind(...params).first()
  const offset = (page - 1) * size
  const rows = await c.env.DB.prepare(
    `SELECT id,title,summary,cover_image AS coverImage,category,publish_time AS date,view_count AS viewCount FROM articles WHERE ${where} ORDER BY publish_time DESC LIMIT ? OFFSET ?`
  ).bind(...params, size, offset).all()
  const list = rows.results.map((r) => ({ ...r, categoryLabel: CATEGORY_MAP[r.category] || r.category }))
  return c.json(ok({ list, total: countRow.c, page, size }))
})

app.get('/api/v1/articles/:id', async (c) => {
  const id = c.req.param('id')
  const row = await c.env.DB.prepare('SELECT * FROM articles WHERE id=?').bind(id).first()
  if (!row) throw new HTTPException(404, { message: '文章不存在' })
  await c.env.DB.prepare('UPDATE articles SET view_count=view_count+1 WHERE id=?').bind(id).run()
  return c.json(ok({
    id: row.id, title: row.title, summary: row.summary, content: row.content,
    coverImage: row.cover_image, category: row.category,
    categoryLabel: CATEGORY_MAP[row.category] || row.category,
    date: row.publish_time, viewCount: row.view_count + 1,
  }))
})

app.get('/api/v1/cases', async (c) => {
  const industry = c.req.query('industry')
  const page = Number(c.req.query('page') || 1)
  const size = Number(c.req.query('size') || 12)
  let where = "status='published'"
  const params = []
  if (industry && industry !== 'all') { where += ' AND industry=?'; params.push(industry) }
  const countRow = await c.env.DB.prepare(`SELECT COUNT(*) AS c FROM cases WHERE ${where}`).bind(...params).first()
  const offset = (page - 1) * size
  const rows = await c.env.DB.prepare(
    `SELECT * FROM cases WHERE ${where} ORDER BY sort_order LIMIT ? OFFSET ?`
  ).bind(...params, size, offset).all()
  return c.json(ok({ list: rows.results.map(mapCase), total: countRow.c, page, size }))
})

app.get('/api/v1/cases/:id', async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM cases WHERE id=?').bind(c.req.param('id')).first()
  if (!row) throw new HTTPException(404, { message: '案例不存在' })
  return c.json(ok(mapCase(row)))
})

app.post('/api/v1/consultations', async (c) => {
  const body = await c.req.json()
  const { company, contactName, phone, email, message } = body
  if (!contactName || !phone) throw new HTTPException(400, { message: '联系人和电话为必填项' })
  const result = await c.env.DB.prepare(
    'INSERT INTO consultations (company,contact_name,phone,email,message) VALUES (?,?,?,?,?)'
  ).bind(company || '', contactName, phone, email || '', message || '').run()
  return c.json(ok({ id: result.meta.last_row_id }, '提交成功'))
})

app.get('/api/v1/solutions', async (c) => {
  const rows = await c.env.DB.prepare('SELECT * FROM solutions WHERE is_visible=1 ORDER BY sort_order').all()
  return c.json(ok(rows.results.map((r) => ({
    id: r.id, category: r.category, categoryLabel: r.category_label,
    title: r.title, pain: r.pain, strategy: r.strategy,
    actions: JSON.parse(r.actions || '[]'), results: JSON.parse(r.results || '[]'),
  }))))
})

// ---- 后台 API ----
app.post('/api/v1/admin/login', async (c) => {
  const body = await c.req.json()
  const { username, password } = body
  const user = await c.env.DB.prepare('SELECT * FROM admins WHERE username=?').bind(username || '').first()
  if (!user || !bcrypt.compareSync(password || '', user.password_hash))
    throw new HTTPException(401, { message: '用户名或密码错误' })
  const token = await jwtSign({ id: user.id, username: user.username }, c.env.JWT_SECRET)
  return c.json(ok({ token, displayName: user.display_name, username: user.username }))
})

app.use('/api/v1/admin/*', authMiddleware)

// 文章管理
app.get('/api/v1/admin/articles', async (c) => {
  const rows = await c.env.DB.prepare('SELECT id,title,category,status,publish_time AS date,view_count AS viewCount,created_at AS createdAt FROM articles ORDER BY id DESC').all()
  return c.json(ok(rows.results.map((r) => ({ ...r, categoryLabel: CATEGORY_MAP[r.category] || r.category }))))
})
app.post('/api/v1/admin/articles', async (c) => {
  const body = await c.req.json()
  if (!body.title) throw new HTTPException(400, { message: '标题必填' })
  const r = await c.env.DB.prepare('INSERT INTO articles (title,summary,content,cover_image,category,status,publish_time) VALUES (?,?,?,?,?,?,?)').bind(body.title, body.summary||'', body.content||'', body.coverImage||'', body.category||'company', body.status||'draft', body.date||new Date().toISOString().slice(0,10)).run()
  return c.json(ok({ id: r.meta.last_row_id }, '创建成功'))
})
app.put('/api/v1/admin/articles/:id', async (c) => {
  const body = await c.req.json()
  await c.env.DB.prepare(`UPDATE articles SET title=?,summary=?,content=?,cover_image=?,category=?,status=?,publish_time=?,updated_at=datetime('now','localtime') WHERE id=?`).bind(body.title,body.summary||'',body.content||'',body.coverImage||'',body.category||'company',body.status||'draft',body.date||null,c.req.param('id')).run()
  return c.json(ok(null, '更新成功'))
})
app.delete('/api/v1/admin/articles/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM articles WHERE id=?').bind(c.req.param('id')).run()
  return c.json(ok(null, '删除成功'))
})

// 案例管理
app.get('/api/v1/admin/cases', async (c) => {
  const rows = await c.env.DB.prepare('SELECT * FROM cases ORDER BY sort_order').all()
  return c.json(ok(rows.results.map(mapCase)))
})
app.post('/api/v1/admin/cases', async (c) => {
  const b = await c.req.json()
  if (!b.title) throw new HTTPException(400, { message: '标题必填' })
  const r = await c.env.DB.prepare('INSERT INTO cases (title,brand_name,industry,industry_label,cover,image,summary,challenge,solution,result,testimonial,data_highlights,sort_order,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(b.title,b.brand||'',b.industry||'other',b.industryLabel||'',b.cover||'',b.image||'',b.summary||'',b.challenge||'',b.solution||'',b.result||'',b.testimonial||'',JSON.stringify(b.highlights||[]),b.sortOrder||0,b.status||'draft').run()
  return c.json(ok({ id: r.meta.last_row_id }, '创建成功'))
})
app.put('/api/v1/admin/cases/:id', async (c) => {
  const b = await c.req.json()
  await c.env.DB.prepare(`UPDATE cases SET title=?,brand_name=?,industry=?,industry_label=?,cover=?,image=?,summary=?,challenge=?,solution=?,result=?,testimonial=?,data_highlights=?,sort_order=?,status=?,updated_at=datetime('now','localtime') WHERE id=?`).bind(b.title,b.brand||'',b.industry||'other',b.industryLabel||'',b.cover||'',b.image||'',b.summary||'',b.challenge||'',b.solution||'',b.result||'',b.testimonial||'',JSON.stringify(b.highlights||[]),b.sortOrder||0,b.status||'draft',c.req.param('id')).run()
  return c.json(ok(null, '更新成功'))
})
app.delete('/api/v1/admin/cases/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM cases WHERE id=?').bind(c.req.param('id')).run()
  return c.json(ok(null, '删除成功'))
})

// 合作品牌管理
app.get('/api/v1/admin/partners', async (c) => {
  const rows = await c.env.DB.prepare('SELECT id,name,logo_url AS logoUrl,sort_order AS sortOrder,is_visible AS isVisible FROM partners ORDER BY sort_order').all()
  return c.json(ok(rows.results))
})
app.post('/api/v1/admin/partners', async (c) => {
  const b = await c.req.json()
  if (!b.name) throw new HTTPException(400, { message: '品牌名必填' })
  const r = await c.env.DB.prepare('INSERT INTO partners (name,logo_url,sort_order,is_visible) VALUES (?,?,?,1)').bind(b.name,b.logoUrl||'',b.sortOrder||0).run()
  return c.json(ok({ id: r.meta.last_row_id }, '创建成功'))
})
app.put('/api/v1/admin/partners/:id', async (c) => {
  const b = await c.req.json()
  await c.env.DB.prepare('UPDATE partners SET name=?,logo_url=?,sort_order=?,is_visible=? WHERE id=?').bind(b.name,b.logoUrl||'',b.sortOrder||0,b.isVisible===false?0:1,c.req.param('id')).run()
  return c.json(ok(null, '更新成功'))
})
app.delete('/api/v1/admin/partners/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM partners WHERE id=?').bind(c.req.param('id')).run()
  return c.json(ok(null, '删除成功'))
})

// 数据亮点管理
app.get('/api/v1/admin/stats', async (c) => {
  const rows = await c.env.DB.prepare('SELECT id,value,label,sort_order AS sortOrder FROM stats ORDER BY sort_order').all()
  return c.json(ok(rows.results))
})
app.put('/api/v1/admin/stats', async (c) => {
  const body = await c.req.json()
  if (!Array.isArray(body.items)) throw new HTTPException(400, { message: '参数错误' })
  await c.env.DB.prepare('DELETE FROM stats').run()
  for (let i = 0; i < body.items.length; i++)
    await c.env.DB.prepare('INSERT INTO stats (value,label,sort_order) VALUES (?,?,?)').bind(body.items[i].value, body.items[i].label, i+1).run()
  return c.json(ok(null, '更新成功'))
})

// 咨询管理
app.get('/api/v1/admin/consultations', async (c) => {
  const rows = await c.env.DB.prepare('SELECT id,company,contact_name AS contactName,phone,email,message,status,created_at AS createdAt FROM consultations ORDER BY id DESC').all()
  return c.json(ok(rows.results))
})
app.put('/api/v1/admin/consultations/:id/status', async (c) => {
  const body = await c.req.json()
  await c.env.DB.prepare('UPDATE consultations SET status=? WHERE id=?').bind(body.status||'pending', c.req.param('id')).run()
  return c.json(ok(null, '更新成功'))
})
app.delete('/api/v1/admin/consultations/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM consultations WHERE id=?').bind(c.req.param('id')).run()
  return c.json(ok(null, '删除成功'))
})

// 解决方案管理
app.get('/api/v1/admin/solutions', async (c) => {
  const rows = await c.env.DB.prepare('SELECT * FROM solutions ORDER BY sort_order').all()
  return c.json(ok(rows.results.map((r) => ({
    id: r.id, category: r.category, categoryLabel: r.category_label,
    title: r.title, pain: r.pain, strategy: r.strategy,
    actions: JSON.parse(r.actions || '[]'), results: JSON.parse(r.results || '[]'),
    sortOrder: r.sort_order, isVisible: r.is_visible === 1,
  }))))
})
app.post('/api/v1/admin/solutions', async (c) => {
  const b = await c.req.json()
  if (!b.title) throw new HTTPException(400, { message: '标题必填' })
  const r = await c.env.DB.prepare('INSERT INTO solutions (category,category_label,title,pain,strategy,actions,results,sort_order,is_visible) VALUES (?,?,?,?,?,?,?,?,?)').bind(b.category||'',b.categoryLabel||'',b.title,b.pain||'',b.strategy||'',JSON.stringify(b.actions||[]),JSON.stringify(b.results||[]),b.sortOrder||0,b.isVisible===false?0:1).run()
  return c.json(ok({ id: r.meta.last_row_id }, '创建成功'))
})
app.put('/api/v1/admin/solutions/:id', async (c) => {
  const b = await c.req.json()
  await c.env.DB.prepare(`UPDATE solutions SET category=?,category_label=?,title=?,pain=?,strategy=?,actions=?,results=?,sort_order=?,is_visible=?,updated_at=datetime('now','localtime') WHERE id=?`).bind(b.category||'',b.categoryLabel||'',b.title,b.pain||'',b.strategy||'',JSON.stringify(b.actions||[]),JSON.stringify(b.results||[]),b.sortOrder||0,b.isVisible===false?0:1,c.req.param('id')).run()
  return c.json(ok(null, '更新成功'))
})
app.delete('/api/v1/admin/solutions/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM solutions WHERE id=?').bind(c.req.param('id')).run()
  return c.json(ok(null, '删除成功'))
})

app.post('/api/v1/admin/upload', (c) => c.json(fail('请直接在编辑器中粘贴图片 URL，无需上传')))
app.get('/api/v1/health', (c) => c.json(ok({ status: 'UP' })))
app.notFound((c) => c.json(fail('接口不存在', 404)))
app.onError((err, c) => {
  if (err instanceof HTTPException) return c.json(fail(err.message, err.status), err.status)
  console.error('[api error]', err)
  return c.json(fail('服务器内部错误', 500), 500)
})

export default app
