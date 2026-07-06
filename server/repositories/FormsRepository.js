// server/repositories/FormsRepository.js
// Each form generates its own Supabase table via the create_form_table RPC function
const BaseRepository = require('./BaseRepository')
const supabase = require('../supabase/client')

class FormsRepository extends BaseRepository {
  constructor() { super('forms') }

  async findBySlug(slug) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('slug', slug)
      .single()
    if (error) throw error
    return data
  }

  async findFields(formId) {
    const { data, error } = await supabase
      .from('form_fields')
      .select('*')
      .eq('form_id', formId)
      .order('sort_order', { ascending: true })
    if (error) throw error
    return data
  }

  // Calls the Postgres function that creates the form's dedicated table
  async createFormTable(tableName, fields) {
    const { error } = await supabase.rpc('create_form_table', {
      p_table_name: tableName,
      p_fields: fields,
    })
    if (error) throw error
    return true
  }

  // Submit a response to the form's dedicated table
  async submitResponse(tableName, payload) {
    const { data, error } = await supabase
      .from(tableName)
      .insert(payload)
      .select()
      .single()
    if (error) throw error
    return data
  }

  // Get all responses from the form's dedicated table
  async getResponses(tableName) {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('submitted_at', { ascending: false })
    if (error) throw error
    return data
  }
}

module.exports = new FormsRepository()
