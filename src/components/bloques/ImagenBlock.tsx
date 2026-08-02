import { ImagenPlaceholder } from "./ImagenPlaceholder";

export function ImagenBlock({
  url,
  caption,
  acento,
}: {
  url: string;
  caption?: string;
  acento?: string;
}) {
  return (
    <figure className="space-y-2">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={caption ?? ""}
          className="w-full rounded-lg border border-borde object-cover"
        />
      ) : (
        <ImagenPlaceholder acento={acento} />
      )}
      {caption && <figcaption className="text-center text-xs text-ink-dim">{caption}</figcaption>}
    </figure>
  );
}
