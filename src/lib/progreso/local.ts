const CLAVE = "kitchef_progreso_local";

export function getProgresoLocal(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CLAVE);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function marcarLeidaLocal(leccionId: string): void {
  if (typeof window === "undefined") return;
  const actuales = getProgresoLocal();
  if (actuales.includes(leccionId)) return;
  window.localStorage.setItem(CLAVE, JSON.stringify([...actuales, leccionId]));
}

export function limpiarProgresoLocal(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CLAVE);
}
