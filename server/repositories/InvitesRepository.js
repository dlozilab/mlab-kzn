// server/repositories/InvitesRepository.js
// No update — resend or delete only
const BaseRepository = require('./BaseRepository')

class InvitesRepository extends BaseRepository {
  constructor() { super('invites') }

  async findPending() {
    return this.findAll({ status: 'Pending' })
  }
}

module.exports = new InvitesRepository()
