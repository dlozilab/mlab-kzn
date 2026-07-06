// server/components/page-header.js
// Title + subtitle + optional right action slot (e.g. Add button)
// Used on every list and detail page

function PageHeader({ title, sub, action = '' }) {
  return `
    <div class="page-header">
      <div class="page-header__text">
        <h1 class="page-header__title">${title}</h1>
        ${sub ? `<p class="page-header__sub">${sub}</p>` : ''}
      </div>
      ${action ? `<div class="page-header__action">${action}</div>` : ''}
    </div>`
}

function AddButton(feature) {
  return `
    <a href="/cms/${feature.id}/new" class="btn btn--primary">
      + Add ${feature.label.replace(/s$/, '')}
    </a>`
}

module.exports = { PageHeader, AddButton }
