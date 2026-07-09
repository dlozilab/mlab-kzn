// server/routes/dashboard.js — mount at /cms/dashboard in index.js
const express      = require('express')
const router       = express.Router()
const verifyToken  = require('../middleware/verifyToken')
const checkRole    = require('../middleware/checkRole')
const { DashboardPage } = require('../pages/cms/dashboard')
const JourneysRepository   = require('../repositories/JourneysRepository')
const ProgrammesRepository = require('../repositories/ProgrammesRepository')
const ProvincesRepository  = require('../repositories/ProvincesRepository')
const ReportsRepository    = require('../repositories/ReportsRepository')

router.get('/', verifyToken, checkRole('super_admin', 'admin', 'staff'), async (req, res, next) => {
  try {
    const [provinces, pendingReports] = await Promise.all([
      ProvincesRepository.findActive(),
      ReportsRepository.findPending(),
    ])

    const stats = {
      totalParticipants: await JourneysRepository.count(),
      activeProvinces:   provinces.length,
      activeProgrammes:  await ProgrammesRepository.count({ status: 'Active' }),
    }

    // Enrich provinces with participant counts
    for (const p of provinces) {
      p.participantCount = await JourneysRepository.count({ province_id: p.id })
    }

    res.send(DashboardPage({ stats, provinces, pendingReports, user: req.user }))
  } catch(err) { next(err) }
})

module.exports = router
