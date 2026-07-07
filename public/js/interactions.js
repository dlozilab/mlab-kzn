// public/js/interactions.js
// DOM events only — no fetch calls
// Handles: modal open/close, notification panel toggle,
//          delete confirmation, public toggle, province tabs

document.addEventListener('DOMContentLoaded', function () {

  // ── NOTIFICATION PANEL ─────────────────────────────────────────────────────

  const bellBtn   = document.getElementById('bell-btn')
  const panel     = document.getElementById('notification-panel')
  const markAllBtn = document.getElementById('mark-all-read')

  if (bellBtn && panel) {
    bellBtn.addEventListener('click', function (e) {
      e.stopPropagation()
      const isOpen = panel.classList.contains('notification-panel--open')
      panel.classList.toggle('notification-panel--open', !isOpen)
      panel.setAttribute('aria-hidden', isOpen)
    })

    // Close panel when clicking outside
    document.addEventListener('click', function (e) {
      if (!panel.contains(e.target) && e.target !== bellBtn) {
        panel.classList.remove('notification-panel--open')
        panel.setAttribute('aria-hidden', 'true')
      }
    })
  }

  if (markAllBtn) {
    markAllBtn.addEventListener('click', function () {
      fetch('/api/notifications/read-all', { method: 'POST' })
        .then(function () {
          // Remove all unread dots
          document.querySelectorAll('.notification-item__dot--unread')
            .forEach(function (dot) {
              dot.classList.remove('notification-item__dot--unread')
              dot.classList.add('notification-item__dot--read')
            })
          // Zero the badge
          const badge = document.getElementById('bell-badge')
          if (badge) badge.textContent = '0'
        })
    })
  }

  // ── MODAL ──────────────────────────────────────────────────────────────────

  const overlay  = document.getElementById('modal-overlay')
  const modalBox = document.getElementById('modal-box')

  function openModal(html) {
    if (!overlay || !modalBox) return
    modalBox.innerHTML = html
    overlay.classList.add('modal-overlay--open')
    overlay.setAttribute('aria-hidden', 'false')
    // Focus cancel button if present
    const cancel = modalBox.querySelector('#modal-cancel')
    if (cancel) cancel.focus()
  }

  function closeModal() {
    if (!overlay) return
    overlay.classList.remove('modal-overlay--open')
    overlay.setAttribute('aria-hidden', 'true')
  }

  // Close modal on overlay click or cancel button
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal()
    })
  }

  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'modal-cancel') closeModal()
  })

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal()
  })

  // ── DELETE CONFIRMATION ────────────────────────────────────────────────────

  document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-action="delete"]')
    if (!btn) return

    const id      = btn.dataset.id
    const name    = btn.dataset.name
    const feature = btn.dataset.feature

    openModal(`
      <h2 class="modal__title">Confirm delete</h2>
      <p class="modal__sub">
        You are about to delete <strong>${name}</strong>. This cannot be undone.
      </p>
      <div class="modal__footer">
        <button class="btn btn--ghost" id="modal-cancel">Cancel</button>
        <button class="btn btn--danger" id="modal-confirm">Delete</button>
      </div>
    `)

    // Confirm handler — submits a DELETE form
    document.getElementById('modal-confirm').addEventListener('click', function () {
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = `/cms/${feature}/${id}/delete`
      document.body.appendChild(form)
      form.submit()
    })
  })

  // ── PUBLIC TOGGLE ──────────────────────────────────────────────────────────

  const toggleInput = document.getElementById('toggle-public')

  if (toggleInput) {
    toggleInput.addEventListener('change', function () {
      const id        = this.dataset.id
      const feature   = this.dataset.feature
      const isPublic  = this.checked
      const toggleRow = this.closest('.toggle-row')

      fetch(`/api/${feature}/${id}/publish`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ is_public: isPublic }),
      })
      .then(function (res) { return res.json() })
      .then(function (data) {
        if (data.success) {
          // Update toggle row styling
          if (toggleRow) {
            toggleRow.classList.toggle('toggle-row--public', isPublic)
          }
          // Update label text
          const label = toggleRow?.querySelector('.toggle-row__label')
          if (label) {
            label.textContent = isPublic
              ? 'Public — visible on the public site'
              : 'Internal — only visible to mLab staff'
          }
        } else {
          // Revert toggle on failure
          toggleInput.checked = !isPublic
          alert('Could not update visibility. Please try again.')
        }
      })
      .catch(function () {
        toggleInput.checked = !isPublic
        alert('Could not update visibility. Please try again.')
      })
    })
  }

  // ── PERMISSION TOGGLES (roles page) ───────────────────────────────────────

  document.addEventListener('change', function (e) {
    const checkbox = e.target.closest('[data-action="toggle-permission"]')
    if (!checkbox) return

    const featureId = checkbox.dataset.feature
    const op        = checkbox.dataset.op
    const enabled   = checkbox.checked
    const roleId    = new URLSearchParams(window.location.search).get('role')

    if (!roleId) return

    fetch('/api/roles/permissions', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ roleId, featureId, op, enabled }),
    })
    .then(function (res) { return res.json() })
    .then(function (data) {
      if (!data.success) {
        checkbox.checked = !enabled
        alert('Could not update permission. Please try again.')
      }
    })
  })

})
