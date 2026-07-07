// server/pages/public/about.js
// About + Contact — one page, two sections
// Nav "About" links to /about, "Contact" links to /about#contact
// Both are the same route — anchor scrolls to contact section

const { publicPage } = require('../../components/layout')

function AboutPage() {
  const main = `

    <!-- About section -->
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
                    margin-bottom:var(--space-md)">
            mLab is a South African Not-for-Profit Company (NPC) with Public Benefit
            Organisation (PBO) status and a Level 1 B-BBEE rating. We have spent over
            a decade building practical, certified ICT talent across the country.
          </p>
          <p style="font-size:var(--text-base);line-height:var(--leading-loose)">
            With offices across multiple provinces, mLab prepares innovators and
            entrepreneurs for opportunities within the digital economy — running
            programmes in digital skills, entrepreneurship, and innovation.
          </p>
        </div>
        <div class="grid-2" style="gap:var(--space-md)">
          <div class="stat-card" style="text-align:center">
            <p class="stat-card__value">2018</p>
            <p class="stat-card__label">Founded</p>
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

      <!-- Programmes overview -->
      <h2 style="font-family:var(--font-heading);font-size:var(--text-md);
                 text-transform:uppercase;color:var(--color-navy);
                 margin-bottom:var(--space-md)">
        What we do
      </h2>
      <div class="grid-3" style="margin-bottom:var(--space-xl)">
        ${[
          { name: 'CodeTribe Coding Academy', desc: 'Intensive software development training for youth.' },
          { name: 'Biz Accelerator',           desc: 'Supporting StartUps and Founders in the digital economy.' },
          { name: 'Her-AI-Path',               desc: 'AI and tech skills for women and girls.' },
          { name: 'IoT',                        desc: 'Internet of Things skills for the fourth industrial revolution.' },
          { name: 'STEP UP',                    desc: 'Skills-to-placement connecting digital talent with SMEs.' },
          { name: 'Digital Skills',             desc: 'Foundational digital literacy across communities.' },
        ].map(p => `
          <div style="padding:var(--space-md);background:var(--color-bg-subtle);
                      border-radius:var(--radius-lg);border:1px solid var(--color-border)">
            <h3 style="font-family:var(--font-heading);font-size:var(--text-sm);
                       text-transform:uppercase;color:var(--color-green);
                       margin-bottom:var(--space-xs)">${p.name}</h3>
            <p style="font-size:var(--text-sm);color:var(--color-text-secondary)">
              ${p.desc}
            </p>
          </div>`
        ).join('')}
      </div>

    </section>

    <hr>

    <!-- Contact section -->
    <section id="contact" aria-labelledby="contact-title"
             style="margin-top:var(--space-2xl)">

      <h2 id="contact-title"
          style="font-family:var(--font-heading);font-size:var(--text-xl);
                 text-transform:uppercase;color:var(--color-navy);
                 margin-bottom:var(--space-lg)">
        Contact us
      </h2>

      <div class="contact-grid">

        <!-- Contact details -->
        <div>
          <h3 style="font-family:var(--font-heading);font-size:var(--text-sm);
                     text-transform:uppercase;color:var(--color-green);
                     margin-bottom:var(--space-md)">
            KwaZulu-Natal
          </h3>
          <address style="font-style:normal">
            <div class="contact-item">
              <span class="contact-item__icon" aria-hidden="true">👤</span>
              <div>
                <p style="font-weight:var(--weight-medium)">Dlozi Mthethwa</p>
                <p style="font-size:var(--text-sm);color:var(--color-text-secondary)">
                  KZN Provincial Lead
                </p>
              </div>
            </div>
            <div class="contact-item">
              <span class="contact-item__icon" aria-hidden="true">📞</span>
              <a href="tel:+27698551175" style="color:var(--color-text-primary)">
                +27 69 855 1175
              </a>
            </div>
            <div class="contact-item">
              <span class="contact-item__icon" aria-hidden="true">📍</span>
              <div>
                <p>DUT iNdumiso Campus, Unit 1</p>
                <p>3201 FJ Sithole Rd, Imbali</p>
                <p>Pietermaritzburg, 3201</p>
              </div>
            </div>
          </address>
        </div>

        <!-- Quick contact form -->
        <div>
          <h3 style="font-family:var(--font-heading);font-size:var(--text-sm);
                     text-transform:uppercase;color:var(--color-green);
                     margin-bottom:var(--space-md)">
            Send a message
          </h3>
          <form method="POST" action="/contact" class="public-form">
            <div class="field">
              <label class="field__label" for="contact-name">Name *</label>
              <input class="field__input" type="text" id="contact-name"
                     name="name" required>
            </div>
            <div class="field">
              <label class="field__label" for="contact-email">Email *</label>
              <input class="field__input" type="email" id="contact-email"
                     name="email" required>
            </div>
            <div class="field">
              <label class="field__label" for="contact-message">Message *</label>
              <textarea class="field__textarea" id="contact-message"
                        name="message" required></textarea>
            </div>
            <button type="submit" class="btn btn--primary">Send message</button>
          </form>
        </div>

      </div>
    </section>
  `

  return publicPage({
    activePage:  'about',
    title:       'mLab — About Us',
    description: 'A Not-for-Profit driving digital skills and innovation across South Africa.',
    url:         'https://mlab.co.za/about',
    main,
  })
}

module.exports = { AboutPage }
