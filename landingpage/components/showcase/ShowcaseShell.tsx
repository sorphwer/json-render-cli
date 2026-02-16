"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { buildAgentReply } from "@/lib/agent-replies";
import { DEFAULT_ENABLED_SKILLS, PROMPTS, SKILLS } from "@/lib/showcase-data";
import { buildPromptPool, pickRandomPrompt } from "@/lib/random-prompt";
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

const INITIAL_PROMPT = pickRandomPrompt(buildPromptPool(PROMPTS, DEFAULT_ENABLED_SKILLS));

const SKILLS_BY_ID: Record<SkillId, SkillDef> = SKILLS.reduce(
  (acc, skill) => {
    acc[skill.id] = skill;
    return acc;
  },
  {} as Record<SkillId, SkillDef>
);

export function ShowcaseShell() {
  const [enabledSkills, setEnabledSkills] = useState<Record<SkillId, boolean>>(DEFAULT_ENABLED_SKILLS);
  const [imageMode, setImageMode] = useState<ImageMode>("dark");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: createId(),
      role: "user",
      text: "Please install skills from GitHub path: sorphwer/json-render-cli -> npm/skills/*"
    },
    {
      id: createId(),
      role: "agent",
      text: "Done. Skills are installed from npm/skills. Runtime will be bootstrapped automatically when rendering."
    }
  ]);
  const [currentPrompt, setCurrentPrompt] = useState<PromptDef | null>(INITIAL_PROMPT);
  const [isSending, setIsSending] = useState(false);

  const promptPool = useMemo(() => buildPromptPool(PROMPTS, enabledSkills), [enabledSkills]);

  const enabledSkillsRef = useRef(enabledSkills);
  const imageModeRef = useRef(imageMode);
  const lastSentPromptIdRef = useRef<string | undefined>(undefined);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    enabledSkillsRef.current = enabledSkills;
  }, [enabledSkills]);

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

  const handleToggleSkill = useCallback((skillId: SkillId) => {
    setEnabledSkills((prev) => {
      const next = {
        ...prev,
        [skillId]: !prev[skillId]
      };

      const nextPool = buildPromptPool(PROMPTS, next);
      setCurrentPrompt((existingPrompt) => {
        if (nextPool.length === 0) {
          return null;
        }

        if (existingPrompt && nextPool.some((prompt) => prompt.id === existingPrompt.id)) {
          return existingPrompt;
        }

        return pickRandomPrompt(nextPool, lastSentPromptIdRef.current);
      });

      return next;
    });
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
      const nextPool = buildPromptPool(PROMPTS, enabledSkillsRef.current);
      setCurrentPrompt(pickRandomPrompt(nextPool, currentPrompt.id));
      setIsSending(false);
    }, delay);
  }, [currentPrompt, isSending]);

  const currentPromptText = currentPrompt?.text ?? "Enable at least one skill";
  const canSend = Boolean(currentPrompt) && promptPool.length > 0;

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
      <ControlMenu
        skills={SKILLS}
        enabledSkills={enabledSkills}
        onToggleSkill={handleToggleSkill}
        imageMode={imageMode}
        onChangeImageMode={setImageMode}
      />
    </div>
  );
}
