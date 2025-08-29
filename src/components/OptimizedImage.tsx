import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  OptimizedImageConfig,
  getOptimizedImageUrl,
  getImageSizeForDevice,
  getBestImageFormat,
  createLazyLoadObserver,
  generatePlaceholder,
  preloadImage
} from '../utils/imageOptimization';

interface OptimizedImageProps extends OptimizedImageConfig {
  className?: string;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  quality = 80,
  format,
  lazy = true,
  priority = false,
  className = '',
  onClick,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Generate optimized image URL
  const generateOptimizedSrc = useCallback(() => {
    const deviceSize = getImageSizeForDevice();
    const imageWidth = width || deviceSize.width;
    const imageHeight = height || deviceSize.height;
    const imageFormat = format || getBestImageFormat();
    
    return getOptimizedImageUrl(src, imageWidth, imageHeight, quality, imageFormat);
  }, [src, width, height, quality, format]);

  // Handle image load
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setError(false);
    onLoad?.();
  }, [onLoad]);

  // Handle image error
  const handleError = useCallback(() => {
    setError(true);
    setIsLoaded(false);
    onError?.();
  }, [onError]);

  // Setup intersection observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || isInView) {
      setImageSrc(generateOptimizedSrc());
      return;
    }

    if (imgRef.current && typeof window !== 'undefined') {
      observerRef.current = createLazyLoadObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            setImageSrc(generateOptimizedSrc());
            observerRef.current?.disconnect();
          }
        });
      });

      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [lazy, priority, isInView, generateOptimizedSrc]);

  // Preload priority images
  useEffect(() => {
    if (priority && imageSrc) {
      preloadImage(imageSrc).catch(handleError);
    }
  }, [priority, imageSrc, handleError]);

  // Generate placeholder
  const placeholder = generatePlaceholder(width || 400, height || 400);

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      onClick={onClick}
      style={{ width: width || 'auto', height: height || 'auto' }}
    >
      {/* Placeholder */}
      {!isLoaded && !error && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          style={{ backgroundImage: `url("${placeholder}")`, backgroundSize: 'cover' }}
        >
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Failed to load</div>
        </div>
      )}

      {/* Optimized Image */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          style={{
            imageRendering: '-webkit-optimize-contrast'
          }}
        />
      )}

      {/* Loading indicator */}
      {!isLoaded && !error && isInView && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
