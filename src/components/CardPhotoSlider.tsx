import React, { useEffect, useState } from "react";

interface Props {
  photos: string[];
  alt: string;
  intervalMs?: number;
  onClick?: (e: React.MouseEvent, index: number) => void;
  className?: string;
}

const CardPhotoSlider: React.FC<Props> = ({
  photos,
  alt,
  intervalMs = 3000,
  onClick,
  className = "w-full h-64 object-cover cursor-pointer hover:opacity-80 transition-all duration-300 border-2 border-gray-400 shadow-lg hover:shadow-xl hover:scale-105",
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % photos.length), intervalMs);
    return () => clearInterval(t);
  }, [photos.length, intervalMs]);

  if (photos.length === 0) return null;

  return (
    <div className="relative w-full">
      <img
        key={index}
        src={photos[index]}
        alt={alt}
        className={`${className} animate-fade-in`}
        onClick={(e) => onClick?.(e, index)}
      />
      {photos.length > 1 && (
        <>
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded pointer-events-none">
            {index + 1} / {photos.length}
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
            {photos.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${
                  i === index ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CardPhotoSlider;
