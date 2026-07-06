// server/pages/cms/activity-detail.js
// Template Method variant of detail.js — for Events and Programmes only
// Adds ProvinceTabs when activity spans 2+ provinces
// Inherits all detail behaviour, extends with province tab logic

const { cmsPage }        = require('../../components/layout')
const { PageHeader }     = require('../../components/page-header')
const { FieldSet }       = require('../../components/field-renderer')
const { Toggle }         = require('../../components/toggle')
const { ProvinceTabs }   = require('../../components/tabs')

function ActivityDetailPage({ feature, item, user, provinces, activeProvinceId }) {

  // province_ids is an array of province IDs on the activity
  const activityProvinces = provinces.filter(p =>
    (item.province_ids || []).includes(p.id)
  )

  const canEdit   = feature.ops.includes('u')
  const canDelete = feature.ops.includes('d')

  const main = `
    <a href="/cms/${feature.id}"
       style="font-size:var(--text-sm);color:var(--color-text-secondary);
              display:inline-flex;align-items:center;gap:var(--space-xs);
              margin-bottom:var(--space-lg);text-decoration:none">
      ← ${feature.label}
    </a>

    ${PageHeader({
      title: item.name || 'Activity',
      action: `
        <div style="display:flex;gap:var(--space-sm)">
          ${canEdit ? `
            <a href="/cms/${feature.id}/${item.id}/edit"
               class="btn btn--secondary">Edit</a>` : ''}
          ${canDelete ? `
            <button class="btn btn--danger"
                    data-action="delete"
                    data-id="${item.id}"
                    data-name="${item.name || ''}"
                    data-feature="${feature.id}">Delete</button>` : ''}
        </div>`
    })}

    <!-- Core fields — always shown regardless of tab -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);margin-bottom:var(--space-lg)">
      ${feature.fields
        .filter(f => f.name !== 'province_ids')
        .map(f => `
          <div>
            <p class="section-label">${f.label}</p>
            <p style="font-size:var(--text-base)">${item[f.name] || '—'}</p>
          </div>`
        ).join('')}
    </div>

    <hr>

    <!-- Province tabs — only renders when 2+ provinces -->
    ${ProvinceTabs({
      provinces:       activityProvinces,
      activeProvinceId: activeProvinceId || 'all',
      featureId:       feature.id,
      itemId:          item.id,
    })}

    <!-- Province-specific data for the active tab -->
    <div style="margin-bottom:var(--space-lg)">
      ${buildProvinceData(item, activityProvinces, activeProvinceId)}
    </div>

    <hr>

    <!-- Visibility toggle -->
    ${Toggle({ id: item.id, isPublic: item.is_public, featureId: feature.id })}
  `

  return cmsPage({
    title:         item.name || feature.label,
    activeFeature: feature.id,
    user,
    main,
  })
}

function buildProvinceData(item, provinces, activeProvinceId) {
  // If single province or All tab — show aggregate
  if (!activeProvinceId || activeProvinceId === 'all') {
    return `
      <div class="grid-${Math.min(provinces.length, 4)}" style="margin-top:var(--space-md)">
        ${provinces.map(p => `
          <div class="stat-card">
            <p class="stat-card__value">—</p>
            <p class="stat-card__label">${p.name}</p>
          </div>`
        ).join('')}
      </div>
      <p style="font-size:var(--text-xs);color:var(--color-text-secondary);margin-top:var(--space-sm)">
        Province-specific data loaded from journeys and KPI entries linked to this activity.
      </p>`
  }

  const province = provinces.find(p => p.id === activeProvinceId)
  return `
    <div class="stat-card" style="max-width:200px;margin-top:var(--space-md)">
      <p class="stat-card__value">—</p>
      <p class="stat-card__label">${province?.name || 'Province'} data</p>
    </div>`
}

module.exports = { ActivityDetailPage }
