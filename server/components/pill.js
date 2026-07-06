// server/components/pill.js
// Status badge — colour driven by config

function Pill({ label, color = 'grey' }) {
  if (!label) return ''
  return `<span class="pill pill--${color}">${label}</span>`
}

module.exports = { Pill }
