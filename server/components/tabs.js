// server/components/tabs.js
// ProvinceTabs — renders only when activity has 2+ provinces
// Used by ActivityDetailPage only (Events and Programmes)

function ProvinceTabs({ provinces, activeProvinceId, featureId, itemId }) {
  if (!provinces || provinces.length < 2) return ''

  const tabs = [
    { id: 'all', name: 'All' },
    ...provinces
  ]

  return `
    <div class="province-tabs" role="tablist" aria-label="Province tabs">
      ${tabs.map(p => `
        <a href="/cms/${featureId}/${itemId}?province=${p.id}"
           class="province-tab ${p.id === activeProvinceId ? 'province-tab--active' : ''}"
           role="tab"
           aria-selected="${p.id === activeProvinceId}">
          ${p.name}
        </a>`
      ).join('')}
    </div>`
}

module.exports = { ProvinceTabs }
