// server/routes/provinces.js
const express       = require('express')
const router        = express.Router()
const verifyToken   = require('../middleware/verifyToken')
const checkRole     = require('../middleware/checkRole')
const auditLog      = require('../middleware/auditLog')
const response      = require('../utils/response')
const { get }       = require('../config/featureRegistry')
const { ListPage }  = require('../pages/cms/list')
const { DetailPage, EditPage, NewPage } = require('../pages/cms/detail')
const Repo          = require('../repositories/ProvincesRepository')
const feature       = get('provinces')

// CMS pages
router.get('/', verifyToken, checkRole('super_admin'), async (req, res, next) => {
  try { res.send(ListPage({ feature, items: await Repo.findAll(), user: req.user })) }
  catch(err) { next(err) }
})

router.get('/new', verifyToken, checkRole('super_admin'), (req, res) => {
  res.send(NewPage({ feature, user: req.user }))
})

router.post('/new', verifyToken, checkRole('super_admin'), auditLog, async (req, res, next) => {
  try { const item = await Repo.create(req.body); res.redirect('/cms/provinces') }
  catch(err) { next(err) }
})

router.get('/:id', verifyToken, checkRole('super_admin'), async (req, res, next) => {
  try { res.send(DetailPage({ feature, item: await Repo.findById(req.params.id), user: req.user })) }
  catch(err) { next(err) }
})

router.get('/:id/edit', verifyToken, checkRole('super_admin'), async (req, res, next) => {
  try { res.send(EditPage({ feature, item: await Repo.findById(req.params.id), user: req.user })) }
  catch(err) { next(err) }
})

router.post('/:id/edit', verifyToken, checkRole('super_admin'), auditLog, async (req, res, next) => {
  try { await Repo.update(req.params.id, req.body); res.redirect(`/cms/provinces/${req.params.id}`) }
  catch(err) { next(err) }
})

router.post('/:id/delete', verifyToken, checkRole('super_admin'), auditLog, async (req, res, next) => {
  try { await Repo.delete(req.params.id); res.redirect('/cms/provinces') }
  catch(err) { next(err) }
})

// API
router.get('/api', verifyToken, async (req, res, next) => {
  try { res.json(response.success(await Repo.findAll())) }
  catch(err) { next(err) }
})

module.exports = router
