// server/repositories/ReportsRepository.js
const BaseRepository = require('./BaseRepository')

class ReportsRepository extends BaseRepository {
  constructor() { super('reports') }

  async findByProvince(provinceId) {
    return this.findAll({ province_id: provinceId })
  }

  async findPending() {
    return this.findAll({ status: 'Pending' })
  }
}

module.exports = new ReportsRepository()
