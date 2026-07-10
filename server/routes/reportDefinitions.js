// server/routes/reportDefinitions.js
const express      = require('express')
const router       = express.Router()
const verifyToken  = require('../middleware/verifyToken')
const checkRole    = require('../middleware/checkRole')
const auditLog     = require('../middleware/auditLog')
const response     = require('../utils/response')
const { get }      = require('../config/featureRegistry')
const { ListPage } = require('../pages/cms/list')
const { NewPage, EditPage } = require('../pages/cms/detail')
const { ReportRunnerPage }  = require('../pages/cms/report-runner')
const Repo           = require('../repositories/ReportDefinitionsRepository')
const validateQuery  = require('../utils/validateQuery')
const renderWithAI   = require('../utils/renderReportWithAI')
const feature        = get('report-definitions')

router.get('/', verifyToken, checkRole('super_admin'), async (req, res, next) => {
  try { res.send(ListPage({ feature, items: await Repo.findAll(), user: req.user })) }
  catch(err) { next(err) }
})

router.get('/new', verifyToken, checkRole('super_admin'), (req, res) => {
  res.send(NewPage({ feature, user: req.user }))
})

router.post('/new', verifyToken, checkRole('super_admin'), auditLog, async (req, res, next) => {
  try {
    const { valid, reason } = validateQuery(req.body.query)
    if (!valid) return res.send(NewPage({ feature, user: req.user, error: reason }))
    const item = await Repo.create(req.body)
    res.redirect(`/cms/report-definitions/${item.id}`)
  } catch(err) { next(err) }
})

router.get('/:id', verifyToken, checkRole('super_admin'), async (req, res, next) => {
  try {
    const definition = await Repo.findById(req.params.id)
    res.send(ReportRunnerPage({ definition, user: req.user }))
  } catch(err) { next(err) }
})

router.get('/:id/edit', verifyToken, checkRole('super_admin'), async (req, res, next) => {
  try { res.send(EditPage({ feature, item: await Repo.findById(req.params.id), user: req.user })) }
  catch(err) { next(err) }
})

router.post('/:id/edit', verifyToken, checkRole('super_admin'), auditLog, async (req, res, next) => {
  try {
    const { valid, reason } = validateQuery(req.body.query)
    if (!valid) return res.send(EditPage({ feature, item: req.body, user: req.user, error: reason }))
    await Repo.update(req.params.id, req.body)
    res.redirect(`/cms/report-definitions/${req.params.id}`)
  } catch(err) { next(err) }
})

router.post('/:id/delete', verifyToken, checkRole('super_admin'), auditLog, async (req, res, next) => {
  try { await Repo.delete(req.params.id); res.redirect('/cms/report-definitions') }
  catch(err) { next(err) }
})

// Run report — execute SQL and render with AI
router.get('/:id/run', verifyToken, checkRole('super_admin'), async (req, res, next) => {
  try {
    const definition = await Repo.findById(req.params.id)
    const { valid, reason } = validateQuery(definition.query)
    if (!valid) {
      return res.send(ReportRunnerPage({ definition, user: req.user, error: reason }))
    }
    const rawData    = await Repo.runQuery(definition.query)
    const rendered   = await renderWithAI(rawData, definition.name)
    res.send(ReportRunnerPage({ definition, renderedHtml: rendered, rawData, user: req.user }))
  } catch(err) { next(err) }
})

module.exports = router
