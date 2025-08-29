import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useCardInteraction, useCardAnimation } from '../utils/cardHooks';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onHover?: () => void;
  hover?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  imageClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  contentClassName?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  selected?: boolean;
  id?: string | number;
}

export interface CardRef {
  focus: () => void;
  blur: () => void;
}

const Card = forwardRef<CardRef, CardProps>(({ 
  children, 
  className = '', 
  onClick, 
  onHover,
  hover = true,
  header,
  footer,
  image,
  imageAlt = '',
  imageClassName = '',
  headerClassName = '',
  footerClassName = '',
  contentClassName = '',
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  selected = false,
  id,
  ...props
}, ref) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { handleCardHover, handleCardClick } = useCardInteraction();
  const { getAnimationClasses } = useCardAnimation();

  useImperativeHandle(ref, () => ({
    focus: () => cardRef.current?.focus(),
    blur: () => cardRef.current?.blur()
  }));

  // Variant-based styling
  const getVariantClasses = () => {
    switch (variant) {
      case 'elevated':
        return 'shadow-lg hover:shadow-xl';
      case 'outlined':
        return 'border-2 border-gray-200 hover:border-gray-300';
      case 'filled':
        return 'bg-gray-50 hover:bg-gray-100';
      default:
        return 'shadow-sm hover:shadow-md';
    }
  };

  // Size-based styling
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-3 text-sm';
      case 'lg':
        return 'p-6 text-lg';
      default:
        return 'p-4 text-base';
    }
  };

  // Base classes
  const baseClasses = "card rounded-lg transition-all duration-200";
  const variantClasses = getVariantClasses();
  const sizeClasses = getSizeClasses();
  const hoverClasses = hover && !disabled ? getAnimationClasses('hover') : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const selectedClasses = selected ? 'ring-2 ring-primary-500 ring-offset-2' : '';
  const loadingClasses = loading ? 'animate-pulse' : '';

  const combinedClasses = [
    baseClasses,
    variantClasses,
    sizeClasses,
    hoverClasses,
    disabledClasses,
    selectedClasses,
    loadingClasses,
    className
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (!disabled && onClick) {
      handleCardClick(id as number, onClick);
    }
  };

  const handleMouseEnter = () => {
    if (!disabled) {
      handleCardHover(id as number);
      onHover?.();
    }
  };

  const handleMouseLeave = () => {
    handleCardHover(null);
  };

  return (
    <div 
      ref={cardRef}
      className={combinedClasses}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      aria-disabled={disabled}
      aria-selected={selected}
      {...props}
    >
      {/* Image */}
      {image && (
        <div className={`mb-4 ${imageClassName}`}>
          <img 
            src={image} 
            alt={imageAlt} 
            className="w-full h-48 object-cover rounded-lg"
            loading="lazy"
          />
        </div>
      )}
      
      {/* Header */}
      {header && (
        <div className={`card-header mb-3 ${headerClassName}`}>
          {header}
        </div>
      )}
      
      {/* Content */}
      <div className={`flex-1 ${contentClassName}`}>
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        ) : (
          children
        )}
      </div>
      
      {/* Footer */}
      {footer && (
        <div className={`mt-4 pt-4 border-t border-gray-200 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
