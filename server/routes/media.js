// server/routes/media.js
const express      = require('express')
const router       = express.Router()
const verifyToken  = require('../middleware/verifyToken')
const checkRole    = require('../middleware/checkRole')
const checkProvince = require('../middleware/checkProvince')
const auditLog     = require('../middleware/auditLog')
const response     = require('../utils/response')
const { get }      = require('../config/featureRegistry')
const { ListPage } = require('../pages/cms/list')
const { DetailPage, EditPage, NewPage } = require('../pages/cms/detail')
const Repo         = require('../repositories/MediaRepository')
const feature      = get('media')

// ── CMS PAGES ─────────────────────────────────────────────────────────────────

router.get('/', verifyToken, checkRole('super_admin','admin'), checkProvince, async (req, res, next) => {
  try {
    const items = req.provinceFilter
      ? await Repo.findAll({ province_id: req.provinceFilter })
      : await Repo.findAll()
    res.send(ListPage({ feature, items, user: req.user, searchQuery: req.query.q || '' }))
  } catch(err) { next(err) }
})

router.get('/new', verifyToken, checkRole('super_admin','admin'), (req, res) => {
  res.send(NewPage({ feature, user: req.user }))
})

router.post('/new', verifyToken, checkRole('super_admin','admin'), auditLog, async (req, res, next) => {
  try {
    const item = await Repo.create({ ...req.body, created_by: req.user.id })
    res.redirect('/cms/media/' + item.id)
  } catch(err) { next(err) }
})

router.get('/:id', verifyToken, checkRole('super_admin','admin'), async (req, res, next) => {
  try {
    const item = await Repo.findById(req.params.id)
    if (!item) return res.status(404).send('<h1>Not found</h1>')
    res.send(DetailPage({ feature, item, user: req.user }))
  } catch(err) { next(err) }
})

router.get('/:id/edit', verifyToken, checkRole('super_admin','admin'), async (req, res, next) => {
  try {
    const item = await Repo.findById(req.params.id)
    res.send(EditPage({ feature, item, user: req.user }))
  } catch(err) { next(err) }
})

router.post('/:id/edit', verifyToken, checkRole('super_admin','admin'), auditLog, async (req, res, next) => {
  try {
    await Repo.update(req.params.id, req.body)
    res.redirect('/cms/media/' + req.params.id)
  } catch(err) { next(err) }
})

router.post('/:id/delete', verifyToken, checkRole('super_admin','admin'), auditLog, async (req, res, next) => {
  try {
    await Repo.delete(req.params.id)
    res.redirect('/cms/media')
  } catch(err) { next(err) }
})

// ── PUBLISH TOGGLE (API) ──────────────────────────────────────────────────────

router.post('/:id/publish', verifyToken, checkRole('super_admin','admin'), auditLog, async (req, res, next) => {
  try {
    const item = await Repo.setPublic(req.params.id, req.body.is_public)
    res.json(response.success(item))
  } catch(err) { next(err) }
})

// ── LIST API ──────────────────────────────────────────────────────────────────

router.get('/api', verifyToken, checkRole('super_admin','admin'), checkProvince, async (req, res, next) => {
  try {
    const items = req.provinceFilter
      ? await Repo.findAll({ province_id: req.provinceFilter })
      : await Repo.findAll()
    res.json(response.success(items))
  } catch(err) { next(err) }
})

module.exports = router
