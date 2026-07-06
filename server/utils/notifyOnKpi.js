// server/utils/notifyOnKpi.js
// Fires a notification every time a KPI entry crosses a 10% threshold
// Called by KpiEntriesRepository after every create and update
// previousValue is null on first entry — always notifies on creation

const NotificationsRepository = require('../repositories/NotificationsRepository')
const KpiTemplatesRepository  = require('../repositories/KpiTemplatesRepository')

async function notifyOnKpi(previousValue, newValue, templateId, provinceId) {
  try {
    const template = await KpiTemplatesRepository.findById(templateId)
    if (!template) return

    const target = template.target
    if (!target || target === 0) return

    const newPct  = Math.floor((newValue      / target) * 10)
    const prevPct = previousValue !== null
      ? Math.floor((previousValue / target) * 10)
      : newPct - 1 // ensures first entry always triggers

    if (prevPct === newPct) return

    const percentage = newPct * 10
    const direction  = newValue > (previousValue || 0) ? '↑' : '↓'

    await NotificationsRepository.create({
      type:        'kpi_milestone',
      message:     `${template.metric_name} ${direction} ${percentage}% of target`,
      province_id: provinceId,
      is_read:     false,
      created_at:  new Date().toISOString(),
    })

  } catch (err) {
    // Notification failure must never break the main operation
    console.error('notifyOnKpi error:', err.message)
  }
}

module.exports = notifyOnKpi
