-- Auth opcional + progreso "leído".
-- Ver docs/esquema-base-datos-app-cocina.md.
-- Desviaciones puntuales respecto al esquema documentado (ver plan de esta
-- entrega): progreso_lecciones agrega unique(usuario_id, leccion_id) para
-- soportar upsert; perfiles se crea automáticamente vía trigger porque
-- progreso_lecciones.usuario_id referencia perfiles, no auth.users.

create table if not exists perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text,
  plan text not null default 'free' check (plan in ('free', 'premium')),
  fecha_registro timestamptz not null default now()
);

alter table perfiles enable row level security;

create policy "Usuario lee su propio perfil"
  on perfiles for select
  to authenticated
  using (auth.uid() = id);

-- Crea la fila de perfiles automáticamente al registrarse (security definer:
-- corre con los privilegios del dueño de la función, no del usuario nuevo,
-- así que no depende de una policy de insert en perfiles).
create or replace function public.crear_perfil_nuevo_usuario()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfiles (id, nombre)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'nombre', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.crear_perfil_nuevo_usuario();

create type calificacion as enum ('aprobado', 'bien', 'muy_bien', 'excelente');

create table if not exists progreso_lecciones (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references perfiles (id) on delete cascade,
  leccion_id uuid not null references lecciones (id) on delete cascade,
  leido boolean not null default false,
  fecha_leido timestamptz,
  aprobado boolean not null default false,
  mejor_calificacion calificacion,
  fecha_aprobado timestamptz,
  unique (usuario_id, leccion_id)
);

create index if not exists progreso_lecciones_usuario_id_idx on progreso_lecciones (usuario_id);

alter table progreso_lecciones enable row level security;

create policy "Usuario lee su propio progreso"
  on progreso_lecciones for select
  to authenticated
  using (auth.uid() = usuario_id);

create policy "Usuario crea su propio progreso"
  on progreso_lecciones for insert
  to authenticated
  with check (auth.uid() = usuario_id);

create policy "Usuario actualiza su propio progreso"
  on progreso_lecciones for update
  to authenticated
  using (auth.uid() = usuario_id)
  with check (auth.uid() = usuario_id);
