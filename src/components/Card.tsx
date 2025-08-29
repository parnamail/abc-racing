import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  image?: string;
  imageAlt?: string;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick, 
  hover = true,
  header,
  footer,
  image,
  imageAlt = ''
}) => {
  const baseClasses = "card";
  const hoverClasses = hover ? "hover:shadow-lg cursor-pointer" : "";
  const combinedClasses = `${baseClasses} ${hoverClasses} ${className}`.trim();

  return (
    <div className={combinedClasses} onClick={onClick}>
      {image && (
        <div className="mb-4">
          <img 
            src={image} 
            alt={imageAlt} 
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}
      
      {header && (
        <div className="card-header">
          {header}
        </div>
      )}
      
      <div className="flex-1">
        {children}
      </div>
      
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
