// server/pages/cms/report-runner.js
// SQL query runner with AI render — super admin only
// Two views: definition list (managed by list.js) and runner (this file)

const { cmsPage }    = require('../../components/layout')
const { PageHeader } = require('../../components/page-header')

function ReportRunnerPage({ definition, renderedHtml, rawData, user, error }) {
  const main = `
    <a href="/cms/report-definitions"
       style="font-size:var(--text-sm);color:var(--color-text-secondary);
              display:inline-flex;align-items:center;gap:var(--space-xs);
              margin-bottom:var(--space-lg);text-decoration:none">
      ← Report definitions
    </a>

    ${PageHeader({
      title: definition.name,
      sub:   definition.description || '',
      action: `
        <div style="display:flex;gap:var(--space-sm)">
          <a href="/cms/report-definitions/${definition.id}/run"
             class="btn btn--primary">Run report</a>
          <a href="/cms/report-definitions/${definition.id}/edit"
             class="btn btn--secondary">Edit query</a>
        </div>`,
    })}

    <!-- Query display -->
    <details style="margin-bottom:var(--space-lg)">
      <summary style="font-size:var(--text-sm);color:var(--color-text-secondary);
                      cursor:pointer;margin-bottom:var(--space-sm)">
        View SQL query
      </summary>
      <pre style="background:var(--color-bg-muted);padding:var(--space-md);
                  border-radius:var(--radius-md);font-size:var(--text-xs);
                  overflow-x:auto;border-left:3px solid var(--color-navy)">
${definition.query}</pre>
    </details>

    <!-- Error state -->
    ${error ? `
      <div class="alert alert--danger" role="alert">
        <strong>Query error:</strong> ${error}
      </div>` : ''}

    <!-- AI rendered output -->
    ${renderedHtml ? `
      <div style="margin-bottom:var(--space-lg)">
        <p class="section-label" style="margin-bottom:var(--space-md)">Report output</p>
        <div style="border:1px solid var(--color-border);
                    border-radius:var(--radius-lg);
                    padding:var(--space-lg)">
          ${renderedHtml}
        </div>
      </div>

      <div style="display:flex;gap:var(--space-sm)">
        <a href="/cms/report-definitions/${definition.id}/export"
           class="btn btn--secondary">Export as PDF snapshot</a>
      </div>` : `

      <!-- Not yet run -->
      ${!error ? `
        <div class="empty-state">
          <div class="empty-state__icon">🔍</div>
          <h3 class="empty-state__title">Ready to run</h3>
          <p class="empty-state__sub">Click "Run report" to execute the query and render the results</p>
        </div>` : ''}`}
  `

  return cmsPage({
    title:         definition.name,
    activeFeature: 'report-definitions',
    user,
    main,
  })
}

module.exports = { ReportRunnerPage }
