import { SKILLS } from "@/lib/showcase-data";

import styles from "./Features.module.css";

export function Features() {
  return (
    <section id="skills" className={styles.section}>
      <div className={styles.head}>
        <p className={styles.kicker}>Skill Catalog</p>
        <h2 className={styles.title}>Five packaged skills, one consistent render pipeline.</h2>
      </div>

      <div className={styles.grid}>
        {SKILLS.map((skill) => (
          <article key={skill.id} className={styles.card}>
            <p className={styles.cardId}>{skill.id}</p>
            <h3 className={styles.cardTitle}>{skill.name}</h3>
            <p className={styles.cardDescription}>{skill.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
