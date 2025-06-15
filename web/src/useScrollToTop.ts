import { useCallback, useEffect, useRef } from "react";

export function useScrollToTop(options: ScrollToOptions = { behavior: "smooth" }) {
  const previousPath = useRef<string>(window.location.href);
  const isInitialMount = useRef<boolean>(true);
  const scrollDisabled = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleLocationChange = () => {
      const currentHref = window.location.href;
      const [currentPath, hash] = currentHref.split("#");
      const cleanCurrentPath = currentPath.split("?")[0];
      const cleanPrevPath = previousPath.current.split("#")[0].split("?")[0];

      if (isInitialMount.current) {
        isInitialMount.current = false;
        previousPath.current = currentHref;
        return;
      }

      if (scrollDisabled.current) {
        previousPath.current = currentHref;
        return;
      }

      if (hash) {
        const scrollToElement = () => {
          const element = document.getElementById(hash);
          if (!element) {
            return false;
          }

          const rect = element.getBoundingClientRect();
          if (rect.top === 0 && rect.left === 0 && rect.height === 0 && rect.width === 0) {
            return false;
          }

          const offset = 64;
          const top = window.pageYOffset + rect.top - offset;

          try {
            window.scrollTo({ top, left: 0, ...optionsRef.current });
          } catch {
            window.scrollTo(0, top);
            return true;
          }
          return true;
        };

        requestAnimationFrame(() => {
          if (!scrollToElement()) {
            setTimeout(() => {
              if (!scrollToElement()) {
                setTimeout(() => scrollToElement(), 200);
              }
            }, 50);
          }
        });
      } else if (cleanCurrentPath !== cleanPrevPath && window.scrollY !== 0) {
        requestAnimationFrame(() => {
          try {
            window.scrollTo({
              top: 0,
              left: 0,
              ...optionsRef.current,
            });
          } catch (e) {
            window.scrollTo(0, 0);
          }
        });
      }

      previousPath.current = currentHref;
    };

    window.addEventListener("popstate", handleLocationChange);

    const checkInterval = setInterval(() => {
      if (window.location.href !== previousPath.current) {
        handleLocationChange();
      }
    }, 100);
    handleLocationChange();

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      clearInterval(checkInterval);
    };
  }, []);

  const disableScrollToTop = useCallback((duration: number = 1000) => {
    scrollDisabled.current = true;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      scrollDisabled.current = false;
      timeoutRef.current = null;
    }, duration);
  }, []);

  return {
    disableScrollToTop,
  };
}
