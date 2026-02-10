"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import type { ChatMessage, ImageMode, SkillDef, SkillId } from "@/lib/showcase-types";

import { ThinkingDots } from "./ThinkingDots";
import styles from "./ChatPanel.module.css";

interface ChatPanelProps {
  messages: ChatMessage[];
  currentPromptText: string;
  canSend: boolean;
  isSending: boolean;
  imageMode: ImageMode;
  skillsById: Record<SkillId, SkillDef>;
  onSend: () => void;
}

export function ChatPanel({
  messages,
  currentPromptText,
  canSend,
  isSending,
  imageMode,
  skillsById,
  onSend
}: ChatPanelProps) {
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const history = historyRef.current;
    if (!history) {
      return;
    }

    history.scrollTop = history.scrollHeight;
  }, [messages]);

  return (
    <div className={styles.panel}>
      <div className={styles.topBar}>
        <div className={styles.dotRow}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
        <p className={styles.title}>Skills Sandbox Chat</p>
      </div>

      <div className={styles.history} ref={historyRef} aria-live="polite">
        {messages.map((message) => {
          if (message.role === "thinking") {
            return (
              <div key={message.id} className={`${styles.messageRow} ${styles.agentRow}`}>
                <span className={`${styles.avatar} ${styles.agentAvatar}`} aria-hidden="true">
                  ✦
                </span>
                <div className={`${styles.bubble} ${styles.agentBubble}`}>
                  <ThinkingDots />
                </div>
              </div>
            );
          }

          if (message.role === "user") {
            return (
              <div key={message.id} className={`${styles.messageRow} ${styles.userRow}`}>
                <div className={`${styles.bubble} ${styles.userBubble}`}>{message.text}</div>
                <span className={`${styles.avatar} ${styles.userAvatar}`} aria-hidden="true">
                  U
                </span>
              </div>
            );
          }

          const skill = message.skillId ? skillsById[message.skillId] : undefined;

          if (skill) {
            const imageSrc = skill.imageByMode[imageMode];

            return (
              <div key={message.id} className={`${styles.messageRow} ${styles.agentRow}`}>
                <span className={`${styles.avatar} ${styles.agentAvatar}`} aria-hidden="true">
                  ✦
                </span>
                <div className={`${styles.bubble} ${styles.agentBubble} ${styles.imageBubble}`}>
                  <Image
                    src={imageSrc}
                    alt={`${skill.name} result preview`}
                    width={1100}
                    height={620}
                    className={styles.resultImage}
                    sizes="(max-width: 768px) 92vw, 60vw"
                  />
                </div>
              </div>
            );
          }

          return (
            <div key={message.id} className={`${styles.messageRow} ${styles.agentRow}`}>
              <span className={`${styles.avatar} ${styles.agentAvatar}`} aria-hidden="true">
                ✦
              </span>
              <div className={`${styles.bubble} ${styles.agentBubble}`}>{message.text}</div>
            </div>
          );
        })}
      </div>

      <div className={styles.composer}>
        <div className={styles.composerInner}>
          <textarea
            id="fake-prompt-input"
            className={styles.input}
            value={currentPromptText}
            readOnly
            rows={2}
            aria-label="Generated prompt"
          />
          <button
            type="button"
            className={styles.sendButton}
            onClick={onSend}
            disabled={!canSend || isSending}
          >
            {isSending ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
