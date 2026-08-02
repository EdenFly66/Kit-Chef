import { NextResponse } from "next/server";
import { usuarioDesdeRequest } from "@/lib/supabase/api-auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ leccion_id: string }> }
) {
  const auth = await usuarioDesdeRequest(request);
  if (!auth) {
    return NextResponse.json(
      { error: { codigo: "no_autenticado", mensaje: "Se requiere sesión." } },
      { status: 401 }
    );
  }

  const { leccion_id } = await params;
  const fecha_leido = new Date().toISOString();

  const { data, error } = await auth.supabase
    .from("progreso_lecciones")
    .upsert(
      {
        usuario_id: auth.user.id,
        leccion_id,
        leido: true,
        fecha_leido,
      },
      { onConflict: "usuario_id,leccion_id" }
    )
    .select("leccion_id, leido, fecha_leido")
    .single();

  if (error) {
    return NextResponse.json(
      { error: { codigo: "error_progreso", mensaje: error.message } },
      { status: 400 }
    );
  }

  return NextResponse.json(data);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ leccion_id: string }> }
) {
  const auth = await usuarioDesdeRequest(request);
  if (!auth) {
    return NextResponse.json(
      { error: { codigo: "no_autenticado", mensaje: "Se requiere sesión." } },
      { status: 401 }
    );
  }

  const { leccion_id } = await params;

  const { data, error } = await auth.supabase
    .from("progreso_lecciones")
    .update({ leido: false, fecha_leido: null })
    .eq("usuario_id", auth.user.id)
    .eq("leccion_id", leccion_id)
    .select("leccion_id, leido")
    .single();

  if (error) {
    return NextResponse.json(
      { error: { codigo: "error_progreso", mensaje: error.message } },
      { status: 400 }
    );
  }

  return NextResponse.json(data);
}
