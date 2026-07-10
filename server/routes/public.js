// server/routes/public.js
// No auth required — serves public site pages and public API data

const express    = require('express')
const router     = express.Router()

const ProgrammesRepository = require('../repositories/ProgrammesRepository')
const EventsRepository     = require('../repositories/EventsRepository')
const JourneysRepository   = require('../repositories/JourneysRepository')
const ResourcesRepository  = require('../repositories/ResourcesRepository')
const ProvincesRepository  = require('../repositories/ProvincesRepository')
const FormsRepository      = require('../repositories/FormsRepository')

const { HomePage }       = require('../pages/public/home')
const { ResourcesPage }  = require('../pages/public/resources')
const { AboutPage }      = require('../pages/public/about')
const { PublicFormPage } = require('../pages/public/form')
const response           = require('../utils/response')

// GET /
router.get('/', async (req, res, next) => {
  try {
    const [programmes, events, journeys] = await Promise.all([
      ProgrammesRepository.findPublic(),
      EventsRepository.findPublic(),
      JourneysRepository.findPublic(),
    ])
    const feed = [
      ...programmes.map(p => ({ ...p, _type: 'programme' })),
      ...events.map(e    => ({ ...e, _type: 'event' })),
      ...journeys.map(j  => ({ ...j, _type: 'journey' })),
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    const stats = {
      totalParticipants: await JourneysRepository.count(),
      activeProvinces:   (await ProvincesRepository.findActive()).length,
      activeProgrammes:  await ProgrammesRepository.count({ status: 'Active' }),
    }
    res.send(HomePage({ feed, stats }))
  } catch (err) { next(err) }
})

// GET /resources
router.get('/resources', async (req, res, next) => {
  try {
    const resources = await ResourcesRepository.findPublicSorted()
    res.send(ResourcesPage({ resources }))
  } catch (err) { next(err) }
})

// GET /about and /contact
router.get(['/about', '/contact'], async (req, res, next) => {
  try {
    const provinces = await ProvincesRepository.findActive()
    res.send(AboutPage({ provinces }))
  } catch (err) { next(err) }
})

// GET /forms/:slug
router.get('/forms/:slug', async (req, res, next) => {
  try {
    const form = await FormsRepository.findBySlug(req.params.slug)
    if (!form || !form.is_public) return res.status(404).send('<h1>Form not found</h1>')
    const fields = await FormsRepository.findFields(form.id)
    res.send(PublicFormPage({ form, fields }))
  } catch (err) { next(err) }
})

// POST /contact
router.post('/contact', async (req, res) => {
  res.redirect('/about?sent=true')
})

// POST /api/forms/:slug/submit
router.post('/api/forms/:slug/submit', async (req, res, next) => {
  try {
    const form = await FormsRepository.findBySlug(req.params.slug)
    if (!form || !form.is_public) return res.status(404).json(response.notFound('Form'))
    const result = await FormsRepository.submitResponse(form.table_name, req.body)
    res.json(response.success(result))
  } catch (err) { next(err) }
})

// Redirects
router.get('/login',     (req, res) => res.redirect('/auth/login'))
router.get('/dashboard', (req, res) => res.redirect('/cms/dashboard'))

module.exports = router