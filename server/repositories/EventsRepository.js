// server/repositories/EventsRepository.js
const BaseRepository = require('./BaseRepository')
const supabase = require('../supabase/client')

class EventsRepository extends BaseRepository {
  constructor() { super('events') }

  async findByProvince(provinceId) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .contains('province_ids', [provinceId])
      .order('event_date', { ascending: true })
    if (error) throw error
    return data
  }
}

module.exports = new EventsRepository()
