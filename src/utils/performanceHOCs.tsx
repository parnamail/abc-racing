import React, { useState, useEffect, ComponentType } from 'react';

// ============================================================================
// PERFORMANCE MEASUREMENT UTILITIES
// ============================================================================

// Performance metrics interface
interface PerformanceMetrics {
  [key: string]: number[];
}

// Global performance tracker
const performanceTracker = {
  metrics: {} as PerformanceMetrics,
  
  recordMetric(name: string, value: number): void {
    if (!this.metrics[name]) {
      this.metrics[name] = [];
    }
    this.metrics[name].push(value);
  },
  
  getAverageMetric(name: string): number {
    const values = this.metrics[name];
    if (!values || values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  },
  
  getAllMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    Object.keys(this.metrics).forEach(name => {
      result[name] = this.getAverageMetric(name);
    });
    return result;
  },
  
  clearMetrics(): void {
    this.metrics = {};
  }
};

// Export performance utilities
export const getPerformanceMetrics = () => performanceTracker.getAllMetrics();
export const clearPerformanceMetrics = () => performanceTracker.clearMetrics();

// ============================================================================
// ESSENTIAL HIGHER-ORDER COMPONENTS (HOCs)
// ============================================================================

/**
 * HOC for performance monitoring
 */
export const withPerformanceMonitoring = <P extends object>(
  WrappedComponent: ComponentType<P>,
  componentName: string = 'Component'
) => {
  return (props: P) => {
    useEffect(() => {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        performanceTracker.recordMetric(`${componentName}-render`, renderTime);
      };
    });
    
    return <WrappedComponent {...props} />;
  };
};

/**
 * HOC for mobile optimization
 */
export const withMobileOptimization = <P extends object>(
  WrappedComponent: ComponentType<P>
) => {
  return (props: P) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkMobile = (): boolean => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      };

      setIsMobile(checkMobile());
    }, []);

    useEffect(() => {
      if (!isMobile) return;
      
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
    }, [isMobile]);
    
    return <WrappedComponent {...props} isMobile={isMobile} />;
  };
};

/**
 * HOC for error boundary functionality
 */
export const withErrorBoundary = <P extends object>(
  WrappedComponent: ComponentType<P>
) => {
  return (props: P) => {
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    if (hasError) {
      return (
        <div className="p-4 border border-red-300 bg-red-50 rounded-lg">
          <h3 className="text-red-800 font-semibold mb-2">Something went wrong</h3>
          <p className="text-red-600 text-sm mb-3">
            {error?.message || 'An unexpected error occurred'}
          </p>
          <button 
            onClick={() => {
              setHasError(false);
              setError(null);
            }}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      );
    }
    
    try {
      return <WrappedComponent {...props} />;
    } catch (err) {
      setError(err as Error);
      setHasError(true);
      return null;
    }
  };
};

/**
 * HOC for memoization (prevent unnecessary re-renders)
 */
export const withMemo = <P extends object>(
  WrappedComponent: ComponentType<P>
) => {
  return React.memo(WrappedComponent) as any;
};

/**
 * Compose multiple HOCs together
 */
export const composeHOCs = <P extends object>(
  ...hocs: Array<(component: ComponentType<P>) => ComponentType<P>>
) => {
  return (WrappedComponent: ComponentType<P>) => {
    return hocs.reduceRight((acc, hoc) => hoc(acc), WrappedComponent);
  };
};
