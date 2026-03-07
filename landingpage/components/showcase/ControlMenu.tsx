import { MoonStars, Sun } from "@phosphor-icons/react";
import { useRef } from "react";
import type { WheelEvent as ReactWheelEvent } from "react";

import type { ImageMode } from "@/lib/showcase-types";
import styles from "./ControlMenu.module.css";

interface ControlMenuProps {
  imageMode: ImageMode;
  onChangeImageMode: (mode: ImageMode) => void;
}

export function ControlMenu({ imageMode, onChangeImageMode }: ControlMenuProps) {
  const panelRef = useRef<HTMLElement>(null);

  const handlePanelWheelCapture = (event: ReactWheelEvent<HTMLElement>) => {
    const panel = panelRef.current;
    if (!panel || event.ctrlKey) {
      return;
    }

    if (panel.scrollHeight <= panel.clientHeight + 1) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    let deltaY = event.deltaY;
    if (event.deltaMode === 1) {
      deltaY *= 16;
    } else if (event.deltaMode === 2) {
      deltaY *= panel.clientHeight;
    }

    panel.scrollTop += deltaY;
  };

  return (
    <aside
      ref={panelRef}
      className={styles.panel}
      aria-label="Showcase controls"
      onWheelCapture={handlePanelWheelCapture}
      data-wheel-scope="control"
    >
      <div className={styles.head}>
        <p className={styles.groupLabel}>Preview Theme</p>
        <p className={styles.groupDescription}>Switch the result card between light and dark without changing the prompt.</p>
      </div>

      <div className={styles.group}>
        <div className={styles.segmented} role="radiogroup" aria-label="Image mode">
          {(["light", "dark"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              className={`${styles.segmentButton} ${imageMode === mode ? styles.segmentButtonActive : ""}`}
              aria-pressed={imageMode === mode}
              onClick={() => onChangeImageMode(mode)}
            >
              {mode === "light" ? (
                <>
                  <Sun className={styles.segmentIcon} aria-hidden="true" weight="duotone" />
                  Light
                </>
              ) : (
                <>
                  <MoonStars className={styles.segmentIcon} aria-hidden="true" weight="duotone" />
                  Dark
                </>
              )}
            </button>
          ))}
        </div>
        <p className={styles.helper}>Only the exported preview changes. The selected prompt stays the same.</p>
      </div>
    </aside>
  );
}
