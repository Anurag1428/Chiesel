"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Hotspot {
  id: string;
  x: number;
  y: number;
  label: string;
  description: string;
}

interface ImageWithHotspotsProps {
  imageUrl: string;
  hotspots: Hotspot[];
}

export function ImageWithHotspots({
  imageUrl,
  hotspots,
}: ImageWithHotspotsProps) {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  return (
    <div className="relative w-full h-full">
      <Image
        src={imageUrl}
        alt="Analysis preview"
        width={800}
        height={600}
        className="w-full h-auto rounded-lg border border-border"
      />
      {hotspots.map((hotspot) => (
        <div key={hotspot.id}>
          <motion.button
            className="absolute w-8 h-8 bg-primary rounded-full border-2 border-primary-foreground shadow-lg cursor-pointer"
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() =>
              setActiveHotspot(
                activeHotspot === hotspot.id ? null : hotspot.id
              )
            }
          >
            <span className="text-primary-foreground text-xs font-bold">
              {hotspot.label}
            </span>
          </motion.button>
          <AnimatePresence>
            {activeHotspot === hotspot.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute bg-card border border-border rounded-lg p-3 shadow-xl z-10 max-w-xs"
                style={{
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y + 5}%`,
                  transform: "translateX(-50%)",
                }}
              >
                <p className="text-sm text-foreground font-semibold mb-1">
                  {hotspot.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {hotspot.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
