-- mlab-kzn schema.sql
-- Run this against your Supabase project SQL editor
-- Order matters -- provinces first, everything else references it
-- Every table requires explicit GRANT (new behaviour from May 30 2026)

-- ── EXTENSIONS ───────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── PROVINCES ────────────────────────────────────────────────────────────────
-- Must be created first — all other tables reference province_id

CREATE TABLE provinces (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text NOT NULL UNIQUE,
  is_active  boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON provinces TO authenticated;
GRANT SELECT ON provinces TO anon;

ALTER TABLE provinces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all" ON provinces
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "all_read_active" ON provinces
  FOR SELECT USING (is_active = true);

-- ── ROLES ────────────────────────────────────────────────────────────────────

CREATE TABLE roles (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text NOT NULL UNIQUE,
  color      text,
  is_system  boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON roles TO authenticated;

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all" ON roles
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "all_read" ON roles
  FOR SELECT USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'staff'));

-- ── ROLE PERMISSIONS ─────────────────────────────────────────────────────────

CREATE TABLE role_permissions (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  role_id    uuid REFERENCES roles(id) ON DELETE CASCADE,
  feature_id text NOT NULL,
  op         text NOT NULL CHECK (op IN ('c', 'r', 'u', 'd')),
  enabled    boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (role_id, feature_id, op)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON role_permissions TO authenticated;

ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all" ON role_permissions
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "all_read" ON role_permissions
  FOR SELECT USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'staff'));

-- ── USERS ────────────────────────────────────────────────────────────────────

CREATE TABLE users (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name   text NOT NULL,
  email       text NOT NULL UNIQUE,
  role        text NOT NULL DEFAULT 'staff',
  province_id uuid REFERENCES provinces(id) ON DELETE SET NULL,
  avatar_url  text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON users TO authenticated;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all" ON users
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "all_read" ON users
  FOR SELECT USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'staff'));

CREATE POLICY "own_record" ON users
  FOR ALL USING (auth.jwt() ->> 'sub' = id::text);

-- ── INVITES ──────────────────────────────────────────────────────────────────

CREATE TABLE invites (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email       text NOT NULL,
  role        text NOT NULL,
  province_id uuid REFERENCES provinces(id) ON DELETE SET NULL,
  token       text NOT NULL UNIQUE,
  status      text DEFAULT 'Pending',
  created_at  timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, DELETE ON invites TO authenticated;

ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all" ON invites
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

-- ── PROGRAMMES ───────────────────────────────────────────────────────────────

CREATE TABLE programmes (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name         text NOT NULL,
  type         text,
  province_ids uuid[] DEFAULT '{}',
  start_date   date,
  end_date     date,
  description  text,
  status       text DEFAULT 'Active',
  is_public    boolean DEFAULT false,
  created_by   uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON programmes TO authenticated;

ALTER TABLE programmes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all" ON programmes
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "admin_own_province" ON programmes
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin'
    AND (auth.jwt() ->> 'province_id')::uuid = ANY(province_ids)
  );

CREATE POLICY "staff_read_all" ON programmes
  FOR SELECT USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'staff'));

-- ── EVENTS ───────────────────────────────────────────────────────────────────

CREATE TABLE events (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name         text NOT NULL,
  role         text NOT NULL DEFAULT 'Host',
  province_ids uuid[] DEFAULT '{}',
  event_date   date,
  event_time   time,
  location     text,
  description  text,
  is_public    boolean DEFAULT false,
  created_by   uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON events TO authenticated;

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all" ON events
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "admin_own_province" ON events
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin'
    AND (auth.jwt() ->> 'province_id')::uuid = ANY(province_ids)
  );

CREATE POLICY "staff_read_all" ON events
  FOR SELECT USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'staff'));

-- ── MEDIA ────────────────────────────────────────────────────────────────────

CREATE TABLE media (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title       text NOT NULL,
  province_id uuid REFERENCES provinces(id) ON DELETE SET NULL,
  category    text,
  file_url    text NOT NULL,
  caption     text,
  created_by  uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON media TO authenticated;

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all" ON media
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "admin_own_province" ON media
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin'
    AND (auth.jwt() ->> 'province_id')::uuid = province_id
  );

CREATE POLICY "staff_read_all" ON media
  FOR SELECT USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'staff'));

-- ── JOURNEYS ─────────────────────────────────────────────────────────────────

CREATE TABLE journeys (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name    text NOT NULL,
  province_id  uuid REFERENCES provinces(id) ON DELETE SET NULL,
  programme_id uuid REFERENCES programmes(id) ON DELETE SET NULL,
  status       text DEFAULT 'Active',
  enrolled_at  date,
  notes        text,
  is_public    boolean DEFAULT false,
  created_by   uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON journeys TO authenticated;

ALTER TABLE journeys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all" ON journeys
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "admin_own_province" ON journeys
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin'
    AND (auth.jwt() ->> 'province_id')::uuid = province_id
  );

CREATE POLICY "staff_read_all" ON journeys
  FOR SELECT USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'staff'));

-- ── KPI TEMPLATES ────────────────────────────────────────────────────────────

CREATE TABLE kpi_templates (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name text NOT NULL,
  unit        text NOT NULL,
  target      numeric NOT NULL,
  scope       text DEFAULT 'National',
  period      text DEFAULT 'Quarterly',
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON kpi_templates TO authenticated;

ALTER TABLE kpi_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all" ON kpi_templates
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "all_read" ON kpi_templates
  FOR SELECT USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'staff'));

-- ── KPI ENTRIES ──────────────────────────────────────────────────────────────

CREATE TABLE kpi_entries (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id uuid REFERENCES kpi_templates(id) ON DELETE CASCADE,
  province_id uuid REFERENCES provinces(id) ON DELETE SET NULL,
  value       numeric NOT NULL,
  period      text NOT NULL,
  notes       text,
  created_by  uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON kpi_entries TO authenticated;

ALTER TABLE kpi_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all" ON kpi_entries
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "admin_own_province" ON kpi_entries
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin'
    AND (auth.jwt() ->> 'province_id')::uuid = province_id
  );

CREATE POLICY "staff_read_all" ON kpi_entries
  FOR SELECT USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'staff'));

-- ── REPORTS ──────────────────────────────────────────────────────────────────

CREATE TABLE reports (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  province_id  uuid REFERENCES provinces(id) ON DELETE SET NULL,
  period       text NOT NULL,
  activities   text,
  outcomes     text,
  challenges   text,
  status       text DEFAULT 'Pending',
  submitted_at date,
  created_by   uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON reports TO authenticated;

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all" ON reports
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "admin_own_province" ON reports
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin'
    AND (auth.jwt() ->> 'province_id')::uuid = province_id
  );

CREATE POLICY "staff_read_all" ON reports
  FOR SELECT USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'staff'));

-- ── SNAPSHOTS ────────────────────────────────────────────────────────────────

CREATE TABLE snapshots (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title       text NOT NULL,
  province_id uuid REFERENCES provinces(id) ON DELETE SET NULL,
  period      text,
  file_url    text NOT NULL,
  is_public   boolean DEFAULT false,
  created_by  uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at  timestamptz DEFAULT now()
  -- no updated_at — snapshots are deleted and regenerated, never edited
);

GRANT SELECT, INSERT, DELETE ON snapshots TO authenticated;
GRANT SELECT ON snapshots TO anon;

ALTER TABLE snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all" ON snapshots
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "all_read" ON snapshots
  FOR SELECT USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'staff'));

CREATE POLICY "anon_read_public" ON snapshots
  FOR SELECT TO anon USING (is_public = true);

-- ── FORMS ────────────────────────────────────────────────────────────────────

CREATE TABLE forms (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name             text NOT NULL,
  slug             text NOT NULL UNIQUE,
  table_name       text NOT NULL UNIQUE,
  is_public        boolean DEFAULT false,
  linked_entity    text,
  linked_entity_id uuid,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON forms TO authenticated;
GRANT SELECT ON forms TO anon;

ALTER TABLE forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all" ON forms
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "all_read" ON forms
  FOR SELECT USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'staff'));

CREATE POLICY "anon_read_public" ON forms
  FOR SELECT TO anon USING (is_public = true);

-- ── FORM FIELDS ──────────────────────────────────────────────────────────────

CREATE TABLE form_fields (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id    uuid REFERENCES forms(id) ON DELETE CASCADE,
  label      text NOT NULL,
  field_name text NOT NULL,
  field_type text NOT NULL,
  options    jsonb,
  required   boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON form_fields TO authenticated;
GRANT SELECT ON form_fields TO anon;

ALTER TABLE form_fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all" ON form_fields
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "all_read" ON form_fields
  FOR SELECT USING (true);

-- ── REPORT DEFINITIONS ───────────────────────────────────────────────────────

CREATE TABLE report_definitions (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text NOT NULL,
  description text,
  query       text NOT NULL,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON report_definitions TO authenticated;

ALTER TABLE report_definitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all" ON report_definitions
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

-- ── NOTIFICATIONS ────────────────────────────────────────────────────────────

CREATE TABLE notifications (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES users(id) ON DELETE CASCADE,
  type        text NOT NULL,
  message     text NOT NULL,
  province_id uuid REFERENCES provinces(id) ON DELETE SET NULL,
  is_read     boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON notifications TO authenticated;

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_notifications" ON notifications
  FOR ALL USING (auth.jwt() ->> 'sub' = user_id::text);

CREATE POLICY "super_admin_all" ON notifications
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

-- ── AUDIT LOG ────────────────────────────────────────────────────────────────

CREATE TABLE audit_log (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES users(id) ON DELETE SET NULL,
  user_name   text,
  action      text NOT NULL,
  entity      text NOT NULL,
  entity_id   uuid,
  province_id uuid REFERENCES provinces(id) ON DELETE SET NULL,
  timestamp   timestamptz DEFAULT now()
);

GRANT SELECT, INSERT ON audit_log TO authenticated;

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all" ON audit_log
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "own_entries" ON audit_log
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id::text);

-- ── CREATE FORM TABLE FUNCTION ───────────────────────────────────────────────
-- Written once, used forever
-- Called by FormsRepository.createFormTable() when a new form is saved
-- Automatically creates the table, grants, and RLS policies

CREATE OR REPLACE FUNCTION create_form_table(p_table_name TEXT, p_fields JSONB)
RETURNS void AS $$
DECLARE
  col      JSONB;
  sql      TEXT;
  col_type TEXT;
BEGIN
  sql := 'CREATE TABLE ' || quote_ident(p_table_name) || ' (
    id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    submitted_at timestamptz DEFAULT now()';

  FOR col IN SELECT * FROM jsonb_array_elements(p_fields) LOOP
    col_type := CASE col->>'field_type'
      WHEN 'text'     THEN 'TEXT'
      WHEN 'textarea' THEN 'TEXT'
      WHEN 'number'   THEN 'NUMERIC'
      WHEN 'date'     THEN 'DATE'
      WHEN 'time'     THEN 'TIME'
      WHEN 'email'    THEN 'TEXT'
      WHEN 'phone'    THEN 'TEXT'
      WHEN 'url'      THEN 'TEXT'
      WHEN 'radio'    THEN 'TEXT'
      WHEN 'checkbox' THEN 'TEXT[]'
      WHEN 'scale'    THEN 'INTEGER'
      ELSE 'TEXT'
    END;
    sql := sql || ', ' || quote_ident(col->>'field_name') || ' ' || col_type;
  END LOOP;

  sql := sql || ')';
  EXECUTE sql;

  EXECUTE 'GRANT INSERT ON '  || quote_ident(p_table_name) || ' TO anon';
  EXECUTE 'GRANT SELECT ON '  || quote_ident(p_table_name) || ' TO authenticated';
  EXECUTE 'ALTER TABLE '      || quote_ident(p_table_name) || ' ENABLE ROW LEVEL SECURITY';
  EXECUTE 'CREATE POLICY "anon_insert" ON ' || quote_ident(p_table_name)
       || ' FOR INSERT TO anon WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "auth_read" ON ' || quote_ident(p_table_name)
       || ' FOR SELECT TO authenticated USING (true)';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── SEED: DEFAULT ROLES ──────────────────────────────────────────────────────

INSERT INTO roles (name, color, is_system) VALUES
  ('super_admin',     '#534AB7', true),
  ('admin',           '#854F0B', false),
  ('staff',           '#0F6E56', false),
  ('stakeholder',     '#185FA5', false);

-- ── SEED: INITIAL PROVINCES ──────────────────────────────────────────────────
-- Add or remove as needed from the CMS — this is just the starting point

INSERT INTO provinces (name, is_active) VALUES
  ('KwaZulu-Natal',  true),
  ('Limpopo',        true),
  ('Northern Cape',  true),
  ('Northwest',      true),
  ('Free State',     false);