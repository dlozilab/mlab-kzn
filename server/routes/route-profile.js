// server/routes/profile.js — mount at /cms/profile in index.js
const express     = require('express')
const router      = express.Router()
const verifyToken = require('../middleware/verifyToken')
const { ProfilePage } = require('../pages/cms/profile')

router.get('/', verifyToken, (req, res) => {
  res.send(ProfilePage({ user: req.user }))
})

module.exports = router
