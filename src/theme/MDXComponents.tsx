import React from 'react';
import type {ComponentProps} from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

/**
 * Smart image component for OpenHD.
 * Matches the post-build optimization pipeline to prevent double-loading during hydration.
 */
function ImgWithOptimization(props: ComponentProps<'img'>) {
  const {src = '', alt, ...rest} = props;

  // Only optimize in production/SSR to avoid 404s during development
  // Skip external URLs and already optimized formats
  const isLocalImage = typeof src === 'string' && (src.startsWith('/') || src.startsWith('./') || src.startsWith('../'));
  const isStandardFormat = /\.(png|jpe?g)$/i.test(src);

  // We only render the <picture> tag if we are NOT in development mode
  // Docusaurus build sets NODE_ENV to production
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction && isLocalImage && isStandardFormat) {
    const avifSrc = src.replace(/\.(png|jpe?g)$/i, '.avif');
    const webpSrc = src.replace(/\.(png|jpe?g)$/i, '.webp');

    return (
      <picture>
        <source srcSet={avifSrc} type="image/avif" />
        <source srcSet={webpSrc} type="image/webp" />
        {/* We add data-optimized to let our post-build script know this is handled */}
        <img src={src} alt={alt} {...rest} data-optimized="true" loading="lazy" />
      </picture>
    );
  }

  return <img src={src} alt={alt} {...rest} />;
}

export default {
  ...MDXComponents,
  img: ImgWithOptimization,
};
