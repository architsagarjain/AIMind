import type { WindowId } from '@/types';
import { cn } from '@/lib/utils';

/**
 * The ARCHIT.OS app icons: macOS-style icons from the WhiteSur icon theme
 * (github.com/vinceliuice/WhiteSur-icon-theme, GPL-3.0; see
 * public/icons/macos/NOTICE.md for the source of each one).
 *
 * The site loads WebP renders at twice their largest display size, about 5KB
 * each, rather than the SVGs: each SVG carries an embedded bitmap shadow, and
 * redrawing that at every frame of the dock's magnification is real work on
 * a phone. Like a Mac's, the artwork includes its own margin and shadow.
 */

export type AppIconId = WindowId | 'linkedin' | 'mail' | 'trash';

export function AppIcon({ app, className }: { app: AppIconId; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- tiny static icons; next/image adds nothing here
    <img
      src={`/icons/macos/${app}.webp`}
      alt=""
      width={192}
      height={192}
      decoding="async"
      draggable={false}
      className={cn('block select-none', className)}
    />
  );
}

/** The matching desktop folder for each window. */
export function FolderIcon({ app, className }: { app: WindowId; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- as above
    <img
      src={`/icons/macos/folder-${app}.webp`}
      alt=""
      width={128}
      height={128}
      decoding="async"
      draggable={false}
      className={cn('block select-none', className)}
    />
  );
}
