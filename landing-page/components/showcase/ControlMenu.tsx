import type { ImageMode, SkillDef, SkillId } from "@/lib/showcase-types";
import styles from "./ControlMenu.module.css";

interface ControlMenuProps {
  skills: SkillDef[];
  enabledSkills: Record<SkillId, boolean>;
  onToggleSkill: (skillId: SkillId) => void;
  imageMode: ImageMode;
  onChangeImageMode: (mode: ImageMode) => void;
}

export function ControlMenu({
  skills,
  enabledSkills,
  onToggleSkill,
  imageMode,
  onChangeImageMode
}: ControlMenuProps) {
  return (
    <aside className={styles.panel} aria-label="Showcase controls">
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

      <div className={styles.group}>
        <p className={styles.groupLabel}>Enabled Skills</p>
        <ul className={styles.skillList}>
          {skills.map((skill) => (
            <li key={skill.id} className={styles.skillItem}>
              <label className={styles.skillLabel} htmlFor={`skill-${skill.id}`}>
                <input
                  id={`skill-${skill.id}`}
                  className={styles.checkbox}
                  type="checkbox"
                  checked={enabledSkills[skill.id]}
                  onChange={() => onToggleSkill(skill.id)}
                />
                <span className={styles.skillName}>{skill.name}</span>
              </label>
              <p className={styles.skillDesc}>{skill.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
