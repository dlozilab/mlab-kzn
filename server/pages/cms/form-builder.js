// server/pages/cms/form-builder.js
// Build and manage forms — super admin only
// Two views: form list (managed by list.js) and field builder (this file)

const { cmsPage }    = require('../../components/layout')
const { PageHeader } = require('../../components/page-header')

const FIELD_TYPES = [
  { value: 'text',      label: 'Short text' },
  { value: 'textarea',  label: 'Long text' },
  { value: 'number',    label: 'Number' },
  { value: 'date',      label: 'Date' },
  { value: 'time',      label: 'Time' },
  { value: 'email',     label: 'Email' },
  { value: 'phone',     label: 'Phone' },
  { value: 'url',       label: 'URL' },
  { value: 'radio',     label: 'Select one (radio)' },
  { value: 'checkbox',  label: 'Select many (checkbox)' },
  { value: 'scale',     label: 'Scale 1–5' },
]

function FormBuilderPage({ form, fields, user }) {
  const isNew = !form?.id

  const main = `
    <a href="/cms/forms"
       style="font-size:var(--text-sm);color:var(--color-text-secondary);
              display:inline-flex;align-items:center;gap:var(--space-xs);
              margin-bottom:var(--space-lg);text-decoration:none">
      ← Forms
    </a>

    ${PageHeader({
      title: isNew ? 'New form' : `Edit — ${form.name}`,
      sub:   isNew ? 'Define the form then add fields' : `/${form.slug}`,
    })}

    <!-- Form metadata -->
    <form method="POST"
          action="${isNew ? '/cms/forms/new' : `/cms/forms/${form.id}/edit`}"
          style="max-width:500px;margin-bottom:var(--space-xl)">

      <div class="field">
        <label class="field__label" for="name">Form name *</label>
        <input class="field__input" type="text" id="name" name="name"
               value="${form?.name || ''}" required>
      </div>

      <div class="field">
        <label class="field__label" for="slug">Slug (URL-safe, no spaces) *</label>
        <input class="field__input" type="text" id="slug" name="slug"
               value="${form?.slug || ''}"
               placeholder="e.g. codetribe-registration"
               pattern="[a-z0-9-]+" required>
      </div>

      <div class="field">
        <label class="field__label" for="linked_entity">Link to entity</label>
        <select class="field__select" id="linked_entity" name="linked_entity">
          <option value="">None</option>
          <option value="programmes" ${form?.linked_entity === 'programmes' ? 'selected' : ''}>Programmes</option>
          <option value="events"     ${form?.linked_entity === 'events'     ? 'selected' : ''}>Events</option>
          <option value="journeys"   ${form?.linked_entity === 'journeys'   ? 'selected' : ''}>Journeys</option>
        </select>
      </div>

      <button type="submit" class="btn btn--primary">
        ${isNew ? 'Create form' : 'Save changes'}
      </button>
    </form>

    <!-- Field builder — only shown after form is created -->
    ${!isNew ? `
      <hr>
      <div style="margin-top:var(--space-xl)">
        <p class="section-label" style="margin-bottom:var(--space-md)">Form fields</p>

        <!-- Existing fields -->
        ${(fields || []).length ? `
          <div style="margin-bottom:var(--space-lg)">
            ${fields.map((f, i) => `
              <div class="card">
                <div class="card__detail">
                  <h3 class="card__name">${f.label}</h3>
                  <p class="card__meta">${f.field_type} · ${f.required ? 'Required' : 'Optional'}</p>
                </div>
                <div class="card__actions">
                  <form method="POST" action="/cms/forms/${form.id}/fields/${f.id}/delete"
                        style="display:inline">
                    <button class="btn btn--danger btn--sm" type="submit">Remove</button>
                  </form>
                </div>
              </div>`
            ).join('')}
          </div>` : `
          <p style="font-size:var(--text-sm);color:var(--color-text-secondary);
                    margin-bottom:var(--space-lg)">No fields yet — add one below</p>`}

        <!-- Add field form -->
        <form method="POST" action="/cms/forms/${form.id}/fields"
              style="background:var(--color-bg-subtle);
                     padding:var(--space-lg);
                     border-radius:var(--radius-lg);
                     border:1px solid var(--color-border)">
          <p style="font-weight:var(--weight-medium);margin-bottom:var(--space-md)">Add field</p>

          <div class="grid-2">
            <div class="field">
              <label class="field__label" for="label">Field label *</label>
              <input class="field__input" type="text" id="label" name="label"
                     placeholder="e.g. Full name" required>
            </div>
            <div class="field">
              <label class="field__label" for="field_name">Field name (no spaces) *</label>
              <input class="field__input" type="text" id="field_name" name="field_name"
                     placeholder="e.g. full_name"
                     pattern="[a-z0-9_]+" required>
            </div>
          </div>

          <div class="grid-2">
            <div class="field">
              <label class="field__label" for="field_type">Field type *</label>
              <select class="field__select" id="field_type" name="field_type" required>
                ${FIELD_TYPES.map(t =>
                  `<option value="${t.value}">${t.label}</option>`
                ).join('')}
              </select>
            </div>
            <div class="field">
              <label class="field__label" for="sort_order">Order</label>
              <input class="field__input" type="number" id="sort_order" name="sort_order"
                     value="${(fields?.length || 0) + 1}" min="1">
            </div>
          </div>

          <div class="field">
            <label class="field__label" for="options">
              Options (for radio/checkbox — one per line)
            </label>
            <textarea class="field__textarea" id="options" name="options"
                      placeholder="Option 1&#10;Option 2&#10;Option 3"
                      style="min-height:80px"></textarea>
          </div>

          <label style="display:flex;align-items:center;gap:var(--space-sm);
                        font-size:var(--text-sm);margin-bottom:var(--space-md)">
            <input type="checkbox" name="required" value="true"
                   style="accent-color:var(--color-navy)">
            Required field
          </label>

          <button type="submit" class="btn btn--primary">Add field</button>
        </form>
      </div>` : ''}
  `

  return cmsPage({ title: isNew ? 'New form' : form.name, activeFeature: 'forms', user, main })
}

module.exports = { FormBuilderPage }
