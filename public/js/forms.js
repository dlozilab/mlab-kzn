// public/js/forms.js
// Form submission via fetch POST — the only client-side POST
// Handles: public forms (/forms/:slug)
// Page does not reload on submit — shows inline success or error

document.addEventListener('DOMContentLoaded', function () {

  const form = document.getElementById('public-form')
  if (!form) return

  const slug       = form.dataset.slug
  const submitBtn  = form.querySelector('[type="submit"]')

  form.addEventListener('submit', function (e) {
    e.preventDefault()
    clearErrors()

    // Collect form data
    const data = {}
    const formData = new FormData(form)

    // Handle checkboxes as arrays
    formData.forEach(function (value, key) {
      if (key.endsWith('[]')) {
        const cleanKey = key.replace('[]', '')
        if (!data[cleanKey]) data[cleanKey] = []
        data[cleanKey].push(value)
      } else {
        data[key] = value
      }
    })

    // Validate required fields client-side
    let hasErrors = false
    form.querySelectorAll('[required]').forEach(function (field) {
      if (!field.value.trim()) {
        showError(field, 'This field is required')
        hasErrors = true
      }
    })
    if (hasErrors) return

    // Submit
    submitBtn.disabled    = true
    submitBtn.textContent = 'Submitting...'

    fetch(`/api/forms/${slug}/submit`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    })
    .then(function (res) { return res.json() })
    .then(function (result) {
      if (result.success) {
        // Replace form with success message
        form.closest('.public-form').innerHTML = `
          <div style="text-align:center;padding:var(--space-2xl)">
            <p style="font-size:48px;margin-bottom:var(--space-md)">✅</p>
            <h2 style="font-family:var(--font-heading);font-size:var(--text-xl);
                       text-transform:uppercase;color:var(--color-navy);
                       margin-bottom:var(--space-sm)">Thank you</h2>
            <p style="color:var(--color-text-secondary)">
              Your response has been submitted successfully.
            </p>
            <a href="/" class="btn btn--primary" style="margin-top:var(--space-lg)">
              Back to home
            </a>
          </div>`
      } else {
        showFormError(result.error || 'Submission failed. Please try again.')
        submitBtn.disabled    = false
        submitBtn.textContent = 'Submit'
      }
    })
    .catch(function () {
      showFormError('Something went wrong. Please try again.')
      submitBtn.disabled    = false
      submitBtn.textContent = 'Submit'
    })
  })

  function showError(field, message) {
    field.classList.add('field__input--error')
    const hint = document.createElement('p')
    hint.className   = 'field__error'
    hint.textContent = message
    field.parentNode.appendChild(hint)
  }

  function showFormError(message) {
    let alert = document.getElementById('form-error')
    if (!alert) {
      alert = document.createElement('div')
      alert.id        = 'form-error'
      alert.className = 'alert alert--danger'
      alert.setAttribute('role', 'alert')
      form.prepend(alert)
    }
    alert.textContent = message
  }

  function clearErrors() {
    form.querySelectorAll('.field__error').forEach(function (el) { el.remove() })
    form.querySelectorAll('.field__input--error').forEach(function (el) {
      el.classList.remove('field__input--error')
    })
    const alert = document.getElementById('form-error')
    if (alert) alert.remove()
  }

})
