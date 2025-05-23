import { useEffect, useState } from "react";

export function useIntersection(element, config) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    if (!element?.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    }, config);

    const currentElement = element.current;
    observer.observe(currentElement);

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [element, config]);

  return isIntersecting;
}
