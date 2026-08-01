-- Módulo 1 test: tablas mínimas de contenido (modulos, lecciones)
-- Ver docs/esquema-base-datos-app-cocina.md.
-- Desviación puntual respecto al esquema documentado: lecciones.numero es
-- text (no numeric) y se agrega lecciones.orden (smallint) — "1.10" y "1.1"
-- colisionan como numeric, ver plan de esta prueba.

create table if not exists modulos (
  id uuid primary key default gen_random_uuid(),
  numero int not null,
  nombre text not null,
  slug text not null unique,
  descripcion text,
  es_premium boolean not null default false
);

create table if not exists lecciones (
  id uuid primary key default gen_random_uuid(),
  modulo_id uuid not null references modulos (id) on delete cascade,
  numero text not null,
  orden smallint not null,
  titulo text not null,
  slug text not null unique,
  contenido jsonb not null default '[]',
  imagen_url text,
  video_url text,
  tiene_quiz boolean not null default false
);

create index if not exists lecciones_modulo_id_idx on lecciones (modulo_id);

alter table modulos enable row level security;
alter table lecciones enable row level security;

create policy "Lectura pública de modulos"
  on modulos for select
  to anon, authenticated
  using (true);

create policy "Lectura pública de lecciones"
  on lecciones for select
  to anon, authenticated
  using (true);
