// server/repositories/ProgrammesRepository.js
const BaseRepository = require('./BaseRepository')
const supabase = require('../supabase/client')

class ProgrammesRepository extends BaseRepository {
  constructor() { super('programmes') }

  async findByProvince(provinceId) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .contains('province_ids', [provinceId])
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }
}

module.exports = new ProgrammesRepository()
