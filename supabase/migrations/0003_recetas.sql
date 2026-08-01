-- Recetas (Módulo 6 en adelante). Ver docs/esquema-base-datos-app-cocina.md §2.
-- Desviaciones puntuales respecto al esquema documentado (ver plan de esta
-- entrega): unique(receta_id, numero_paso) en receta_pasos y
-- unique(receta_id, ingrediente_id) en receta_ingredientes — necesarios para
-- que el seed pueda hacer upsert por conflicto en vez de duplicar filas.

create table if not exists recetas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  slug text not null unique,
  descripcion text,
  imagen_url text,
  tiempo_preparacion_min int,
  dificultad text check (dificultad in ('facil', 'media', 'dificil')),
  porciones int,
  modulo_id uuid references modulos (id) on delete set null
);

create table if not exists receta_pasos (
  id uuid primary key default gen_random_uuid(),
  receta_id uuid not null references recetas (id) on delete cascade,
  numero_paso int not null,
  instruccion text not null,
  tecnica_id uuid references lecciones (id) on delete set null,
  unique (receta_id, numero_paso)
);

create table if not exists ingredientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  categoria text,
  creado_desde_receta_id uuid references recetas (id) on delete set null
);

create table if not exists receta_ingredientes (
  id uuid primary key default gen_random_uuid(),
  receta_id uuid not null references recetas (id) on delete cascade,
  ingrediente_id uuid not null references ingredientes (id) on delete cascade,
  cantidad numeric,
  unidad text,
  unique (receta_id, ingrediente_id)
);

create table if not exists tags_dieta (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique
);

create table if not exists receta_tags_dieta (
  receta_id uuid not null references recetas (id) on delete cascade,
  tag_id uuid not null references tags_dieta (id) on delete cascade,
  primary key (receta_id, tag_id)
);

create index if not exists receta_ingredientes_ingrediente_id_idx on receta_ingredientes (ingrediente_id);
create index if not exists receta_pasos_tecnica_id_idx on receta_pasos (tecnica_id);

alter table recetas enable row level security;
alter table receta_pasos enable row level security;
alter table ingredientes enable row level security;
alter table receta_ingredientes enable row level security;
alter table tags_dieta enable row level security;
alter table receta_tags_dieta enable row level security;

create policy "Lectura pública de recetas" on recetas for select to anon, authenticated using (true);
create policy "Lectura pública de receta_pasos" on receta_pasos for select to anon, authenticated using (true);
create policy "Lectura pública de ingredientes" on ingredientes for select to anon, authenticated using (true);
create policy "Lectura pública de receta_ingredientes" on receta_ingredientes for select to anon, authenticated using (true);
create policy "Lectura pública de tags_dieta" on tags_dieta for select to anon, authenticated using (true);
create policy "Lectura pública de receta_tags_dieta" on receta_tags_dieta for select to anon, authenticated using (true);
