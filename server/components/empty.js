// server/components/empty.js
// Empty state — shows when a list has no items

function EmptyState(label) {
  return `
    <div class="empty-state">
      <div class="empty-state__icon" aria-hidden="true">📭</div>
      <h3 class="empty-state__title">No ${label} yet</h3>
      <p class="empty-state__sub">Add one using the button above</p>
    </div>`
}

module.exports = { EmptyState }
