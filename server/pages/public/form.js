// server/pages/public/form.js
// Public form renderer — any form marked is_public = true
// Accessible at /forms/:slug — no login required
// Submits via forms.js fetch POST to /api/forms/:slug/submit

const { publicPage }   = require('../../components/layout')
const { FieldRenderer } = require('../../components/field-renderer')

function PublicFormPage({ form, fields = [], submitted = false, error = '' }) {
  const main = `
    <div class="public-form">

      ${submitted ? `
        <!-- Success state -->
        <div style="text-align:center;padding:var(--space-2xl)">
          <p style="font-size:48px;margin-bottom:var(--space-md)" aria-hidden="true">✅</p>
          <h1 class="public-form__title">Thank you</h1>
          <p style="color:var(--color-text-secondary);margin-top:var(--space-sm)">
            Your response has been submitted successfully.
          </p>
          <a href="/" class="btn btn--primary" style="margin-top:var(--space-lg)">
            Back to home
          </a>
        </div>` : `

        <h1 class="public-form__title">${form.name}</h1>
        <p class="public-form__sub">
          All fields marked * are required.
        </p>

        ${error ? `
          <div class="alert alert--danger" role="alert">${error}</div>` : ''}

        <form id="public-form"
              data-slug="${form.slug}"
              novalidate>

          ${fields.map(f => FieldRenderer(f)).join('')}

          <button type="submit" class="btn btn--primary btn--full"
                  style="margin-top:var(--space-lg)">
            Submit
          </button>

        </form>`}
    </div>
  `

  return publicPage({
    activePage:  '',
    title:       `${form.name} — mLab`,
    description: `Complete the ${form.name} form.`,
    url:         `https://mlab.co.za/forms/${form.slug}`,
    main,
  })
}

module.exports = { PublicFormPage }
