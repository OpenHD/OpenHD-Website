import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

function addCaptions() {
  // Only run on documentation pages
  if (!document.querySelector('.theme-doc-page, .theme-doc-markdown')) {
    return;
  }
  
  // Target only documentation content images
  const images = document.querySelectorAll('.theme-doc-markdown img[alt]:not([alt=""])');
  
  images.forEach(img => {
    // Skip if caption already exists
    if (img.nextElementSibling?.classList?.contains('auto-caption')) {
      return;
    }
    
    // Skip images that are part of flex layouts with manual captions
    const parent = img.closest('div[style*="display: flex"], div[style*="display:flex"]');
    if (parent && parent.querySelector('p, h4, h5, h6')) {
      return;
    }
    
    const caption = document.createElement('div');
    caption.className = 'auto-caption';
    caption.style.cssText = `
      text-align: center;
      font-size: 0.85rem;
      font-style: italic;
      color: var(--ifm-color-content-secondary);
      margin: 8px 0 16px 0;
      padding: 4px 8px;
      background-color: var(--ifm-background-surface-color);
      border-radius: 4px;
      border-left: 3px solid var(--ifm-color-primary);
      line-height: 1.4;
    `;
    caption.textContent = img.alt;
    
    // Insert caption after image
    img.parentNode.insertBefore(caption, img.nextSibling);
  });
}

if (ExecutionEnvironment.canUseDOM) {
  // Initial load
  document.addEventListener('DOMContentLoaded', addCaptions);
  
  // Handle route changes in Docusaurus
  let timeoutId;
  const observer = new MutationObserver(() => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(addCaptions, 100);
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