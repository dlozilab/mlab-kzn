// public/js/notifications.js
// Polls GET /api/notifications/count every 60 seconds
// Updates bell badge count only — lightweight, returns a number
// Full notification list is rendered server-side on page load

document.addEventListener('DOMContentLoaded', function () {

  const badge = document.getElementById('bell-badge')
  if (!badge) return

  function updateCount() {
    fetch('/api/notifications/count')
      .then(function (res) { return res.json() })
      .then(function (data) {
        if (data.success) {
          const count = data.data || 0
          badge.textContent = count
          badge.style.display = count > 0 ? 'flex' : 'none'
        }
      })
      .catch(function () {
        // Silent fail — notification count is non-critical
      })
  }

  // Initial count
  updateCount()

  // Poll every 60 seconds
  setInterval(updateCount, 60 * 1000)

})
