"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { PasswordInput } from "@/components/forms/PasswordInput";
import { FormSkeleton } from "@/components/forms/FormSkeleton";

export default function IniciarSesionPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) router.replace("/modulos");
  }, [authLoading, user, router]);

  const formularioValido = email.trim() !== "" && password !== "";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setCargando(false);
      return;
    }

    router.push("/modulos");
  }

  if (authLoading) return <FormSkeleton campos={2} />;
  if (user) return null;

  return (
    <main className="mx-auto w-full max-w-md px-6 py-16">
      <h1 className="font-titulo text-2xl font-semibold text-foreground">Iniciar sesión</h1>
      <p className="mt-2 text-sm text-ink-dim">
        Si tenías progreso guardado sin cuenta, se migra automáticamente al iniciar sesión.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-borde bg-superficie px-3 py-2 text-sm text-foreground"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground">
            Contraseña
          </label>
          <PasswordInput
            id="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
          />
        </div>

        {error && <p className="text-sm text-dorado">{error}</p>}

        <button
          type="submit"
          disabled={cargando || !formularioValido}
          className="w-full rounded-md bg-brasa px-4 py-2 font-mono text-sm uppercase tracking-wide text-pergamino disabled:opacity-50"
        >
          {cargando ? "Ingresando…" : "Iniciar sesión"}
        </button>
      </form>

      <p className="mt-4 text-sm text-ink-dim">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="text-brasa hover:underline">
          Regístrate
        </Link>
      </p>
    </main>
  );
}
