// index.js
require('dotenv').config()

const express      = require('express')
const path         = require('path')
const cookieParser = require('cookie-parser')
const errorHandler = require('./server/middleware/errorHandler')

const app = express()

// ── CORE MIDDLEWARE ───────────────────────────────────────────────────────────

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// ── PUBLIC ROUTES (no auth) ───────────────────────────────────────────────────

app.use('/',     require('./server/routes/public'))
app.use('/auth', require('./server/routes/auth'))

// ── CMS ROUTES (auth per route) ───────────────────────────────────────────────

app.use('/cms/dashboard',          require('./server/routes/dashboard'))
app.use('/cms/profile',            require('./server/routes/profile'))
app.use('/cms/roles',              require('./server/routes/roles-page'))
app.use('/cms/provinces',          require('./server/routes/provinces'))
app.use('/cms/programmes',         require('./server/routes/programmes'))
app.use('/cms/events',             require('./server/routes/events'))
app.use('/cms/media',              require('./server/routes/media'))
app.use('/cms/journeys',           require('./server/routes/journeys'))
app.use('/cms/kpi-templates',      require('./server/routes/kpiTemplates'))
app.use('/cms/kpi-entries',        require('./server/routes/kpiEntries'))
app.use('/cms/reports',            require('./server/routes/reports'))
app.use('/cms/snapshots',          require('./server/routes/snapshots'))
app.use('/cms/forms',              require('./server/routes/forms'))
app.use('/cms/report-definitions', require('./server/routes/reportDefinitions'))
app.use('/cms/users',              require('./server/routes/users'))
app.use('/cms/invites',            require('./server/routes/invites'))
app.use('/cms/notifications',      require('./server/routes/notifications'))
app.use('/cms/audit',              require('./server/routes/audit'))

// ── API ROUTES ────────────────────────────────────────────────────────────────

app.use('/api/provinces',          require('./server/routes/provinces'))
app.use('/api/notifications',      require('./server/routes/notifications'))
app.use('/api/roles',              require('./server/routes/roles-page'))

// ── ERROR HANDLER (must be last) ─────────────────────────────────────────────

app.use(errorHandler)

// ── START ─────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`mLab KZN running on http://localhost:${PORT}`)
})
