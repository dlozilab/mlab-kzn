// server/components/card.js
// The atom of the system — used on every list page
// Composite leaf — receives data, returns HTML string

function Card({ id, feature, name, meta, pill, ops }) {
  return `
    <article class="card">
      <div class="card__detail">
        <h3 class="card__name">
          <a href="/cms/${feature.id}/${id}" class="card__name"
             style="text-decoration:none;color:inherit">
            ${name}
          </a>
          ${pill ? Pill(pill) : ''}
        </h3>
        <p class="card__meta">${meta || ''}</p>
      </div>
      <div class="card__actions">
        ${ops.includes('u') ? `
          <a href="/cms/${feature.id}/${id}/edit" class="btn btn--ghost btn--sm">Edit</a>` : ''}
        ${ops.includes('d') ? `
          <button class="btn btn--danger btn--sm"
                  data-action="delete"
                  data-id="${id}"
                  data-name="${name}"
                  data-feature="${feature.id}">Delete</button>` : ''}
      </div>
    </article>`
}

function CardList(items, feature) {
  if (!items || !items.length) return EmptyState(feature.label)
  return `
    <div class="card-list">
      ${items.map(item => Card({
        id:      item.id,
        feature,
        name:    item.name || item.full_name || item.title || item.metric_name || 'Untitled',
        meta:    item.meta || buildMeta(item),
        pill:    item.pill || buildPill(item),
        ops:     feature.ops,
      })).join('')}
    </div>`
}

// Build a sensible meta string from common fields
function buildMeta(item) {
  const parts = []
  if (item.province)    parts.push(item.province)
  if (item.status)      parts.push(item.status)
  if (item.period)      parts.push(item.period)
  if (item.event_date)  parts.push(new Date(item.event_date).toLocaleDateString('en-ZA'))
  if (item.enrolled_at) parts.push(`Enrolled ${new Date(item.enrolled_at).toLocaleDateString('en-ZA')}`)
  if (item.created_at)  parts.push(new Date(item.created_at).toLocaleDateString('en-ZA'))
  return parts.join(' · ')
}

// Build a pill from common status fields
function buildPill(item) {
  if (!item.status && !item.is_public) return null
  if (item.is_public) return { label: 'Public', color: 'green' }
  const colorMap = {
    'Active':     'green',
    'Graduated':  'blue',
    'Completed':  'blue',
    'Pending':    'amber',
    'Upcoming':   'amber',
    'Withdrawn':  'grey',
    'Cancelled':  'grey',
    'Submitted':  'green',
    'Host':       'navy',
    'Participant':'blue',
  }
  return { label: item.status, color: colorMap[item.status] || 'grey' }
}

const { Pill }       = require('./pill')
const { EmptyState } = require('./empty')

module.exports = { Card, CardList }
