// server/pages/public/about.js

const { publicPage } = require('../../components/layout')

function AboutPage({ provinces = [] }) {
  const main = `

    <section id="about" aria-labelledby="about-title"
             style="margin-bottom:var(--space-2xl)">

      <h1 id="about-title"
          style="font-family:var(--font-heading);font-size:var(--text-xl);
                 text-transform:uppercase;color:var(--color-navy);
                 margin-bottom:var(--space-md)">
        About mLab
      </h1>

      <div class="grid-2" style="gap:var(--space-xl);align-items:start;
                                  margin-bottom:var(--space-xl)">
        <div>
          <p style="font-size:var(--text-base);line-height:var(--leading-loose);
                    margin-bottom:var(--space-md);font-weight:var(--weight-medium);
                    color:var(--color-navy)">
            We empower innovators, entrepreneurs, and vulnerable communities
            with digital skills, resources and tools.
          </p>
          <p style="font-size:var(--text-base);line-height:var(--leading-loose);
                    margin-bottom:var(--space-md)">
            mLab is a South African Not-for-Profit Company (NPC) with Public Benefit
            Organisation (PBO) status and a Level 1 B-BBEE rating. Since 2011 we have
            been building practical, certified ICT talent across the country — enhancing
            employability and helping people launch viable businesses.
          </p>
          <p style="font-size:var(--text-base);line-height:var(--leading-loose)">
            With offices across multiple provinces, mLab prepares innovators and
            entrepreneurs for opportunities within the digital economy.
          </p>
        </div>
        <div class="grid-2" style="gap:var(--space-md)">
          <div class="stat-card" style="text-align:center">
            <p class="stat-card__value">2011</p>
            <p class="stat-card__label">Established</p>
          </div>
          <div class="stat-card" style="text-align:center">
            <p class="stat-card__value">NPC</p>
            <p class="stat-card__label">Not-for-profit</p>
          </div>
          <div class="stat-card" style="text-align:center">
            <p class="stat-card__value">L1</p>
            <p class="stat-card__label">B-BBEE rating</p>
          </div>
          <div class="stat-card" style="text-align:center">
            <p class="stat-card__value">PBO</p>
            <p class="stat-card__label">Status</p>
          </div>
        </div>
      </div>

      <h2 style="font-family:var(--font-heading);font-size:var(--text-md);
                 text-transform:uppercase;color:var(--color-navy);
                 margin-bottom:var(--space-md)">
        What we offer
      </h2>
      <div class="grid-3" style="margin-bottom:var(--space-xl)">
        ${[
          { name: 'CodeTribe Coding Academy',      desc: 'Intensive software development training for youth.' },
          { name: '4IR Ecosystem Training',        desc: 'Future-focused skills for the fourth industrial revolution including IoT, AI and more.' },
          { name: 'Talent Management',             desc: 'Identifying, developing and placing digital talent where it is needed most.' },
          { name: 'Venture Building & Incubation', desc: 'Supporting StartUps and Founders to build and grow viable digital businesses.' },
          { name: 'ESO Support Projects',          desc: 'Strengthening enterprise support organisations across South Africa.' },
          { name: 'Her-AI-Path',                   desc: 'AI and technology skills designed for women and girls.' },
        ].map(p => `
          <div style="padding:var(--space-md);background:var(--color-bg-subtle);
                      border-radius:var(--radius-lg);border:1px solid var(--color-border)">
            <h3 style="font-family:var(--font-heading);font-size:var(--text-sm);
                       text-transform:uppercase;color:var(--color-green);
                       margin-bottom:var(--space-xs)">${p.name}</h3>
            <p style="font-size:var(--text-sm);color:var(--color-text-secondary);
                      line-height:var(--leading-normal)">${p.desc}</p>
          </div>`
        ).join('')}
      </div>

      ${provinces.length ? `
        <h2 style="font-family:var(--font-heading);font-size:var(--text-md);
                   text-transform:uppercase;color:var(--color-navy);
                   margin-bottom:var(--space-md)">
          Where we operate
        </h2>
        <div class="grid-3" style="margin-bottom:var(--space-xl)">
          ${provinces.map(p => `
            <div style="padding:var(--space-md);background:var(--color-bg-subtle);
                        border-radius:var(--radius-lg);border:1px solid var(--color-border);
                        font-size:var(--text-base);font-weight:var(--weight-medium);
                        color:var(--color-text-primary)">
              ${p.name}
            </div>`
          ).join('')}
        </div>` : ''}

    </section>

    <hr>

    <section id="contact" aria-labelledby="contact-title"
             style="margin-top:var(--space-2xl)">

      <h2 id="contact-title"
          style="font-family:var(--font-heading);font-size:var(--text-xl);
                 text-transform:uppercase;color:var(--color-navy);
                 margin-bottom:var(--space-lg)">
        Contact us
      </h2>

      <address style="font-style:normal;display:flex;flex-direction:column;
                      gap:var(--space-lg);max-width:480px">
        <div class="contact-item">
          <span class="contact-item__icon" aria-hidden="true">✉️</span>
          <a href="mailto:KZN@mlab.co.za"
             style="color:var(--color-text-primary);font-size:var(--text-base)">
            KZN@mlab.co.za
          </a>
        </div>
        <div class="contact-item">
          <span class="contact-item__icon" aria-hidden="true">📞</span>
          <div>
            <a href="tel:+27698551175"
               style="color:var(--color-text-primary);font-size:var(--text-base);display:block">
              069 855 1175
            </a>
            <p style="font-size:var(--text-sm);color:var(--color-text-secondary);
                       margin-top:var(--space-xs)">
              Call, text or WhatsApp
            </p>
          </div>
        </div>
        <div class="contact-item">
          <span class="contact-item__icon" aria-hidden="true">📍</span>
          <a href="https://www.google.com/search?sa=X&sca_esv=ecbc8704466b2aa7&biw=1366&bih=649&sxsrf=APpeQns_Mxk7NhI7Np-HebKVWAFIujwq4w:1783704865200&q=indumiso+campus+address&ludocid=7449801513760795487&ved=2ahUKEwj49_620siVAxX4T0EAHaCiAIEQ6BN6BAgjEAI"
             target="_blank" rel="noopener"
             style="color:var(--color-text-primary);font-size:var(--text-base);
                    line-height:var(--leading-loose)">
            DUT iNdumiso Campus<br>
            Unit 1, 3201 FJ Sithole Rd<br>
            Imbali, Pietermaritzburg, 3201
          </a>
        </div>
      </address>

    </section>
  `

  return publicPage({
    activePage:  'about',
    title:       'mLab — About Us',
    description: 'Empowering innovators, entrepreneurs and communities with digital skills since 2011.',
    url:         'https://mlab.co.za/about',
    main,
  })
}

module.exports = { AboutPage }