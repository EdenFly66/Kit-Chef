export function TablaBlock({
  titulo,
  columnas,
  filas,
}: {
  titulo: string;
  columnas: string[];
  filas: string[][];
}) {
  return (
    <div className="space-y-2">
      <p className="font-mono text-xs font-medium uppercase tracking-wide text-acero">
        {titulo}
      </p>
      <div className="overflow-x-auto border border-borde">
        <table className="w-full min-w-full text-left text-sm">
          <thead className="bg-superficie-2">
            <tr>
              {columnas.map((col) => (
                <th key={col} className="px-3 py-2 font-semibold">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((fila, i) => (
              <tr key={i} className="border-t border-borde">
                {fila.map((celda, j) => (
                  <td key={j} className="px-3 py-2">
                    {celda}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
