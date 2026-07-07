// server/pages/cms/dashboard.js
// National overview — stats, province status, pending reports
// Unique page — cannot be templated

const { cmsPage }    = require('../../components/layout')
const { PageHeader } = require('../../components/page-header')
const { Pill }       = require('../../components/pill')

function DashboardPage({ stats, provinces, pendingReports, user }) {
  const main = `
    ${PageHeader({
      title:  'Dashboard',
      sub:    'National overview',
      action: user.role === 'super_admin'
        ? `<a href="/cms/report-definitions" class="btn btn--primary">Generate report</a>`
        : '',
    })}

    <!-- Stats row -->
    <div class="grid-4" style="margin-bottom:var(--space-xl)">
      <div class="stat-card">
        <p class="stat-card__value">${stats.totalParticipants || 0}</p>
        <p class="stat-card__label">Programme participants</p>
      </div>
      <div class="stat-card">
        <p class="stat-card__value">${stats.activeProvinces || 0}</p>
        <p class="stat-card__label">Active provinces</p>
      </div>
      <div class="stat-card">
        <p class="stat-card__value">${stats.activeProgrammes || 0}</p>
        <p class="stat-card__label">Active programmes</p>
      </div>
      <div class="stat-card">
        <p class="stat-card__value">${pendingReports?.length || 0}</p>
        <p class="stat-card__label">Reports due</p>
      </div>
    </div>

    <!-- Province status -->
    ${user.role === 'super_admin' ? `
      <p class="section-label" style="margin-bottom:var(--space-sm)">Province status</p>
      <div style="margin-bottom:var(--space-xl)">
        ${(provinces || []).map(p => `
          <article class="card">
            <div class="card__detail">
              <h3 class="card__name">
                ${p.name}
                ${Pill({ label: p.reportStatus || 'Pending', color: p.reportStatus === 'Submitted' ? 'green' : 'amber' })}
              </h3>
              <p class="card__meta">
                ${p.participantCount || 0} participants &middot;
                ${p.kpisOnTrack || 0}/${p.kpisTotal || 0} KPIs on track
              </p>
            </div>
            <a href="/cms/journeys?province=${p.id}" class="btn btn--ghost btn--sm">View</a>
          </article>`
        ).join('')}
      </div>` : ''}

    <!-- Pending reports -->
    ${pendingReports?.length ? `
      <p class="section-label" style="margin-bottom:var(--space-sm)">Reports due</p>
      ${pendingReports.map(r => `
        <article class="card">
          <div class="card__detail">
            <h3 class="card__name">${r.province} — ${r.period}</h3>
            <p class="card__meta">Due ${r.dueDate || 'end of month'}</p>
          </div>
          <a href="/cms/reports/${r.id}" class="btn btn--primary btn--sm">Submit</a>
        </article>`
      ).join('')}` : ''}
  `

  return cmsPage({ title: 'Dashboard', activeFeature: 'dashboard', user, main })
}

module.exports = { DashboardPage }
