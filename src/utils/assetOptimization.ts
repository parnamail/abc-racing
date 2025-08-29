// Asset optimization utilities for CDN-based applications

export interface AssetConfig {
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  cdn?: 'unsplash' | 'cloudinary' | 'generic';
  optimization?: {
    quality?: number;
    format?: string;
    width?: number;
    height?: number;
  };
  caching?: {
    strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate';
    maxAge?: number;
  };
}

// CDN Providers configuration
export const CDN_PROVIDERS = {
  unsplash: {
    name: 'Unsplash',
    baseUrl: 'https://images.unsplash.com',
    supports: ['image'],
    optimization: {
      quality: [10, 100],
      format: ['webp', 'avif', 'jpeg', 'png'],
      transformations: ['crop', 'resize', 'blur', 'grayscale']
    }
  },
  cloudinary: {
    name: 'Cloudinary',
    baseUrl: 'https://res.cloudinary.com',
    supports: ['image', 'video', 'audio'],
    optimization: {
      quality: [10, 100],
      format: ['webp', 'avif', 'jpeg', 'png', 'mp4', 'webm'],
      transformations: ['crop', 'resize', 'blur', 'grayscale', 'overlay']
    }
  },
  generic: {
    name: 'Generic CDN',
    baseUrl: '',
    supports: ['image', 'video', 'audio', 'document'],
    optimization: {
      quality: [10, 100],
      format: ['webp', 'jpeg', 'png'],
      transformations: ['resize']
    }
  }
} as const;

// Asset optimization strategies
export class AssetOptimizer {
  private static instance: AssetOptimizer;
  private cache = new Map<string, string>();

  static getInstance(): AssetOptimizer {
    if (!AssetOptimizer.instance) {
      AssetOptimizer.instance = new AssetOptimizer();
    }
    return AssetOptimizer.instance;
  }

  // Optimize asset URL based on configuration
  optimizeAsset(config: AssetConfig): string {
    const cacheKey = this.generateCacheKey(config);
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const optimizedUrl = this.applyOptimization(config);
    this.cache.set(cacheKey, optimizedUrl);
    
    return optimizedUrl;
  }

  // Apply optimization based on CDN type
  private applyOptimization(config: AssetConfig): string {
    const cdn = this.detectCDN(config.url);
    const optimization = config.optimization || {};

    switch (cdn) {
      case 'unsplash':
        return this.optimizeUnsplashUrl(config.url, optimization);
      case 'cloudinary':
        return this.optimizeCloudinaryUrl(config.url, optimization);
      default:
        return this.optimizeGenericUrl(config.url, optimization);
    }
  }

  // Optimize Unsplash URLs
  private optimizeUnsplashUrl(url: string, optimization: any): string {
    const baseUrl = url.split('?')[0];
    const params = new URLSearchParams();

    if (optimization.width) params.set('w', optimization.width.toString());
    if (optimization.height) params.set('h', optimization.height.toString());
    if (optimization.quality) params.set('q', optimization.quality.toString());
    if (optimization.format) params.set('fm', optimization.format);

    params.set('fit', 'crop');
    params.set('crop', 'face');

    return `${baseUrl}?${params.toString()}`;
  }

  // Optimize Cloudinary URLs
  private optimizeCloudinaryUrl(url: string, optimization: any): string {
    const urlParts = url.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) return url;

    const transformations: string[] = [];
    
    if (optimization.width) transformations.push(`w_${optimization.width}`);
    if (optimization.height) transformations.push(`h_${optimization.height}`);
    if (optimization.quality) transformations.push(`q_${optimization.quality}`);
    if (optimization.format) transformations.push(`f_${optimization.format}`);

    if (transformations.length > 0) {
      urlParts.splice(uploadIndex + 1, 0, transformations.join(','));
    }

    return urlParts.join('/');
  }

  // Optimize generic URLs
  private optimizeGenericUrl(url: string, optimization: any): string {
    const urlObj = new URL(url);
    
    if (optimization.width) urlObj.searchParams.set('w', optimization.width.toString());
    if (optimization.height) urlObj.searchParams.set('h', optimization.height.toString());
    if (optimization.quality) urlObj.searchParams.set('q', optimization.quality.toString());
    if (optimization.format) urlObj.searchParams.set('f', optimization.format);

    return urlObj.toString();
  }

  // Detect CDN from URL
  private detectCDN(url: string): keyof typeof CDN_PROVIDERS {
    if (url.includes('unsplash.com')) return 'unsplash';
    if (url.includes('cloudinary.com')) return 'cloudinary';
    return 'generic';
  }

  // Generate cache key for optimization
  private generateCacheKey(config: AssetConfig): string {
    return `${config.url}-${JSON.stringify(config.optimization)}`;
  }

  // Clear optimization cache
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache statistics
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

// Preload critical assets
export const preloadAssets = async (assets: AssetConfig[]): Promise<void> => {
  const preloadPromises = assets.map(async (asset) => {
    const optimizer = AssetOptimizer.getInstance();
    const optimizedUrl = optimizer.optimizeAsset(asset);

    switch (asset.type) {
      case 'image':
        return preloadImage(optimizedUrl);
      case 'video':
        return preloadVideo(optimizedUrl);
      default:
        return Promise.resolve();
    }
  });

  await Promise.allSettled(preloadPromises);
};

// Preload image
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    img.src = src;
  });
};

// Preload video
const preloadVideo = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => resolve();
    video.onerror = () => reject(new Error(`Failed to preload video: ${src}`));
    video.src = src;
  });
};

// Generate responsive asset sources
export const generateResponsiveAssets = (
  asset: AssetConfig,
  breakpoints: { width: number; media?: string }[] = [
    { width: 400, media: '(max-width: 768px)' },
    { width: 600, media: '(max-width: 1024px)' },
    { width: 800, media: '(min-width: 1025px)' }
  ]
): Array<{ src: string; media?: string }> => {
  const optimizer = AssetOptimizer.getInstance();
  
  return breakpoints.map(breakpoint => ({
    src: optimizer.optimizeAsset({
      ...asset,
      optimization: {
        ...asset.optimization,
        width: breakpoint.width
      }
    }),
    media: breakpoint.media
  }));
};

// Asset loading performance monitoring
export class AssetPerformanceMonitor {
  private metrics = new Map<string, number[]>();

  // Record asset load time
  recordLoadTime(assetUrl: string, loadTime: number): void {
    if (!this.metrics.has(assetUrl)) {
      this.metrics.set(assetUrl, []);
    }
    this.metrics.get(assetUrl)!.push(loadTime);
  }

  // Get average load time for an asset
  getAverageLoadTime(assetUrl: string): number {
    const times = this.metrics.get(assetUrl);
    if (!times || times.length === 0) return 0;
    
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }

  // Get all performance metrics
  getAllMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    
    // Use forEach instead of for...of for better compatibility
    this.metrics.forEach((times, url) => {
      result[url] = this.getAverageLoadTime(url);
    });
    
    return result;
  }

  // Clear metrics
  clearMetrics(): void {
    this.metrics.clear();
  }
}

// Export singleton instances
export const assetOptimizer = AssetOptimizer.getInstance();
export const performanceMonitor = new AssetPerformanceMonitor();
