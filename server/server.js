const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const bcrypt = require('bcryptjs')
const db = require('./db')
const { sign, verify } = require('./auth')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json({ limit: '5mb' }))

// 上传文件静态访问
const UPLOAD_DIR = path.join(__dirname, 'uploads')
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR)
app.use('/uploads', express.static(UPLOAD_DIR))

// multer 配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`)
  },
})
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })

const ok = (data, message = 'success') => ({ code: 200, message, data })
const fail = (message, code = 400) => ({ code, message, data: null })

// 案例行 -> 前端对象（解析 data_highlights JSON）
function mapCase(row) {
  if (!row) return null
  let highlights = []
  try { highlights = JSON.parse(row.data_highlights || '[]') } catch (e) { highlights = [] }
  return {
    id: row.id,
    title: row.title,
    brand: row.brand_name,
    industry: row.industry,
    industryLabel: row.industry_label,
    cover: row.cover,
    image: row.image,
    summary: row.summary,
    challenge: row.challenge,
    solution: row.solution,
    result: row.result,
    testimonial: row.testimonial,
    highlights,
  }
}

const CATEGORY_MAP = { company: '公司动态', insight: '行业洞察', event: '活动回顾' }

/* ===================== 前台 API ===================== */

app.get('/api/v1/stats', (req, res) => {
  const rows = db.all('SELECT value, label FROM stats ORDER BY sort_order')
  res.json(ok(rows))
})

app.get('/api/v1/partners', (req, res) => {
  const rows = db.all('SELECT name, logo_url AS logoUrl FROM partners WHERE is_visible=1 ORDER BY sort_order')
  res.json(ok(rows))
})

app.get('/api/v1/articles', (req, res) => {
  const { category, page = 1, size = 10 } = req.query
  const where = ["status='published'"]
  const params = []
  if (category && category !== 'all') { where.push('category=?'); params.push(category) }
  const total = db.get(`SELECT COUNT(*) AS c FROM articles WHERE ${where.join(' AND ')}`, params).c
  const offset = (Number(page) - 1) * Number(size)
  const rows = db.all(
    `SELECT id,title,summary,cover_image AS coverImage,category,publish_time AS date,view_count AS viewCount
     FROM articles WHERE ${where.join(' AND ')} ORDER BY publish_time DESC LIMIT ? OFFSET ?`,
    [...params, Number(size), offset]
  ).map((r) => ({ ...r, categoryLabel: CATEGORY_MAP[r.category] || r.category }))
  res.json(ok({ list: rows, total, page: Number(page), size: Number(size) }))
})

app.get('/api/v1/articles/:id', (req, res) => {
  const row = db.get('SELECT * FROM articles WHERE id=?', [req.params.id])
  if (!row) return res.status(404).json(fail('文章不存在', 404))
  db.run('UPDATE articles SET view_count=view_count+1 WHERE id=?', [row.id])
  res.json(ok({
    id: row.id, title: row.title, summary: row.summary, content: row.content,
    coverImage: row.cover_image, category: row.category,
    categoryLabel: CATEGORY_MAP[row.category] || row.category,
    date: row.publish_time, viewCount: row.view_count + 1,
  }))
})

app.get('/api/v1/cases', (req, res) => {
  const { industry, page = 1, size = 12 } = req.query
  const where = ["status='published'"]
  const params = []
  if (industry && industry !== 'all') { where.push('industry=?'); params.push(industry) }
  const total = db.get(`SELECT COUNT(*) AS c FROM cases WHERE ${where.join(' AND ')}`, params).c
  const offset = (Number(page) - 1) * Number(size)
  const rows = db.all(
    `SELECT * FROM cases WHERE ${where.join(' AND ')} ORDER BY sort_order LIMIT ? OFFSET ?`,
    [...params, Number(size), offset]
  ).map(mapCase)
  res.json(ok({ list: rows, total, page: Number(page), size: Number(size) }))
})

app.get('/api/v1/cases/:id', (req, res) => {
  const row = db.get('SELECT * FROM cases WHERE id=?', [req.params.id])
  if (!row) return res.status(404).json(fail('案例不存在', 404))
  res.json(ok(mapCase(row)))
})

app.post('/api/v1/consultations', (req, res) => {
  const { company, contactName, phone, email, message } = req.body
  if (!contactName || !phone) return res.status(400).json(fail('联系人和电话为必填项'))
  const { lastId } = db.run(
    'INSERT INTO consultations (company,contact_name,phone,email,message) VALUES (?,?,?,?,?)',
    [company || '', contactName, phone, email || '', message || '']
  )
  res.json(ok({ id: lastId }, '提交成功'))
})

app.get('/api/v1/solutions', (req, res) => {
  const rows = db.all('SELECT * FROM solutions WHERE is_visible=1 ORDER BY sort_order').map((r) => ({
    id: r.id, category: r.category, categoryLabel: r.category_label,
    title: r.title, pain: r.pain, strategy: r.strategy,
    actions: JSON.parse(r.actions || '[]'), results: JSON.parse(r.results || '[]'),
  }))
  res.json(ok(rows))
})

/* ===================== 后台 API ===================== */

app.post('/api/v1/admin/login', (req, res) => {
  const { username, password } = req.body
  const user = db.get('SELECT * FROM admins WHERE username=?', [username || ''])
  if (!user || !bcrypt.compareSync(password || '', user.password_hash)) {
    return res.status(401).json(fail('用户名或密码错误', 401))
  }
  res.json(ok({ token: sign(user), displayName: user.display_name, username: user.username }))
})

// ---- 文章管理 ----
app.get('/api/v1/admin/articles', verify, (req, res) => {
  const rows = db.all('SELECT id,title,category,status,publish_time AS date,view_count AS viewCount,created_at AS createdAt FROM articles ORDER BY id DESC')
    .map((r) => ({ ...r, categoryLabel: CATEGORY_MAP[r.category] || r.category }))
  res.json(ok(rows))
})
app.post('/api/v1/admin/articles', verify, (req, res) => {
  const { title, summary, content, coverImage, category, status, date } = req.body
  if (!title) return res.status(400).json(fail('标题必填'))
  const { lastId } = db.run(
    'INSERT INTO articles (title,summary,content,cover_image,category,status,publish_time) VALUES (?,?,?,?,?,?,?)',
    [title, summary || '', content || '', coverImage || '', category || 'company', status || 'draft', date || new Date().toISOString().slice(0, 10)]
  )
  res.json(ok({ id: lastId }, '创建成功'))
})
app.put('/api/v1/admin/articles/:id', verify, (req, res) => {
  const { title, summary, content, coverImage, category, status, date } = req.body
  db.run(
    `UPDATE articles SET title=?,summary=?,content=?,cover_image=?,category=?,status=?,publish_time=?,updated_at=datetime('now','localtime') WHERE id=?`,
    [title, summary || '', content || '', coverImage || '', category || 'company', status || 'draft', date || null, req.params.id]
  )
  res.json(ok(null, '更新成功'))
})
app.delete('/api/v1/admin/articles/:id', verify, (req, res) => {
  db.run('DELETE FROM articles WHERE id=?', [req.params.id])
  res.json(ok(null, '删除成功'))
})

// ---- 案例管理 ----
app.get('/api/v1/admin/cases', verify, (req, res) => {
  res.json(ok(db.all('SELECT * FROM cases ORDER BY sort_order').map(mapCase)))
})
app.post('/api/v1/admin/cases', verify, (req, res) => {
  const c = req.body
  if (!c.title) return res.status(400).json(fail('标题必填'))
  const { lastId } = db.run(
    'INSERT INTO cases (title,brand_name,industry,industry_label,cover,image,summary,challenge,solution,result,testimonial,data_highlights,sort_order,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    [c.title, c.brand || '', c.industry || 'other', c.industryLabel || '', c.cover || '', c.image || '', c.summary || '', c.challenge || '', c.solution || '', c.result || '', c.testimonial || '', JSON.stringify(c.highlights || []), c.sortOrder || 0, c.status || 'draft']
  )
  res.json(ok({ id: lastId }, '创建成功'))
})
app.put('/api/v1/admin/cases/:id', verify, (req, res) => {
  const c = req.body
  db.run(
    `UPDATE cases SET title=?,brand_name=?,industry=?,industry_label=?,cover=?,image=?,summary=?,challenge=?,solution=?,result=?,testimonial=?,data_highlights=?,sort_order=?,status=?,updated_at=datetime('now','localtime') WHERE id=?`,
    [c.title, c.brand || '', c.industry || 'other', c.industryLabel || '', c.cover || '', c.image || '', c.summary || '', c.challenge || '', c.solution || '', c.result || '', c.testimonial || '', JSON.stringify(c.highlights || []), c.sortOrder || 0, c.status || 'draft', req.params.id]
  )
  res.json(ok(null, '更新成功'))
})
app.delete('/api/v1/admin/cases/:id', verify, (req, res) => {
  db.run('DELETE FROM cases WHERE id=?', [req.params.id])
  res.json(ok(null, '删除成功'))
})

// ---- 合作品牌管理 ----
app.get('/api/v1/admin/partners', verify, (req, res) => {
  res.json(ok(db.all('SELECT id,name,logo_url AS logoUrl,sort_order AS sortOrder,is_visible AS isVisible FROM partners ORDER BY sort_order')))
})
app.post('/api/v1/admin/partners', verify, (req, res) => {
  const { name, logoUrl, sortOrder } = req.body
  if (!name) return res.status(400).json(fail('品牌名必填'))
  const { lastId } = db.run('INSERT INTO partners (name,logo_url,sort_order,is_visible) VALUES (?,?,?,1)', [name, logoUrl || '', sortOrder || 0])
  res.json(ok({ id: lastId }, '创建成功'))
})
app.put('/api/v1/admin/partners/:id', verify, (req, res) => {
  const { name, logoUrl, sortOrder, isVisible } = req.body
  db.run('UPDATE partners SET name=?,logo_url=?,sort_order=?,is_visible=? WHERE id=?', [name, logoUrl || '', sortOrder || 0, isVisible === false ? 0 : 1, req.params.id])
  res.json(ok(null, '更新成功'))
})
app.delete('/api/v1/admin/partners/:id', verify, (req, res) => {
  db.run('DELETE FROM partners WHERE id=?', [req.params.id])
  res.json(ok(null, '删除成功'))
})

// ---- 数据亮点管理 ----
app.get('/api/v1/admin/stats', verify, (req, res) => {
  res.json(ok(db.all('SELECT id,value,label,sort_order AS sortOrder FROM stats ORDER BY sort_order')))
})
app.put('/api/v1/admin/stats', verify, (req, res) => {
  const { items } = req.body
  if (!Array.isArray(items)) return res.status(400).json(fail('参数错误'))
  db.run('DELETE FROM stats')
  items.forEach((s, i) => db.run('INSERT INTO stats (value,label,sort_order) VALUES (?,?,?)', [s.value, s.label, i + 1]))
  res.json(ok(null, '更新成功'))
})

// ---- 咨询管理 ----
app.get('/api/v1/admin/consultations', verify, (req, res) => {
  res.json(ok(db.all('SELECT id,company,contact_name AS contactName,phone,email,message,status,created_at AS createdAt FROM consultations ORDER BY id DESC')))
})
app.put('/api/v1/admin/consultations/:id/status', verify, (req, res) => {
  db.run('UPDATE consultations SET status=? WHERE id=?', [req.body.status || 'pending', req.params.id])
  res.json(ok(null, '更新成功'))
})
app.delete('/api/v1/admin/consultations/:id', verify, (req, res) => {
  db.run('DELETE FROM consultations WHERE id=?', [req.params.id])
  res.json(ok(null, '删除成功'))
})

// ---- 解决方案管理 ----
app.get('/api/v1/admin/solutions', verify, (req, res) => {
  const rows = db.all('SELECT * FROM solutions ORDER BY sort_order').map((r) => ({
    id: r.id, category: r.category, categoryLabel: r.category_label,
    title: r.title, pain: r.pain, strategy: r.strategy,
    actions: JSON.parse(r.actions || '[]'), results: JSON.parse(r.results || '[]'),
    sortOrder: r.sort_order, isVisible: r.is_visible === 1,
  }))
  res.json(ok(rows))
})
app.post('/api/v1/admin/solutions', verify, (req, res) => {
  const s = req.body
  if (!s.title) return res.status(400).json(fail('标题必填'))
  const { lastId } = db.run(
    'INSERT INTO solutions (category,category_label,title,pain,strategy,actions,results,sort_order,is_visible) VALUES (?,?,?,?,?,?,?,?,?)',
    [s.category || '', s.categoryLabel || '', s.title, s.pain || '', s.strategy || '', JSON.stringify(s.actions || []), JSON.stringify(s.results || []), s.sortOrder || 0, s.isVisible === false ? 0 : 1]
  )
  res.json(ok({ id: lastId }, '创建成功'))
})
app.put('/api/v1/admin/solutions/:id', verify, (req, res) => {
  const s = req.body
  db.run(
    `UPDATE solutions SET category=?,category_label=?,title=?,pain=?,strategy=?,actions=?,results=?,sort_order=?,is_visible=?,updated_at=datetime('now','localtime') WHERE id=?`,
    [s.category || '', s.categoryLabel || '', s.title, s.pain || '', s.strategy || '', JSON.stringify(s.actions || []), JSON.stringify(s.results || []), s.sortOrder || 0, s.isVisible === false ? 0 : 1, req.params.id]
  )
  res.json(ok(null, '更新成功'))
})
app.delete('/api/v1/admin/solutions/:id', verify, (req, res) => {
  db.run('DELETE FROM solutions WHERE id=?', [req.params.id])
  res.json(ok(null, '删除成功'))
})

// ---- 图片上传 ----
app.post('/api/v1/admin/upload', verify, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json(fail('未选择文件'))
  res.json(ok({ url: `/uploads/${req.file.filename}` }, '上传成功'))
})

// 健康检查
app.get('/api/v1/health', (req, res) => res.json(ok({ status: 'UP' })))

db.init().then(() => {
  app.listen(PORT, () => console.log(`[server] 踏云行CMS后端已启动: http://localhost:${PORT}`))
}).catch((err) => {
  console.error('[server] 启动失败:', err)
  process.exit(1)
})
