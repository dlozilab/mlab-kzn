// server/pages/public/resources.js
// Curated list of links — forms, downloads, external sites
// Sorted newest to oldest — items under 7 days get a New badge

const { publicPage } = require('../../components/layout')

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

function isNew(createdAt) {
  return Date.now() - new Date(createdAt).getTime() < SEVEN_DAYS_MS
}

const TYPE_CONFIG = {
  form:     { label: 'Open form',  icon: '📝' },
  download: { label: 'Download',   icon: '📥' },
  external: { label: 'Visit',      icon: '🔗' },
}

function ResourcesPage({ resources = [] }) {
  const main = `
    <h1 style="font-family:var(--font-heading);font-size:var(--text-xl);
               text-transform:uppercase;color:var(--color-navy);
               margin-bottom:var(--space-xs)">
      Resources
    </h1>
    <p style="color:var(--color-text-secondary);font-size:var(--text-base);
              margin-bottom:var(--space-xl)">
      Forms, downloads and useful links from mLab.
    </p>

    ${resources.length === 0 ? `
      <p style="color:var(--color-text-secondary);font-size:var(--text-base)">
        No resources published yet — check back soon.
      </p>` :

      resources.map(r => {
        const type    = TYPE_CONFIG[r.type] || TYPE_CONFIG.external
        const newItem = isNew(r.created_at)

        return `
          <div class="banner ${newItem ? 'banner--new' : ''}"
               style="align-items:flex-start;gap:var(--space-lg)">
            <div style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;gap:var(--space-sm);
                          margin-bottom:var(--space-xs)">
                <span aria-hidden="true">${type.icon}</span>
                <p class="banner__title">${r.title}</p>
                ${newItem ? `<span class="new-badge">New</span>` : ''}
              </div>
              ${r.description ? `
                <p style="font-size:var(--text-sm);color:var(--color-text-secondary);
                           margin-top:var(--space-xs)">
                  ${r.description}
                </p>` : ''}
              <p style="font-size:var(--text-xs);color:var(--color-text-tertiary);
                         margin-top:var(--space-xs)">
                ${new Date(r.created_at).toLocaleDateString('en-ZA', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
            </div>
            <a href="${r.url}"
               class="btn btn--primary"
               ${r.type !== 'form' ? 'target="_blank" rel="noopener"' : ''}
               ${r.type === 'download' ? 'download' : ''}
               style="flex-shrink:0"
               aria-label="${type.label} — ${r.title}">
              ${type.label}
            </a>
          </div>`
      }).join('')}
  `

  return publicPage({
    activePage:  'resources',
    title:       'mLab — Resources',
    description: 'Forms, downloads and useful links from mLab.',
    url:         'https://mlab.co.za/resources',
    main,
  })
}

module.exports = { ResourcesPage }