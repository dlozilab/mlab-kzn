// server/middleware/auditLog.js
// Chain link 4 — writes to audit log and conditionally creates notifications
// Runs after auth checks, before route handler
// Only fires on mutating operations: POST, PUT, PATCH, DELETE

const AuditRepository        = require('../repositories/AuditRepository')
const NotificationsRepository = require('../repositories/NotificationsRepository')

const NOTIFY_ACTIONS = ['PUBLISH', 'DELETE']

function getAction(method) {
  switch (method) {
    case 'POST':   return 'CREATE'
    case 'PUT':
    case 'PATCH':  return 'UPDATE'
    case 'DELETE': return 'DELETE'
    default:       return null
  }
}

function getEntityFromPath(path) {
  // e.g. /api/journeys/123 → journeys
  const parts = path.replace('/api/', '').split('/')
  return parts[0] || 'unknown'
}

async function auditLog(req, res, next) {
  const action = getAction(req.method)

  // Only log mutating operations
  if (!action) return next()

  // Run the route first, then log after response
  const originalSend = res.send.bind(res)
  res.send = async function (body) {
    originalSend(body)

    try {
      const entity   = getEntityFromPath(req.path)
      const entityId = req.params?.id || null

      await AuditRepository.create({
        user_id:     req.user.id,
        user_name:   req.user.full_name || req.user.email,
        action,
        entity,
        entity_id:   entityId,
        province_id: req.user.province_id || null,
        timestamp:   new Date().toISOString(),
      })

      // Notify on publish (is_public toggled to true)
      if (action === 'UPDATE' && req.body?.is_public === true) {
        await NotificationsRepository.create({
          type:        'content_published',
          message:     `${entity} published publicly`,
          province_id: req.user.province_id || null,
          is_read:     false,
          created_at:  new Date().toISOString(),
        })
      }

    } catch (err) {
      // Audit failure must never affect the response
      console.error('auditLog error:', err.message)
    }
  }

  next()
}

module.exports = auditLog
