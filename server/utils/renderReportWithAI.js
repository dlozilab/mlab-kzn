// server/utils/renderReportWithAI.js
// Passes SQL query results to the Anthropic API
// Returns a clean HTML string ready to embed in the report runner page
// Called by the report definitions route after query execution

const Anthropic = require('@anthropic-ai/sdk')

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function renderReportWithAI(data, reportName) {
  if (!data || data.length === 0) {
    return '<p class="empty-state">No data returned for this report.</p>'
  }

  const prompt = `
Report name: ${reportName}
Data: ${JSON.stringify(data)}

Render this data as clean HTML only.
Rules:
- If the data has multiple rows use a table with thead and tbody
- If the data is a single aggregate value use a large stat display
- If the data has mixed types use a combination of stat cards and a table
- Use only inline styles — no external classes
- Colour palette: headings #073f4e, accents #8ac052, text #333, borders #e0e0e0
- Font: Trebuchet MS, sans-serif
- Return only valid HTML — no markdown, no explanation, no code fences
`.trim()

  const message = await client.messages.create({
    model:      'claude-sonnet-4-6',
    max_tokens: 2000,
    messages:   [{ role: 'user', content: prompt }],
  })

  return message.content[0].text
}

module.exports = renderReportWithAI
