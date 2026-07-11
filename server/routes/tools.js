// server/routes/tools.js
// Serves standalone tool HTML files from server/views/tools/
// Each tool has its own full HTML — header and footer baked in
// No auth required — tools are public
// Add a new tool: drop HTML into server/views/tools/ and create a Resource entry

const express = require('express')
const router  = express.Router()
const fs      = require('fs')
const path    = require('path')

const TOOLS_DIR = path.join(__dirname, '../views/tools')

router.get('/:tool', (req, res, next) => {
  // Sanitise — only allow alphanumeric and hyphens, no path traversal
  const name = req.params.tool.replace(/[^a-z0-9-]/gi, '')
  if (!name) return next()

  const file = path.join(TOOLS_DIR, `${name}.html`)

  if (!fs.existsSync(file)) return next()

  res.sendFile(file)
})

module.exports = router
