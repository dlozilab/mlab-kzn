// server/components/form-elements.js
// Search bar, modal shell, delete confirm

function SearchBar({ placeholder = 'Search...', value = '' }) {
  return `
    <input class="search-bar"
           type="search"
           name="q"
           placeholder="${placeholder}"
           value="${value}"
           aria-label="Search">`
}

function Modal({ title, sub = '', body, confirmLabel = 'Save', confirmClass = 'btn--primary', id = '' }) {
  return `
    <h2 class="modal__title">${title}</h2>
    ${sub ? `<p class="modal__sub">${sub}</p>` : ''}
    <div class="modal__body">${body}</div>
    <div class="modal__footer">
      <button class="btn btn--ghost" id="modal-cancel">Cancel</button>
      <button class="btn ${confirmClass}" id="modal-confirm"
              data-id="${id}">${confirmLabel}</button>
    </div>`
}

function DeleteConfirm({ name, feature }) {
  return Modal({
    title:        'Confirm delete',
    sub:          `You are about to delete "${name}". This cannot be undone.`,
    body:         '',
    confirmLabel: 'Delete',
    confirmClass: 'btn--danger',
  })
}

module.exports = { SearchBar, Modal, DeleteConfirm }
