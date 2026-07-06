// server/utils/validateQuery.js
// Guards the report runner — rejects any SQL that is not a pure SELECT
// Super admin only feature but we validate at the util level regardless

const FORBIDDEN = ['insert', 'update', 'delete', 'drop', 'alter', 'truncate', 'create', 'grant', 'revoke']

function validateQuery(sql) {
  if (!sql || typeof sql !== 'string') {
    return { valid: false, reason: 'Query must be a non-empty string' }
  }

  const normalised = sql.trim().toLowerCase()

  if (!normalised.startsWith('select')) {
    return { valid: false, reason: 'Only SELECT queries are permitted' }
  }

  for (const word of FORBIDDEN) {
    // Check as whole word to avoid false positives
    const pattern = new RegExp(`\\b${word}\\b`)
    if (pattern.test(normalised)) {
      return { valid: false, reason: `Query contains forbidden keyword: ${word.toUpperCase()}` }
    }
  }

  return { valid: true, reason: null }
}

module.exports = validateQuery
