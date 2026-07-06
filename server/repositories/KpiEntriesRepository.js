// server/repositories/KpiEntriesRepository.js
// Calls notifyOnKpi after every save
const BaseRepository = require('./BaseRepository')
const supabase = require('../supabase/client')
const notifyOnKpi = require('../utils/notifyOnKpi')

class KpiEntriesRepository extends BaseRepository {
  constructor() { super('kpi_entries') }

  async findByTemplate(templateId) {
    return this.findAll({ template_id: templateId })
  }

  async findByProvince(provinceId) {
    return this.findAll({ province_id: provinceId })
  }

  // Override create to fire notification
  async create(payload) {
    const entry = await super.create(payload)
    await notifyOnKpi(null, entry.value, entry.template_id, entry.province_id)
    return entry
  }

  // Override update to fire notification
  async update(id, payload) {
    const previous = await this.findById(id)
    const entry = await super.update(id, payload)
    await notifyOnKpi(previous.value, entry.value, entry.template_id, entry.province_id)
    return entry
  }
}

module.exports = new KpiEntriesRepository()
