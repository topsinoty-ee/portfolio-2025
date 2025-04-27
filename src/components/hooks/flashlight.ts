import { useEffect, useState } from "react";
import { useFlashLightContext } from "../ui/flashlightContext";

interface MousePosition {
  x: number;
  y: number;
}

export function useFlashlight(smoothingFactor = 0.1) {
  const { enabled } = useFlashLightContext();

  const [rawMousePosition, setRawMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [smoothedMousePosition, setSmoothedMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setRawMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const updateSmoothedPosition = () => {
      setSmoothedMousePosition((prev) => ({
        x: prev.x + (rawMousePosition.x - prev.x) * smoothingFactor,
        y: prev.y + (rawMousePosition.y - prev.y) * smoothingFactor,
      }));
      animationFrameId = requestAnimationFrame(updateSmoothedPosition);
    };

    animationFrameId = requestAnimationFrame(updateSmoothedPosition);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [rawMousePosition, smoothingFactor]);

  const gradientPosition = () => {
    if (!enabled) return "";

    const x = (smoothedMousePosition.x / window.innerWidth) * 100;
    const y = (smoothedMousePosition.y / window.innerHeight) * 100;

    return `radial-gradient(circle at ${x}% ${y}%, var(--secondary) -50%, var(--card) -50%, var(--primary) -50%, transparent 15%)`;
  };

  return {
    mousePosition: smoothedMousePosition,
    scrollPosition,
    gradientPosition,
  };
}
