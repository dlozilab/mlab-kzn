// server/components/field-renderer.js
// Renders any field type from featureRegistry config
// Used by add/edit forms on list and detail pages

function FieldRenderer(field, value = '') {
  const id    = `field-${field.name}`
  const req   = field.required ? 'required' : ''
  const label = `<label class="field__label" for="${id}">${field.label}${field.required ? ' *' : ''}</label>`

  switch (field.type) {

    case 'text':
    case 'email':
    case 'phone':
    case 'url':
      return `
        <div class="field">
          ${label}
          <input class="field__input"
                 type="${field.type}"
                 id="${id}"
                 name="${field.name}"
                 value="${value || ''}"
                 ${req}
                 autocomplete="off">
        </div>`

    case 'number':
      return `
        <div class="field">
          ${label}
          <input class="field__input"
                 type="number"
                 id="${id}"
                 name="${field.name}"
                 value="${value || ''}"
                 ${req}>
        </div>`

    case 'date':
      return `
        <div class="field">
          ${label}
          <input class="field__input"
                 type="date"
                 id="${id}"
                 name="${field.name}"
                 value="${value || ''}"
                 ${req}>
        </div>`

    case 'time':
      return `
        <div class="field">
          ${label}
          <input class="field__input"
                 type="time"
                 id="${id}"
                 name="${field.name}"
                 value="${value || ''}"
                 ${req}>
        </div>`

    case 'textarea':
      return `
        <div class="field">
          ${label}
          <textarea class="field__textarea"
                    id="${id}"
                    name="${field.name}"
                    ${req}>${value || ''}</textarea>
        </div>`

    case 'select':
      const options = field.options || []
      return `
        <div class="field">
          ${label}
          <select class="field__select"
                  id="${id}"
                  name="${field.name}"
                  ${req}>
            <option value="">Select ${field.label}</option>
            ${options.map(opt =>
              `<option value="${opt}" ${value === opt ? 'selected' : ''}>${opt}</option>`
            ).join('')}
          </select>
        </div>`

    case 'multiselect':
      // Rendered as checkboxes — options populated from source at route level
      const msOptions = field.options || []
      const selected  = Array.isArray(value) ? value : []
      return `
        <div class="field">
          ${label}
          <div style="display:flex;flex-direction:column;gap:var(--space-xs);margin-top:var(--space-xs)">
            ${msOptions.map(opt => `
              <label style="display:flex;align-items:center;gap:var(--space-sm);font-size:var(--text-sm)">
                <input type="checkbox"
                       name="${field.name}[]"
                       value="${opt.id || opt}"
                       ${selected.includes(opt.id || opt) ? 'checked' : ''}
                       style="accent-color:var(--color-navy)">
                ${opt.name || opt}
              </label>`
            ).join('')}
          </div>
        </div>`

    case 'radio':
      const radioOptions = field.options || []
      return `
        <div class="field">
          ${label}
          <div style="display:flex;gap:var(--space-md);margin-top:var(--space-xs)">
            ${radioOptions.map(opt => `
              <label style="display:flex;align-items:center;gap:var(--space-xs);font-size:var(--text-sm)">
                <input type="radio"
                       name="${field.name}"
                       value="${opt}"
                       ${value === opt ? 'checked' : ''}
                       style="accent-color:var(--color-navy)"
                       ${req}>
                ${opt}
              </label>`
            ).join('')}
          </div>
        </div>`

    case 'scale':
      return `
        <div class="field">
          ${label}
          <div class="scale-options">
            ${[1,2,3,4,5].map(n => `
              <label class="scale-option">
                <input type="radio"
                       name="${field.name}"
                       value="${n}"
                       ${value === n ? 'checked' : ''}
                       ${req}>
                <span class="scale-option__label">${n}</span>
              </label>`
            ).join('')}
          </div>
        </div>`

    default:
      return `
        <div class="field">
          ${label}
          <input class="field__input"
                 type="text"
                 id="${id}"
                 name="${field.name}"
                 value="${value || ''}">
        </div>`
  }
}

// Render all fields for a feature
function FieldSet(fields, values = {}) {
  return fields.map(f => FieldRenderer(f, values[f.name])).join('')
}

module.exports = { FieldRenderer, FieldSet }
