import React from 'react';

interface ShimmerUIProps {
  type?: 'card' | 'driver' | 'news';
  count?: number;
}

const ShimmerUI: React.FC<ShimmerUIProps> = ({ type = 'card', count = 1 }) => {
  const renderShimmerCard = (): JSX.Element => (
    <div className="card animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 rounded w-4/6"></div>
      </div>
    </div>
  );

  const renderShimmerDriver = (): JSX.Element => (
    <div className="card animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
          <div className="flex space-x-2">
            <div className="h-3 bg-gray-300 rounded w-16"></div>
            <div className="h-3 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
        <div className="w-8 h-8 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  const renderShimmerNews = (): JSX.Element => (
    <div className="card animate-pulse">
      <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
      <div className="space-y-3">
        <div className="h-5 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-3 bg-gray-300 rounded w-20"></div>
          <div className="h-3 bg-gray-300 rounded w-16"></div>
        </div>
      </div>
    </div>
  );

  const renderShimmer = (): JSX.Element => {
    switch (type) {
      case 'driver':
        return renderShimmerDriver();
      case 'news':
        return renderShimmerNews();
      default:
        return renderShimmerCard();
    }
  };

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          {renderShimmer()}
        </div>
      ))}
    </div>
  );
};

export default ShimmerUI;
