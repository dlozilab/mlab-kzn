// server/routes/audit.js
// Read only — written by auditLog middleware only
const express     = require('express')
const router      = express.Router()
const verifyToken = require('../middleware/verifyToken')
const checkRole   = require('../middleware/checkRole')
const response    = require('../utils/response')
const { get }     = require('../config/featureRegistry')
const { ListPage }= require('../pages/cms/list')
const Repo        = require('../repositories/AuditRepository')
const feature     = get('audit')

// CMS page
router.get('/', verifyToken, checkRole('super_admin'), async (req, res, next) => {
  try {
    const items = await Repo.findAll()
    res.send(ListPage({ feature, items, user: req.user }))
  } catch(err) { next(err) }
})

// API
router.get('/api', verifyToken, checkRole('super_admin'), async (req, res, next) => {
  try { res.json(response.success(await Repo.findAll())) }
  catch(err) { next(err) }
})

module.exports = router
