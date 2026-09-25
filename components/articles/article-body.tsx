import Link from 'next/link';
import type { ArticleBlock } from '@/types';
import { headingId } from '@/content/articles';
import { Figure } from './figures';

/**
 * Renders article blocks as semantic HTML: real headings with anchors, real
 * tables, real lists. That structure is what search engines read, and what
 * makes the page usable with a screen reader.
 */

const INLINE = /(\*\*.+?\*\*|\[[^\]]+\]\([^)]+\))/g;

/** The two inline marks: **bold** and [label](href). */
export function Inline({ text }: { text: string }) {
  const parts = text.split(INLINE);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold text-ink">
              {part.slice(2, -2)}
            </strong>
          );
        }
        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        if (link) {
          const [, label, href] = link;
          const cls = 'text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:decoration-accent';
          return href!.startsWith('/') ? (
            <Link key={i} href={href!} className={cls}>
              {label}
            </Link>
          ) : (
            <a key={i} href={href} className={cls} target="_blank" rel="noopener noreferrer">
              {label}
            </a>
          );
        }
        return part;
      })}
    </>
  );
}

export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="article-body">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2 key={i} id={headingId(block.text)} className="scroll-mt-24">
                <Inline text={block.text} />
              </h2>
            );
          case 'h3':
            return (
              <h3 key={i} id={headingId(block.text)} className="scroll-mt-24">
                <Inline text={block.text} />
              </h3>
            );
          case 'p':
            return (
              <p key={i}>
                <Inline text={block.text} />
              </p>
            );
          case 'ul':
          case 'ol': {
            const List = block.type;
            return (
              <List key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>
                    <Inline text={item} />
                  </li>
                ))}
              </List>
            );
          }
          case 'quote':
            return (
              <blockquote key={i}>
                <Inline text={block.text} />
              </blockquote>
            );
          case 'callout':
            return (
              <p key={i} className="article-callout">
                <Inline text={block.text} />
              </p>
            );
          case 'table':
            return (
              <figure key={i} className="article-table-wrap">
                <div className="article-table" role="region" aria-label={block.caption ?? 'Table'} tabIndex={0}>
                  <table>
                    <thead>
                      <tr>
                        {block.head.map((h, j) => (
                          <th key={j} scope="col">
                            <Inline text={h} />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, j) => (
                        <tr key={j}>
                          {row.map((cell, k) =>
                            k === 0 && block.head[0] === '' ? (
                              <th key={k} scope="row">
                                <Inline text={cell} />
                              </th>
                            ) : (
                              <td key={k}>
                                <Inline text={cell} />
                              </td>
                            ),
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Outside the scroll area, so a phone shows it in full. */}
                {block.caption && <figcaption className="article-table-caption">{block.caption}</figcaption>}
              </figure>
            );
          case 'figure':
            return <Figure key={i} figure={block.figure} caption={block.caption} />;
        }
      })}
    </div>
  );
}
