const jwt = require('jsonwebtoken')

const SECRET = process.env.JWT_SECRET || 'tayunxing-cms-secret-please-change'

function sign(user) {
  return jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '7d' })
}

function verify(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ code: 401, message: '未登录', data: null })
  try {
    req.user = jwt.verify(token, SECRET)
    next()
  } catch (e) {
    return res.status(401).json({ code: 401, message: '登录已过期', data: null })
  }
}

module.exports = { sign, verify, SECRET }
