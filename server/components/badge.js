// server/components/badge.js
// NewBadge — renders only when item is less than 8 days old

const EIGHT_DAYS_MS = 8 * 24 * 60 * 60 * 1000

function NewBadge(createdAt) {
  const age = Date.now() - new Date(createdAt).getTime()
  if (age > EIGHT_DAYS_MS) return ''
  return `<span class="new-badge" aria-label="New">New</span>`
}

module.exports = { NewBadge }
