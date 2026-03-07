import styles from "./ThinkingDots.module.css";

export function ThinkingDots() {
  return (
    <span className={styles.wrap} aria-label="Render Agent is preparing a preview" role="status">
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </span>
  );
}
