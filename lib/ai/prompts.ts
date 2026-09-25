/**
 * Starter prompts for the chat's empty state.
 *
 * Chosen to cover the four things people actually want to know (the headline
 * numbers, the career pivot, how he thinks, and what he wants next), and each
 * one is answerable offline as well as live.
 */
export const STARTER_PROMPTS = [
  { label: 'How did you scale ZenCabs?' },
  { label: 'What did you do at PwC?' },
  { label: 'Why did you leave consulting?' },
  { label: 'Tell me about Cairros.' },
  { label: "Why Masters' Union?" },
  { label: 'What is your biggest lesson?' },
  { label: 'How would you market a startup?' },
  { label: 'What role are you looking for?' },
] as const;

export type StarterPrompt = (typeof STARTER_PROMPTS)[number];
