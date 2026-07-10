// server/routes/public.js
// No auth required — serves public site pages and public API data
// All data queries filter WHERE is_public = true
// Provinces page removed — provinces are internal only
// About page shows "Where we operate" with province names only

const express    = require('express')
const router     = express.Router()

const ProgrammesRepository = require('../repositories/ProgrammesRepository')
const EventsRepository     = require('../repositories/EventsRepository')
const JourneysRepository   = require('../repositories/JourneysRepository')
const SnapshotsRepository  = require('../repositories/SnapshotsRepository')
const ProvincesRepository  = require('../repositories/ProvincesRepository')
const FormsRepository      = require('../repositories/FormsRepository')

const { HomePage }       = require('../pages/public/home')
const { ResourcesPage }  = require('../pages/public/resources')
const { AboutPage }      = require('../pages/public/about')
const { PublicFormPage } = require('../pages/public/form')
const response           = require('../utils/response')

// ── PUBLIC PAGES ──────────────────────────────────────────────────────────────

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
    const q       = req.query.q || ''
    let snapshots = await SnapshotsRepository.findPublic()
    if (q) {
      snapshots = snapshots.filter(s =>
        s.title.toLowerCase().includes(q.toLowerCase())
      )
    }
    res.send(ResourcesPage({ snapshots, searchQuery: q }))
  } catch (err) { next(err) }
})

// GET /about and /contact (same page)
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
  // TODO: send email or store in DB
  res.redirect('/about?sent=true')
})

// ── PUBLIC API ────────────────────────────────────────────────────────────────

// GET /api/public/feed
router.get('/api/public/feed', async (req, res, next) => {
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
    res.json(response.success(feed))
  } catch (err) { next(err) }
})

// GET /api/public/snapshots
router.get('/api/public/snapshots', async (req, res, next) => {
  try {
    const snapshots = await SnapshotsRepository.findPublic()
    res.json(response.success(snapshots))
  } catch (err) { next(err) }
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