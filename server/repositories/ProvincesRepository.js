// server/repositories/ProvincesRepository.js
// Provinces are a system entity — super admin only
// findActive() is called by every dropdown and filter across the app

const BaseRepository = require('./BaseRepository')

class ProvincesRepository extends BaseRepository {

  constructor() {
    super('provinces')
  }

  // Active provinces only — used by all dropdowns, filters, and public site toggle
  async findActive() {
    const { data, error } = await require('../supabase/client')
      .from(this.table)
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })
    if (error) throw error
    return data
  }

  // Used by public site provinces page toggle
  async findActiveNames() {
    const provinces = await this.findActive()
    return provinces.map(p => ({ id: p.id, name: p.name }))
  }

}

module.exports = new ProvincesRepository()