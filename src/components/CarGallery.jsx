import { useState } from 'react';

export default function CarGallery({ images, alt }) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return (
      <div
        role="img"
        aria-label="No photos available"
        className="flex h-64 items-center justify-center rounded-lg bg-slate-200 text-6xl"
      >
        🚗
      </div>
    );
  }

  return (
    <div>
      <img
        src={images[selected]}
        alt={`${alt} photo ${selected + 1}`}
        className="h-64 w-full rounded-lg object-cover sm:h-96"
      />
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setSelected(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-pressed={i === selected}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded border-2 ${
                i === selected ? 'border-blue-600' : 'border-transparent'
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}