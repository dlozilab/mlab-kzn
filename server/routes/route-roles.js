// server/routes/roles.js
const express     = require('express')
const router      = express.Router()
const verifyToken = require('../middleware/verifyToken')
const checkRole   = require('../middleware/checkRole')
const auditLog    = require('../middleware/auditLog')
const response    = require('../utils/response')
const { RolesPage } = require('../pages/cms/roles')
const Repo        = require('../repositories/RolesRepository')

router.get('/', verifyToken, checkRole('super_admin'), async (req, res, next) => {
  try {
    const groups      = await Repo.findWithUserCount()
    const activeId    = req.query.role || groups[0]?.id
    const permissions = activeId ? await Repo.findPermissions(activeId) : []
    const permMap     = permissions.reduce((acc, p) => {
      if (!acc[p.feature_id]) acc[p.feature_id] = {}
      acc[p.feature_id][p.op] = p.enabled
      return acc
    }, {})
    const groupsWithActive = groups.map(g => ({ ...g, active: g.id === activeId }))
    res.send(RolesPage({ groups: groupsWithActive, permissions: permMap, user: req.user }))
  } catch(err) { next(err) }
})

router.get('/new', verifyToken, checkRole('super_admin'), (req, res) => {
  const { get } = require('../config/featureRegistry')
  const { NewPage } = require('../pages/cms/detail')
  res.send(NewPage({ feature: get('roles'), user: req.user }))
})

router.post('/new', verifyToken, checkRole('super_admin'), auditLog, async (req, res, next) => {
  try { await Repo.create(req.body); res.redirect('/cms/roles') }
  catch(err) { next(err) }
})

router.post('/:id/delete', verifyToken, checkRole('super_admin'), auditLog, async (req, res, next) => {
  try { await Repo.delete(req.params.id); res.redirect('/cms/roles') }
  catch(err) { next(err) }
})

// API — update a single permission toggle
router.post('/permissions', verifyToken, checkRole('super_admin'), async (req, res, next) => {
  try {
    const { roleId, featureId, op, enabled } = req.body
    const result = await Repo.updatePermission(roleId, featureId, op, enabled)
    res.json(response.success(result))
  } catch(err) { next(err) }
})

module.exports = router
