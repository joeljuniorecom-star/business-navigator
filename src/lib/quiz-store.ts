import { useSyncExternalStore } from "react";
import type { Answers, AnswerValue } from "@/data/types";

/**
 * Tiny answers store (module-level + localStorage).
 * Swap the persistence layer here to plug a backend later.
 */
const KEY = "business-fit-answers";

let state: Answers = {};
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function hydrateAnswers() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      state = JSON.parse(raw) as Answers;
      emit();
    }
  } catch {
    /* ignore */
  }
}

export const quizStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  get: () => state,
  set(id: string, value: AnswerValue) {
    state = { ...state, [id]: value };
    persist();
    emit();
  },
  reset() {
    state = {};
    persist();
    emit();
  },
};

const emptySnapshot: Answers = {};

export function useAnswers(): Answers {
  return useSyncExternalStore(quizStore.subscribe, quizStore.get, () => emptySnapshot);
}
