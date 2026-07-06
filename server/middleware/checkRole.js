// server/middleware/checkRole.js
// Chain link 2 — checks the user's role has permission for this operation
// Usage: checkRole('admin') or checkRole('super_admin')
// Super admin always passes

function checkRole(...allowedRoles) {
  return function (req, res, next) {
    const role = req.user?.role

    // Super admin always passes
    if (role === 'super_admin') return next()

    if (!role || !allowedRoles.includes(role)) {
      if (req.path.startsWith('/api')) {
        return res.status(403).json({ success: false, error: 'Access denied' })
      }
      return res.status(403).send('<h1>403 — Access denied</h1>')
    }

    next()
  }
}

module.exports = checkRole
