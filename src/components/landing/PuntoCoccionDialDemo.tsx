"use client";

import { useEffect, useRef, useState } from "react";
import { PuntoCoccionDial } from "@/components/progreso/PuntoCoccionDial";

export function PuntoCoccionDialDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProgreso(100);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center gap-3">
      <PuntoCoccionDial progreso={progreso} size="lg" />
      <p className="font-mono text-xs uppercase tracking-wide text-ink-dim">
        Así se ve avanzar en una lección
      </p>
    </div>
  );
}
