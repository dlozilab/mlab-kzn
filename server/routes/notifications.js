// server/routes/notifications.js
const express     = require('express')
const router      = express.Router()
const verifyToken = require('../middleware/verifyToken')
const response    = require('../utils/response')
const Repo        = require('../repositories/NotificationsRepository')

// GET /api/notifications/count — polled by notifications.js every 60s
router.get('/count', verifyToken, async (req, res, next) => {
  try {
    const count = await Repo.countUnread(req.user.id)
    res.json(response.success(count))
  } catch(err) { next(err) }
})

// GET /api/notifications
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const notifications = await Repo.findForUser(req.user.id)
    res.json(response.success(notifications))
  } catch(err) { next(err) }
})

// POST /api/notifications/read-all
router.post('/read-all', verifyToken, async (req, res, next) => {
  try {
    await Repo.markAllRead(req.user.id)
    res.json(response.success(true))
  } catch(err) { next(err) }
})

// POST /api/notifications/:id/read
router.post('/:id/read', verifyToken, async (req, res, next) => {
  try {
    await Repo.markRead(req.params.id)
    res.json(response.success(true))
  } catch(err) { next(err) }
})

module.exports = router
