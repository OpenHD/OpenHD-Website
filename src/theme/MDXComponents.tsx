import React from 'react';
import type {ComponentProps} from 'react';
import MDXComponents from '@theme-original/MDXComponents';

// Global <img> override for MDX/Markdown content to prefer AVIF when available
function ImgWithAvif(props: ComponentProps<'img'>) {
  const {src = '', alt, ...rest} = props;
  // Only add AVIF source for png/jpg/jpeg; otherwise fall back to default
  if (typeof src === 'string' && /\.(png|jpe?g)(\?.*)?$/i.test(src)) {
    const avifSrc = src.replace(/\.(png|jpe?g)(\?.*)?$/i, '.avif$2');
    return (
      <picture>
        <source srcSet={avifSrc} type="image/avif" />
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={src} alt={alt} {...rest} />
      </picture>
    );
  }
  // Non-convertible type: render default
  // eslint-disable-next-line jsx-a11y/alt-text
  return <img src={src} alt={alt} {...rest} />;
}

export default {
  // Re-export the default mappings
  ...MDXComponents,
  // Override <img>
  img: ImgWithAvif,
};

