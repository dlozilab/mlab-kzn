// server/pages/cms/profile.js
// Current user profile — name, email, avatar

const { cmsPage }    = require('../../components/layout')
const { PageHeader } = require('../../components/page-header')

function ProfilePage({ user }) {
  const main = `
    ${PageHeader({ title: 'My profile' })}

    <div style="max-width:480px">

      <!-- Avatar -->
      <div style="display:flex;align-items:center;gap:var(--space-lg);
                  margin-bottom:var(--space-xl)">
        <img src="${user.avatar_url || `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(user.email)}`}"
             alt="${user.full_name} avatar"
             width="72" height="72"
             style="border-radius:50%;border:2px solid var(--color-border)">
        <div>
          <p style="font-size:var(--text-md);font-weight:var(--weight-medium)">
            ${user.full_name}
          </p>
          <p style="font-size:var(--text-sm);color:var(--color-text-secondary)">
            ${user.role} &middot; ${user.province || 'National'}
          </p>
        </div>
      </div>

      <!-- Update form -->
      <form method="POST" action="/auth/profile">

        <div class="field">
          <label class="field__label" for="full_name">Full name</label>
          <input class="field__input"
                 type="text"
                 id="full_name"
                 name="full_name"
                 value="${user.full_name || ''}"
                 required>
        </div>

        <div class="field">
          <label class="field__label" for="email">Email</label>
          <input class="field__input"
                 type="email"
                 id="email"
                 name="email"
                 value="${user.email || ''}"
                 required>
        </div>

        <div class="field">
          <label class="field__label" for="new_password">New password</label>
          <input class="field__input"
                 type="password"
                 id="new_password"
                 name="new_password"
                 placeholder="Leave blank to keep current">
        </div>

        <button type="submit" class="btn btn--primary">Save changes</button>

      </form>

    </div>
  `

  return cmsPage({ title: 'My profile', activeFeature: '', user, main })
}

module.exports = { ProfilePage }
