// server/components/notification.js
// Builds notification panel items
// Panel is always in the DOM — JS toggles visibility

function NotificationItem({ message, time, isRead, type }) {
  return `
    <div class="notification-item">
      <div class="notification-item__dot ${isRead
        ? 'notification-item__dot--read'
        : 'notification-item__dot--unread'}"
        aria-hidden="true"></div>
      <div>
        <p style="font-size:var(--text-sm)">${message}</p>
        <p class="notification-item__time">${time}</p>
      </div>
    </div>`
}

function NotificationList(notifications) {
  if (!notifications || !notifications.length) {
    return `<p style="padding:var(--space-md);font-size:var(--text-sm);
            color:var(--color-text-secondary);text-align:center">
            All caught up</p>`
  }
  return notifications.map(n => NotificationItem({
    message: n.message,
    time:    new Date(n.created_at).toLocaleDateString('en-ZA', {
               day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
             }),
    isRead:  n.is_read,
    type:    n.type,
  })).join('')
}

module.exports = { NotificationItem, NotificationList }
