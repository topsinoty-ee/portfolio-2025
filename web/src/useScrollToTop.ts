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

      console.log(`useScrollToTop triggered for path: ${cleanCurrentPath}, hash: ${hash}`);

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
        console.log(`Scrolling to element with ID: ${hash}`);

        const scrollToElement = () => {
          const element = document.getElementById(hash);
          if (!element) {
            console.warn(`Element with ID "${hash}" not found for scrollToTop.`);
            return false;
          }

          const rect = element.getBoundingClientRect();
          console.log(`Element rect:`, rect, `Window scrollY: ${window.scrollY}`);

          if (rect.height === 0 && rect.width === 0) {
            console.log(`Element not fully rendered yet, retrying...`);
            return false;
          }

          const offset = 80;
          const top = rect.top + window.scrollY - offset;

          console.log(
            `Calculated scroll position: ${top} (rect.top: ${rect.top}, scrollY: ${window.scrollY}, offset: ${offset})`,
          );

          try {
            window.scrollTo({ top, left: 0, ...optionsRef.current });
          } catch {
            window.scrollTo(0, top);
          }

          return true;
        };

        requestAnimationFrame(() => {
          if (!scrollToElement()) {
            setTimeout(() => {
              requestAnimationFrame(() => {
                if (!scrollToElement()) {
                  setTimeout(() => {
                    requestAnimationFrame(scrollToElement);
                  }, 200);
                }
              });
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
