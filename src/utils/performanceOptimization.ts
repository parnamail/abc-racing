// Performance optimization utilities
export interface CacheConfig {
  maxAge: number; // seconds
  maxSize: number; // MB
  strategy: 'memory' | 'localStorage' | 'sessionStorage';
}

export interface NetworkConfig {
  timeout: number; // milliseconds
  retries: number;
  retryDelay: number; // milliseconds
}

// Simple in-memory cache
class MemoryCache {
  private cache = new Map<string, { data: any; timestamp: number; size: number }>();
  private maxSize: number;
  private maxAge: number;

  constructor(maxSize: number = 50, maxAge: number = 3600) {
    this.maxSize = maxSize * 1024 * 1024; // Convert MB to bytes
    this.maxAge = maxAge * 1000; // Convert seconds to milliseconds
  }

  set(key: string, data: any, size: number = 0): void {
    const timestamp = Date.now();
    
    // Remove expired entries
    this.cleanup();
    
    // Check if adding this item would exceed max size
    if (this.getCurrentSize() + size > this.maxSize) {
      this.evictOldest();
    }
    
    this.cache.set(key, { data, timestamp, size });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    // Check if expired
    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    this.cache.forEach((item, key) => {
      if (now - item.timestamp > this.maxAge) {
        this.cache.delete(key);
      }
    });
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();
    
    this.cache.forEach((item, key) => {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp;
        oldestKey = key;
      }
    });
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  private getCurrentSize(): number {
    let totalSize = 0;
    this.cache.forEach((item) => {
      totalSize += item.size;
    });
    return totalSize;
  }
}

// Network performance utilities
export class NetworkOptimizer {
  private cache: MemoryCache;
  private config: NetworkConfig;

  constructor(cacheConfig: CacheConfig, networkConfig: NetworkConfig) {
    this.cache = new MemoryCache(cacheConfig.maxSize, cacheConfig.maxAge);
    this.config = networkConfig;
  }

  // Optimized fetch with caching and retries
  async fetchWithCache(url: string, options: RequestInit = {}): Promise<Response> {
    const cacheKey = this.generateCacheKey(url, options);
    
    // Check cache first
    const cachedResponse = this.cache.get(cacheKey);
    if (cachedResponse) {
      return new Response(JSON.stringify(cachedResponse), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch with retries
    let lastError: Error;
    for (let attempt = 0; attempt <= this.config.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
        
        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Cache successful response
        const data = await response.clone().json();
        this.cache.set(cacheKey, data, JSON.stringify(data).length);
        
        return response;
      } catch (error) {
        lastError = error as Error;
        if (attempt < this.config.retries) {
          await this.delay(this.config.retryDelay * Math.pow(2, attempt)); // Exponential backoff
        }
      }
    }
    
    throw lastError!;
  }

  // Preload critical resources
  async preloadResources(urls: string[]): Promise<void> {
    const promises = urls.map(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = this.getResourceType(url);
      document.head.appendChild(link);
      
      return new Promise<void>((resolve) => {
        link.onload = () => resolve();
        link.onerror = () => resolve(); // Don't fail on preload errors
      });
    });
    
    await Promise.all(promises);
  }

  // Optimize for mobile networks
  isSlowConnection(): boolean {
    if (typeof navigator === 'undefined') return false;
    
    const connection = (navigator as any).connection;
    if (!connection) return false;
    
    return connection.effectiveType === 'slow-2g' || 
           connection.effectiveType === '2g' || 
           connection.effectiveType === '3g' ||
           connection.saveData === true;
  }

  // Get appropriate quality based on connection
  getOptimalQuality(): number {
    if (this.isSlowConnection()) {
      return 60; // Lower quality for slow connections
    }
    return 80; // Default quality
  }

  // Generate cache key
  private generateCacheKey(url: string, options: RequestInit): string {
    const method = options.method || 'GET';
    const body = options.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }

  // Get resource type for preloading
  private getResourceType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js': return 'script';
      case 'css': return 'style';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'webp':
      case 'avif': return 'image';
      case 'woff':
      case 'woff2': return 'font';
      default: return 'fetch';
    }
  }

  // Delay utility
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Mobile-specific optimizations
export class MobileOptimizer {
  // Check if device is mobile
  static isMobile(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }

  // Check if device supports touch
  static isTouchDevice(): boolean {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  // Get optimal image size for device
  static getOptimalImageSize(): { width: number; height: number } {
    if (this.isMobile()) {
      return { width: 300, height: 300 }; // Smaller for mobile
    }
    return { width: 600, height: 600 }; // Larger for desktop
  }

  // Optimize for mobile performance
  static optimizeForMobile(): void {
    if (!this.isMobile()) return;
    
    // Reduce animations on mobile
    document.documentElement.style.setProperty('--animation-duration', '0.2s');
    
    // Optimize touch targets
    const touchTargets = document.querySelectorAll('button, a, input, select, textarea');
    touchTargets.forEach(element => {
      const rect = element.getBoundingClientRect();
      if (rect.height < 44 || rect.width < 44) {
        element.classList.add('min-h-[44px]', 'min-w-[44px]');
      }
    });
  }
}

// Service Worker utilities for offline support
export class ServiceWorkerManager {
  static async register(): Promise<void> {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  static async unregister(): Promise<void> {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  // Measure function execution time
  measure(name: string, fn: () => any): any {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    this.recordMetric(name, end - start);
    return result;
  }

  // Measure async function execution time
  async measureAsync(name: string, fn: () => Promise<any>): Promise<any> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    
    this.recordMetric(name, end - start);
    return result;
  }

  // Record performance metric
  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  // Get average metric
  getAverageMetric(name: string): number {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return 0;
    
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  // Get all metrics
  getAllMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    this.metrics.forEach((_, name) => {
      result[name] = this.getAverageMetric(name);
    });
    return result;
  }

  // Clear metrics
  clearMetrics(): void {
    this.metrics.clear();
  }
}

// Export default instances
export const networkOptimizer = new NetworkOptimizer(
  { maxAge: 3600, maxSize: 50, strategy: 'memory' },
  { timeout: 10000, retries: 3, retryDelay: 1000 }
);

export const performanceMonitor = new PerformanceMonitor();
