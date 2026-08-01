import type { BloqueContenido } from "@/lib/types/database";
import { ParrafoBlock } from "./ParrafoBlock";
import { TipBlock } from "./TipBlock";
import { TablaBlock } from "./TablaBlock";
import { ImagenBlock } from "./ImagenBlock";

export function BloqueRenderer({ bloque }: { bloque: BloqueContenido }) {
  switch (bloque.tipo) {
    case "parrafo":
      return <ParrafoBlock texto={bloque.texto} />;
    case "tip":
      return <TipBlock titulo={bloque.titulo} texto={bloque.texto} />;
    case "tabla":
      return (
        <TablaBlock
          titulo={bloque.titulo}
          columnas={bloque.columnas}
          filas={bloque.filas}
        />
      );
    case "imagen":
      return <ImagenBlock url={bloque.url} caption={bloque.caption} />;
    default:
      return null;
  }
}
