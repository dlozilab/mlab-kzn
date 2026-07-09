// server/routes/public.js
// No auth required — serves public site pages and public API data
// All data queries filter WHERE is_public = true

const express    = require('express')
const router     = express.Router()

const ProgrammesRepository = require('../repositories/ProgrammesRepository')
const EventsRepository     = require('../repositories/EventsRepository')
const JourneysRepository   = require('../repositories/JourneysRepository')
const SnapshotsRepository  = require('../repositories/SnapshotsRepository')
const ProvincesRepository  = require('../repositories/ProvincesRepository')
const FormsRepository      = require('../repositories/FormsRepository')

const { HomePage }       = require('../pages/public/home')
const { ProvincesPage }  = require('../pages/public/provinces')
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

// GET /provinces
router.get('/provinces', async (req, res, next) => {
  try {
    const provinces      = await ProvincesRepository.findActive()
    const activeProvince = req.query.province || 'national'
    const data           = {}

    if (activeProvince === 'national') {
      data.participantCount = await JourneysRepository.count()
      data.programmeCount   = await ProgrammesRepository.count({ status: 'Active' })
      data.graduationRate   = 0 // TODO: calculate from journeys
      data.byProvince       = {}
      for (const p of provinces) {
        data.byProvince[p.id] = {
          participantCount: await JourneysRepository.count({ province_id: p.id })
        }
      }
    } else {
      data.participantCount = await JourneysRepository.count({ province_id: activeProvince })
      data.programmeCount   = 0
      data.graduationRate   = 0
      data.programmes       = await ProgrammesRepository.findPublic({ province_id: activeProvince })
      data.recentJourneys   = await JourneysRepository.findPublic({ province_id: activeProvince })
    }

    res.send(ProvincesPage({ provinces, activeProvince, data }))
  } catch (err) { next(err) }
})

// GET /resources
router.get('/resources', async (req, res, next) => {
  try {
    const q         = req.query.q || ''
    let snapshots   = await SnapshotsRepository.findPublic()
    if (q) {
      snapshots = snapshots.filter(s =>
        s.title.toLowerCase().includes(q.toLowerCase())
      )
    }
    res.send(ResourcesPage({ snapshots, searchQuery: q }))
  } catch (err) { next(err) }
})

// GET /about and /contact (same page)
router.get(['/about', '/contact'], (req, res) => {
  res.send(AboutPage())
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
  // For now redirect with success
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

// GET /api/public/provinces
router.get('/api/public/provinces', async (req, res, next) => {
  try {
    const provinces = await ProvincesRepository.findActiveNames()
    res.json(response.success(provinces))
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

// GET /login — redirect to auth
router.get('/login', (req, res) => res.redirect('/auth/login'))

// GET /dashboard — redirect to CMS dashboard
router.get('/dashboard', (req, res) => res.redirect('/cms/dashboard'))

module.exports = router
