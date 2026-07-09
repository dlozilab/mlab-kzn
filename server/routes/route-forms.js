// server/routes/forms.js
// Form builder — super admin only
const express      = require('express')
const router       = express.Router()
const verifyToken  = require('../middleware/verifyToken')
const checkRole    = require('../middleware/checkRole')
const auditLog     = require('../middleware/auditLog')
const response     = require('../utils/response')
const { get }      = require('../config/featureRegistry')
const { ListPage } = require('../pages/cms/list')
const { FormBuilderPage }   = require('../pages/cms/form-builder')
const { FormResponsesPage } = require('../pages/cms/form-responses')
const Repo         = require('../repositories/FormsRepository')
const feature      = get('forms')

router.get('/', verifyToken, checkRole('super_admin'), async (req, res, next) => {
  try { res.send(ListPage({ feature, items: await Repo.findAll(), user: req.user })) }
  catch(err) { next(err) }
})

router.get('/new', verifyToken, checkRole('super_admin'), (req, res) => {
  res.send(FormBuilderPage({ form: null, fields: [], user: req.user }))
})

router.post('/new', verifyToken, checkRole('super_admin'), auditLog, async (req, res, next) => {
  try {
    const tableName = `form_${req.body.slug.replace(/-/g, '_')}`
    const form = await Repo.create({ ...req.body, table_name: tableName })
    res.redirect(`/cms/forms/${form.id}`)
  } catch(err) { next(err) }
})

router.get('/:id', verifyToken, checkRole('super_admin'), async (req, res, next) => {
  try {
    const form   = await Repo.findById(req.params.id)
    const fields = await Repo.findFields(form.id)
    res.send(FormBuilderPage({ form, fields, user: req.user }))
  } catch(err) { next(err) }
})

router.post('/:id/edit', verifyToken, checkRole('super_admin'), auditLog, async (req, res, next) => {
  try {
    await Repo.update(req.params.id, req.body)
    res.redirect(`/cms/forms/${req.params.id}`)
  } catch(err) { next(err) }
})

router.post('/:id/delete', verifyToken, checkRole('super_admin'), auditLog, async (req, res, next) => {
  try { await Repo.delete(req.params.id); res.redirect('/cms/forms') }
  catch(err) { next(err) }
})

// Add field to form — triggers createFormTable on first field
router.post('/:id/fields', verifyToken, checkRole('super_admin'), async (req, res, next) => {
  try {
    const form   = await Repo.findById(req.params.id)
    const fields = await Repo.findFields(form.id)

    // Parse options from textarea (one per line)
    const options = req.body.options
      ? req.body.options.split('\n').map(o => o.trim()).filter(Boolean)
      : []

    const newField = {
      form_id:    form.id,
      label:      req.body.label,
      field_name: req.body.field_name,
      field_type: req.body.field_type,
      options:    options.length ? options : null,
      required:   req.body.required === 'true',
      sort_order: parseInt(req.body.sort_order) || fields.length + 1,
    }

    // Create the Supabase table on first field
    if (fields.length === 0) {
      await Repo.createFormTable(form.table_name, [newField])
    } else {
      // TODO: ALTER TABLE to add column — for now insert field record only
    }

    await require('../supabase/client')
      .from('form_fields').insert(newField)

    res.redirect(`/cms/forms/${form.id}`)
  } catch(err) { next(err) }
})

// Delete a field
router.post('/:id/fields/:fieldId/delete', verifyToken, checkRole('super_admin'), async (req, res, next) => {
  try {
    await require('../supabase/client')
      .from('form_fields').delete().eq('id', req.params.fieldId)
    res.redirect(`/cms/forms/${req.params.id}`)
  } catch(err) { next(err) }
})

// Responses
router.get('/:id/responses', verifyToken, checkRole('super_admin'), async (req, res, next) => {
  try {
    const form      = await Repo.findById(req.params.id)
    const fields    = await Repo.findFields(form.id)
    const responses = await Repo.getResponses(form.table_name)
    res.send(FormResponsesPage({ form, fields, responses, user: req.user }))
  } catch(err) { next(err) }
})

// Submit — public
router.post('/:slug/submit', async (req, res, next) => {
  try {
    const form = await Repo.findBySlug(req.params.slug)
    if (!form || !form.is_public) return res.status(404).json({ error: 'Not found' })
    const result = await Repo.submitResponse(form.table_name, req.body)
    res.json(response.success(result))
  } catch(err) { next(err) }
})

module.exports = router
