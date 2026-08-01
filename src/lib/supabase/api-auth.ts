import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Autentica una request de /api/v1/* usando el header Authorization: Bearer
 * (ver especificacion-api-app-cocina.md §"Principios generales"). Devuelve un
 * cliente Supabase con ese token — las queries que se hagan con él quedan
 * sujetas a RLS como ese usuario, sin service role key.
 */
export async function usuarioDesdeRequest(request: Request) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local"
    );
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return { user, supabase };
}
