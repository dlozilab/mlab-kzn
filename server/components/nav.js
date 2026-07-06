// server/components/nav.js
// Builds CMS sidebar and topbar right from featureRegistry
// Composite pattern — Sidebar contains NavSections which contain NavButtons

const { getBySection, getSections } = require('../config/featureRegistry')

// ── NAV BUTTON ────────────────────────────────────────────────────────────────

function NavButton({ id, label, icon, active }) {
  return `
    <a href="/cms/${id}"
       class="nav-btn${active ? ' nav-btn--active' : ''}"
       aria-current="${active ? 'page' : 'false'}">
      <span class="nav-btn__icon" aria-hidden="true">${icon}</span>
      <span class="nav-btn__label">${label}</span>
    </a>`
}

// ── NAV SECTION ───────────────────────────────────────────────────────────────

function NavSection({ title, features, activeFeature }) {
  return `
    <div class="sidebar__section">
      <p class="sidebar__section-label">${title}</p>
      ${features.map(f => NavButton({
        id:     f.id,
        label:  f.label,
        icon:   f.icon,
        active: f.id === activeFeature
      })).join('')}
    </div>`
}

// ── SIDEBAR ───────────────────────────────────────────────────────────────────

function Sidebar(activeFeature, user) {
  const sections  = getSections()
  const bySection = getBySection()

  return sections.map(section => {
    const features = bySection[section].filter(f => {
      // Hide super admin only features from non-super admins
      if (f.superAdminOnly && user.role !== 'super_admin') return false
      return true
    })
    if (!features.length) return ''
    return NavSection({ title: section, features, activeFeature })
  }).join('')
}

// ── TOPBAR RIGHT ─────────────────────────────────────────────────────────────

function TopbarRight(user) {
  return `
    <div class="bell-wrap" id="bell-btn" aria-label="Notifications" role="button" tabindex="0">
      <span class="bell-wrap__icon" aria-hidden="true">🔔</span>
      <span class="bell-badge" id="bell-badge" aria-live="polite">0</span>
    </div>
    <span style="font-size:var(--text-sm);color:rgba(255,255,255,0.7)">
      ${user.full_name || user.email}
    </span>
    <a href="/auth/logout" class="btn btn--ghost btn--sm"
       style="color:rgba(255,255,255,0.7);border-color:rgba(255,255,255,0.2)">
      Sign out
    </a>`
}

module.exports = { Sidebar, NavButton, NavSection, TopbarRight }
