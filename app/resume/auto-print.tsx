'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Opens the browser print dialog when the page is reached with `?print=1`.
 *
 * This is the PDF export: the print stylesheet renders an A4-friendly document
 * and the browser's "Save as PDF" produces the file. Keeping a committed PDF
 * binary in the repo would mean it silently drifts from `content/resume.ts`.
 */
export function AutoPrint() {
  const params = useSearchParams();

  useEffect(() => {
    if (params.get('print') !== '1') return;
    // Wait for web fonts, otherwise the print snapshot uses fallback metrics.
    const run = () => setTimeout(() => window.print(), 350);
    if (document.fonts?.ready) void document.fonts.ready.then(run);
    else run();
  }, [params]);

  return null;
}
