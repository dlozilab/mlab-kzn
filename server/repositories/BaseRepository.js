// server/repositories/BaseRepository.js
// Repository pattern — all Supabase queries live in repositories
// Every entity repository extends this class and inherits these methods
// Routes never touch Supabase directly — they call repository methods only

const supabase = require('../supabase/client')

class BaseRepository {

  constructor(tableName) {
    this.table = tableName
  }

  // ── READ ──────────────────────────────────────────────────────────────────

  async findAll(filters = {}) {
    let query = supabase.from(this.table).select('*')
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value)
    })
    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return data
  }

  async findById(id) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }

  async findPublic(filters = {}) {
    let query = supabase.from(this.table).select('*').eq('is_public', true)
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value)
    })
    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return data
  }

  async search(column, term) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .ilike(column, `%${term}%`)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }

  // ── CREATE ────────────────────────────────────────────────────────────────

  async create(payload) {
    const { data, error } = await supabase
      .from(this.table)
      .insert(payload)
      .select()
      .single()
    if (error) throw error
    return data
  }

  // ── UPDATE ────────────────────────────────────────────────────────────────

  async update(id, payload) {
    const { data, error } = await supabase
      .from(this.table)
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async setPublic(id, value) {
    const { data, error } = await supabase
      .from(this.table)
      .update({ is_public: value, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  // ── DELETE ────────────────────────────────────────────────────────────────

  async delete(id) {
    const { error } = await supabase
      .from(this.table)
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  }

  // ── COUNT ─────────────────────────────────────────────────────────────────

  async count(filters = {}) {
    let query = supabase
      .from(this.table)
      .select('*', { count: 'exact', head: true })
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value)
    })
    const { count, error } = await query
    if (error) throw error
    return count
  }

}

module.exports = BaseRepository