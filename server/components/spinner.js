// server/components/spinner.js
// Loading state — used while async operations complete

function LoadingState(message = 'Loading...') {
  return `
    <div class="flex-center" style="padding:var(--space-2xl)">
      <p style="color:var(--color-text-secondary);font-size:var(--text-sm)">${message}</p>
    </div>`
}

module.exports = { LoadingState }
