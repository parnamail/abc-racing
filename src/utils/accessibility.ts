// AAA-level accessibility utilities
export interface AccessibilityConfig {
  enableHighContrast: boolean;
  enableReducedMotion: boolean;
  enableScreenReader: boolean;
  enableKeyboardNavigation: boolean;
  enableFocusIndicators: boolean;
  enableSkipLinks: boolean;
  enableLargeText: boolean;
  enableDyslexiaFriendly: boolean;
  enableColorBlindSupport: boolean;
  enableVoiceControl: boolean;
}

// WCAG 2.1 AAA Level Requirements
export const WCAG_AAA_REQUIREMENTS = {
  // Color Contrast Ratios
  CONTRAST_RATIOS: {
    NORMAL_TEXT: 7.0,      // AAA level for normal text
    LARGE_TEXT: 4.5,       // AAA level for large text (18pt+ or 14pt+ bold)
    UI_COMPONENTS: 3.0,    // AAA level for UI components and graphics
  },
  
  // Text sizing
  MIN_FONT_SIZE: 16,       // Minimum font size in pixels
  LINE_HEIGHT: 1.5,        // Minimum line height ratio
  
  // Focus indicators
  FOCUS_INDICATOR_WIDTH: 3, // Minimum focus indicator width in pixels
  FOCUS_INDICATOR_COLOR: '#2563eb', // High contrast focus color
  
  // Animation and motion
  MAX_ANIMATION_DURATION: 500, // Maximum animation duration in milliseconds
  REDUCED_MOTION_THRESHOLD: 200, // Threshold for reduced motion
  
  // Keyboard navigation
  TAB_ORDER_LOGICAL: true,  // Ensure logical tab order
  KEYBOARD_SHORTCUTS: true, // Provide keyboard shortcuts
  
  // Screen reader support
  ARIA_LABELS_REQUIRED: true, // All interactive elements need labels
  SEMANTIC_HTML: true,      // Use semantic HTML elements
  HEADING_HIERARCHY: true,  // Proper heading structure
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
  region: (name: string) => ({ role: 'region', 'aria-label': name }),

  // Form labels and descriptions
  label: (id: string, text: string) => ({ htmlFor: id, id: `${id}-label` }),
  describedBy: (id: string) => ({ 'aria-describedby': `${id}-description` }),
  required: { 'aria-required': 'true' },
  invalid: (id: string) => ({ 'aria-invalid': 'true', 'aria-describedby': `${id}-error` }),
  error: (id: string, message: string) => ({ 
    id: `${id}-error`, 
    role: 'alert', 
    'aria-live': 'assertive',
    'aria-atomic': 'true'
  }),

  // Interactive elements
  button: (pressed?: boolean, expanded?: boolean) => ({ 
    role: 'button', 
    tabIndex: 0,
    ...(pressed !== undefined && { 'aria-pressed': pressed.toString() }),
    ...(expanded !== undefined && { 'aria-expanded': expanded.toString() })
  }),
  tab: (selected: boolean, controls: string, id: string) => ({
    role: 'tab',
    id: id,
    'aria-selected': selected.toString(),
    'aria-controls': controls,
    tabIndex: selected ? 0 : -1
  }),
  tabpanel: (labelledBy: string, id: string) => ({
    role: 'tabpanel',
    id: id,
    'aria-labelledby': labelledBy,
    tabIndex: 0
  }),
  tablist: (id: string, orientation: 'horizontal' | 'vertical' = 'horizontal') => ({
    role: 'tablist',
    id: id,
    'aria-orientation': orientation
  }),

  // Lists and navigation
  list: { role: 'list' },
  listItem: { role: 'listitem' },
  menu: { role: 'menu' },
  menuitem: { role: 'menuitem', tabIndex: -1 },
  menubar: { role: 'menubar' },

  // Status and live regions
  status: { role: 'status', 'aria-live': 'polite' },
  alert: { role: 'alert', 'aria-live': 'assertive' },
  log: { role: 'log', 'aria-live': 'polite' },
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
  }),

  // Dialog and modal
  dialog: (id: string, labelledBy: string) => ({
    role: 'dialog',
    id: id,
    'aria-labelledby': labelledBy,
    'aria-modal': 'true'
  }),

  // Tooltip
  tooltip: (id: string, describedBy: string) => ({
    role: 'tooltip',
    id: id,
    'aria-describedby': describedBy
  }),

  // Combobox
  combobox: (id: string, expanded: boolean, controls: string) => ({
    role: 'combobox',
    id: id,
    'aria-expanded': expanded.toString(),
    'aria-controls': controls,
    'aria-autocomplete': 'list'
  }),

  // Listbox
  listbox: (id: string, multiSelect: boolean = false) => ({
    role: 'listbox',
    id: id,
    'aria-multiselectable': multiSelect.toString()
  }),

  // Option
  option: (selected: boolean, id: string) => ({
    role: 'option',
    id: id,
    'aria-selected': selected.toString()
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

// Accessibility testing utilities - AAA Level Compliance
export class AccessibilityTester {
  // Enhanced color contrast ratio calculation for AAA compliance
  static checkColorContrast(foreground: string, background: string): number {
    const getLuminance = (color: string): number => {
      // Handle different color formats
      let hex = color.replace('#', '');
      if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
      }
      
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

  // Check if contrast ratio meets AAA standards
  static isAAACompliant(contrastRatio: number, textSize: 'normal' | 'large' = 'normal'): boolean {
    const requiredRatio = textSize === 'large' 
      ? WCAG_AAA_REQUIREMENTS.CONTRAST_RATIOS.LARGE_TEXT 
      : WCAG_AAA_REQUIREMENTS.CONTRAST_RATIOS.NORMAL_TEXT;
    
    return contrastRatio >= requiredRatio;
  }

  // Comprehensive color contrast testing
  static checkAllColorContrasts(): Array<{element: HTMLElement, ratio: number, compliant: boolean, textSize: 'normal' | 'large'}> {
    const results: Array<{element: HTMLElement, ratio: number, compliant: boolean, textSize: 'normal' | 'large'}> = [];
    
    // Check all text elements
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button, label, input, textarea');
    
    textElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const color = computedStyle.color;
      const backgroundColor = computedStyle.backgroundColor;
      const fontSize = parseFloat(computedStyle.fontSize);
      const fontWeight = computedStyle.fontWeight;
      
      // Determine if text is large (18pt+ or 14pt+ bold)
      const isLargeText = fontSize >= 18 || (fontSize >= 14 && parseInt(fontWeight) >= 700);
      const textSize: 'normal' | 'large' = isLargeText ? 'large' : 'normal';
      
      const ratio = this.checkColorContrast(color, backgroundColor);
      const compliant = this.isAAACompliant(ratio, textSize);
      
      results.push({
        element: element as HTMLElement,
        ratio,
        compliant,
        textSize
      });
    });
    
    return results;
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

  // Check for proper focus indicators
  static checkFocusIndicators(): string[] {
    const errors: string[] = [];
    const focusableElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    
    focusableElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const outline = computedStyle.outline;
      const boxShadow = computedStyle.boxShadow;
      
      if (outline === 'none' && !boxShadow.includes('rgb')) {
        errors.push(`Focus indicator missing for ${element.tagName} element`);
      }
    });
    
    return errors;
  }

  // Check for proper form labels
  static checkFormLabels(): string[] {
    const errors: string[] = [];
    const formControls = document.querySelectorAll('input, select, textarea');
    
    formControls.forEach(control => {
      const id = control.getAttribute('id');
      const ariaLabel = control.getAttribute('aria-label');
      const ariaLabelledBy = control.getAttribute('aria-labelledby');
      const placeholder = control.getAttribute('placeholder');
      
      if (!id && !ariaLabel && !ariaLabelledBy && !placeholder) {
        errors.push(`Form control ${control.tagName} missing accessible label`);
      }
    });
    
    return errors;
  }

  // Check for proper language attributes
  static checkLanguageAttributes(): string[] {
    const errors: string[] = [];
    const html = document.documentElement;
    const lang = html.getAttribute('lang');
    
    if (!lang) {
      errors.push('HTML element missing lang attribute');
    }
    
    // Check for language changes in content
    const elementsWithLang = document.querySelectorAll('[lang]');
    elementsWithLang.forEach(element => {
      const langValue = element.getAttribute('lang');
      if (!langValue || langValue.length < 2) {
        errors.push('Invalid lang attribute value');
      }
    });
    
    return errors;
  }

  // Check for proper skip links
  static checkSkipLinks(): string[] {
    const errors: string[] = [];
    const skipLinks = document.querySelectorAll('.skip-link, [href^="#"]');
    
    if (skipLinks.length === 0) {
      errors.push('No skip links found for keyboard navigation');
    }
    
    skipLinks.forEach(link => {
      const href = link.getAttribute('href');
      const target = document.querySelector(href || '');
      
      if (!target) {
        errors.push(`Skip link target not found: ${href}`);
      }
    });
    
    return errors;
  }

  // Check for proper ARIA landmarks
  static checkAriaLandmarks(): string[] {
    const errors: string[] = [];
    const landmarks = document.querySelectorAll('[role="banner"], [role="main"], [role="navigation"], [role="complementary"], [role="contentinfo"]');
    
    // Check for duplicate landmarks
    const landmarkTypes = Array.from(landmarks).map(el => el.getAttribute('role'));
    const duplicates = landmarkTypes.filter((type, index) => landmarkTypes.indexOf(type) !== index);
    
    if (duplicates.length > 0) {
      errors.push(`Duplicate landmarks found: ${duplicates.join(', ')}`);
    }
    
    // Check for missing main landmark
    const mainLandmark = document.querySelector('[role="main"]');
    if (!mainLandmark) {
      errors.push('Missing main landmark');
    }
    
    return errors;
  }

  // Check for proper table structure
  static checkTableStructure(): string[] {
    const errors: string[] = [];
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
      const headers = table.querySelectorAll('th');
      const caption = table.querySelector('caption');
      
      if (headers.length > 0 && !caption) {
        errors.push('Table with headers missing caption');
      }
      
      headers.forEach(header => {
        const scope = header.getAttribute('scope');
        if (!scope || !['row', 'col', 'rowgroup', 'colgroup'].includes(scope)) {
          errors.push('Table header missing or invalid scope attribute');
        }
      });
    });
    
    return errors;
  }

  // Check for proper list structure
  static checkListStructure(): string[] {
    const errors: string[] = [];
    const lists = document.querySelectorAll('ul, ol');
    
    lists.forEach(list => {
      const listItems = list.querySelectorAll('li');
      if (listItems.length === 0) {
        errors.push('Empty list found');
      }
    });
    
    return errors;
  }

  // Check for proper button and link text
  static checkInteractiveElementText(): string[] {
    const errors: string[] = [];
    const buttons = document.querySelectorAll('button');
    const links = document.querySelectorAll('a[href]');
    
    buttons.forEach(button => {
      const text = button.textContent?.trim();
      const ariaLabel = button.getAttribute('aria-label');
      
      if (!text && !ariaLabel) {
        errors.push('Button missing accessible text');
      }
    });
    
    links.forEach(link => {
      const text = link.textContent?.trim();
      const ariaLabel = link.getAttribute('aria-label');
      const title = link.getAttribute('title');
      
      if (!text && !ariaLabel && !title) {
        errors.push('Link missing accessible text');
      }
    });
    
    return errors;
  }

  // Comprehensive AAA compliance check
  static runAAAComplianceCheck(): {
    passed: boolean;
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    results: {
      category: string;
      passed: boolean;
      issues: string[];
    }[];
  } {
    const results = [
      {
        category: 'Color Contrast',
        passed: true,
        issues: this.checkAllColorContrasts().filter(r => !r.compliant).map(r => 
          `Insufficient contrast ratio ${r.ratio.toFixed(2)} for ${r.textSize} text`
        )
      },
      {
        category: 'ARIA Attributes',
        passed: true,
        issues: this.validateAriaAttributes(document.body)
      },
      {
        category: 'Alt Text',
        passed: true,
        issues: this.checkMissingAltText().map(img => `Image missing alt text: ${img.src}`)
      },
      {
        category: 'Heading Structure',
        passed: true,
        issues: this.checkHeadingStructure()
      },
      {
        category: 'Keyboard Navigation',
        passed: true,
        issues: this.checkKeyboardNavigation()
      },
      {
        category: 'Focus Indicators',
        passed: true,
        issues: this.checkFocusIndicators()
      },
      {
        category: 'Form Labels',
        passed: true,
        issues: this.checkFormLabels()
      },
      {
        category: 'Language Attributes',
        passed: true,
        issues: this.checkLanguageAttributes()
      },
      {
        category: 'Skip Links',
        passed: true,
        issues: this.checkSkipLinks()
      },
      {
        category: 'ARIA Landmarks',
        passed: true,
        issues: this.checkAriaLandmarks()
      },
      {
        category: 'Table Structure',
        passed: true,
        issues: this.checkTableStructure()
      },
      {
        category: 'List Structure',
        passed: true,
        issues: this.checkListStructure()
      },
      {
        category: 'Interactive Element Text',
        passed: true,
        issues: this.checkInteractiveElementText()
      }
    ];

    // Update passed status based on issues
    results.forEach(result => {
      result.passed = result.issues.length === 0;
    });

    const totalChecks = results.length;
    const passedChecks = results.filter(r => r.passed).length;
    const failedChecks = totalChecks - passedChecks;
    const passed = failedChecks === 0;

    return {
      passed,
      totalChecks,
      passedChecks,
      failedChecks,
      results
    };
  }
}

// Export instances
export const keyboardNavigator = new KeyboardNavigator();
export const focusManager = new FocusManager();
export const highContrastMode = HighContrastMode.getInstance();
export const reducedMotion = ReducedMotion.getInstance();
export const screenReader = new ScreenReaderSupport();
