// server/repositories/MediaRepository.js
const BaseRepository = require('./BaseRepository')
const supabase = require('../supabase/client')

class MediaRepository extends BaseRepository {
  constructor() { super('media') }

  async findByProvince(provinceId) {
    return this.findAll({ province_id: provinceId })
  }

  async findByCategory(category) {
    return this.findAll({ category })
  }
}

module.exports = new MediaRepository()
