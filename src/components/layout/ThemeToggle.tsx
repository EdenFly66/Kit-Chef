"use client";

import { useEffect, useState } from "react";

const CLAVE = "kitchef_tema";

export function ThemeToggle() {
  const [tema, setTema] = useState<"claro" | "oscuro" | null>(null);

  useEffect(() => {
    function leerTemaActual() {
      const guardado = window.localStorage.getItem(CLAVE);
      if (guardado === "claro" || guardado === "oscuro") return guardado;
      const prefiereOscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefiereOscuro ? "oscuro" : "claro";
    }
    // Se lee recién en el efecto (no en el estado inicial) a propósito: en
    // el servidor no hay window, así que el render inicial es null en
    // ambos lados. Resolver esto vía useState perezoso desincroniza el
    // primer render del cliente del HTML de servidor (hydration mismatch).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTema(leerTemaActual());
  }, []);

  function alternar() {
    const siguiente = tema === "oscuro" ? "claro" : "oscuro";
    setTema(siguiente);
    window.localStorage.setItem(CLAVE, siguiente);
    document.documentElement.setAttribute("data-theme", siguiente === "oscuro" ? "dark" : "light");
  }

  if (!tema) return <span className="h-8 w-8" />;

  return (
    <button
      onClick={alternar}
      aria-label={tema === "oscuro" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className="flex h-8 w-8 items-center justify-center border border-borde text-acero hover:text-foreground"
    >
      {tema === "oscuro" ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M20 14.5a8.5 8.5 0 0 1-11-11 8.5 8.5 0 1 0 11 11z" />
        </svg>
      )}
    </button>
  );
}
