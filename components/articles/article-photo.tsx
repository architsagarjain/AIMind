import { articleImage, articleImageSrc } from '@/content/articles/images';
import { cn } from '@/lib/utils';

/**
 * An article's photo. Plain <img> with a srcset over two pre-cropped WebP
 * files: the sizes are fixed, so there is nothing for an image optimiser to
 * add, and the width and height stop the layout from shifting as it loads.
 */
export function ArticlePhoto({
  slug,
  priority = false,
  sizes,
  className,
}: {
  slug: string;
  /** The article page's hero is the largest paint on the page; load it first. */
  priority?: boolean;
  sizes: string;
  className?: string;
}) {
  const image = articleImage(slug);
  if (!image) return null;
  const src = articleImageSrc(slug);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src.full}
      srcSet={`${src.small} 640w, ${src.full} ${image.width}w`}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={image.alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={cn('aspect-video w-full object-cover', className)}
    />
  );
}

/** The credit line each photo's licence asks for: author, source and licence, all linked. */
export function PhotoCredit({ slug, className }: { slug: string; className?: string }) {
  const image = articleImage(slug);
  if (!image) return null;
  const link = 'underline decoration-hairline-strong underline-offset-2 transition-colors hover:text-ink';
  return (
    <p className={cn('text-[12px] leading-relaxed text-faint', className)}>
      Photo:{' '}
      {image.creatorUrl ? (
        <a href={image.creatorUrl} target="_blank" rel="noopener noreferrer nofollow" className={link}>
          {image.credit}
        </a>
      ) : (
        image.credit
      )}{' '}
      on{' '}
      <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" className={link}>
        {image.source}
      </a>
      ,{' '}
      <a href={image.licenseUrl} target="_blank" rel="license noopener noreferrer nofollow" className={link}>
        {image.license}
      </a>
    </p>
  );
}
