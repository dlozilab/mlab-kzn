// server/repositories/JourneysRepository.js
const BaseRepository = require('./BaseRepository')
const supabase = require('../supabase/client')

class JourneysRepository extends BaseRepository {
  constructor() { super('journeys') }

  async findByProvince(provinceId) {
    return this.findAll({ province_id: provinceId })
  }

  async findByProgramme(programmeId) {
    return this.findAll({ programme_id: programmeId })
  }

  async countByStatus(provinceId) {
    const { data, error } = await supabase
      .from(this.table)
      .select('status')
      .eq('province_id', provinceId)
    if (error) throw error
    return data.reduce((acc, row) => {
      acc[row.status] = (acc[row.status] || 0) + 1
      return acc
    }, {})
  }
}

module.exports = new JourneysRepository()
