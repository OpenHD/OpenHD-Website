// Enhanced Mobile Search functionality
function initEnhancedMobileSearch() {
  if (typeof window === 'undefined') return;

  let searchInput = null;
  let searchContainer = null;
  let isSearchExpanded = false;

  function findSearchElements() {
    searchInput = document.querySelector('.navbar__search-input');
    searchContainer = document.querySelector('.navbar__search');
    return searchInput && searchContainer;
  }

  function expandSearch() {
    if (!searchInput || isSearchExpanded) return;
    
    isSearchExpanded = true;
    searchInput.classList.add('search-expanded');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when search is expanded
    
    // Create close button
    createCloseButton();
    
    // Focus the input after animation
    setTimeout(() => {
      if (searchInput) {
        searchInput.focus();
      }
    }, 300);
  }

  function collapseSearch() {
    if (!searchInput || !isSearchExpanded) return;
    
    isSearchExpanded = false;
    searchInput.classList.remove('search-expanded');
    searchInput.blur();
    document.body.style.overflow = ''; // Restore scrolling
    
    // Remove close button
    removeCloseButton();
    
    // Clear search if it's empty
    if (searchInput.value.trim() === '') {
      searchInput.value = '';
    }
  }

  function createCloseButton() {
    if (document.getElementById('mobile-search-close')) return;
    
    const closeButton = document.createElement('button');
    closeButton.id = 'mobile-search-close';
    closeButton.innerHTML = '✕';
    closeButton.style.cssText = `
      position: fixed;
      top: calc(var(--ifm-navbar-height) + 14px);
      right: calc(var(--ifm-navbar-padding-horizontal) + 12px);
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--ifm-color-emphasis-200);
      border: none;
      border-radius: 50%;
      font-size: 12px;
      font-weight: bold;
      cursor: pointer;
      z-index: 10001;
      transition: all 0.2s ease;
      color: var(--ifm-font-color-base);
    `;
    
    closeButton.addEventListener('click', collapseSearch);
    closeButton.addEventListener('mouseenter', () => {
      closeButton.style.background = 'var(--ifm-color-danger)';
      closeButton.style.color = 'white';
      closeButton.style.transform = 'scale(1.1)';
    });
    closeButton.addEventListener('mouseleave', () => {
      closeButton.style.background = 'var(--ifm-color-emphasis-200)';
      closeButton.style.color = 'var(--ifm-font-color-base)';
      closeButton.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(closeButton);
  }

  function removeCloseButton() {
    const closeButton = document.getElementById('mobile-search-close');
    if (closeButton) {
      closeButton.remove();
    }
  }

  function handleSearchClick(event) {
    if (window.innerWidth > 576) return; // Only on mobile
    
    if (!isSearchExpanded) {
      event.preventDefault();
      expandSearch();
    }
  }

  function handleEscapeKey(event) {
    if (event.key === 'Escape' && isSearchExpanded) {
      collapseSearch();
    }
  }

  function handleClickOutside(event) {
    if (!isSearchExpanded) return;
    
    // If click is outside the search input and dropdown
    const dropdown = document.querySelector('.searchBar .dropdownMenu');
    const closeButton = document.querySelector('.navbar__search::after');
    
    if (searchInput && 
        !searchInput.contains(event.target) && 
        (!dropdown || !dropdown.contains(event.target))) {
      collapseSearch();
    }
  }

  function handleCloseButtonClick(event) {
    // Check if click is on the pseudo-element close button area
    if (isSearchExpanded && searchContainer) {
      const rect = searchContainer.getBoundingClientRect();
      const closeButtonArea = {
        left: rect.right - 36,
        right: rect.right - 12,
        top: rect.top + 14,
        bottom: rect.top + 38
      };
      
      if (event.clientX >= closeButtonArea.left && 
          event.clientX <= closeButtonArea.right &&
          event.clientY >= closeButtonArea.top && 
          event.clientY <= closeButtonArea.bottom) {
        collapseSearch();
      }
    }
  }

  function handleWindowResize() {
    // Collapse search when switching to desktop
    if (window.innerWidth > 576 && isSearchExpanded) {
      collapseSearch();
    }
  }

  function setupEventListeners() {
    if (!findSearchElements()) return;

    // Click on collapsed search button to expand
    searchInput.addEventListener('click', handleSearchClick);
    
    // Escape key to close
    document.addEventListener('keydown', handleEscapeKey);
    
    // Click outside to close
    document.addEventListener('click', handleClickOutside);
    
    // Handle close button click (pseudo-element)
    if (searchContainer) {
      searchContainer.addEventListener('click', handleCloseButtonClick);
    }
    
    // Handle window resize
    window.addEventListener('resize', handleWindowResize);

    // Handle blur event (when input loses focus naturally)
    searchInput.addEventListener('blur', (event) => {
      // Small delay to allow clicking on dropdown items
      setTimeout(() => {
        const activeElement = document.activeElement;
        const dropdown = document.querySelector('.searchBar .dropdownMenu');
        
        // Only collapse if focus didn't move to a dropdown item
        if (isSearchExpanded && 
            (!dropdown || !dropdown.contains(activeElement)) &&
            activeElement !== searchInput) {
          collapseSearch();
        }
      }, 150);
    });
  }

  function init() {
    setupEventListeners();
    
    // Re-setup on route changes (SPA navigation)
    let currentPath = location.pathname;
    const observer = new MutationObserver(() => {
      if (currentPath !== location.pathname) {
        currentPath = location.pathname;
        setTimeout(() => {
          if (isSearchExpanded) {
            collapseSearch();
          }
          setupEventListeners();
        }, 100);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

// Auto-initialize
if (typeof window !== 'undefined') {
  initEnhancedMobileSearch();
}