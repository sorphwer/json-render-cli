"use client";

import { Children, startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import Lenis from "lenis";
import Snap from "lenis/snap";

import styles from "./DeckScroller.module.css";

interface DeckScrollerProps {
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }

  return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

export function DeckScroller({ className, ariaLabel, children }: DeckScrollerProps) {
  const deckRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const snapRef = useRef<Snap | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const slideCount = useMemo(() => Children.toArray(children).length, [children]);

  const setActive = useCallback((index: number) => {
    startTransition(() => {
      setActiveIndex((prev) => (prev === index ? prev : index));
    });
  }, []);

  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const lenis = new Lenis({
      wrapper: deck,
      content: deck,
      autoRaf: true,
      smoothWheel: !reduceMotion.matches,
      duration: reduceMotion.matches ? 0 : 1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      prevent: (node) => isEditableTarget(node),
    });
    lenisRef.current = lenis;

    // Collect slice elements for snap points.
    const slices = Array.from(deck.children).filter(
      (node): node is HTMLElement => node instanceof HTMLElement && node.hasAttribute("data-slice")
    );

    const snap = new Snap(lenis, {
      type: "mandatory",
      duration: reduceMotion.matches ? 0 : 1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      debounce: 100,
      onSnapComplete: (item) => {
        if (item.index != null) {
          setActive(item.index);
        }
      },
    });
    snapRef.current = snap;

    // Register each slice as a snap element.
    const removeElements = slices.map((slice) =>
      snap.addElement(slice, { align: ["start"] })
    );

    // Sync initial active index.
    setActive(0);

    // Keyboard navigation.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || isEditableTarget(event.target)) {
        return;
      }

      if (event.key === "ArrowUp" || event.key === "PageUp" || (event.key === " " && event.shiftKey)) {
        event.preventDefault();
        snap.previous();
        return;
      }

      if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        snap.next();
      }
    };

    // Listen to reduce-motion changes.
    const onMotionChange = () => {
      const reduced = reduceMotion.matches;
      lenis.options.smoothWheel = !reduced;
      lenis.options.duration = reduced ? 0 : 1;
    };

    window.addEventListener("keydown", onKeyDown);
    reduceMotion.addEventListener("change", onMotionChange);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      reduceMotion.removeEventListener("change", onMotionChange);
      for (const remove of removeElements) {
        remove();
      }
      snap.destroy();
      lenis.destroy();
      lenisRef.current = null;
      snapRef.current = null;
    };
  }, [setActive]);

  const goToSlide = useCallback((index: number) => {
    setActive(index);
    snapRef.current?.goTo(index);
  }, [setActive]);

  const scrollerClassName = className ? `${styles.scroller} ${className}` : styles.scroller;

  return (
    <div className={styles.root}>
      <div ref={deckRef} className={scrollerClassName} aria-label={ariaLabel}>
        {children}
      </div>

      {slideCount > 1 ? (
        <nav className={styles.rail} aria-label="Slide navigation">
          <ol className={styles.railList}>
            {Array.from({ length: slideCount }, (_, index) => {
              const isActive = index === activeIndex;
              const buttonClassName = isActive
                ? `${styles.railButton} ${styles.railButtonActive}`
                : styles.railButton;

              return (
                <li key={index}>
                  <button
                    type="button"
                    className={buttonClassName}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={isActive ? "step" : undefined}
                  >
                    <span className={styles.railBar} />
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      ) : null}
    </div>
  );
}
