// server/repositories/KpiTemplatesRepository.js
const BaseRepository = require('./BaseRepository')

class KpiTemplatesRepository extends BaseRepository {
  constructor() { super('kpi_templates') }

  async findNational() {
    return this.findAll({ scope: 'National' })
  }

  async findPerProvince() {
    return this.findAll({ scope: 'Per province' })
  }
}

module.exports = new KpiTemplatesRepository()
