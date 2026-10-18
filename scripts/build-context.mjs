// Turns content/archit-context.md into a TypeScript module the server can
// import, so the chatbot's knowledge is the same file Archit edits. Runs before
// every build and dev start (package.json), and the output is committed so
// type-checking works on a fresh clone too.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const source = path.join(root, 'content/archit-context.md');
const target = path.join(root, 'content/archit-context.generated.ts');

const md = fs.readFileSync(source, 'utf8').replace(/\r\n/g, '\n');

// "## 4. Experience ..." → { 4: '## 4. Experience ...\n...' }
const sections = {};
for (const part of md.split(/\n(?=## \d+\. )/)) {
  const m = /^## (\d+)\. /.exec(part);
  if (m) sections[m[1]] = part.trim().replace(/\n---$/, '').trim();
}

const verified = /\*\*Last verified:\*\*\s*([^\n]+)/.exec(md)?.[1]?.trim() ?? null;

const out = `// Generated from content/archit-context.md by scripts/build-context.mjs.
// Do not edit by hand: edit the markdown file, and the build regenerates this.

/** When the context file was last checked, as written in it. */
export const CONTEXT_LAST_VERIFIED: string | null = ${JSON.stringify(verified)};

/** The context file's numbered sections, keyed by section number. */
export const CONTEXT_SECTIONS: Record<string, string> = ${JSON.stringify(sections, null, 2)};
`;

const previous = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';
if (previous !== out) {
  fs.writeFileSync(target, out);
  console.log(`[context] wrote ${path.relative(root, target)} (${Object.keys(sections).length} sections)`);
}
