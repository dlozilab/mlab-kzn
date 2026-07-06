// server/utils/response.js
// Standard response shape for all API routes
// Every route uses these helpers — consistent output every time

function success(data, message = null) {
  return { success: true, data, message }
}

function error(message, code = 500) {
  return { success: false, error: message, code }
}

function notFound(resource = 'Record') {
  return error(`${resource} not found`, 404)
}

function forbidden(message = 'Access denied') {
  return error(message, 403)
}

function invalid(message = 'Invalid request') {
  return error(message, 400)
}

module.exports = { success, error, notFound, forbidden, invalid }
