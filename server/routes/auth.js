// server/routes/auth.js
const express  = require('express')
const jwt      = require('jsonwebtoken')
const router   = express.Router()
const supabase = require('../supabase/client')
const response = require('../utils/response')
const { LoginPage } = require('../pages/cms/login')
const { ProfilePage } = require('../pages/cms/profile')
const verifyToken = require('../middleware/verifyToken')

// GET /auth/login
router.get('/login', (req, res) => {
  res.send(LoginPage())
})

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return res.send(LoginPage({ error: 'Invalid email or password' }))

    const { data: userData } = await supabase
      .from('users').select('*').eq('email', email).single()

    const token = jwt.sign({
      id:          data.user.id,
      email:       data.user.email,
      full_name:   userData?.full_name || '',
      role:        userData?.role || 'staff',
      province_id: userData?.province_id || null,
    }, process.env.JWT_SECRET, { expiresIn: '8h' })

    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 8 * 60 * 60 * 1000 })
    res.redirect('/dashboard')
  } catch (err) {
    res.send(LoginPage({ error: 'Something went wrong. Please try again.' }))
  }
})

// GET /auth/logout
router.get('/logout', (req, res) => {
  res.clearCookie('token')
  res.redirect('/login')
})

// GET /auth/forgot
router.get('/forgot', (req, res) => {
  res.send(`<!DOCTYPE html><html><head><title>Reset password</title>
    <link rel="stylesheet" href="/css/tokens.css">
    <link rel="stylesheet" href="/css/reset.css">
    <link rel="stylesheet" href="/css/components.css">
    </head><body style="display:flex;align-items:center;justify-content:center;min-height:100vh">
    <div style="max-width:360px;width:100%;padding:var(--space-xl)">
    <h1 style="font-family:var(--font-heading);margin-bottom:var(--space-lg)">Reset password</h1>
    <form method="POST" action="/auth/forgot">
      <div class="field"><label class="field__label">Email</label>
      <input class="field__input" type="email" name="email" required></div>
      <button class="btn btn--primary btn--full">Send reset link</button>
    </form></div></body></html>`)
})

// POST /auth/forgot
router.post('/forgot', async (req, res) => {
  const { email } = req.body
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.BASE_URL || 'http://localhost:3000'}/auth/reset`,
  })
  res.send('<p style="font-family:sans-serif;padding:40px">Check your email for a reset link.</p>')
})

// POST /auth/profile
router.post('/profile', verifyToken, async (req, res) => {
  const { full_name, email, new_password } = req.body
  try {
    await supabase.from('users').update({ full_name, email }).eq('id', req.user.id)
    if (new_password) {
      await supabase.auth.updateUser({ password: new_password })
    }
    res.redirect('/profile')
  } catch (err) {
    res.redirect('/profile')
  }
})

module.exports = router
