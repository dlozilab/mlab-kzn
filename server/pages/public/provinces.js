// server/pages/public/provinces.js
// One page, one JSX — province toggle filters the view
// Active province passed in from route — no client-side fetching
// "National" shows aggregate across all provinces

const { publicPage }  = require('../../components/layout')
const { Pill }        = require('../../components/pill')

function ProvincesPage({ provinces = [], activeProvince = 'national', data = {} }) {
  const isNational = activeProvince === 'national'
  const current    = isNational ? null : provinces.find(p => p.id === activeProvince)

  const main = `

    <h1 style="font-family:var(--font-heading);font-size:var(--text-xl);
               text-transform:uppercase;color:var(--color-navy);
               margin-bottom:var(--space-xs)">
      Our provinces
    </h1>
    <p style="color:var(--color-text-secondary);margin-bottom:var(--space-lg)">
      mLab operates across ${provinces.length} active province${provinces.length !== 1 ? 's' : ''}.
    </p>

    <!-- Province toggle — server-side, each is a link -->
    <nav class="province-toggle" aria-label="Filter by province">
      <a href="/provinces"
         class="province-toggle__btn ${isNational ? 'province-toggle__btn--active' : ''}">
        National
      </a>
      ${provinces.map(p => `
        <a href="/provinces?province=${p.id}"
           class="province-toggle__btn ${activeProvince === p.id ? 'province-toggle__btn--active' : ''}">
          ${p.name}
        </a>`
      ).join('')}
    </nav>

    <!-- Stats for active view -->
    <section aria-label="${isNational ? 'National statistics' : `${current?.name} statistics`}"
             style="margin-bottom:var(--space-xl)">
      <div class="grid-3">
        <div class="stat-card">
          <p class="stat-card__value">${data.participantCount || 0}</p>
          <p class="stat-card__label">
            ${isNational ? 'Total participants' : `${current?.name} participants`}
          </p>
        </div>
        <div class="stat-card">
          <p class="stat-card__value">${data.programmeCount || 0}</p>
          <p class="stat-card__label">Active programmes</p>
        </div>
        <div class="stat-card">
          <p class="stat-card__value">${data.graduationRate || 0}%</p>
          <p class="stat-card__label">Graduation rate</p>
        </div>
      </div>
    </section>

    <!-- Province list (national view) or Province detail (single view) -->
    ${isNational ? NationalView(provinces, data) : ProvinceView(current, data)}
  `

  return publicPage({
    activePage:  'provinces',
    title:       isNational
                   ? 'mLab — Our Provinces'
                   : `mLab — ${current?.name}`,
    description: 'mLab impact across South African provinces.',
    url:         `https://mlab.co.za/provinces${isNational ? '' : `?province=${activeProvince}`}`,
    main,
  })
}

function NationalView(provinces, data) {
  return `
    <h2 style="font-family:var(--font-heading);font-size:var(--text-md);
               text-transform:uppercase;color:var(--color-navy);
               margin-bottom:var(--space-md)">
      Active provinces
    </h2>
    ${provinces.map(p => `
      <article class="card" style="margin-bottom:var(--space-sm)">
        <div class="card__detail">
          <h3 class="card__name">${p.name}</h3>
          <p class="card__meta">
            ${data.byProvince?.[p.id]?.participantCount || 0} participants
          </p>
        </div>
        <a href="/provinces?province=${p.id}"
           class="btn btn--secondary btn--sm">View</a>
      </article>`
    ).join('')}`
}

function ProvinceView(province, data) {
  if (!province) return ''
  return `
    <h2 style="font-family:var(--font-heading);font-size:var(--text-md);
               text-transform:uppercase;color:var(--color-navy);
               margin-bottom:var(--space-md)">
      ${province.name}
    </h2>

    ${(data.programmes || []).length ? `
      <p class="section-label" style="margin-bottom:var(--space-sm)">Programmes</p>
      ${data.programmes.map(p => `
        <article class="news-card">
          <h3 class="news-card__title">${p.name}</h3>
          <p class="news-card__meta">${p.type || ''} · ${p.status || ''}</p>
        </article>`
      ).join('')}` : ''}

    ${(data.recentJourneys || []).length ? `
      <p class="section-label" style="margin-bottom:var(--space-sm);
                                       margin-top:var(--space-lg)">
        Recent participant stories
      </p>
      ${data.recentJourneys.map(j => `
        <article class="news-card">
          <h3 class="news-card__title">${j.full_name}</h3>
          <p class="news-card__meta">${j.programme || ''} · ${j.status || ''}</p>
        </article>`
      ).join('')}` : ''}`
}

module.exports = { ProvincesPage }
