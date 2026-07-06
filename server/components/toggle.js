// server/components/toggle.js
// The is_public switch — the only door between CMS and public site

function Toggle({ id, isPublic, featureId }) {
  return `
    <div style="margin-top:var(--space-lg)">
      <p class="section-label">Visibility</p>

      <div class="toggle-row ${isPublic ? 'toggle-row--public' : ''}">
        <div>
          <p class="toggle-row__label">
            ${isPublic ? 'Public — visible on the public site' : 'Internal — only visible to mLab staff'}
          </p>
          <p class="toggle-row__sub">
            ${isPublic
              ? 'Toggle off to remove from the public site immediately'
              : 'Toggle on to publish this to the public site'}
          </p>
        </div>
        <label class="toggle" aria-label="Make public">
          <input
            type="checkbox"
            class="toggle__input"
            id="toggle-public"
            data-id="${id}"
            data-feature="${featureId}"
            ${isPublic ? 'checked' : ''}>
          <span class="toggle__slider"></span>
        </label>
      </div>
    </div>`
}

module.exports = { Toggle }
