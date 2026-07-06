// server/repositories/NotificationsRepository.js
// Created by auditLog middleware only — never from a route directly
// User can only read and mark as read
const BaseRepository = require('./BaseRepository')
const supabase = require('../supabase/client')

class NotificationsRepository extends BaseRepository {
  constructor() { super('notifications') }

  async findForUser(userId) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }

  async countUnread(userId) {
    return this.count({ user_id: userId, is_read: false })
  }

  async markRead(id) {
    return this.update(id, { is_read: true })
  }

  async markAllRead(userId) {
    const { error } = await supabase
      .from(this.table)
      .update({ is_read: true })
      .eq('user_id', userId)
    if (error) throw error
    return true
  }
}

module.exports = new NotificationsRepository()
