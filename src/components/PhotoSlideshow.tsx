import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

interface Props {
  photos: string[];
  startIndex?: number;
  onClose: () => void;
  intervalMs?: number;
}

const PhotoSlideshow: React.FC<Props> = ({ photos, startIndex = 0, onClose, intervalMs = 3000 }) => {
  const [index, setIndex] = useState(startIndex);
  const [playing, setPlaying] = useState(photos.length > 1);

  useEffect(() => setIndex(startIndex), [startIndex]);

  useEffect(() => {
    if (!playing || photos.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % photos.length), intervalMs);
    return () => clearInterval(t);
  }, [playing, photos.length, intervalMs]);

  const prev = () => setIndex((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setIndex((i) => (i + 1) % photos.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === " ") { e.preventDefault(); setPlaying((p) => !p); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [photos.length]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Photo {index + 1} of {photos.length}
          </DialogTitle>
        </DialogHeader>
        <div className="relative flex justify-center items-center bg-black/90 rounded-md overflow-hidden">
          <img
            key={index}
            src={photos[index]}
            alt={`Photo ${index + 1}`}
            className="max-w-full max-h-[70vh] object-contain animate-fade-in"
          />
          {photos.length > 1 && (
            <>
              <button
                aria-label="Previous"
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white p-2 shadow"
              >
                <ChevronLeft className="h-5 w-5 text-black" />
              </button>
              <button
                aria-label="Next"
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white p-2 shadow"
              >
                <ChevronRight className="h-5 w-5 text-black" />
              </button>
            </>
          )}
        </div>
        {photos.length > 1 && (
          <div className="flex items-center justify-between gap-3 pt-2">
            <div className="flex gap-1 overflow-x-auto">
              {photos.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-12 w-12 rounded border-2 overflow-hidden flex-shrink-0 ${
                    i === index ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={p} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => setPlaying((p) => !p)}>
              {playing ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
              {playing ? "Pause" : "Play"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PhotoSlideshow;
