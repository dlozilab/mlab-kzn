// server/pages/cms/roles.js
// Roles and permissions — super admin only
// Group CRUD + permission toggle matrix driven by featureRegistry

const { cmsPage }    = require('../../components/layout')
const { PageHeader } = require('../../components/page-header')
const { registry }   = require('../../config/featureRegistry')

function RolesPage({ groups, permissions, user }) {
  const main = `
    ${PageHeader({
      title:  'Roles & permissions',
      sub:    'Manage groups and what they can do',
      action: `<a href="/cms/roles/new" class="btn btn--primary">+ New group</a>`,
    })}

    <div style="display:flex;gap:var(--space-xl);align-items:flex-start">

      <!-- Group list -->
      <div style="width:200px;flex-shrink:0">
        <p class="section-label">Groups</p>
        ${(groups || []).map(g => `
          <a href="/cms/roles/${g.id}"
             class="nav-btn ${g.active ? 'nav-btn--active' : ''}"
             style="margin-bottom:var(--space-xs)">
            <span style="width:10px;height:10px;border-radius:50%;
                         background:${g.color || '#888'};flex-shrink:0"></span>
            <span class="nav-btn__label">${g.name}</span>
            ${g.is_system ? `<span style="font-size:var(--text-xs);
              color:var(--color-text-secondary)">(system)</span>` : ''}
          </a>`
        ).join('')}
      </div>

      <!-- Permissions matrix -->
      <div style="flex:1;min-width:0">
        <p class="section-label">Permissions for selected group</p>
        <p style="font-size:var(--text-sm);color:var(--color-text-secondary);
                  margin-bottom:var(--space-md)">
          Toggle what this group can do. Super admin always has full access.
        </p>

        ${registry.map(f => `
          <div style="margin-bottom:var(--space-md)">
            <p style="font-weight:var(--weight-medium);font-size:var(--text-sm);
                      margin-bottom:var(--space-xs)">${f.label}</p>
            <div style="display:flex;gap:var(--space-sm);flex-wrap:wrap">
              ${f.ops.map(op => {
                const opLabel = { c:'Create', r:'Read', u:'Update', d:'Delete' }[op]
                const enabled = permissions?.[f.id]?.[op] || false
                return `
                  <label style="display:flex;align-items:center;gap:var(--space-xs);
                                font-size:var(--text-xs);cursor:pointer">
                    <input type="checkbox"
                           data-feature="${f.id}"
                           data-op="${op}"
                           data-action="toggle-permission"
                           ${enabled ? 'checked' : ''}
                           style="accent-color:var(--color-navy)">
                    ${opLabel}
                  </label>`
              }).join('')}
            </div>
          </div>`
        ).join('')}
      </div>

    </div>
  `

  return cmsPage({ title: 'Roles & permissions', activeFeature: 'roles', user, main })
}

module.exports = { RolesPage }
