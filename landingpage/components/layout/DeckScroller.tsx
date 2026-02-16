"use client";

import { Children, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import styles from "./DeckScroller.module.css";

interface DeckScrollerProps {
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }

  return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

export function DeckScroller({ className, ariaLabel, children }: DeckScrollerProps) {
  const deckRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef(0);
  const wheelResetTimerRef = useRef(0);
  const scrollFrameRef = useRef(0);
  const wheelAccumulatedRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const activeIndexRef = useRef(0);
  const reduceMotionRef = useRef<MediaQueryList | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const slideCount = useMemo(() => Children.toArray(children).length, [children]);

  const setActive = useCallback((index: number) => {
    activeIndexRef.current = index;
    setActiveIndex((prev) => (prev === index ? prev : index));
  }, []);

  const getSlices = useCallback(() => {
    const deck = deckRef.current;
    if (!deck) {
      return [];
    }

    return Array.from(deck.children).filter(
      (node): node is HTMLElement => node instanceof HTMLElement && node.hasAttribute("data-slice")
    );
  }, []);

  const getNearestSliceIndex = useCallback(() => {
    const deck = deckRef.current;
    const slices = getSlices();
    if (!deck || slices.length === 0) {
      return 0;
    }

    const top = deck.scrollTop;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    slices.forEach((slice, index) => {
      const distance = Math.abs(slice.offsetTop - top);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    return nearestIndex;
  }, [getSlices]);

  const animateToIndex = useCallback(
    (requestedIndex: number) => {
      const deck = deckRef.current;
      const slices = getSlices();
      if (!deck || slices.length === 0) {
        return;
      }

      const targetIndex = Math.max(0, Math.min(requestedIndex, slices.length - 1));
      const targetTop = slices[targetIndex]?.offsetTop ?? 0;
      const reduceMotion = reduceMotionRef.current?.matches ?? false;

      if (reduceMotion) {
        deck.scrollTop = targetTop;
        setActive(targetIndex);
        return;
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      const startTop = deck.scrollTop;
      const delta = targetTop - startTop;

      if (Math.abs(delta) < 1) {
        setActive(targetIndex);
        return;
      }

      const durationMs = 900;
      const startAt = performance.now();
      isAnimatingRef.current = true;
      setActive(targetIndex);

      const tick = (now: number) => {
        const elapsed = now - startAt;
        const progress = Math.min(1, elapsed / durationMs);
        const eased = easeInOutCubic(progress);
        deck.scrollTop = startTop + delta * eased;

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(tick);
          return;
        }

        isAnimatingRef.current = false;
        animationFrameRef.current = 0;
      };

      animationFrameRef.current = requestAnimationFrame(tick);
    },
    [getSlices, setActive]
  );

  const moveBy = useCallback(
    (step: number) => {
      if (isAnimatingRef.current) {
        return;
      }

      const slices = getSlices();
      if (slices.length === 0) {
        return;
      }

      const nextIndex = Math.max(0, Math.min(activeIndexRef.current + step, slices.length - 1));
      animateToIndex(nextIndex);
    },
    [animateToIndex, getSlices]
  );

  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) {
      return;
    }

    reduceMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncActiveFromScroll = () => {
      if (isAnimatingRef.current || scrollFrameRef.current) {
        return;
      }

      scrollFrameRef.current = requestAnimationFrame(() => {
        scrollFrameRef.current = 0;
        setActive(getNearestSliceIndex());
      });
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || isEditableTarget(event.target)) {
        return;
      }

      event.preventDefault();

      if (isAnimatingRef.current) {
        return;
      }

      wheelAccumulatedRef.current += event.deltaY;

      if (wheelResetTimerRef.current) {
        window.clearTimeout(wheelResetTimerRef.current);
      }

      wheelResetTimerRef.current = window.setTimeout(() => {
        wheelAccumulatedRef.current = 0;
      }, 140);

      if (Math.abs(wheelAccumulatedRef.current) < 48) {
        return;
      }

      const direction = wheelAccumulatedRef.current > 0 ? 1 : -1;
      wheelAccumulatedRef.current = 0;
      moveBy(direction);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || isEditableTarget(event.target)) {
        return;
      }

      if (event.key === "ArrowUp" || event.key === "PageUp" || (event.key === " " && event.shiftKey)) {
        event.preventDefault();
        moveBy(-1);
        return;
      }

      if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        moveBy(1);
      }
    };

    syncActiveFromScroll();
    deck.addEventListener("scroll", syncActiveFromScroll, { passive: true });
    deck.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", syncActiveFromScroll);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (scrollFrameRef.current) {
        cancelAnimationFrame(scrollFrameRef.current);
      }
      if (wheelResetTimerRef.current) {
        window.clearTimeout(wheelResetTimerRef.current);
      }
      deck.removeEventListener("scroll", syncActiveFromScroll);
      deck.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", syncActiveFromScroll);
    };
  }, [getNearestSliceIndex, moveBy, setActive]);

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
                    onClick={() => animateToIndex(index)}
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
