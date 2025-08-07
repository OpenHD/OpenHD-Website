// Intelligent Navbar Management for better responsive behavior
function initIntelligentNavbar() {
  if (typeof window === 'undefined') return;

  let navbarElement = null;
  let navbarItems = [];
  let adaptiveState = {
    isOverflowing: false,
    hiddenItems: [],
    availableWidth: 0,
    requiredWidth: 0
  };

  // Define device-specific breakpoints
  const breakpoints = {
    mobile: 576,
    tabletPortrait: 768,
    tabletLandscape: 1024,
    desktop: 1200,
    largeDesktop: 1440
  };

  function findNavbarElements() {
    navbarElement = document.querySelector('.navbar');
    if (!navbarElement) return false;

    // Find all navbar items that might cause overflow
    const items = navbarElement.querySelectorAll('.navbar__item, .navbar__link, .searchBarContainer, #github-stars-navbar');
    navbarItems = Array.from(items);
    
    return true;
  }

  function getCurrentBreakpoint() {
    const width = window.innerWidth;
    
    if (width <= breakpoints.mobile) return 'mobile';
    if (width <= breakpoints.tabletPortrait) return 'tabletPortrait';
    if (width <= breakpoints.tabletLandscape) return 'tabletLandscape';
    if (width <= breakpoints.desktop) return 'desktop';
    return 'largeDesktop';
  }

  function getDeviceType() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const ratio = width / height;
    
    // iPad Pro detection (common sizes: 1024x1366, 1112x834, 1194x834)
    if ((width >= 1024 && width <= 1194 && height >= 834 && height <= 1366) ||
        (height >= 1024 && height <= 1194 && width >= 834 && width <= 1366)) {
      return 'ipadPro';
    }
    
    // iPad detection
    if ((width >= 768 && width <= 1024) || (height >= 768 && height <= 1024)) {
      return 'ipad';
    }
    
    // iPhone/mobile detection
    if (width <= 768) {
      return 'mobile';
    }
    
    return 'desktop';
  }

  function calculateRequiredSpace() {
    if (!navbarElement) return 0;
    
    let totalWidth = 0;
    const navbarRect = navbarElement.getBoundingClientRect();
    const container = navbarElement.querySelector('.navbar__inner');
    
    if (container) {
      const children = Array.from(container.children);
      children.forEach(child => {
        const rect = child.getBoundingClientRect();
        totalWidth += rect.width + 16; // Add some margin
      });
    }
    
    adaptiveState.availableWidth = navbarRect.width;
    adaptiveState.requiredWidth = totalWidth;
    adaptiveState.isOverflowing = totalWidth > navbarRect.width;
    
    return totalWidth;
  }

  function applyResponsiveStrategy() {
    const breakpoint = getCurrentBreakpoint();
    const deviceType = getDeviceType();
    
    if (!navbarElement) return;
    
    // Remove any existing adaptive classes
    navbarElement.classList.remove(
      'navbar-adaptive-mobile',
      'navbar-adaptive-tablet',
      'navbar-adaptive-ipad-pro',
      'navbar-adaptive-overflow',
      'navbar-adaptive-compact'
    );

    switch (deviceType) {
      case 'ipadPro':
        handleiPadPro();
        break;
      case 'ipad':
        handleTablet();
        break;
      case 'mobile':
        handleMobile();
        break;
      default:
        handleDesktop();
    }

    // Check for overflow and apply additional fixes
    setTimeout(() => {
      const requiredWidth = calculateRequiredSpace();
      if (adaptiveState.isOverflowing) {
        handleOverflow();
      }
    }, 100);
  }

  function handleiPadPro() {
    navbarElement.classList.add('navbar-adaptive-ipad-pro');
    
    // iPad Pro specific optimizations
    const versionDropdown = navbarElement.querySelector('.dropdown');
    const privacyLink = navbarElement.querySelector('[href="/privacy"]');
    
    // Temporarily hide less important items on iPad Pro
    if (privacyLink && adaptiveState.isOverflowing) {
      privacyLink.style.display = 'none';
      adaptiveState.hiddenItems.push(privacyLink);
    }
  }

  function handleTablet() {
    navbarElement.classList.add('navbar-adaptive-tablet');
    
    // Tablet optimizations - more aggressive hiding
    const lessImportantItems = [
      navbarElement.querySelector('[href="/privacy"]'),
      navbarElement.querySelector('[href="https://t.me/OpenHD_User"]')
    ].filter(Boolean);
    
    lessImportantItems.forEach(item => {
      if (adaptiveState.isOverflowing) {
        item.style.display = 'none';
        adaptiveState.hiddenItems.push(item);
      }
    });
  }

  function handleMobile() {
    navbarElement.classList.add('navbar-adaptive-mobile');
    // Mobile is handled by Docusaurus hamburger menu
  }

  function handleDesktop() {
    // Restore all hidden items on desktop
    restoreHiddenItems();
  }

  function handleOverflow() {
    navbarElement.classList.add('navbar-adaptive-overflow');
    
    // Priority system for hiding items
    const hidePriority = [
      { selector: '[href="/privacy"]', priority: 1 },
      { selector: '[href="https://t.me/OpenHD_User"]', priority: 2 },
      { selector: '.dropdown', priority: 3 },
      { selector: '#github-stars-navbar', priority: 4 }
    ];

    for (const item of hidePriority) {
      const element = navbarElement.querySelector(item.selector);
      if (element && adaptiveState.isOverflowing) {
        element.style.display = 'none';
        adaptiveState.hiddenItems.push(element);
        
        // Recalculate after hiding each item
        setTimeout(() => {
          calculateRequiredSpace();
          if (!adaptiveState.isOverflowing) return;
        }, 50);
      }
    }
  }

  function restoreHiddenItems() {
    adaptiveState.hiddenItems.forEach(item => {
      if (item && item.style) {
        item.style.display = '';
      }
    });
    adaptiveState.hiddenItems = [];
  }

  function addOverflowIndicator() {
    if (adaptiveState.hiddenItems.length > 0 && !navbarElement.querySelector('.navbar-overflow-indicator')) {
      const indicator = document.createElement('div');
      indicator.className = 'navbar-overflow-indicator';
      indicator.innerHTML = `<span>•••</span>`;
      indicator.title = `${adaptiveState.hiddenItems.length} items hidden`;
      
      // Add click handler for overflow menu
      indicator.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (window.NavbarOverflowMenu) {
          window.NavbarOverflowMenu.show(adaptiveState.hiddenItems, indicator);
        }
      });
      
      const navbarEnd = navbarElement.querySelector('.navbar__items--right');
      if (navbarEnd) {
        navbarEnd.appendChild(indicator);
      }
    }
  }

  function removeOverflowIndicator() {
    const indicator = navbarElement?.querySelector('.navbar-overflow-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function handleResize() {
    removeOverflowIndicator();
    restoreHiddenItems();
    applyResponsiveStrategy();
    
    // Add overflow indicator if items are hidden
    if (adaptiveState.hiddenItems.length > 0) {
      addOverflowIndicator();
    }
  }

  function init() {
    if (!findNavbarElements()) {
      // Retry after a delay if navbar not found
      setTimeout(init, 100);
      return;
    }

    // Apply initial strategy
    applyResponsiveStrategy();

    // Handle resize with debouncing
    const debouncedResize = debounce(handleResize, 150);
    window.addEventListener('resize', debouncedResize);

    // Handle orientation changes on mobile devices
    window.addEventListener('orientationchange', () => {
      setTimeout(handleResize, 300);
    });

    // Re-apply on route changes
    let currentPath = location.pathname;
    const observer = new MutationObserver(() => {
      if (currentPath !== location.pathname) {
        currentPath = location.pathname;
        setTimeout(() => {
          restoreHiddenItems();
          applyResponsiveStrategy();
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
  initIntelligentNavbar();
}