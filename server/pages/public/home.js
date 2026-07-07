// server/pages/public/home.js
// Public home page — news feed + impact stats
// Feed = all records where is_public = true across programmes, events, journeys

const { publicPage } = require('../../components/layout')
const { Pill }       = require('../../components/pill')

const TYPE_PILL = {
  programme: { label: 'Programme', color: 'navy'  },
  event:     { label: 'Event',     color: 'green' },
  journey:   { label: 'Journey',   color: 'blue'  },
}

function HomePage({ feed = [], stats = {} }) {
  const main = `

    <!-- Hero -->
    <section class="hero" aria-labelledby="hero-title">
      <h1 class="hero__title" id="hero-title">
        Building <span>digital talent</span> across South Africa
      </h1>
      <p class="hero__sub">
        mLab runs digital skills, entrepreneurship and innovation programmes
        across multiple South African provinces.
      </p>
      <a href="/provinces" class="btn btn--accent btn--lg">
        See our impact
      </a>
    </section>

    <!-- Impact stats -->
    <section aria-label="Impact statistics" style="margin-bottom:var(--space-xl)">
      <div class="grid-3">
        <div class="stat-card" style="text-align:center">
          <p class="stat-card__value">${stats.totalParticipants || '6 400'}+</p>
          <p class="stat-card__label">Programme participants</p>
        </div>
        <div class="stat-card" style="text-align:center">
          <p class="stat-card__value">${stats.activeProvinces || 0}</p>
          <p class="stat-card__label">Active provinces</p>
        </div>
        <div class="stat-card" style="text-align:center">
          <p class="stat-card__value">${stats.activeProgrammes || 0}</p>
          <p class="stat-card__label">Programmes running</p>
        </div>
      </div>
    </section>

    <!-- News feed -->
    <section aria-labelledby="news-title" style="margin-bottom:var(--space-xl)">
      <h2 id="news-title"
          style="font-family:var(--font-heading);font-size:var(--text-lg);
                 text-transform:uppercase;color:var(--color-navy);
                 margin-bottom:var(--space-md)">
        Latest news
      </h2>

      ${feed.length === 0 ? `
        <p style="color:var(--color-text-secondary);font-size:var(--text-sm)">
          No news yet — check back soon.
        </p>` :

        feed.map(item => `
          <article class="news-card">
            <div class="news-card__type">
              ${Pill(TYPE_PILL[item._type] || { label: item._type, color: 'grey' })}
            </div>
            <h3 class="news-card__title">
              ${item.name || item.full_name || item.title || 'Update'}
            </h3>
            <p class="news-card__meta">
              ${item.province || ''}
              ${item.province && item.created_at ? ' · ' : ''}
              ${item.created_at
                ? new Date(item.created_at).toLocaleDateString('en-ZA', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })
                : ''}
            </p>
          </article>`
        ).join('')}
    </section>

    <!-- CTA -->
    <section style="text-align:center;padding:var(--space-xl);
                    background:var(--color-bg-subtle);
                    border-radius:var(--radius-xl)">
      <h2 style="font-family:var(--font-heading);font-size:var(--text-lg);
                 text-transform:uppercase;color:var(--color-navy);
                 margin-bottom:var(--space-sm)">
        Work with us
      </h2>
      <p style="color:var(--color-text-secondary);margin-bottom:var(--space-lg)">
        Partner with mLab to bring digital skills to your community or business.
      </p>
      <a href="/about#contact" class="btn btn--primary btn--lg">Get in touch</a>
    </section>
  `

  return publicPage({
    activePage:  'home',
    title:       'mLab — Digital Skills and Innovation',
    description: 'Building certified digital talent and supporting entrepreneurs across South Africa.',
    url:         'https://mlab.co.za',
    main,
  })
}

module.exports = { HomePage }
