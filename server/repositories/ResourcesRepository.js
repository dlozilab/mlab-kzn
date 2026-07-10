// server/repositories/ResourcesRepository.js
const BaseRepository = require('./BaseRepository')

class ResourcesRepository extends BaseRepository {
  constructor() { super('resources') }

  async findPublicSorted() {
    const { data, error } = await require('../supabase/client')
      .from(this.table)
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }
}

module.exports = new ResourcesRepository()
