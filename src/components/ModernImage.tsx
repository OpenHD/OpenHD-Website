import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * Enhanced Image Component for OpenHD Documentation
 * Provides modern image formats with fallbacks and enhanced loading states
 */

interface ModernImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  width?: number;
  height?: number;
}

const ModernImage: React.FC<ModernImageProps> = ({
  src,
  alt,
  caption,
  className = '',
  style = {},
  loading = 'lazy',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  width,
  height,
}) => {
  const imageUrl = useBaseUrl(src);
  
  // Extract base path for different format versions
  const basePath = imageUrl.replace(/\.[^/.]+$/, '');
  const extension = imageUrl.split('.').pop()?.toLowerCase();
  
  // Skip format optimization for SVGs or already optimized formats
  const skipOptimization = ['svg', 'avif', 'webp'].includes(extension || '');
  
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const imageStyles: React.CSSProperties = {
    opacity: imageLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease',
    ...style,
  };

  const wrapperStyles: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    maxWidth: '100%',
  };

  const loadingStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(90deg, var(--ifm-color-emphasis-200) 25%, var(--ifm-color-emphasis-100) 50%, var(--ifm-color-emphasis-200) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: '8px',
    opacity: imageLoaded ? 0 : 1,
    transition: 'opacity 0.3s ease',
  };

  if (skipOptimization) {
    return (
      <figure className={`modern-image-figure ${className}`} style={{ margin: '1rem auto', textAlign: 'center' }}>
        <div style={wrapperStyles}>
          <div style={loadingStyles} />
          <img
            src={imageUrl}
            alt={alt}
            loading={loading}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={imageStyles}
            className={`modern-image ${imageError ? 'error' : ''}`}
            width={width}
            height={height}
            sizes={sizes}
          />
        </div>
        {(caption || alt) && (
          <figcaption className="modern-image-caption">
            {caption || alt}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure className={`modern-image-figure ${className}`} style={{ margin: '1rem auto', textAlign: 'center' }}>
      <div style={wrapperStyles}>
        <div style={loadingStyles} />
        <picture>
          <source 
            srcSet={`${basePath}.avif`} 
            type="image/avif"
            sizes={sizes}
          />
          <source 
            srcSet={`${basePath}.webp`} 
            type="image/webp"
            sizes={sizes}
          />
          <img
            src={imageUrl}
            alt={alt}
            loading={loading}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={imageStyles}
            className={`modern-image ${imageError ? 'error' : ''}`}
            width={width}
            height={height}
            sizes={sizes}
          />
        </picture>
      </div>
      {(caption || alt) && (
        <figcaption className="modern-image-caption">
          {caption || alt}
        </figcaption>
      )}
    </figure>
  );
};

export default ModernImage;
