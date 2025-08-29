// AAA-level accessibility utilities
export interface AccessibilityConfig {
  enableHighContrast: boolean;
  enableReducedMotion: boolean;
  enableScreenReader: boolean;
  enableKeyboardNavigation: boolean;
  enableFocusIndicators: boolean;
  enableSkipLinks: boolean;
}

// ARIA helpers for semantic markup
export const ariaHelpers = {
  // Landmark roles
  main: { role: 'main', 'aria-label': 'Main content' },
  navigation: { role: 'navigation', 'aria-label': 'Main navigation' },
  banner: { role: 'banner', 'aria-label': 'Site header' },
  contentinfo: { role: 'contentinfo', 'aria-label': 'Site footer' },
  complementary: { role: 'complementary', 'aria-label': 'Additional information' },
  search: { role: 'search', 'aria-label': 'Search functionality' },

  // Form labels and descriptions
  label: (id: string, text: string) => ({ htmlFor: id, id: `${id}-label` }),
  describedBy: (id: string) => ({ 'aria-describedby': `${id}-description` }),
  required: { 'aria-required': 'true' },
  invalid: (id: string) => ({ 'aria-invalid': 'true', 'aria-describedby': `${id}-error` }),

  // Interactive elements
  button: (pressed?: boolean) => ({ 
    role: 'button', 
    tabIndex: 0,
    ...(pressed !== undefined && { 'aria-pressed': pressed.toString() })
  }),
  tab: (selected: boolean, controls: string) => ({
    role: 'tab',
    'aria-selected': selected.toString(),
    'aria-controls': controls,
    tabIndex: selected ? 0 : -1
  }),
  tabpanel: (labelledBy: string) => ({
    role: 'tabpanel',
    'aria-labelledby': labelledBy,
    tabIndex: 0
  }),

  // Lists and navigation
  list: { role: 'list' },
  listItem: { role: 'listitem' },
  menu: { role: 'menu' },
  menuitem: { role: 'menuitem', tabIndex: -1 },

  // Status and live regions
  status: { role: 'status', 'aria-live': 'polite' },
  alert: { role: 'alert', 'aria-live': 'assertive' },
  progressbar: (value: number, min: number = 0, max: number = 100) => ({
    role: 'progressbar',
    'aria-valuenow': value.toString(),
    'aria-valuemin': min.toString(),
    'aria-valuemax': max.toString(),
    'aria-valuetext': `${value}% complete`
  }),

  // Images and media
  img: (alt: string, decorative: boolean = false) => ({
    alt: decorative ? '' : alt,
    ...(decorative && { 'aria-hidden': 'true' })
  }),

  // Expandable content
  expandable: (expanded: boolean, controls: string) => ({
    'aria-expanded': expanded.toString(),
    'aria-controls': controls
  }),

  // Search and filters
  searchbox: (placeholder: string) => ({
    role: 'searchbox',
    'aria-label': placeholder,
    'aria-autocomplete': 'list'
  }),

  // Data tables
  table: { role: 'table' },
  row: { role: 'row' },
  cell: (header: boolean = false) => ({
    role: header ? 'columnheader' : 'cell'
  }),

  // Skip links
  skipLink: (target: string, text: string) => ({
    href: target,
    className: 'skip-link',
    'aria-label': `Skip to ${text}`
  })
};

// Keyboard navigation utilities
export class KeyboardNavigator {
  private focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[role="button"]',
    '[role="tab"]',
    '[role="menuitem"]'
  ].join(', ');

  // Get all focusable elements within a container
  getFocusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll(this.focusableSelectors)) as HTMLElement[];
  }

  // Handle arrow key navigation
  handleArrowNavigation(
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    orientation: 'horizontal' | 'vertical' = 'horizontal'
  ): number {
    const key = event.key;
    let newIndex = currentIndex;

    if (orientation === 'horizontal') {
      if (key === 'ArrowLeft') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      } else if (key === 'ArrowRight') {
        newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      }
    } else {
      if (key === 'ArrowUp') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      } else if (key === 'ArrowDown') {
        newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      }
    }

    if (newIndex !== currentIndex) {
      event.preventDefault();
      items[newIndex]?.focus();
      return newIndex;
    }

    return currentIndex;
  }

  // Handle Enter and Space key activation
  handleActivation(event: KeyboardEvent, callback: () => void): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  }

  // Trap focus within a container
  trapFocus(container: HTMLElement): void {
    const focusableElements = this.getFocusableElements(container);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    container.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      }
    });
  }

  // Move focus to first focusable element
  focusFirst(container: HTMLElement): void {
    const focusableElements = this.getFocusableElements(container);
    focusableElements[0]?.focus();
  }

  // Move focus to last focusable element
  focusLast(container: HTMLElement): void {
    const focusableElements = this.getFocusableElements(container);
    focusableElements[focusableElements.length - 1]?.focus();
  }
}

// Focus management utilities
export class FocusManager {
  private previousFocus: HTMLElement | null = null;

  // Save current focus
  saveFocus(): void {
    this.previousFocus = document.activeElement as HTMLElement;
  }

  // Restore previous focus
  restoreFocus(): void {
    this.previousFocus?.focus();
  }

  // Move focus to element with smooth scrolling
  focusElement(element: HTMLElement, scrollIntoView: boolean = true): void {
    element.focus();
    if (scrollIntoView) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // Announce to screen readers
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  // Create skip link
  createSkipLink(target: string, text: string): HTMLAnchorElement {
    const skipLink = document.createElement('a');
    skipLink.href = target;
    skipLink.textContent = text;
    skipLink.className = 'skip-link';
    skipLink.setAttribute('aria-label', `Skip to ${text}`);
    return skipLink;
  }
}

// High contrast mode utilities
export class HighContrastMode {
  private static instance: HighContrastMode;
  private isEnabled = false;

  static getInstance(): HighContrastMode {
    if (!HighContrastMode.instance) {
      HighContrastMode.instance = new HighContrastMode();
    }
    return HighContrastMode.instance;
  }

  enable(): void {
    this.isEnabled = true;
    document.documentElement.classList.add('high-contrast');
    this.announceChange('High contrast mode enabled');
  }

  disable(): void {
    this.isEnabled = false;
    document.documentElement.classList.remove('high-contrast');
    this.announceChange('High contrast mode disabled');
  }

  toggle(): void {
    if (this.isEnabled) {
      this.disable();
    } else {
      this.enable();
    }
  }

  isActive(): boolean {
    return this.isEnabled;
  }

  private announceChange(message: string): void {
    const focusManager = new FocusManager();
    focusManager.announce(message);
  }
}

// Reduced motion utilities
export class ReducedMotion {
  private static instance: ReducedMotion;
  private isEnabled = false;

  static getInstance(): ReducedMotion {
    if (!ReducedMotion.instance) {
      ReducedMotion.instance = new ReducedMotion();
    }
    return ReducedMotion.instance;
  }

  enable(): void {
    this.isEnabled = true;
    document.documentElement.classList.add('reduced-motion');
  }

  disable(): void {
    this.isEnabled = false;
    document.documentElement.classList.remove('reduced-motion');
  }

  toggle(): void {
    if (this.isEnabled) {
      this.disable();
    } else {
      this.enable();
    }
  }

  isActive(): boolean {
    return this.isEnabled;
  }

  // Check user's motion preference
  respectsUserPreference(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}

// Screen reader utilities
export class ScreenReaderSupport {
  // Announce page title changes
  announcePageTitle(title: string): void {
    const focusManager = new FocusManager();
    focusManager.announce(`Page loaded: ${title}`);
  }

  // Announce loading states
  announceLoading(message: string): void {
    const focusManager = new FocusManager();
    focusManager.announce(message, 'assertive');
  }

  // Announce completion
  announceComplete(message: string): void {
    const focusManager = new FocusManager();
    focusManager.announce(message);
  }

  // Create screen reader only text
  srOnly(text: string): string {
    return `<span class="sr-only">${text}</span>`;
  }

  // Announce form validation errors
  announceFormErrors(errors: string[]): void {
    const focusManager = new FocusManager();
    const message = `Form has ${errors.length} error${errors.length > 1 ? 's' : ''}: ${errors.join(', ')}`;
    focusManager.announce(message, 'assertive');
  }

  // Announce search results
  announceSearchResults(count: number, query: string): void {
    const focusManager = new FocusManager();
    const message = `Found ${count} result${count !== 1 ? 's' : ''} for "${query}"`;
    focusManager.announce(message);
  }
}

// Accessibility testing utilities
export class AccessibilityTester {
  // Check color contrast ratio
  static checkColorContrast(foreground: string, background: string): number {
    // Simplified contrast calculation
    const getLuminance = (color: string): number => {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16) / 255;
      const g = parseInt(hex.substr(2, 2), 16) / 255;
      const b = parseInt(hex.substr(4, 2), 16) / 255;
      
      const [rs, gs, bs] = [r, g, b].map(c => {
        if (c <= 0.03928) return c / 12.92;
        return Math.pow((c + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const l1 = getLuminance(foreground);
    const l2 = getLuminance(background);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  // Validate ARIA attributes
  static validateAriaAttributes(element: HTMLElement): string[] {
    const errors: string[] = [];
    const ariaAttributes = element.getAttributeNames().filter(name => name.startsWith('aria-'));

    ariaAttributes.forEach(attr => {
      const value = element.getAttribute(attr);
      
      // Check for empty aria-labels
      if (attr === 'aria-label' && (!value || value.trim() === '')) {
        errors.push('aria-label should not be empty');
      }
      
      // Check for valid aria-expanded values
      if (attr === 'aria-expanded' && !['true', 'false'].includes(value || '')) {
        errors.push('aria-expanded must be "true" or "false"');
      }
      
      // Check for valid aria-selected values
      if (attr === 'aria-selected' && !['true', 'false'].includes(value || '')) {
        errors.push('aria-selected must be "true" or "false"');
      }
    });

    return errors;
  }

  // Check for missing alt text
  static checkMissingAltText(): HTMLImageElement[] {
    const images = document.querySelectorAll('img');
    const missingAlt: HTMLImageElement[] = [];
    
    images.forEach(img => {
      if (!img.hasAttribute('alt')) {
        missingAlt.push(img);
      }
    });
    
    return missingAlt;
  }

  // Check for proper heading structure
  static checkHeadingStructure(): string[] {
    const errors: string[] = [];
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      
      if (index === 0 && level !== 1) {
        errors.push('Page should start with h1 heading');
      }
      
      if (level > previousLevel + 1) {
        errors.push(`Heading level skipped: ${previousLevel} to ${level}`);
      }
      
      previousLevel = level;
    });
    
    return errors;
  }

  // Check for keyboard navigation
  static checkKeyboardNavigation(): string[] {
    const errors: string[] = [];
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [role="button"], [role="tab"]');
    
    interactiveElements.forEach(element => {
      if (!element.hasAttribute('tabindex') && element.tagName !== 'A') {
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden') {
          errors.push(`Interactive element ${element.tagName} should be keyboard accessible`);
        }
      }
    });
    
    return errors;
  }
}

// Export instances
export const keyboardNavigator = new KeyboardNavigator();
export const focusManager = new FocusManager();
export const highContrastMode = HighContrastMode.getInstance();
export const reducedMotion = ReducedMotion.getInstance();
export const screenReader = new ScreenReaderSupport();
