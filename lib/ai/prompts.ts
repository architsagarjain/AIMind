/** Starter prompts surfaced in the empty state of the chat. */
export const STARTER_PROMPTS = [
  { label: "Why Masters' Union?", icon: 'GraduationCap' },
  { label: 'Why did you leave PwC?', icon: 'DoorOpen' },
  { label: 'How did ZenCabs scale?', icon: 'TrendingUp' },
  { label: 'What is your biggest startup lesson?', icon: 'Lightbulb' },
  { label: 'Tell me about yourself.', icon: 'User' },
  { label: 'How would you market a startup?', icon: 'Megaphone' },
] as const;

export type StarterPrompt = (typeof STARTER_PROMPTS)[number];
