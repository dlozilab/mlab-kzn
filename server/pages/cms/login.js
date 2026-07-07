// server/pages/cms/login.js
// Login page — no auth required, no CMS shell
// Standalone page, not wrapped in cmsPage()

function LoginPage({ error = '' } = {}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>Sign in — mLab CMS</title>
  <link rel="stylesheet" href="/css/tokens.css">
  <link rel="stylesheet" href="/css/reset.css">
  <link rel="stylesheet" href="/css/components.css">
  <link rel="stylesheet" href="/css/utilities.css">
  <style>
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-bg-subtle);
    }
    .login-box {
      background: var(--color-white);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      padding: var(--space-xl);
      width: 100%;
      max-width: 380px;
      box-shadow: var(--shadow-md);
    }
    .login-logo {
      font-family: var(--font-heading);
      font-size: var(--text-xl);
      text-transform: uppercase;
      margin-bottom: var(--space-xs);
    }
    .login-logo span:first-child { color: var(--color-green); }
    .login-logo span:last-child  { color: var(--color-navy); }
  </style>
</head>
<body>
  <main>
    <div class="login-box">

      <p class="login-logo"><span>m</span><span>Lab</span></p>
      <p style="font-size:var(--text-sm);color:var(--color-text-secondary);
                margin-bottom:var(--space-xl)">Sign in to the CMS</p>

      ${error ? `
        <div class="alert alert--danger" role="alert">${error}</div>` : ''}

      <form method="POST" action="/auth/login">

        <div class="field">
          <label class="field__label" for="email">Email</label>
          <input class="field__input"
                 type="email"
                 id="email"
                 name="email"
                 placeholder="you@mlab.co.za"
                 required
                 autocomplete="email">
        </div>

        <div class="field">
          <label class="field__label" for="password">Password</label>
          <input class="field__input"
                 type="password"
                 id="password"
                 name="password"
                 placeholder="••••••••"
                 required
                 autocomplete="current-password">
        </div>

        <button type="submit" class="btn btn--primary btn--full"
                style="margin-top:var(--space-sm)">
          Sign in
        </button>

      </form>

      <p style="text-align:center;margin-top:var(--space-md);font-size:var(--text-sm)">
        <a href="/auth/forgot" style="color:var(--color-text-secondary)">Forgot password?</a>
      </p>

    </div>
  </main>
</body>
</html>`
}

module.exports = { LoginPage }
