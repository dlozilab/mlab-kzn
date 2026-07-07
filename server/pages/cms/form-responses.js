// server/pages/cms/form-responses.js
// View responses for a specific form — super admin only
// Each form has its own table so columns are dynamic

const { cmsPage }    = require('../../components/layout')
const { PageHeader } = require('../../components/page-header')

function FormResponsesPage({ form, fields, responses, user }) {
  const main = `
    <a href="/cms/forms"
       style="font-size:var(--text-sm);color:var(--color-text-secondary);
              display:inline-flex;align-items:center;gap:var(--space-xs);
              margin-bottom:var(--space-lg);text-decoration:none">
      ← Forms
    </a>

    ${PageHeader({
      title: `${form.name} — Responses`,
      sub:   `${responses.length} submission${responses.length !== 1 ? 's' : ''}`,
      action: `
        <a href="/cms/forms/${form.id}/responses/export"
           class="btn btn--secondary">Export CSV</a>`,
    })}

    ${responses.length === 0 ? `
      <div class="empty-state">
        <div class="empty-state__icon">📭</div>
        <h3 class="empty-state__title">No responses yet</h3>
        <p class="empty-state__sub">Share the form link to start collecting responses</p>
      </div>
      <p style="margin-top:var(--space-md);font-size:var(--text-sm);
                color:var(--color-text-secondary)">
        Public link:
        <code style="background:var(--color-bg-muted);padding:2px 6px;
                     border-radius:var(--radius-sm)">/forms/${form.slug}</code>
      </p>` : `

      <!-- Response table -->
      <div style="overflow-x:auto">
        <table style="font-size:var(--text-sm)">
          <thead>
            <tr>
              <th style="text-align:left;padding:var(--space-sm);
                         background:var(--color-bg-subtle);
                         border-bottom:2px solid var(--color-border)">
                Submitted
              </th>
              ${fields.map(f => `
                <th style="text-align:left;padding:var(--space-sm);
                           background:var(--color-bg-subtle);
                           border-bottom:2px solid var(--color-border)">
                  ${f.label}
                </th>`
              ).join('')}
            </tr>
          </thead>
          <tbody>
            ${responses.map(r => `
              <tr style="border-bottom:1px solid var(--color-border)">
                <td style="padding:var(--space-sm);white-space:nowrap">
                  ${new Date(r.submitted_at).toLocaleDateString('en-ZA', {
                    day:'numeric', month:'short', year:'numeric',
                    hour:'2-digit', minute:'2-digit'
                  })}
                </td>
                ${fields.map(f => `
                  <td style="padding:var(--space-sm)">
                    ${Array.isArray(r[f.field_name])
                      ? r[f.field_name].join(', ')
                      : r[f.field_name] || '—'}
                  </td>`
                ).join('')}
              </tr>`
            ).join('')}
          </tbody>
        </table>
      </div>`}
  `

  return cmsPage({
    title:         `${form.name} — Responses`,
    activeFeature: 'forms',
    user,
    main,
  })
}

module.exports = { FormResponsesPage }
