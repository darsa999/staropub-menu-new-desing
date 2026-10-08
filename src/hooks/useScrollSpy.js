import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Custom hook for two-way synchronized scrolling (Scrollspy)
 * @param {Array<string>} sectionIds - List of section IDs to observe
 * @param {number} offset - Pixel offset from top for sticky header/tabs (default 140px)
 */
export function useScrollSpy(sectionIds = [], offset = 140) {
  const [activeId, setActiveId] = useState(sectionIds[0] || "");
  const isProgrammaticScrollRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // Scroll listener with bounding rect detection for accuracy across all section heights
  useEffect(() => {
    if (!sectionIds || sectionIds.length === 0) return;

    const handleScroll = () => {
      // Don't override activeId while programmatic smooth scrolling is executing
      if (isProgrammaticScrollRef.current) return;

      const scrollPosition = window.scrollY + offset + 20;

      // Find the last section that has scrolled past the trigger threshold
      let currentActive = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            currentActive = id;
          }
        }
      }

      // Check if user scrolled to the very bottom of the page
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 50
      ) {
        currentActive = sectionIds[sectionIds.length - 1];
      }

      setActiveId(currentActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [sectionIds, offset]);

  // Programmatic smooth scroll to a section by ID
  const scrollToSection = useCallback(
    (id) => {
      const el = document.getElementById(id);
      if (!el) return;

      setActiveId(id);
      isProgrammaticScrollRef.current = true;

      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth",
      });

      // Clear programmatic flag after smooth scroll finishes
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 700);
    },
    [offset]
  );

  return {
    activeId,
    setActiveId,
    scrollToSection,
  };
}
