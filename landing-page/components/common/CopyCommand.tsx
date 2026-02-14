"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

import styles from "./CopyCommand.module.css";

type CopyState = "idle" | "copied" | "error";

interface CopyCommandProps {
  command: string;
  buttonClassName?: string;
  compact?: boolean;
}

interface FireworkParticle {
  angle: number;
  distance: number;
  delay: number;
  color: string;
}

const FIREWORK_PARTICLES: FireworkParticle[] = [
  { angle: -90, distance: 34, delay: 0, color: "#0070c9" },
  { angle: -60, distance: 30, delay: 12, color: "#0070c9" },
  { angle: -30, distance: 32, delay: 22, color: "#e83e8c" },
  { angle: 0, distance: 28, delay: 35, color: "#ffffff" },
  { angle: 30, distance: 31, delay: 18, color: "#0070c9" },
  { angle: 60, distance: 33, delay: 10, color: "#808080" },
  { angle: 90, distance: 30, delay: 0, color: "#0070c9" },
  { angle: 120, distance: 33, delay: 14, color: "#e83e8c" },
  { angle: 150, distance: 29, delay: 24, color: "#0070c9" },
  { angle: 180, distance: 27, delay: 30, color: "#ffffff" },
  { angle: 210, distance: 32, delay: 20, color: "#e83e8c" },
  { angle: 240, distance: 34, delay: 8, color: "#808080" }
];

async function writeToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback to execCommand below.
    }
  }

  if (typeof document === "undefined") {
    return false;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.appendChild(textarea);
  textarea.select();

  let success = false;
  try {
    success = document.execCommand("copy");
  } finally {
    textarea.remove();
  }

  return success;
}

export function CopyCommand({ command, buttonClassName, compact = false }: CopyCommandProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [fireworkBurstId, setFireworkBurstId] = useState(0);
  const textRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showTemporaryState = (state: CopyState) => {
    setCopyState(state);
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setCopyState("idle");
    }, 1600);
  };

  const handleCopy = async () => {
    const success = await writeToClipboard(command);
    showTemporaryState(success ? "copied" : "error");
    if (success) {
      setFireworkBurstId((prev) => prev + 1);
    }
  };

  const handleSelect = () => {
    if (!textRef.current || typeof window === "undefined") {
      return;
    }

    const selection = window.getSelection();
    if (!selection) {
      return;
    }

    const range = document.createRange();
    range.selectNodeContents(textRef.current);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={[
          styles.button,
          compact ? styles.buttonCompact : "",
          buttonClassName ?? "",
          copyState === "copied" ? styles.buttonCopied : "",
          copyState === "error" ? styles.buttonError : ""
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={handleCopy}
        onDoubleClick={compact ? undefined : handleSelect}
        aria-label={`Copy command: ${command}`}
      >
        {!compact && (
          <code ref={textRef} className={styles.commandText}>
            {command}
          </code>
        )}
        <span className={`${styles.copyChip} ${compact ? styles.copyChipCompact : ""}`} aria-hidden="true">
          {copyState === "copied" ? "Copied" : copyState === "error" ? "Retry" : "Copy"}
        </span>
      </button>
      <span className={styles.srOnly} role="status" aria-live="polite">
        {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : ""}
      </span>
      {fireworkBurstId > 0 && (
        <span key={fireworkBurstId} className={styles.fireworkLayer} aria-hidden="true">
          <span className={styles.fireworkCore} />
          <span className={styles.fireworkRing} />
          {FIREWORK_PARTICLES.map((particle, index) => (
            <span
              // Custom CSS variables power the radial burst animation.
              key={`${fireworkBurstId}-${index}`}
              className={styles.spark}
              style={
                {
                  "--spark-angle": `${particle.angle}deg`,
                  "--spark-distance": `${particle.distance}px`,
                  "--spark-delay": `${particle.delay}ms`,
                  "--spark-color": particle.color
                } as CSSProperties
              }
            />
          ))}
        </span>
      )}
    </div>
  );
}
