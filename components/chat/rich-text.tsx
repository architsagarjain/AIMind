import { Fragment } from 'react';

/**
 * Minimal inline formatter for model output.
 *
 * Handles paragraphs, bullet/numbered lists, `code`, **bold** and _italic_ —
 * which covers everything the persona prompt actually produces. A full markdown
 * renderer would add ~40KB to the bundle to parse tables and images the clone
 * never emits.
 *
 * Input is model- or fallback-generated text rendered as React elements, never
 * as HTML, so there is no injection surface here.
 */

/**
 * Code spans come first so a backticked identifier is never re-parsed, and the
 * italic arm requires non-word characters on both sides — otherwise a token
 * like OPENROUTER_API_KEY reads as emphasis.
 */
const INLINE =
  /(`[^`]+`|\*\*[^*]+\*\*|(?<![A-Za-z0-9_])_[^_\n]+_(?![A-Za-z0-9_]))/g;

function renderInline(text: string, keyPrefix: string) {
  return text.split(INLINE).map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={key} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('_') && part.endsWith('_') && part.length > 2) {
      return (
        <em key={key} className="text-faint italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={key}
          className="rounded surface-3 px-1.5 py-0.5 font-mono text-[0.85em] text-accent"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <Fragment key={key}>{part}</Fragment>;
  });
}

export function RichText({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/);

  return (
    <>
      {blocks.map((block, bi) => {
        const lines = block.split('\n').filter(Boolean);
        const isList = lines.length > 0 && lines.every((l) => /^\s*([-*•]|\d+\.)\s+/.test(l));

        if (isList) {
          const ordered = /^\s*\d+\./.test(lines[0] ?? '');
          const ListTag = ordered ? 'ol' : 'ul';
          return (
            <ListTag key={bi} className="my-2 space-y-1.5">
              {lines.map((line, li) => (
                <li key={li} className="flex gap-2.5">
                  <span className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                  <span>{renderInline(line.replace(/^\s*([-*•]|\d+\.)\s+/, ''), `${bi}-${li}`)}</span>
                </li>
              ))}
            </ListTag>
          );
        }

        return (
          <p key={bi} className="my-2 first:mt-0 last:mb-0">
            {renderInline(block, String(bi))}
          </p>
        );
      })}
    </>
  );
}
