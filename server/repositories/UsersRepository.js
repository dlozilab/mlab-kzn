// server/repositories/UsersRepository.js
const BaseRepository = require('./BaseRepository')
const supabase = require('../supabase/client')

class UsersRepository extends BaseRepository {
  constructor() { super('users') }

  async findByProvince(provinceId) {
    return this.findAll({ province_id: provinceId })
  }

  async findByRole(role) {
    return this.findAll({ role })
  }

  async findByEmail(email) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('email', email)
      .single()
    if (error) throw error
    return data
  }
}

module.exports = new UsersRepository()
