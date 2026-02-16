import styles from "./ThinkingDots.module.css";

export function ThinkingDots() {
  return (
    <span className={styles.wrap} aria-label="Agent is thinking" role="status">
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </span>
  );
}
