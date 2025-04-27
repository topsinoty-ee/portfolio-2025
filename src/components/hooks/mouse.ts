import { useEffect, useState } from "react";

interface MousePosition {
  x: number;
  y: number;
}

export function useMouseHook(smoothingFactor = 0.1) {
  const [rawMousePosition, setRawMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [smoothedMousePosition, setSmoothedMousePosition] =
    useState<MousePosition>({ x: 0, y: 0 });
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
    const x = (smoothedMousePosition.x / window.innerWidth) * 100;
    const y = (smoothedMousePosition.y / window.innerHeight) * 100;
    return `radial-gradient(circle at ${x}% ${y}%, var(--secondary) -10%, var(--card) -7.5%, var(--primary) -12.5%, transparent 10%)`;
  };

  return {
    mousePosition: smoothedMousePosition,
    scrollPosition,
    gradientPosition,
  };
}
