// server/config/featureRegistry.js
// SINGLE SOURCE OF TRUTH
// Sidebar, list pages, detail pages, permissions matrix all read from here.
// Adding a feature = adding one object to this array. Everything updates automatically.
// Super admin always gets new features immediately.
// detailPage: 'standard' | 'activity'
// ops: c=create, r=read, u=update, d=delete

const registry = [

  // ── CONTENT ──────────────────────────────────────────────────────────────

  {
    id:          'programmes',
    label:       'Programmes',
    section:     'Content',
    icon:        '📋',
    ops:         ['c', 'r', 'u', 'd'],
    fields: [
      { name: 'name',         label: 'Programme name',  type: 'text',   required: true },
      { name: 'type',         label: 'Type',            type: 'select', required: true,
        options: ['CodeTribe Coding Academy', 'Biz Accelerator', 'IoT', 'Her-AI-Path', 'STEP UP', 'Other'] },
      { name: 'province_ids', label: 'Provinces',       type: 'multiselect', source: 'provinces', required: true },
      { name: 'start_date',   label: 'Start date',      type: 'date' },
      { name: 'end_date',     label: 'End date',        type: 'date' },
      { name: 'description',  label: 'Description',     type: 'textarea' },
      { name: 'status',       label: 'Status',          type: 'select',
        options: ['Active', 'Completed', 'Upcoming', 'Cancelled'] },
    ],
    canBePublic:  true,
    detailPage:   'activity',
    readOnly:     false,
  },

  {
    id:          'events',
    label:       'Events',
    section:     'Content',
    icon:        '📅',
    ops:         ['c', 'r', 'u', 'd'],
    fields: [
      { name: 'name',         label: 'Event name',  type: 'text',        required: true },
      { name: 'role',         label: 'Our role',    type: 'select',      required: true,
        options: ['Host', 'Participant'] },
      { name: 'province_ids', label: 'Provinces',   type: 'multiselect', source: 'provinces', required: true },
      { name: 'event_date',   label: 'Date',        type: 'date',        required: true },
      { name: 'event_time',   label: 'Time',        type: 'time' },
      { name: 'location',     label: 'Location',    type: 'text' },
      { name: 'description',  label: 'Description', type: 'textarea' },
    ],
    canBePublic:  true,
    detailPage:   'activity',
    readOnly:     false,
  },

  {
    id:          'media',
    label:       'Media',
    section:     'Content',
    icon:        '🖼️',
    ops:         ['c', 'r', 'u', 'd'],
    fields: [
      { name: 'title',       label: 'Title',       type: 'text',   required: true },
      { name: 'province_id', label: 'Province',    type: 'select', source: 'provinces', required: true },
      { name: 'category',    label: 'Category',    type: 'select',
        options: ['Evidence', 'Lab', 'Brand', 'Video', 'Audio', 'Document'] },
      { name: 'file_url',    label: 'File',        type: 'url',    required: true },
      { name: 'caption',     label: 'Caption',     type: 'text' },
    ],
    canBePublic:  false,
    detailPage:   'standard',
    readOnly:     false,
  },

  // ── IMPACT ───────────────────────────────────────────────────────────────

  {
    id:          'journeys',
    label:       'Journeys',
    section:     'Impact',
    icon:        '👤',
    ops:         ['c', 'r', 'u', 'd'],
    fields: [
      { name: 'full_name',    label: 'Full name',    type: 'text',   required: true },
      { name: 'province_id',  label: 'Province',     type: 'select', source: 'provinces', required: true },
      { name: 'programme_id', label: 'Programme',    type: 'select', source: 'programmes' },
      { name: 'status',       label: 'Status',       type: 'select',
        options: ['Active', 'Graduated', 'Withdrawn'] },
      { name: 'enrolled_at',  label: 'Enrolled',     type: 'date' },
      { name: 'notes',        label: 'Notes',        type: 'textarea' },
    ],
    canBePublic:  true,
    detailPage:   'standard',
    readOnly:     false,
  },

  {
    id:          'kpi-templates',
    label:       'KPI Templates',
    section:     'Impact',
    icon:        '🎯',
    ops:         ['c', 'r', 'u', 'd'],
    fields: [
      { name: 'metric_name', label: 'Metric name',  type: 'text',   required: true },
      { name: 'unit',        label: 'Unit',         type: 'text',   required: true },
      { name: 'target',      label: 'Target value', type: 'number', required: true },
      { name: 'scope',       label: 'Scope',        type: 'select',
        options: ['National', 'Per province'] },
      { name: 'period',      label: 'Period',       type: 'select',
        options: ['Monthly', 'Quarterly', 'Annual'] },
    ],
    canBePublic:  false,
    detailPage:   'standard',
    readOnly:     false,
    superAdminOnly: true,
  },

  {
    id:          'kpi-entries',
    label:       'KPI Entries',
    section:     'Impact',
    icon:        '📊',
    ops:         ['c', 'r', 'u', 'd'],
    fields: [
      { name: 'template_id', label: 'KPI',          type: 'select', source: 'kpi-templates', required: true },
      { name: 'province_id', label: 'Province',     type: 'select', source: 'provinces',     required: true },
      { name: 'value',       label: 'Actual value', type: 'number', required: true },
      { name: 'period',      label: 'Period',       type: 'text',   required: true },
      { name: 'notes',       label: 'Notes',        type: 'textarea' },
    ],
    canBePublic:  false,
    detailPage:   'standard',
    readOnly:     false,
  },

  // ── REPORTING ─────────────────────────────────────────────────────────────

  {
    id:          'reports',
    label:       'Reports',
    section:     'Reporting',
    icon:        '📄',
    ops:         ['c', 'r', 'u', 'd'],
    fields: [
      { name: 'province_id', label: 'Province',    type: 'select', source: 'provinces', required: true },
      { name: 'period',      label: 'Period',      type: 'text',   required: true },
      { name: 'activities',  label: 'Activities',  type: 'textarea', required: true },
      { name: 'outcomes',    label: 'Outcomes',    type: 'textarea', required: true },
      { name: 'challenges',  label: 'Challenges',  type: 'textarea' },
      { name: 'submitted_at',label: 'Submitted',   type: 'date' },
    ],
    canBePublic:  false,
    detailPage:   'standard',
    readOnly:     false,
  },

  {
    id:          'snapshots',
    label:       'Snapshots',
    section:     'Reporting',
    icon:        '📥',
    ops:         ['c', 'r', 'd'],
    fields: [
      { name: 'title',       label: 'Title',       type: 'text',   required: true },
      { name: 'province_id', label: 'Province',    type: 'select', source: 'provinces' },
      { name: 'period',      label: 'Period',      type: 'text' },
      { name: 'file_url',    label: 'PDF URL',     type: 'url',    required: true },
    ],
    canBePublic:  true,
    detailPage:   'standard',
    readOnly:     false,
  },

  // ── FORMS ─────────────────────────────────────────────────────────────────

  {
    id:          'forms',
    label:       'Forms',
    section:     'Forms',
    icon:        '📝',
    ops:         ['c', 'r', 'u', 'd'],
    fields: [
      { name: 'name',              label: 'Form name',       type: 'text',   required: true },
      { name: 'slug',              label: 'Slug',            type: 'text',   required: true },
      { name: 'linked_entity',     label: 'Linked to',       type: 'select',
        options: ['None', 'programmes', 'events', 'journeys'] },
      { name: 'linked_entity_id',  label: 'Linked record',   type: 'text' },
    ],
    canBePublic:  true,
    detailPage:   'standard',
    readOnly:     false,
    superAdminOnly: true,
  },

  // ── ANALYTICS ─────────────────────────────────────────────────────────────

  {
    id:          'report-definitions',
    label:       'Report Definitions',
    section:     'Analytics',
    icon:        '🔍',
    ops:         ['c', 'r', 'u', 'd'],
    fields: [
      { name: 'name',        label: 'Report name', type: 'text',     required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'query',       label: 'SQL query',   type: 'textarea', required: true },
    ],
    canBePublic:  false,
    detailPage:   'standard',
    readOnly:     false,
    superAdminOnly: true,
  },

  // ── SYSTEM ────────────────────────────────────────────────────────────────

  {
    id:          'provinces',
    label:       'Provinces',
    section:     'System',
    icon:        '📍',
    ops:         ['c', 'r', 'u', 'd'],
    fields: [
      { name: 'name',      label: 'Province name', type: 'text',    required: true },
      { name: 'is_active', label: 'Active',        type: 'radio',   options: ['Yes', 'No'] },
    ],
    canBePublic:  false,
    detailPage:   'standard',
    readOnly:     false,
    superAdminOnly: true,
  },

  {
    id:          'users',
    label:       'Users',
    section:     'System',
    icon:        '👥',
    ops:         ['c', 'r', 'u', 'd'],
    fields: [
      { name: 'full_name',   label: 'Full name',  type: 'text',   required: true },
      { name: 'email',       label: 'Email',      type: 'email',  required: true },
      { name: 'role',        label: 'Role',       type: 'select', source: 'roles', required: true },
      { name: 'province_id', label: 'Province',   type: 'select', source: 'provinces' },
    ],
    canBePublic:  false,
    detailPage:   'standard',
    readOnly:     false,
    superAdminOnly: true,
  },

  {
    id:          'roles',
    label:       'Roles',
    section:     'System',
    icon:        '🔒',
    ops:         ['c', 'r', 'u', 'd'],
    fields: [
      { name: 'name',  label: 'Group name', type: 'text', required: true },
      { name: 'color', label: 'Colour',     type: 'text' },
    ],
    canBePublic:  false,
    detailPage:   'standard',
    readOnly:     false,
    superAdminOnly: true,
  },

  {
    id:          'invites',
    label:       'Invites',
    section:     'System',
    icon:        '✉️',
    ops:         ['c', 'r', 'd'],
    fields: [
      { name: 'email',       label: 'Email',    type: 'email',  required: true },
      { name: 'role',        label: 'Role',     type: 'select', source: 'roles', required: true },
      { name: 'province_id', label: 'Province', type: 'select', source: 'provinces' },
    ],
    canBePublic:  false,
    detailPage:   'standard',
    readOnly:     false,
    superAdminOnly: true,
  },

  {
    id:          'notifications',
    label:       'Notifications',
    section:     'System',
    icon:        '🔔',
    ops:         ['r', 'u'],
    fields:      [],
    canBePublic:  false,
    detailPage:   'standard',
    readOnly:     false,
    superAdminOnly: false,
  },

  {
    id:          'audit',
    label:       'Audit Log',
    section:     'System',
    icon:        '👁️',
    ops:         ['r'],
    fields:      [],
    canBePublic:  false,
    detailPage:   'standard',
    readOnly:     true,
    superAdminOnly: true,
  },

]

// ── HELPERS ───────────────────────────────────────────────────────────────────

function get(id) {
  return registry.find(f => f.id === id) || null
}

function getBySection() {
  return registry.reduce((acc, feature) => {
    if (!acc[feature.section]) acc[feature.section] = []
    acc[feature.section].push(feature)
    return acc
  }, {})
}

function getSections() {
  return [...new Set(registry.map(f => f.section))]
}

function canDo(feature, op) {
  return feature.ops.includes(op)
}

module.exports = { registry, get, getBySection, getSections, canDo }