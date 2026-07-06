// server/middleware/verifyToken.js
// Chain link 1 — validates JWT from cookie or Authorization header
// Attaches user object to req.user for downstream middleware and routes

const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1]

  if (!token) {
    // Not authenticated — redirect to login for page requests, 401 for API
    if (req.path.startsWith('/api')) {
      return res.status(401).json({ success: false, error: 'Not authenticated' })
    }
    return res.redirect('/login')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    if (req.path.startsWith('/api')) {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' })
    }
    return res.redirect('/login')
  }
}

module.exports = verifyToken
