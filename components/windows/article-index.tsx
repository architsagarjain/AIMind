'use client';

import { createContext, useContext } from 'react';
import type { ArticleSummary } from '@/content/articles';

/**
 * The article list for the desktop's Writing window.
 *
 * The home page is a server component, so it builds the summaries and hands
 * them down here. Importing the articles directly would ship every article's
 * full text in the home page's JavaScript to show nine titles.
 */
const ArticleIndex = createContext<ArticleSummary[]>([]);

export function ArticleIndexProvider({ value, children }: { value: ArticleSummary[]; children: React.ReactNode }) {
  return <ArticleIndex.Provider value={value}>{children}</ArticleIndex.Provider>;
}

export const useArticleIndex = () => useContext(ArticleIndex);
