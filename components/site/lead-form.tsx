'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Intent = 'hiring' | 'consulting' | 'other';

const INTENT_EVENT = 'lead-intent';

/** A button that picks the form's intent and scrolls to it. */
export function IntentButton({ intent, className, children }: { intent: Intent; className?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        window.dispatchEvent(new CustomEvent(INTENT_EVENT, { detail: intent }));
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }}
    >
      {children}
    </button>
  );
}

const INTENTS: { id: Intent; label: string }[] = [
  { id: 'hiring', label: 'A full-time role' },
  { id: 'consulting', label: 'Consulting work' },
  { id: 'other', label: 'Something else' },
];

const field =
  'mt-1.5 w-full rounded-xl border border-hairline-strong bg-void/60 px-3.5 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-faint focus:border-accent/60';

/** The enquiry form. Works with any intent preset through ?intent= in the URL. */
export function LeadForm({ email }: { email: string }) {
  const [intent, setIntent] = useState<Intent>('consulting');
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    const preset = new URLSearchParams(window.location.search).get('intent');
    if (preset === 'hiring' || preset === 'consulting' || preset === 'other') setIntent(preset);
    // Buttons elsewhere on the page pick the intent before scrolling here.
    const onPick = (e: Event) => setIntent((e as CustomEvent<Intent>).detail);
    window.addEventListener(INTENT_EVENT, onPick);
    return () => window.removeEventListener(INTENT_EVENT, onPick);
  }, []);

  if (state === 'sent') {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 text-center">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
          <Check className="h-5 w-5" />
        </span>
        <p className="mt-3 text-[17px] font-bold text-ink">Thanks, that reached me.</p>
        <p className="mt-1 text-[14px] text-muted">I read every message, and I’ll reply from {email}.</p>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget).entries());
        setState('sending');
        setError('');
        try {
          const res = await fetch('/api/lead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, intent, source: window.location.pathname }),
          });
          const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
          if (!res.ok || !json.ok) throw new Error(json.error || `Something went wrong. Please email ${email}.`);
          setState('sent');
        } catch (err) {
          setError((err as Error).message);
          setState('idle');
        }
      }}
    >
      <fieldset>
        <legend className="text-[13px] font-semibold text-ink">I’m reaching out about</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {INTENTS.map((i) => (
            <button
              key={i.id}
              type="button"
              aria-pressed={intent === i.id}
              onClick={() => setIntent(i.id)}
              className={cn(
                'rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors',
                intent === i.id ? 'border-accent bg-accent/15 text-ink' : 'border-hairline-strong text-muted hover:text-ink',
              )}
            >
              {i.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-[13px] font-semibold text-ink">
          Your name
          <input name="name" required maxLength={100} autoComplete="name" className={field} />
        </label>
        <label className="block text-[13px] font-semibold text-ink">
          Email
          <input name="email" type="email" required maxLength={200} autoComplete="email" inputMode="email" className={field} />
        </label>
      </div>
      <label className="block text-[13px] font-semibold text-ink">
        Company <span className="font-normal text-faint">(optional)</span>
        <input name="organisation" maxLength={120} autoComplete="organization" className={field} />
      </label>
      <label className="block text-[13px] font-semibold text-ink">
        {intent === 'hiring' ? 'The role, and what the first months look like' : intent === 'consulting' ? 'The problem you want solved' : 'Your message'}
        <textarea name="message" required minLength={10} maxLength={3000} rows={5} className={cn(field, 'resize-y')} />
      </label>
      {/* Hidden from people, irresistible to bots. */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      {error && (
        <p role="alert" className="text-[13.5px] text-[#ff8a80]">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={state === 'sending'}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[13px] font-bold tracking-[0.1em] text-void uppercase transition-colors hover:bg-accent disabled:opacity-60 sm:w-auto"
      >
        {state === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        Send
      </button>
      <p className="text-[12.5px] text-faint">
        Prefer email? Write to{' '}
        <a href={`mailto:${email}`} className="text-muted underline underline-offset-2 hover:text-ink">
          {email}
        </a>
        .
      </p>
    </form>
  );
}
