// server/repositories/RolesRepository.js
// Groups + permissions — system roles are locked
const BaseRepository = require('./BaseRepository')
const supabase = require('../supabase/client')

class RolesRepository extends BaseRepository {
  constructor() { super('roles') }

  async findWithUserCount() {
    const { data, error } = await supabase
      .from(this.table)
      .select('*, users(count)')
    if (error) throw error
    return data
  }

  async findPermissions(roleId) {
    const { data, error } = await supabase
      .from('role_permissions')
      .select('*')
      .eq('role_id', roleId)
    if (error) throw error
    return data
  }

  async updatePermission(roleId, featureId, op, value) {
    const { data, error } = await supabase
      .from('role_permissions')
      .upsert({ role_id: roleId, feature_id: featureId, op, enabled: value })
      .select()
      .single()
    if (error) throw error
    return data
  }
}

module.exports = new RolesRepository()
