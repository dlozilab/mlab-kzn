// server/pages/public/resources.js
// Published report snapshots — click banner to download PDF
// Search is server-side (GET with ?q=) — no JS filtering
// NewBadge renders for items less than 8 days old

const { publicPage } = require('../../components/layout')
const { NewBadge }   = require('../../components/badge')

function ResourcesPage({ snapshots = [], searchQuery = '' }) {
  const main = `

    <h1 style="font-family:var(--font-heading);font-size:var(--text-xl);
               text-transform:uppercase;color:var(--color-navy);
               margin-bottom:var(--space-xs)">
      Reports &amp; resources
    </h1>
    <p style="color:var(--color-text-secondary);margin-bottom:var(--space-lg)">
      Published impact reports and programme resources — click to download.
    </p>

    <!-- Search — plain GET form, server renders filtered results -->
    <form method="GET" action="/resources"
          style="margin-bottom:var(--space-lg);display:flex;gap:var(--space-sm)">
      <input class="search-bar"
             style="margin-bottom:0;flex:1"
             type="search"
             name="q"
             placeholder="Search reports..."
             value="${searchQuery}"
             aria-label="Search reports">
      <button type="submit" class="btn btn--primary">Search</button>
      ${searchQuery ? `
        <a href="/resources" class="btn btn--ghost">Clear</a>` : ''}
    </form>

    ${searchQuery ? `
      <p style="font-size:var(--text-sm);color:var(--color-text-secondary);
                margin-bottom:var(--space-md)">
        ${snapshots.length} result${snapshots.length !== 1 ? 's' : ''} for
        &ldquo;${searchQuery}&rdquo;
      </p>` : ''}

    <!-- Snapshot banners -->
    ${snapshots.length === 0 ? `
      <p style="color:var(--color-text-secondary);font-size:var(--text-sm)">
        ${searchQuery ? 'No results found.' : 'No reports published yet — check back soon.'}
      </p>` :

      snapshots.map(s => `
        <div class="banner ${isNew(s.created_at) ? 'banner--new' : ''}">
          <div>
            <p class="banner__title">
              ${s.title}
              ${NewBadge(s.created_at)}
            </p>
            <p class="banner__meta">
              PDF
              ${s.period ? `· ${s.period}` : ''}
              · Published ${new Date(s.created_at).toLocaleDateString('en-ZA', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
            </p>
          </div>
          <a href="${s.file_url}"
             class="btn btn--primary"
             target="_blank"
             rel="noopener"
             download
             aria-label="Download ${s.title}">
            Download
          </a>
        </div>`
      ).join('')}
  `

  return publicPage({
    activePage:  'resources',
    title:       'mLab — Reports and Resources',
    description: 'Download published mLab impact reports and programme resources.',
    url:         'https://mlab.co.za/resources',
    main,
  })
}

function isNew(createdAt) {
  return Date.now() - new Date(createdAt).getTime() < 8 * 24 * 60 * 60 * 1000
}

module.exports = { ResourcesPage }
