import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  path: string; // path under /static, e.g. /img/logo.png
};

export default function OptimizedImg({ path, alt, ...imgProps }: Props) {
  const pngJpgUrl = useBaseUrl(path);
  const avifUrl = useBaseUrl(path.replace(/\.(png|jpe?g)$/i, '.avif'));
  const isConvertible = /\.(png|jpe?g)$/i.test(path);

  if (!isConvertible) {
    // Fallback: render normal img
    return <img src={pngJpgUrl} alt={alt} {...imgProps} />;
  }

  return (
    <picture>
      <source srcSet={avifUrl} type="image/avif" />
      <img src={pngJpgUrl} alt={alt} {...imgProps} />
    </picture>
  );
}

