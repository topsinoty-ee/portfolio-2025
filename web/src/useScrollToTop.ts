import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

export function useScrollToTop() {
  const [location] = useLocation();
  const previousPath = useRef<string | null>(null);

  if (previousPath.current === null) {
    previousPath.current = location;
  }

  useEffect(() => {
    if (previousPath.current !== location) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      previousPath.current = location;
    }
  }, [location]);
}
