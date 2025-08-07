// Navbar Overflow Menu for hidden items
function createNavbarOverflowMenu() {
  if (typeof window === 'undefined') return null;

  let overflowMenu = null;
  let isMenuOpen = false;

  function createMenu(hiddenItems) {
    if (!hiddenItems || hiddenItems.length === 0) return null;

    // Remove existing menu
    removeMenu();

    const menu = document.createElement('div');
    menu.className = 'navbar-overflow-menu';
    menu.innerHTML = `
      <div class="navbar-overflow-backdrop"></div>
      <div class="navbar-overflow-content">
        <div class="navbar-overflow-header">
          <span>More Options</span>
          <button class="navbar-overflow-close" aria-label="Close menu">&times;</button>
        </div>
        <div class="navbar-overflow-items">
          ${hiddenItems.map(item => {
            const link = item.querySelector('a') || item;
            const href = link.href || '#';
            const text = link.textContent?.trim() || 'Item';
            const isExternal = href.startsWith('http') && !href.includes(location.hostname);
            
            return `
              <a href="${href}" class="navbar-overflow-item" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''}>
                <span>${text}</span>
                ${isExternal ? '<i class="fas fa-external-link-alt"></i>' : ''}
              </a>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .navbar-overflow-menu {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        padding-top: var(--ifm-navbar-height);
        animation: fadeIn 0.2s ease-out;
      }

      .navbar-overflow-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(2px);
      }

      .navbar-overflow-content {
        position: relative;
        background: var(--ifm-background-color);
        border: 1px solid var(--ifm-color-emphasis-300);
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        margin: 1rem;
        min-width: 200px;
        max-width: 300px;
        overflow: hidden;
        animation: slideDown 0.2s ease-out;
      }

      [data-theme='dark'] .navbar-overflow-content {
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      }

      .navbar-overflow-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        background: var(--ifm-color-emphasis-100);
        border-bottom: 1px solid var(--ifm-color-emphasis-300);
        font-weight: 600;
        font-size: 0.9rem;
      }

      .navbar-overflow-close {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        color: var(--ifm-color-content-secondary);
        transition: all 0.2s ease;
      }

      .navbar-overflow-close:hover {
        background: var(--ifm-color-emphasis-200);
        color: var(--ifm-color-content);
      }

      .navbar-overflow-items {
        padding: 0.5rem 0;
      }

      .navbar-overflow-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        color: var(--ifm-color-content);
        text-decoration: none;
        transition: background-color 0.2s ease;
        border: none;
        width: 100%;
        font-size: 0.9rem;
      }

      .navbar-overflow-item:hover {
        background: var(--ifm-color-emphasis-100);
        color: var(--ifm-color-primary);
      }

      .navbar-overflow-item i {
        font-size: 0.8rem;
        opacity: 0.7;
        margin-left: 0.5rem;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes slideDown {
        from { 
          opacity: 0; 
          transform: translateY(-10px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(menu);
    overflowMenu = menu;

    // Add event listeners
    menu.querySelector('.navbar-overflow-backdrop').addEventListener('click', closeMenu);
    menu.querySelector('.navbar-overflow-close').addEventListener('click', closeMenu);
    
    // Handle clicks on menu items
    menu.querySelectorAll('.navbar-overflow-item').forEach(item => {
      item.addEventListener('click', (e) => {
        // Allow normal navigation
        closeMenu();
      });
    });

    // Handle escape key
    document.addEventListener('keydown', handleEscKey);

    isMenuOpen = true;
    return menu;
  }

  function handleEscKey(e) {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMenu();
    }
  }

  function closeMenu() {
    if (overflowMenu) {
      overflowMenu.style.animation = 'fadeOut 0.2s ease-in forwards';
      setTimeout(() => {
        removeMenu();
      }, 200);
    }
    document.removeEventListener('keydown', handleEscKey);
    isMenuOpen = false;
  }

  function removeMenu() {
    if (overflowMenu) {
      overflowMenu.remove();
      overflowMenu = null;
    }
    
    // Remove style tag
    const style = document.querySelector('style[data-overflow-menu]');
    if (style) {
      style.remove();
    }
  }

  function showMenu(hiddenItems, trigger) {
    if (isMenuOpen) {
      closeMenu();
      return;
    }

    const menu = createMenu(hiddenItems);
    if (menu && trigger) {
      // Position menu near the trigger
      const triggerRect = trigger.getBoundingClientRect();
      const content = menu.querySelector('.navbar-overflow-content');
      
      if (content) {
        content.style.position = 'absolute';
        content.style.top = `${triggerRect.bottom + 5}px`;
        content.style.right = `${window.innerWidth - triggerRect.right}px`;
        content.style.margin = '0';
      }
    }
  }

  // CSS for fadeOut animation
  const fadeOutStyle = document.createElement('style');
  fadeOutStyle.textContent = `
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(fadeOutStyle);

  return {
    show: showMenu,
    close: closeMenu,
    remove: removeMenu,
    isOpen: () => isMenuOpen
  };
}

// Export for use in IntelligentNavbar
if (typeof window !== 'undefined') {
  window.NavbarOverflowMenu = createNavbarOverflowMenu();
}