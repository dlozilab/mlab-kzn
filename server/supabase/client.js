// server/supabase/client.js
// Single Supabase client instance — imported by all repositories
// Server side only — never import this in public/ or anywhere the browser can reach

require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

module.exports = supabase