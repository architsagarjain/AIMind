/**
 * Starter prompts for the chat's empty state.
 *
 * The context file's suggested chips (section 10) plus the questions recruiters
 * ask most (section 11). Each one is answerable offline as well as live.
 */
export const STARTER_PROMPTS = [
  { label: 'What did you build at ZenCabs?' },
  { label: 'Tell me about the AI tool at PwC' },
  { label: "Why Founder's Office?" },
  { label: 'Walk me through a problem you solved with data' },
  { label: 'What are you looking for next?' },
  { label: 'Are you a founder?' },
  { label: 'Why did you leave PwC?' },
  { label: 'How much experience do you have?' },
] as const;

export type StarterPrompt = (typeof STARTER_PROMPTS)[number];
