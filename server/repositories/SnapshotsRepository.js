// server/repositories/SnapshotsRepository.js
// No update — snapshots are deleted and regenerated, never edited
const BaseRepository = require('./BaseRepository')

class SnapshotsRepository extends BaseRepository {
  constructor() { super('snapshots') }

  async findByProvince(provinceId) {
    return this.findAll({ province_id: provinceId })
  }

  // Snapshots less than 8 days old — for NewBadge on resources page
  async findRecent() {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 8)
    const { data, error } = await require('../supabase/client')
      .from(this.table)
      .select('*')
      .eq('is_public', true)
      .gte('created_at', cutoff.toISOString())
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }
}

module.exports = new SnapshotsRepository()
