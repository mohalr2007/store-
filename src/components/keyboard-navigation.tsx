"use client";

import { useEffect } from "react";

export function KeyboardNavigation() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        const target = e.target as HTMLElement;
        if (
          target &&
          (target.tagName === "INPUT" ||
            target.tagName === "SELECT" ||
            target.tagName === "TEXTAREA")
        ) {
          // Allow default behavior for submit buttons or textareas
          if (
            (target as HTMLInputElement).type === "submit" ||
            (target as HTMLInputElement).type === "button" ||
            target.tagName === "TEXTAREA"
          ) {
            return;
          }

          e.preventDefault();

          // Get all inputs, selects, textareas, and buttons that are visible and enabled
          const focusable = Array.from(
            document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLButtonElement>(
              "input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]):not([type=submit])"
            )
          ).filter((el) => {
            const style = window.getComputedStyle(el);
            return (
              style.display !== "none" &&
              style.visibility !== "hidden" &&
              el.tabIndex !== -1
            );
          });

          const index = focusable.indexOf(target as any);
          if (index > -1 && index < focusable.length - 1) {
            const nextEl = focusable[index + 1];
            nextEl.focus();
            if (nextEl.tagName === "INPUT") {
              (nextEl as HTMLInputElement).select?.();
            }
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return null;
}
