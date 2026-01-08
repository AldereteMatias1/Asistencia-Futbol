CREATE SCHEMA IF NOT EXISTS mydb;
SET search_path TO mydb;

-- ===== ENUMS =====
DO $$ BEGIN
  CREATE TYPE estado_participacion AS ENUM ('PRESENTE', 'BAJA');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE estado_partido AS ENUM ('PROGRAMADO', 'EN_JUEGO', 'FINALIZADO', 'CANCELADO');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE ganador_partido AS ENUM ('A', 'B', 'EMPATE', 'PENDIENTE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE equipo_lado AS ENUM ('A', 'B');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ===== jugadores =====
-- Si jugadores ya existe en otro módulo, NO la crees acá.
-- La dejo por si querés probar rápido. Si ya existe, borrá este bloque.
CREATE TABLE IF NOT EXISTS jugadores (
  id_jugador BIGSERIAL PRIMARY KEY,
  nombre_jugador VARCHAR(45),
  apellido_jugador VARCHAR(45),
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- ===== partidos =====
CREATE TABLE IF NOT EXISTS partidos (
  id_partido BIGSERIAL PRIMARY KEY,

  fecha_hora TIMESTAMPTZ NOT NULL,
  cancha TEXT NOT NULL,

  estado estado_partido NOT NULL DEFAULT 'PROGRAMADO',
  ganador ganador_partido NOT NULL DEFAULT 'PENDIENTE',

  equipo_a_nombre TEXT,
  equipo_b_nombre TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- coherencia: si FINALIZADO => ganador != PENDIENTE, sino ganador = PENDIENTE
  CONSTRAINT chk_ganador_vs_estado
    CHECK (
      (estado = 'FINALIZADO' AND ganador <> 'PENDIENTE')
      OR (estado <> 'FINALIZADO' AND ganador = 'PENDIENTE')
    )
);

-- ===== participaciones =====
CREATE TABLE IF NOT EXISTS participaciones (
  id_participacion BIGSERIAL PRIMARY KEY,

  jugador_id BIGINT NOT NULL REFERENCES jugadores(id_jugador) ON DELETE RESTRICT,
  partido_id BIGINT NOT NULL REFERENCES partidos(id_partido) ON DELETE CASCADE,

  equipo equipo_lado, -- puede ser NULL si todavía no asignaste equipo
  estado estado_participacion NOT NULL DEFAULT 'PRESENTE',

  anotado_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  baja_at TIMESTAMPTZ,
  comentarios TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- 1 jugador = 1 fila por partido (clave para tu flujo)
  CONSTRAINT uq_partido_jugador UNIQUE (partido_id, jugador_id),

  -- si BAJA => baja_at NOT NULL; si PRESENTE => baja_at NULL
  CONSTRAINT chk_baja_at
    CHECK (
      (estado = 'BAJA' AND baja_at IS NOT NULL)
      OR (estado = 'PRESENTE' AND baja_at IS NULL)
    )
);

-- ===== índices útiles =====
CREATE INDEX IF NOT EXISTS idx_partidos_fecha ON partidos(fecha_hora);
CREATE INDEX IF NOT EXISTS idx_participaciones_partido ON participaciones(partido_id);
CREATE INDEX IF NOT EXISTS idx_participaciones_jugador ON participaciones(jugador_id);
CREATE INDEX IF NOT EXISTS idx_participaciones_estado ON participaciones(estado);
