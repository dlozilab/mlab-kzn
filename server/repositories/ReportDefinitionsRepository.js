// server/repositories/ReportDefinitionsRepository.js
// SQL SELECT queries rendered by AI — super admin only
// validateQuery.js must approve the SQL before runQuery is called
const BaseRepository = require('./BaseRepository')
const supabase = require('../supabase/client')

class ReportDefinitionsRepository extends BaseRepository {
  constructor() { super('report_definitions') }

  async runQuery(sql) {
    const { data, error } = await supabase.rpc('run_report_query', { query: sql })
    if (error) throw error
    return data
  }
}

module.exports = new ReportDefinitionsRepository()
