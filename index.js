// index.js
// Express app entry point
// Mounts all routes and applies middleware chain

require('dotenv').config()

const express    = require('express')
const path       = require('path')
const cookieParser = require('cookie-parser')

const errorHandler = require('./server/middleware/errorHandler')

// ── ROUTES ────────────────────────────────────────────────────────────────────

const authRoute              = require('./server/routes/auth')
const provincesRoute         = require('./server/routes/provinces')
const programmesRoute        = require('./server/routes/programmes')
const eventsRoute            = require('./server/routes/events')
const mediaRoute             = require('./server/routes/media')
const journeysRoute          = require('./server/routes/journeys')
const kpiTemplatesRoute      = require('./server/routes/kpiTemplates')
const kpiEntriesRoute        = require('./server/routes/kpiEntries')
const reportsRoute           = require('./server/routes/reports')
const snapshotsRoute         = require('./server/routes/snapshots')
const formsRoute             = require('./server/routes/forms')
const reportDefinitionsRoute = require('./server/routes/reportDefinitions')
const usersRoute             = require('./server/routes/users')
const rolesRoute             = require('./server/routes/roles')
const invitesRoute           = require('./server/routes/invites')
const notificationsRoute     = require('./server/routes/notifications')
const auditRoute             = require('./server/routes/audit')
const publicRoute            = require('./server/routes/public')

// ── APP ───────────────────────────────────────────────────────────────────────

const app = express()

// ── CORE MIDDLEWARE ───────────────────────────────────────────────────────────

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Serve static files — CSS, JS, images
app.use(express.static(path.join(__dirname, 'public')))

// ── PUBLIC ROUTES (no auth) ───────────────────────────────────────────────────

app.use('/',      publicRoute)
app.use('/auth',  authRoute)

// ── API ROUTES (auth applied per route) ──────────────────────────────────────

app.use('/api/provinces',          provincesRoute)
app.use('/api/programmes',         programmesRoute)
app.use('/api/events',             eventsRoute)
app.use('/api/media',              mediaRoute)
app.use('/api/journeys',           journeysRoute)
app.use('/api/kpi-templates',      kpiTemplatesRoute)
app.use('/api/kpi-entries',        kpiEntriesRoute)
app.use('/api/reports',            reportsRoute)
app.use('/api/snapshots',          snapshotsRoute)
app.use('/api/forms',              formsRoute)
app.use('/api/report-definitions', reportDefinitionsRoute)
app.use('/api/users',              usersRoute)
app.use('/api/roles',              rolesRoute)
app.use('/api/invites',            invitesRoute)
app.use('/api/notifications',      notificationsRoute)
app.use('/api/audit',              auditRoute)

// ── ERROR HANDLER (must be last) ─────────────────────────────────────────────

app.use(errorHandler)

// ── START ─────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`mLab KZN running on http://localhost:${PORT}`)
})