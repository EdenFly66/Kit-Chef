"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { supabase } from "@/lib/supabase/client";

export function SiteHeader() {
  const { user, loading } = useAuth();
  const nombre = (user?.user_metadata?.nombre as string | undefined) || user?.email;

  return (
    <header className="border-b border-borde bg-superficie">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-6 py-3">
        <Link href="/modulos" className="font-titulo text-lg font-semibold text-foreground">
          Kit-Chef
        </Link>

        {!loading && (
          <nav className="flex items-center gap-3 font-mono text-xs uppercase tracking-wide text-ink-dim">
            {user ? (
              <>
                <span>{nombre}</span>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="text-brasa hover:underline"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link href="/iniciar-sesion" className="hover:text-foreground">
                  Iniciar sesión
                </Link>
                <Link href="/registro" className="text-brasa hover:underline">
                  Registrarse
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
