"use client";

import { useEffect, useRef } from "react";
import type { WheelEvent as ReactWheelEvent } from "react";

import type { ChatMessage, SkillDef, SkillId } from "@/lib/showcase-types";

import { ThinkingDots } from "./ThinkingDots";
import styles from "./ChatPanel.module.css";

interface ChatPanelProps {
  messages: ChatMessage[];
  currentPromptText: string;
  canSend: boolean;
  isSending: boolean;
  skillsById: Record<SkillId, SkillDef>;
  onSend: () => void;
}

export function ChatPanel({
  messages,
  currentPromptText,
  canSend,
  isSending,
  skillsById,
  onSend
}: ChatPanelProps) {
  const historyRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    const history = historyRef.current;
    if (!history) {
      return;
    }

    history.scrollTop = history.scrollHeight;
  };

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      scrollToBottom();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [messages]);

  const handlePanelWheelCapture = (event: ReactWheelEvent<HTMLDivElement>) => {
    const history = historyRef.current;
    if (!history || event.ctrlKey) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    let deltaY = event.deltaY;
    if (event.deltaMode === 1) {
      deltaY *= 16;
    } else if (event.deltaMode === 2) {
      deltaY *= history.clientHeight;
    }

    history.scrollTop += deltaY;
  };

  const handleResultImageLoad = () => {
    scrollToBottom();
  };

  /* Check whether previous message shares the same role (for grouping) */
  const isContinuation = (index: number): boolean => {
    if (index === 0) return false;
    const prev = messages[index - 1];
    const curr = messages[index];
    /* "thinking" is visually part of the agent group */
    const roleOf = (m: ChatMessage) => (m.role === "thinking" ? "agent" : m.role);
    return roleOf(prev) === roleOf(curr);
  };

  return (
    <div className={styles.panel} onWheelCapture={handlePanelWheelCapture} data-wheel-scope="chat">
      {/* Message history */}
      <div className={styles.history} ref={historyRef} aria-live="polite">
        {messages.map((message, index) => {
          const grouped = isContinuation(index);

          /* ---------- thinking indicator ---------- */
          if (message.role === "thinking") {
            return (
              <div
                key={message.id}
                className={`${styles.messageRow} ${grouped ? styles.grouped : ""}`}
              >
                {!grouped && (
                  <span className={`${styles.avatar} ${styles.agentAvatar}`} aria-hidden="true">
                    ✦
                  </span>
                )}
                <div className={styles.messageBody} style={grouped ? { paddingLeft: 52 } : undefined}>
                  {!grouped && (
                    <div className={styles.messageHeader}>
                      <span className={styles.usernameAgent}>Skill Agent</span>
                      <span className={styles.timestamp}>Today</span>
                    </div>
                  )}
                  <div className={styles.messageContent}>
                    <ThinkingDots />
                  </div>
                </div>
              </div>
            );
          }

          /* ---------- user message ---------- */
          if (message.role === "user") {
            return (
              <div
                key={message.id}
                className={`${styles.messageRow} ${grouped ? styles.grouped : ""}`}
              >
                {!grouped && (
                  <span className={`${styles.avatar} ${styles.userAvatar}`} aria-hidden="true">
                    U
                  </span>
                )}
                <div className={styles.messageBody} style={grouped ? { paddingLeft: 52 } : undefined}>
                  {!grouped && (
                    <div className={styles.messageHeader}>
                      <span className={styles.usernameUser}>You</span>
                      <span className={styles.timestamp}>Today</span>
                    </div>
                  )}
                  <div className={styles.messageContent}>{message.text}</div>
                </div>
              </div>
            );
          }

          /* ---------- agent message (with optional skill image) ---------- */
          const skill = message.skillId ? skillsById[message.skillId] : undefined;

          return (
            <div
              key={message.id}
              className={`${styles.messageRow} ${grouped ? styles.grouped : ""}`}
            >
              {!grouped && (
                <span className={`${styles.avatar} ${styles.agentAvatar}`} aria-hidden="true">
                  ✦
                </span>
              )}
              <div className={styles.messageBody} style={grouped ? { paddingLeft: 52 } : undefined}>
                {!grouped && (
                  <div className={styles.messageHeader}>
                    <span className={styles.usernameAgent}>Skill Agent</span>
                    {skill && <span className={styles.botBadge}>BOT</span>}
                    <span className={styles.timestamp}>Today</span>
                  </div>
                )}
                {message.text && <div className={styles.messageContent}>{message.text}</div>}
                {skill && message.imageMode && (
                  <div className={styles.imageWrapper}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={skill.imageByMode[message.imageMode]}
                      alt={`${skill.name} result preview`}
                      className={styles.resultImage}
                      loading="lazy"
                      onLoad={handleResultImageLoad}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Composer — Discord style */}
      <div className={styles.composer}>
        <div className={styles.composerInner}>
          <textarea
            id="fake-prompt-input"
            className={styles.input}
            value={currentPromptText}
            readOnly
            rows={2}
            placeholder="Message #skills-sandbox"
            aria-label="Generated prompt"
          />
          <button
            type="button"
            className={styles.sendButton}
            onClick={onSend}
            disabled={!canSend || isSending}
            aria-label="Send message"
          >
            {isSending ? "..." : "SEND"}
          </button>
        </div>
      </div>
    </div>
  );
}
