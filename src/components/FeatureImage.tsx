"use client";

interface FeatureImageProps {
  src: string;
  alt: string;
}

export default function FeatureImage({ src, alt }: FeatureImageProps) {
  return (
    <div className="relative h-48 w-full overflow-hidden rounded-lg bg-slate-100 mb-4">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
        }}
      />
    </div>
  );
}

