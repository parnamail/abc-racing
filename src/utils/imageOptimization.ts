// Image optimization utilities
export interface OptimizedImageConfig {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  lazy?: boolean;
  priority?: boolean;
}

// Generate hash for image URL for better caching (browser-compatible)
export const generateImageHash = (url: string): string => {
  // Simple hash function for browser compatibility
  let hash = 0;
  if (url.length === 0) return hash.toString(16);
  
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(16).substring(0, 8);
};

// Get optimized image URL with parameters
export const getOptimizedImageUrl = (
  originalUrl: string,
  width: number = 400,
  height: number = 400,
  quality: number = 80,
  format: 'webp' | 'avif' | 'jpeg' | 'png' = 'webp'
): string => {
  // For Unsplash images, use their optimization API
  if (originalUrl.includes('unsplash.com')) {
    const baseUrl = originalUrl.split('?')[0];
    return `${baseUrl}?w=${width}&h=${height}&fit=crop&crop=face&q=${quality}&fm=${format}`;
  }
  
  // For other images, you can implement your own CDN optimization
  // This is a placeholder for custom image optimization service
  return originalUrl;
};

// Generate responsive image sources
export const generateResponsiveSources = (
  originalUrl: string,
  sizes: { width: number; height: number }[] = [
    { width: 400, height: 400 },   // Mobile
    { width: 600, height: 600 },   // Tablet
    { width: 800, height: 800 }    // Desktop
  ]
): string[] => {
  return sizes.map(size => 
    getOptimizedImageUrl(originalUrl, size.width, size.height)
  );
};

// Get appropriate image size based on device
export const getImageSizeForDevice = (): { width: number; height: number } => {
  if (typeof window === 'undefined') return { width: 400, height: 400 };
  
  const screenWidth = window.innerWidth;
  if (screenWidth < 768) return { width: 400, height: 400 }; // Mobile
  if (screenWidth < 1024) return { width: 600, height: 600 }; // Tablet
  return { width: 800, height: 800 }; // Desktop
};

// Check if WebP is supported
export const isWebPSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

// Check if AVIF is supported
export const isAVIFSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
};

// Get best image format for current browser
export const getBestImageFormat = (): 'webp' | 'avif' | 'jpeg' => {
  if (isAVIFSupported()) return 'avif';
  if (isWebPSupported()) return 'webp';
  return 'jpeg';
};

// Preload critical images
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Intersection Observer for lazy loading
export const createLazyLoadObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void
): IntersectionObserver => {
  return new IntersectionObserver(callback, {
    rootMargin: '50px 0px',
    threshold: 0.1
  });
};

// Generate placeholder for images
export const generatePlaceholder = (width: number, height: number): string => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%239ca3af'%3ELoading...%3C/text%3E%3C/svg%3E`;
};

// Optimize image configuration
export const optimizeImageConfig = (config: OptimizedImageConfig): OptimizedImageConfig => {
  const format = getBestImageFormat();
  const { width, height } = getImageSizeForDevice();
  
  return {
    ...config,
    width: config.width || width,
    height: config.height || height,
    quality: config.quality || 80,
    format: config.format || format,
    lazy: config.lazy !== false, // Default to lazy loading
    priority: config.priority || false
  };
};
