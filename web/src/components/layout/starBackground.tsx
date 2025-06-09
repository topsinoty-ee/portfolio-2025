import React, { useMemo } from "react";

interface StarBackgroundProps {
  children?: React.ReactNode;
  starDensity?: number;
  starColors?: string[];
  animationSpeed?: number;
  className?: string;
}

const hexToRgb = (hex: string) => {
  const normalizedHex = hex.replace("#", "");
  const bigint = parseInt(normalizedHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
};

const generateStars = (count: number, starDensity: number, starColors: string[], size: number) => {
  return Array.from({ length: Math.floor(count * starDensity) }, () => {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const color = starColors[Math.floor(Math.random() * starColors.length)];
    const opacity = (Math.random() * 0.5 + 0.5).toFixed(2); // brighter stars
    const glowSize = size * (Math.random() * 5) + 5;
    return `${x}vw ${y}vh ${glowSize}px rgba(${hexToRgb(color)}, ${opacity})`;
  }).join(", ");
};

interface StarLayerProps {
  starCount: number;
  starDensity: number;
  starColors: string[];
  size: number;
  animationName: "sparkle" | "fall";
  animationDuration: number;
  zOffset: number;
  extraScale: number;
}

const StarLayer = ({
  starCount,
  starDensity,
  starColors,
  size,
  animationName,
  animationDuration,
  zOffset,
  extraScale,
}: StarLayerProps) => {
  const boxShadow = useMemo(
    () => generateStars(starCount, starDensity, starColors, size),
    [starCount, starDensity, starColors, size],
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 2 * size,
        height: 2 * size,
        borderRadius: "50%",
        background: "white",
        boxShadow,
        animation: `${animationName} ${animationDuration}s ${
          animationName === "fall" ? "linear" : "ease-in-out"
        } infinite ${animationName === "sparkle" ? "alternate" : "normal"}`,
        transform: `translateZ(${zOffset}px) scale(${extraScale})`,
        filter: `drop-shadow(0 0 ${size}px white)`,
        pointerEvents: "none",
      }}
    />
  );
};

export const StarBackground = ({
  children,
  starDensity = 1,
  starColors = ["#ffffff", "#aaaaaa"],
  animationSpeed = 0.5,
  className = "",
}: StarBackgroundProps) => {
  return (
    <div className={`relative h-screen w-full overflow-hidden -z-50 ${className}`}>
      {/* Star Layers */}
      <StarLayer
        starCount={300}
        starDensity={starDensity}
        starColors={starColors}
        size={1}
        animationName="sparkle"
        animationDuration={12}
        zOffset={-200}
        extraScale={1.2}
      />
      <StarLayer
        starCount={200}
        starDensity={starDensity}
        starColors={starColors}
        size={2}
        animationName="fall"
        animationDuration={320 / animationSpeed}
        zOffset={-400}
        extraScale={1.5}
      />
      <StarLayer
        starCount={100}
        starDensity={starDensity}
        starColors={starColors}
        size={3}
        animationName="sparkle"
        animationDuration={16}
        zOffset={-600}
        extraScale={2}
      />

      <div className="inset-0 flex items-center justify-center z-0">{children}</div>

      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) translateZ(0) scale(1);
          }
          100% {
            transform: translateY(100vh) translateZ(0) scale(1.05);
          }
        }

        @keyframes sparkle {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
};
