"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { PasswordInput } from "@/components/forms/PasswordInput";
import { FormSkeleton } from "@/components/forms/FormSkeleton";

export default function RegistroPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [estado, setEstado] = useState<"idle" | "cargando" | "revisar_email" | "listo">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) router.replace("/modulos");
  }, [authLoading, user, router]);

  const formularioValido =
    nombre.trim() !== "" &&
    email.trim() !== "" &&
    password !== "" &&
    confirmarPassword !== "";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setEstado("cargando");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre } },
    });

    if (error) {
      setError(error.message);
      setEstado("idle");
      return;
    }

    // Sin confirmación de email de por medio, signUp ya devuelve sesión activa.
    setEstado(data.session ? "listo" : "revisar_email");
  }

  if (estado === "listo") {
    return (
      <main className="mx-auto w-full max-w-md px-6 py-16">
        <p className="text-foreground">Cuenta creada. Tu progreso ya quedó guardado.</p>
        <Link href="/modulos" className="mt-4 inline-block text-brasa hover:underline">
          Ir a los módulos →
        </Link>
      </main>
    );
  }

  if (estado === "revisar_email") {
    return (
      <main className="mx-auto w-full max-w-md px-6 py-16">
        <p className="text-foreground">
          Revisa tu correo ({email}) para confirmar la cuenta antes de iniciar sesión.
        </p>
      </main>
    );
  }

  if (authLoading) return <FormSkeleton campos={4} />;
  if (user) return null;

  return (
    <main className="mx-auto w-full max-w-md px-6 py-16">
      <h1 className="font-titulo text-2xl font-semibold text-foreground">Crear cuenta</h1>
      <p className="mt-2 text-sm text-ink-dim">
        Opcional — puedes seguir usando Kit-Chef sin registrarte. Regístrate solo si quieres
        guardar tu progreso en la nube.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-foreground">
            Nombre
          </label>
          <input
            id="nombre"
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 w-full rounded-md border border-borde bg-superficie px-3 py-2 text-sm text-foreground"
          />
        </div>
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
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={setPassword}
          />
        </div>
        <div>
          <label htmlFor="confirmar-password" className="block text-sm font-medium text-foreground">
            Confirmar contraseña
          </label>
          <PasswordInput
            id="confirmar-password"
            required
            minLength={6}
            autoComplete="new-password"
            value={confirmarPassword}
            onChange={setConfirmarPassword}
          />
        </div>

        {error && <p className="text-sm text-dorado">{error}</p>}

        <button
          type="submit"
          disabled={estado === "cargando" || !formularioValido}
          className="w-full rounded-md bg-brasa px-4 py-2 font-mono text-sm uppercase tracking-wide text-pergamino disabled:opacity-50"
        >
          {estado === "cargando" ? "Creando cuenta…" : "Crear cuenta"}
        </button>
      </form>

      <p className="mt-4 text-sm text-ink-dim">
        ¿Ya tienes cuenta?{" "}
        <Link href="/iniciar-sesion" className="text-brasa hover:underline">
          Inicia sesión
        </Link>
      </p>
    </main>
  );
}
