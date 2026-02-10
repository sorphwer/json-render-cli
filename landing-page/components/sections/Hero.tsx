import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero}>
      <p className={styles.kicker}>json-render-cli / Skills Runtime</p>
      <h1 className={styles.title}>Prompt-to-image workflows for every reporting moment.</h1>
      <p className={styles.subtitle}>
        json-render-cli packages reusable skills that transform structured prompts into production-grade PNG outputs.
        This page demonstrates the skill experience with a simulated agent conversation.
      </p>
      <div className={styles.actions}>
        <a href="#showcase" className={styles.primaryAction}>
          Try Interactive Showcase
        </a>
        <a href="#skills" className={styles.secondaryAction}>
          Explore Skill Catalog
        </a>
      </div>
    </section>
  );
}
