// server/pages/public/about.js
// Design language from mLab flyer — bold statement, credential pills,
// two-column icon list, no decorative boxes

const { publicPage } = require('../../components/layout')

// SVG icons — inline, no emoji, no external dependency
const ICONS = {
  code: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  ecosystem: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  talent: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  venture: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  eso: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  incubation: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  email: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  phone: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.64 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.07 6.07l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  pin: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
}

const OFFERINGS = [
  { icon: ICONS.code,       name: 'CodeTribe Training' },
  { icon: ICONS.ecosystem,  name: '4IR Ecosystem' },
  { icon: ICONS.talent,     name: 'Talent Management' },
  { icon: ICONS.venture,    name: 'Venture Building' },
  { icon: ICONS.eso,        name: 'ESO Support' },
  { icon: ICONS.incubation, name: 'Incubation' },
]

function AboutPage({ provinces = [] }) {
  const provinceNames = provinces.map(p => p.name).join(', ')

  const main = `

    <!-- Intro + credentials -->
    <section style="margin-bottom:var(--space-xl)">
      <p style="font-size:var(--text-base);line-height:var(--leading-loose);
                color:var(--color-text-secondary);margin-bottom:var(--space-lg)">
        mLab is a tech-centred business that prepares innovators and
        entrepreneurs for opportunities within the digital economy.
        ${provinceNames ? `Operating across ${provinceNames}.` : ''}
      </p>

      <!-- Credential pills -->
      <div style="display:flex;gap:var(--space-sm);flex-wrap:wrap;
                  margin-bottom:var(--space-xl)">
        ${['NPC Registered', 'PBO Status', 'Level 1 B-BBEE', 'Est. 2011'].map(c => `
          <span style="padding:var(--space-xs) var(--space-md);
                       border:2px solid var(--color-navy);
                       border-radius:var(--radius-full);
                       font-family:var(--font-heading);
                       font-size:var(--text-sm);
                       font-weight:var(--weight-bold);
                       text-transform:uppercase;
                       letter-spacing:0.06em;
                       color:var(--color-navy)">
            ${c}
          </span>`
        ).join('')}
      </div>

      <hr style="border:none;border-top:2px solid var(--color-navy);
                 margin-bottom:var(--space-xl)">

      <!-- Bold statement -->
      <p style="font-family:var(--font-heading);
                font-size:clamp(24px, 4vw, 42px);
                font-weight:var(--weight-bold);
                text-transform:uppercase;
                color:var(--color-navy);
                line-height:1.15;
                margin-bottom:var(--space-xl)">
        We empower innovators, entrepreneurs, and vulnerable communities
        with digital skills, resources and tools.
      </p>

      <hr style="border:none;border-top:2px solid var(--color-navy);
                 margin-bottom:var(--space-xl)">

      <!-- To enhance / And help -->
      <div class="grid-2" style="gap:var(--space-xl);margin-bottom:var(--space-xl)">
        <div style="text-align:center">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-navy)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin:0 auto var(--space-sm)"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          <p style="font-size:var(--text-xs);text-transform:uppercase;
                    letter-spacing:0.08em;color:var(--color-text-secondary);
                    margin-bottom:var(--space-xs)">To enhance:</p>
          <p style="font-size:var(--text-md);font-weight:var(--weight-bold);
                    color:var(--color-navy)">Employability</p>
        </div>
        <div style="text-align:center">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-navy)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin:0 auto var(--space-sm)"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
          <p style="font-size:var(--text-xs);text-transform:uppercase;
                    letter-spacing:0.08em;color:var(--color-text-secondary);
                    margin-bottom:var(--space-xs)">And help:</p>
          <p style="font-size:var(--text-md);font-weight:var(--weight-bold);
                    color:var(--color-navy)">Launch viable businesses</p>
        </div>
      </div>
    </section>

    <!-- What we offer -->
    <section style="background:var(--color-navy);border-radius:var(--radius-xl);
                    padding:var(--space-xl);margin-bottom:var(--space-2xl)">
      <h2 style="font-family:var(--font-heading);font-size:var(--text-lg);
                 text-transform:uppercase;color:var(--color-white);
                 border-bottom:2px solid var(--color-green);
                 padding-bottom:var(--space-sm);margin-bottom:var(--space-lg)">
        What we offer
      </h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md)">
        ${OFFERINGS.map(o => `
          <div style="display:flex;align-items:center;gap:var(--space-sm);
                      color:var(--color-white)">
            <span style="color:var(--color-green);flex-shrink:0">${o.icon}</span>
            <span style="font-size:var(--text-base);font-weight:var(--weight-medium)">
              ${o.name}
            </span>
          </div>`
        ).join('')}
      </div>
    </section>

    <hr>

    <!-- Contact -->
    <section id="contact" aria-labelledby="contact-title"
             style="margin-top:var(--space-2xl)">

      <h2 id="contact-title"
          style="font-family:var(--font-heading);font-size:var(--text-xl);
                 text-transform:uppercase;color:var(--color-navy);
                 margin-bottom:var(--space-lg)">
        Contact us
      </h2>

      <address style="font-style:normal;display:grid;
                      grid-template-columns:1fr 1fr 1fr;
                      gap:var(--space-lg)">

        <!-- Location -->
        <div>
          <div style="display:flex;align-items:center;gap:var(--space-sm);
                      margin-bottom:var(--space-sm)">
            <span style="color:var(--color-green);flex-shrink:0">${ICONS.pin}</span>
            <p style="font-family:var(--font-heading);font-size:var(--text-sm);
                      text-transform:uppercase;letter-spacing:0.06em;
                      color:var(--color-navy);font-weight:var(--weight-bold)">Location</p>
          </div>
          <a href="https://www.google.com/search?sa=X&sca_esv=ecbc8704466b2aa7&biw=1366&bih=649&sxsrf=APpeQns_Mxk7NhI7Np-HebKVWAFIujwq4w:1783704865200&q=indumiso+campus+address&ludocid=7449801513760795487&ved=2ahUKEwj49_620siVAxX4T0EAHaCiAIEQ6BN6BAgjEAI"
             target="_blank" rel="noopener"
             style="color:var(--color-text-primary);font-size:var(--text-base);
                    line-height:var(--leading-loose)">
            DUT iNdumiso Campus<br>
            Unit 1, 3201 FJ Sithole Rd<br>
            Imbali, Pietermaritzburg, 3201
          </a>
        </div>

        <!-- Phone -->
        <div>
          <div style="display:flex;align-items:center;gap:var(--space-sm);
                      margin-bottom:var(--space-sm)">
            <span style="color:var(--color-green);flex-shrink:0">${ICONS.phone}</span>
            <p style="font-family:var(--font-heading);font-size:var(--text-sm);
                      text-transform:uppercase;letter-spacing:0.06em;
                      color:var(--color-navy);font-weight:var(--weight-bold)">Phone</p>
          </div>
          <a href="tel:+27698551175"
             style="color:var(--color-text-primary);font-size:var(--text-base);
                    display:block;margin-bottom:var(--space-xs)">
            069 855 1175
          </a>
          <p style="font-size:var(--text-sm);color:var(--color-text-secondary)">
            Call, text or WhatsApp
          </p>
        </div>

        <!-- Email -->
        <div>
          <div style="display:flex;align-items:center;gap:var(--space-sm);
                      margin-bottom:var(--space-sm)">
            <span style="color:var(--color-green);flex-shrink:0">${ICONS.email}</span>
            <p style="font-family:var(--font-heading);font-size:var(--text-sm);
                      text-transform:uppercase;letter-spacing:0.06em;
                      color:var(--color-navy);font-weight:var(--weight-bold)">Email</p>
          </div>
          <a href="mailto:KZN@mlab.co.za"
             style="color:var(--color-text-primary);font-size:var(--text-base)">
            KZN@mlab.co.za
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