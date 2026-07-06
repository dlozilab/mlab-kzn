// server/repositories/AuditRepository.js
// Written by auditLog middleware only
// No user can create, update, or delete audit entries — read only from routes
const BaseRepository = require('./BaseRepository')

class AuditRepository extends BaseRepository {
  constructor() { super('audit_log') }

  async findByProvince(provinceId) {
    return this.findAll({ province_id: provinceId })
  }

  async findByUser(userId) {
    return this.findAll({ user_id: userId })
  }

  async findByEntity(entity, entityId) {
    return this.findAll({ entity, entity_id: entityId })
  }
}

module.exports = new AuditRepository()
