'use client';

import { create } from 'zustand';

/**
 * Hands a question from the desktop's prompt panel to the Ask Archit window.
 *
 * The chat's conversation state lives inside the Chat component, which only
 * exists once its window is open, so the panel cannot call `send` directly.
 * It parks the question here and opens the window; the chat takes it once on
 * mount (or whenever a new one arrives) and sends it.
 */
interface ChatHandoff {
  pending: string | null;
  ask: (question: string) => void;
  take: () => string | null;
}

export const useChatHandoff = create<ChatHandoff>((set, get) => ({
  pending: null,
  ask: (question) => set({ pending: question }),
  take: () => {
    const q = get().pending;
    if (q) set({ pending: null });
    return q;
  },
}));
