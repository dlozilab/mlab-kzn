// server/middleware/checkProvince.js
// Chain link 3 — scopes provincial leads to their own province
// Super admin and staff pass through without restriction
// Attaches province filter to req for use in route handlers

function checkProvince(req, res, next) {
  const { role, province_id } = req.user

  // Super admin and staff see everything
  if (role === 'super_admin' || role === 'staff') {
    req.provinceFilter = null // no filter — see all
    return next()
  }

  // Provincial leads scoped to their province
  if (role === 'admin') {
    if (!province_id) {
      return res.status(403).json({ success: false, error: 'No province assigned to this account' })
    }
    req.provinceFilter = province_id
    return next()
  }

  return res.status(403).json({ success: false, error: 'Access denied' })
}

module.exports = checkProvince
