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
      <div className={styles.group}>
        <p className={styles.groupLabel}>Image Mode</p>
        <div className={styles.segmented} role="radiogroup" aria-label="Image mode">
          {(["light", "dark"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              className={`${styles.segmentButton} ${imageMode === mode ? styles.segmentButtonActive : ""}`}
              aria-pressed={imageMode === mode}
              onClick={() => onChangeImageMode(mode)}
            >
              {mode === "light" ? "Light" : "Dark"}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
