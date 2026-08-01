"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { getProgresoLocal, limpiarProgresoLocal } from "@/lib/progreso/local";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

async function migrarProgresoLocal(session: Session) {
  const leccionesLeidas = getProgresoLocal();
  if (leccionesLeidas.length === 0) return;

  const res = await fetch("/api/v1/progreso/migrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ lecciones_leidas: leccionesLeidas }),
  });

  if (res.ok) {
    limpiarProgresoLocal();
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, nuevaSesion) => {
      setSession(nuevaSesion);
      if (event === "SIGNED_IN" && nuevaSesion) {
        migrarProgresoLocal(nuevaSesion);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user: session?.user ?? null, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
