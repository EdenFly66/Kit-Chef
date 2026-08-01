import { NextResponse } from "next/server";
import { usuarioDesdeRequest } from "@/lib/supabase/api-auth";

export async function POST(request: Request) {
  const auth = await usuarioDesdeRequest(request);
  if (!auth) {
    return NextResponse.json(
      { error: { codigo: "no_autenticado", mensaje: "Se requiere sesión." } },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);
  const leccionesLeidas: unknown = body?.lecciones_leidas;

  if (!Array.isArray(leccionesLeidas) || !leccionesLeidas.every((id) => typeof id === "string")) {
    return NextResponse.json(
      { error: { codigo: "body_invalido", mensaje: "Se espera { lecciones_leidas: string[] }." } },
      { status: 400 }
    );
  }

  if (leccionesLeidas.length === 0) {
    return NextResponse.json({ migradas: 0 });
  }

  const fecha_leido = new Date().toISOString();
  const filas = leccionesLeidas.map((leccion_id) => ({
    usuario_id: auth.user.id,
    leccion_id,
    leido: true,
    fecha_leido,
  }));

  const { error } = await auth.supabase
    .from("progreso_lecciones")
    .upsert(filas, { onConflict: "usuario_id,leccion_id" });

  if (error) {
    return NextResponse.json(
      { error: { codigo: "error_migracion", mensaje: error.message } },
      { status: 400 }
    );
  }

  return NextResponse.json({ migradas: filas.length });
}
