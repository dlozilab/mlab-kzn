// server/pages/cms/detail.js
// Shared detail page — Template Method pattern
// Used by all standard entities (not Events or Programmes — those use activity-detail.js)
// Shows all fields + is_public toggle if canBePublic + edit/delete actions

const { cmsPage }        = require('../../components/layout')
const { PageHeader }     = require('../../components/page-header')
const { FieldSet }       = require('../../components/field-renderer')
const { Toggle }         = require('../../components/toggle')
const { DeleteConfirm }  = require('../../components/form-elements')

function DetailPage({ feature, item, user, backLabel }) {
  const canEdit   = feature.ops.includes('u') && !feature.readOnly
  const canDelete = feature.ops.includes('d') && !feature.readOnly

  const main = `
    <!-- Back link -->
    <a href="/cms/${feature.id}"
       style="font-size:var(--text-sm);color:var(--color-text-secondary);
              display:inline-flex;align-items:center;gap:var(--space-xs);
              margin-bottom:var(--space-lg);text-decoration:none"
       aria-label="Back to ${feature.label}">
      ← ${backLabel || feature.label}
    </a>

    ${PageHeader({
      title: item.name || item.full_name || item.title || item.metric_name || 'Detail',
      action: `
        <div style="display:flex;gap:var(--space-sm)">
          ${canEdit ? `
            <a href="/cms/${feature.id}/${item.id}/edit"
               class="btn btn--secondary">Edit</a>` : ''}
          ${canDelete ? `
            <button class="btn btn--danger"
                    data-action="delete"
                    data-id="${item.id}"
                    data-name="${item.name || item.full_name || item.title || ''}"
                    data-feature="${feature.id}">
              Delete
            </button>` : ''}
        </div>`
    })}

    <!-- Field values -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);margin-bottom:var(--space-lg)">
      ${feature.fields.map(f => `
        <div>
          <p class="section-label">${f.label}</p>
          <p style="font-size:var(--text-base)">${item[f.name] || '—'}</p>
        </div>`
      ).join('')}
    </div>

    <hr>

    <!-- Visibility toggle -->
    ${feature.canBePublic ? Toggle({
      id:        item.id,
      isPublic:  item.is_public,
      featureId: feature.id,
    }) : ''}
  `

  return cmsPage({
    title:         item.name || item.full_name || item.title || feature.label,
    activeFeature: feature.id,
    user,
    main,
  })
}

// Edit page — same layout but with editable form fields
function EditPage({ feature, item, user }) {
  const main = `
    <a href="/cms/${feature.id}/${item.id}"
       style="font-size:var(--text-sm);color:var(--color-text-secondary);
              display:inline-flex;align-items:center;gap:var(--space-xs);
              margin-bottom:var(--space-lg);text-decoration:none">
      ← Back
    </a>

    ${PageHeader({ title: `Edit ${feature.label.replace(/s$/, '')}` })}

    <form method="POST" action="/cms/${feature.id}/${item.id}/edit"
          style="max-width:600px">
      ${FieldSet(feature.fields, item)}
      <div style="display:flex;gap:var(--space-sm);margin-top:var(--space-lg)">
        <button type="submit" class="btn btn--primary">Save changes</button>
        <a href="/cms/${feature.id}/${item.id}" class="btn btn--ghost">Cancel</a>
      </div>
    </form>
  `

  return cmsPage({
    title:         `Edit — ${item.name || item.full_name || item.title || feature.label}`,
    activeFeature: feature.id,
    user,
    main,
  })
}

// New page — blank form for creating a new item
function NewPage({ feature, user, fieldOptions = {} }) {
  const main = `
    <a href="/cms/${feature.id}"
       style="font-size:var(--text-sm);color:var(--color-text-secondary);
              display:inline-flex;align-items:center;gap:var(--space-xs);
              margin-bottom:var(--space-lg);text-decoration:none">
      ← ${feature.label}
    </a>

    ${PageHeader({ title: `New ${feature.label.replace(/s$/, '')}` })}

    <form method="POST" action="/cms/${feature.id}/new"
          style="max-width:600px">
      ${FieldSet(feature.fields.map(f => ({
        ...f,
        options: fieldOptions[f.name] || f.options || [],
      })), {})}
      <div style="display:flex;gap:var(--space-sm);margin-top:var(--space-lg)">
        <button type="submit" class="btn btn--primary">
          Create ${feature.label.replace(/s$/, '')}
        </button>
        <a href="/cms/${feature.id}" class="btn btn--ghost">Cancel</a>
      </div>
    </form>
  `

  return cmsPage({
    title:         `New ${feature.label.replace(/s$/, '')}`,
    activeFeature: feature.id,
    user,
    main,
  })
}

module.exports = { DetailPage, EditPage, NewPage }
