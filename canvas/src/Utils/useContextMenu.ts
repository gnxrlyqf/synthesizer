import { useState, useEffect, useCallback } from "react";

export function useContextMenu() {
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);

  const close = useCallback(() => setMenu(null), []);

  useEffect(() => {
    // Listen for clicks and our custom "global close" signal
    window.addEventListener("click", close);
    window.addEventListener("closeAllModuleMenus", close);

    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("closeAllModuleMenus", close);
    };
  }, [close]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Force all other modules to close their menus
    window.dispatchEvent(new CustomEvent("closeAllModuleMenus"));

    // 2. Wait for the next tick to open this specific menu.
    // This prevents the current module from closing its own menu 
    // immediately after opening it.
    const { clientX: x, clientY: y } = e;
    requestAnimationFrame(() => {
      setMenu({ x, y });
    });
  };

  return { menu, setMenu, handleContextMenu };
}