"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getProgresoLocal, marcarLeidaLocal } from "@/lib/progreso/local";

/**
 * Fuente única de verdad para "¿qué lecciones de este set están leídas?".
 * Con sesión: lee/escribe contra progreso_lecciones (RLS + Bearer token).
 * Sin sesión: lee/escribe localStorage. El resto de la UI (dial, pip, botón)
 * no necesita saber cuál de las dos está pasando.
 */
export function useProgreso(leccionIds: string[]) {
  const { user, session, loading: authLoading } = useAuth();
  const [leidas, setLeidas] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const idsKey = leccionIds.join(",");

  useEffect(() => {
    if (authLoading) return;

    let cancelado = false;

    async function cargar() {
      if (!cancelado) setLoading(true);

      if (leccionIds.length === 0) {
        setLeidas(new Set());
        setLoading(false);
        return;
      }

      if (user) {
        const { data } = await supabase
          .from("progreso_lecciones")
          .select("leccion_id")
          .eq("usuario_id", user.id)
          .eq("leido", true)
          .in("leccion_id", leccionIds);

        if (!cancelado) {
          setLeidas(new Set((data ?? []).map((fila) => fila.leccion_id as string)));
          setLoading(false);
        }
      } else {
        const local = getProgresoLocal();
        if (!cancelado) {
          setLeidas(new Set(local.filter((id) => leccionIds.includes(id))));
          setLoading(false);
        }
      }
    }

    cargar();

    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, idsKey]);

  const marcarLeida = useCallback(
    async (leccionId: string) => {
      setLeidas((actuales) => new Set(actuales).add(leccionId));

      if (user && session) {
        await fetch(`/api/v1/progreso/${leccionId}/leido`, {
          method: "POST",
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
      } else {
        marcarLeidaLocal(leccionId);
      }
    },
    [user, session]
  );

  return { leidas, loading, marcarLeida };
}
