import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

/**
 * Simplified Modern Image Loader
 * This script only handles basic image enhancements:
 * - Lazy loading
 * - Proper zoom integration
 * - Loading indicators
 * 
 * No more AVIF/WebP complexity - we'll let Docusaurus handle image optimization
 */

function enhanceImageForZoom(img) {
  // Skip if already processed or if it's an SVG
  if (img.hasAttribute('data-enhanced') || img.src.includes('.svg')) {
    return;
  }

  // Mark as processed
  img.setAttribute('data-enhanced', 'true');
  
  // Add loading state
  img.style.transition = 'opacity 0.3s ease';
  
  // Ensure proper zoom cursor
  img.style.cursor = 'zoom-in';
  
  // Add loading placeholder if image hasn't loaded yet
  if (!img.complete) {
    img.style.opacity = '0.7';
    
    img.onload = () => {
      img.style.opacity = '1';
      img.style.cursor = 'zoom-in';
    };
    
    img.onerror = () => {
      img.style.opacity = '1';
      img.style.cursor = 'default';
    };
  }
}

function enhanceImages() {
  // Only run on documentation pages
  if (!document.querySelector('.theme-doc-page, .theme-doc-markdown')) {
    return;
  }

  // Target images in documentation content
  const images = document.querySelectorAll('.theme-doc-markdown img:not([data-enhanced])');
  
  images.forEach(enhanceImageForZoom);
}

function addIntersectionObserver() {
  if (!('IntersectionObserver' in window)) {
    return;
  }

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  });

  // Observe images that have data-src (lazy loading)
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

if (ExecutionEnvironment.canUseDOM) {
  // Initial load
  document.addEventListener('DOMContentLoaded', () => {
    enhanceImages();
    addIntersectionObserver();
  });
  
  // Handle route changes in Docusaurus
  let timeoutId;
  const observer = new MutationObserver(() => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      enhanceImages();
      addIntersectionObserver();
    }, 150);
  });
  
  // Start observing when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { 
        childList: true, 
        subtree: true 
      });
    });
  } else {
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
  }
}
