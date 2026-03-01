"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { buildAgentReply } from "@/lib/agent-replies";
import { PROMPTS, SKILLS } from "@/lib/showcase-data";
import { pickRandomPrompt } from "@/lib/random-prompt";
import type { ChatMessage, ImageMode, PromptDef, SkillDef, SkillId } from "@/lib/showcase-types";

import { ChatPanel } from "./ChatPanel";
import { ControlMenu } from "./ControlMenu";
import styles from "./ShowcaseShell.module.css";

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const INITIAL_PROMPT = pickRandomPrompt(PROMPTS);

const SKILLS_BY_ID: Record<SkillId, SkillDef> = SKILLS.reduce(
  (acc, skill) => {
    acc[skill.id] = skill;
    return acc;
  },
  {} as Record<SkillId, SkillDef>
);

export function ShowcaseShell() {
  const [imageMode, setImageMode] = useState<ImageMode>("dark");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: createId(),
      role: "user",
      text: "Please install skill from GitHub path: sorphwer/json-render-cli -> npm/skills/use-json-render-cli"
    },
    {
      id: createId(),
      role: "agent",
      text: "Done. use-json-render-cli is installed from npm/skills. It routes to the right template automatically."
    }
  ]);
  const [currentPrompt, setCurrentPrompt] = useState<PromptDef | null>(INITIAL_PROMPT);
  const [isSending, setIsSending] = useState(false);

  const imageModeRef = useRef(imageMode);
  const lastSentPromptIdRef = useRef<string | undefined>(undefined);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    imageModeRef.current = imageMode;
  }, [imageMode]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSend = useCallback(() => {
    if (!currentPrompt || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      text: currentPrompt.text,
      promptId: currentPrompt.id,
      skillId: currentPrompt.skillId
    };

    const thinkingMessageId = createId();

    const thinkingMessage: ChatMessage = {
      id: thinkingMessageId,
      role: "thinking",
      promptId: currentPrompt.id,
      skillId: currentPrompt.skillId
    };

    setMessages((prev) => [...prev, userMessage, thinkingMessage]);
    setIsSending(true);

    const delay = 1200 + Math.floor(Math.random() * 1001);

    timeoutRef.current = window.setTimeout(() => {
      setMessages((prev) =>
        prev.map((message) => {
          if (message.id !== thinkingMessageId) {
            return message;
          }

          return {
            id: createId(),
            role: "agent",
            promptId: currentPrompt.id,
            skillId: currentPrompt.skillId,
            text: buildAgentReply(currentPrompt),
            imageMode: imageModeRef.current
          };
        })
      );

      lastSentPromptIdRef.current = currentPrompt.id;
      setCurrentPrompt(pickRandomPrompt(PROMPTS, currentPrompt.id));
      setIsSending(false);
    }, delay);
  }, [currentPrompt, isSending]);

  const currentPromptText = currentPrompt?.text ?? "Prompt ready";
  const canSend = Boolean(currentPrompt);

  return (
    <div className={styles.shell}>
      <ChatPanel
        messages={messages}
        currentPromptText={currentPromptText}
        canSend={canSend}
        isSending={isSending}
        skillsById={SKILLS_BY_ID}
        onSend={handleSend}
      />
      <ControlMenu imageMode={imageMode} onChangeImageMode={setImageMode} />
    </div>
  );
}
