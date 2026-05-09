-- ============================================================
-- Steven IA — Schema Supabase PostgreSQL
-- República Dominicana · Multi-tenant SaaS
-- ============================================================

-- ── Empresas ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS empresas (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      text NOT NULL,
  rnc         text,
  plan        text NOT NULL DEFAULT 'basico',  -- basico | profesional | contadores
  activa      boolean DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

-- ── Perfiles (extends auth.users 1-to-1) ───────────────────
CREATE TABLE IF NOT EXISTS perfiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  empresa_id  uuid REFERENCES empresas(id) ON DELETE SET NULL,
  nombre      text,
  rol         text DEFAULT 'admin',  -- admin | contador | rrhh | gerencia | auditor
  created_at  timestamptz DEFAULT now()
);

-- ── Empleados ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS empleados (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id      uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nombre          text NOT NULL,
  cedula          text,
  cargo           text,
  area            text,
  salario_bruto   numeric(12,2),
  tipo_contrato   text,  -- indefinido | determinado
  fecha_ingreso   date,
  activo          boolean DEFAULT true,
  created_at      timestamptz DEFAULT now()
);

-- ── Facturas / NCF (FiscalGuard) ────────────────────────────
CREATE TABLE IF NOT EXISTS facturas (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id      uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  ncf             text NOT NULL,
  proveedor       text NOT NULL,
  rnc_proveedor   text,
  tipo_ncf        text,  -- B01 | B02 | B14 | B15 | E31 | E32 | E33 | E34 | E41 | E43 | E44 | E45
  concepto        text,
  monto           numeric(12,2),
  itbis           numeric(12,2),
  fecha           date,
  estado          text DEFAULT 'Pendiente',  -- Verificado | Pendiente | Observación | Rechazado
  riesgo          text DEFAULT 'Bajo',       -- Bajo | Medio | Alto | Crítico
  alerta          text,
  created_at      timestamptz DEFAULT now()
);

-- ── Retenciones ISR / ITBIS ─────────────────────────────────
CREATE TABLE IF NOT EXISTS retenciones (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id       uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  proveedor        text NOT NULL,
  rnc              text,
  tipo_persona     text,  -- Física | Jurídica
  concepto         text,
  factura          text,
  monto            numeric(12,2),
  tasa_sugerida    numeric(5,2),
  monto_retencion  numeric(12,2),
  estado           text DEFAULT 'Pendiente',  -- Aplicada | Pendiente | Sin retención | Revisión
  riesgo           text DEFAULT 'Bajo',
  alerta           text,
  fecha            date,
  created_at       timestamptz DEFAULT now()
);

-- ── Períodos de nómina ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS nomina_periodos (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id           uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  periodo              text NOT NULL,   -- "Mayo 2026"
  fecha_inicio         date,
  fecha_fin            date,
  estado               text DEFAULT 'Borrador',  -- Borrador | Procesada | Pagada
  total_bruto          numeric(12,2),
  total_isr            numeric(12,2),
  total_tss_empleado   numeric(12,2),
  total_tss_empleador  numeric(12,2),
  total_neto           numeric(12,2),
  created_at           timestamptz DEFAULT now()
);

-- ── Nómina detalle por empleado ─────────────────────────────
CREATE TABLE IF NOT EXISTS nomina_empleados (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  periodo_id       uuid NOT NULL REFERENCES nomina_periodos(id) ON DELETE CASCADE,
  empleado_id      uuid REFERENCES empleados(id) ON DELETE SET NULL,
  salario_bruto    numeric(12,2),
  isr              numeric(12,2),
  sfs_empleado     numeric(12,2),   -- Seguro Familiar Salud
  afp_empleado     numeric(12,2),   -- Fondo Pensiones (VDS)
  rl_empleado      numeric(12,2),   -- Riesgo Laboral
  sfs_empleador    numeric(12,2),
  afp_empleador    numeric(12,2),
  rl_empleador     numeric(12,2),
  salario_neto     numeric(12,2),
  observacion      text,
  created_at       timestamptz DEFAULT now()
);

-- ── Documentos laborales (DocVault) ─────────────────────────
CREATE TABLE IF NOT EXISTS documentos (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id         uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  empleado_id        uuid NOT NULL REFERENCES empleados(id) ON DELETE CASCADE,
  nombre             text NOT NULL,  -- "Cédula de identidad", "Contrato laboral firmado", etc.
  estado             text DEFAULT 'Falta',  -- OK | Falta | Vencido
  fecha_vencimiento  date,
  storage_path       text,  -- Supabase Storage path
  created_at         timestamptz DEFAULT now()
);

-- ── Contratos legales (LexGuard) ────────────────────────────
CREATE TABLE IF NOT EXISTS contratos (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id           uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  titulo               text NOT NULL,
  tipo                 text,  -- Laboral Indefinido | NDA | Arrendamiento | Servicios Profesionales | Política interna
  partes               text,
  fecha                date,
  vencimiento          date,
  estado               text DEFAULT 'Borrador',  -- Vigente | Borrador | Pendiente firma | Vencido | Revisión legal
  riesgo               text DEFAULT 'Bajo',
  clausulas_faltantes  text[],
  observacion          text,
  storage_path         text,
  created_at           timestamptz DEFAULT now()
);

-- ── Alertas ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alertas (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id   uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  titulo       text NOT NULL,
  descripcion  text,
  categoria    text,  -- Fiscal | Nómina | Legal | Documentos | Retenciones | Privacidad
  prioridad    text DEFAULT 'Media',  -- Crítica | Alta | Media | Baja
  modulo       text,
  leida        boolean DEFAULT false,
  accion       text,
  created_at   timestamptz DEFAULT now()
);

-- ── Consentimientos de datos (DataShield / Ley 172-13) ──────
CREATE TABLE IF NOT EXISTS consentimientos (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id   uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  empleado_id  uuid NOT NULL REFERENCES empleados(id) ON DELETE CASCADE,
  tipo         text DEFAULT 'Contratación',
  estado       text DEFAULT 'Pendiente',  -- Firmado | Pendiente renovación | Sin consentimiento
  fecha_firma  date,
  created_at   timestamptz DEFAULT now()
);

-- ── Trigger: crear empresa y perfil al registrarse ──────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  new_empresa_id uuid;
BEGIN
  INSERT INTO empresas (nombre, rnc, plan)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'company', 'Mi Empresa'),
    NEW.raw_user_meta_data->>'rnc',
    COALESCE(NEW.raw_user_meta_data->>'plan', 'basico')
  )
  RETURNING id INTO new_empresa_id;

  INSERT INTO perfiles (id, empresa_id, nombre, rol)
  VALUES (
    NEW.id,
    new_empresa_id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    'admin'
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ════════════════════════════════════════════════════════════
-- Row Level Security
-- ════════════════════════════════════════════════════════════
ALTER TABLE empresas          ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE empleados         ENABLE ROW LEVEL SECURITY;
ALTER TABLE facturas          ENABLE ROW LEVEL SECURITY;
ALTER TABLE retenciones       ENABLE ROW LEVEL SECURITY;
ALTER TABLE nomina_periodos   ENABLE ROW LEVEL SECURITY;
ALTER TABLE nomina_empleados  ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos        ENABLE ROW LEVEL SECURITY;
ALTER TABLE contratos         ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas           ENABLE ROW LEVEL SECURITY;
ALTER TABLE consentimientos   ENABLE ROW LEVEL SECURITY;

-- Helper: get empresa_id for the authenticated user
CREATE OR REPLACE FUNCTION my_empresa_id()
RETURNS uuid
LANGUAGE sql STABLE
AS $$
  SELECT empresa_id FROM perfiles WHERE id = auth.uid()
$$;

-- Perfiles: each user sees/edits only their own row
CREATE POLICY "perfiles_own" ON perfiles
  FOR ALL USING (id = auth.uid());

-- Empresas: user sees their own empresa
CREATE POLICY "empresas_own" ON empresas
  FOR ALL USING (id = my_empresa_id());

-- All other tables: users see only records from their empresa
CREATE POLICY "empleados_empresa"        ON empleados        FOR ALL USING (empresa_id = my_empresa_id());
CREATE POLICY "facturas_empresa"         ON facturas         FOR ALL USING (empresa_id = my_empresa_id());
CREATE POLICY "retenciones_empresa"      ON retenciones      FOR ALL USING (empresa_id = my_empresa_id());
CREATE POLICY "nomina_periodos_empresa"  ON nomina_periodos  FOR ALL USING (empresa_id = my_empresa_id());
CREATE POLICY "documentos_empresa"       ON documentos       FOR ALL USING (empresa_id = my_empresa_id());
CREATE POLICY "contratos_empresa"        ON contratos        FOR ALL USING (empresa_id = my_empresa_id());
CREATE POLICY "alertas_empresa"          ON alertas          FOR ALL USING (empresa_id = my_empresa_id());
CREATE POLICY "consentimientos_empresa"  ON consentimientos  FOR ALL USING (empresa_id = my_empresa_id());

-- nomina_empleados: accessible if the parent periodo belongs to user's empresa
CREATE POLICY "nomina_empleados_empresa" ON nomina_empleados
  FOR ALL USING (
    periodo_id IN (SELECT id FROM nomina_periodos WHERE empresa_id = my_empresa_id())
  );

-- ── Indexes for performance ─────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_empleados_empresa    ON empleados(empresa_id);
CREATE INDEX IF NOT EXISTS idx_facturas_empresa     ON facturas(empresa_id);
CREATE INDEX IF NOT EXISTS idx_facturas_fecha       ON facturas(empresa_id, fecha DESC);
CREATE INDEX IF NOT EXISTS idx_retenciones_empresa  ON retenciones(empresa_id);
CREATE INDEX IF NOT EXISTS idx_nomina_empresa       ON nomina_periodos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_documentos_empleado  ON documentos(empleado_id);
CREATE INDEX IF NOT EXISTS idx_contratos_empresa    ON contratos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_alertas_empresa_prio ON alertas(empresa_id, prioridad);
CREATE INDEX IF NOT EXISTS idx_alertas_leida        ON alertas(empresa_id, leida);
