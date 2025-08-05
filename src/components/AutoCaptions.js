import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

/**
 * Enhanced Auto Captions for OpenHD Documentation
 * Automatically generates captions for images with alt text
 * Compatible with modern image formats and zoom functionality
 */

function addCaptions() {
  // Only run on documentation pages
  if (!document.querySelector('.theme-doc-page, .theme-doc-markdown')) {
    return;
  }
  
  // Target images in documentation content (including those in picture elements)
  const selectors = [
    '.theme-doc-markdown img[alt]:not([alt=""])',
    '.theme-doc-markdown picture img[alt]:not([alt=""])'
  ];
  
  const images = document.querySelectorAll(selectors.join(', '));
  
  images.forEach(img => {
    // Skip if caption already exists
    const nextElement = img.parentElement.nextElementSibling;
    if (nextElement?.classList?.contains('auto-caption')) {
      return;
    }
    
    // For picture elements, check the parent's next sibling
    const parentElement = img.closest('picture') || img;
    if (parentElement.nextElementSibling?.classList?.contains('auto-caption')) {
      return;
    }
    
    // Skip images that are part of flex layouts with manual captions
    const parent = img.closest('div[style*="display: flex"], div[style*="display:flex"]');
    if (parent && parent.querySelector('p, h4, h5, h6')) {
      return;
    }
    
    // Get alt text for caption
    const altText = img.alt;
    if (!altText || altText.trim() === '') {
      return;
    }
    
    const caption = document.createElement('div');
    caption.className = 'auto-caption';
    caption.style.cssText = `
      text-align: center;
      font-size: 0.9rem;
      font-style: italic;
      color: var(--ifm-color-emphasis-700);
      margin: 8px 0 16px 0;
      width: 100%;
      box-sizing: border-box;
      line-height: 1.4;
      opacity: 0.8;
      transition: opacity 0.2s ease;
    `;
    caption.textContent = altText;
    
    // Add subtle hover effect
    caption.addEventListener('mouseenter', () => {
      caption.style.opacity = '1';
    });
    
    caption.addEventListener('mouseleave', () => {
      caption.style.opacity = '0.8';
    });
    
    // Insert caption after image or picture element
    const targetElement = img.closest('picture') || img;
    targetElement.parentNode.insertBefore(caption, targetElement.nextSibling);
  });
}

function enhanceImageAccessibility() {
  // Add better accessibility to images
  const images = document.querySelectorAll('.theme-doc-markdown img[alt]:not([alt=""])');
  
  images.forEach(img => {
    if (!img.hasAttribute('role')) {
      img.setAttribute('role', 'img');
    }
    
    // Add tabindex for keyboard navigation
    if (!img.hasAttribute('tabindex')) {
      img.setAttribute('tabindex', '0');
    }
    
    // Add keyboard support for zoom
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        img.click(); // Trigger zoom
      }
    });
  });
}

if (ExecutionEnvironment.canUseDOM) {
  // Initial load
  document.addEventListener('DOMContentLoaded', () => {
    addCaptions();
    enhanceImageAccessibility();
  });
  
  // Handle route changes in Docusaurus
  let timeoutId;
  const observer = new MutationObserver(() => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      addCaptions();
      enhanceImageAccessibility();
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