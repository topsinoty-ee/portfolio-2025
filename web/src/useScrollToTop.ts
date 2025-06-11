import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

export function useScrollToTop(options: ScrollToOptions = { behavior: "smooth" }) {
  const [location] = useLocation();
  const previousPath = useRef<string>(location);
  const isInitialMount = useRef<boolean>(true);
  const scrollDisabled = useRef<boolean>(false);

  useEffect(() => {
    if (!scrollDisabled.current) return;

    const timeoutId = setTimeout(() => {
      scrollDisabled.current = false;
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [location]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (scrollDisabled.current) return;

    const currentPath = location.split(/[?#]/)[0];
    const prevPath = previousPath.current.split(/[?#]/)[0];
    if (currentPath === prevPath) return;

    if (window.scrollY === 0) return;

    try {
      window.scrollTo({
        top: 0,
        left: 0,
        ...options,
      });
    } catch (e) {
      window.scrollTo(0, 0);
    }

    previousPath.current = location;
  }, [location, options]);

  const disableScrollToTop = (duration: number = 1000) => {
    scrollDisabled.current = true;
    setTimeout(() => {
      scrollDisabled.current = false;
    }, duration);
  };

  return {
    disableScrollToTop,
  };
}
