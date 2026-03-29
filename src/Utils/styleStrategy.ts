export const createStyleStrategy = (tw?: string, css?: React.CSSProperties) => {
  // Pre-process Tailwind classes into an array once
  const twClasses = tw ? tw.split(" ").filter(Boolean) : [];
  const cssEntries = css ? Object.entries(css) : [];

  let prevEl: HTMLElement | null = null;

  return {
    apply: (el: HTMLElement | null) => {
      if (!el) return;
      prevEl = el
      if (twClasses.length) el.classList.add(...twClasses);
      if (cssEntries.length) {
        cssEntries.forEach(([key, val]) => (el.style as any)[key] = val);
      }
      // Default fallback if nothing is provided
      if (!twClasses.length && !cssEntries.length) el.classList.add("bg-blue-100");
    },
    // remove: (el: HTMLElement | null) => {
    //   if (!el) return;
    //   if (twClasses.length) el.classList.remove(...twClasses);
    //   if (cssEntries.length) {
    //     cssEntries.forEach(([key]) => (el.style as any)[key] = "");
    //   }
    //   if (!twClasses.length && !cssEntries.length) el.classList.remove("bg-blue-100");
    // }
    remove: () => {
      if (!prevEl) return;
      if (twClasses.length) prevEl.classList.remove(...twClasses);
      if (cssEntries.length) {
        cssEntries.forEach(([key]) => (prevEl?.style as any)[key] = "");
      }
      if (!twClasses.length && !cssEntries.length) prevEl.classList.remove("bg-blue-100");
      prevEl = null
    },
    swap: (nextEl: HTMLElement | null) => {
      // Use rAF to ensure the browser batches these changes 
      // before the next screen repaint
      window.requestAnimationFrame(() => {
        // 1. Clean up previous
        if (prevEl) {
          if (twClasses.length) prevEl.classList.remove(...twClasses);
          if (cssEntries.length) {
            cssEntries.forEach(([key]) => (prevEl!.style as any)[key] = "");
          }
          if (!twClasses.length && !cssEntries.length) prevEl.classList.remove("bg-blue-100");
        }

        // 2. Apply to next
        if (nextEl) {
          if (twClasses.length) nextEl.classList.add(...twClasses);
          if (cssEntries.length) {
            cssEntries.forEach(([key, val]) => (nextEl.style as any)[key] = val);
          }
          if (!twClasses.length && !cssEntries.length) nextEl.classList.add("bg-blue-100");
        }

        prevEl = nextEl;
      });
    }
  };
};