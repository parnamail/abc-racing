import { useState, useCallback } from 'react';

// Hook for managing bookmark state
export const useBookmark = (initialBookmarks: Set<number> = new Set()) => {
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<number>>(initialBookmarks);

  const toggleBookmark = useCallback((itemId: number) => {
    setBookmarkedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  const isBookmarked = useCallback((itemId: number) => {
    return bookmarkedItems.has(itemId);
  }, [bookmarkedItems]);

  const addBookmark = useCallback((itemId: number) => {
    setBookmarkedItems(prev => new Set(prev).add(itemId));
  }, []);

  const removeBookmark = useCallback((itemId: number) => {
    setBookmarkedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  }, []);

  const clearAllBookmarks = useCallback(() => {
    setBookmarkedItems(new Set());
  }, []);

  return {
    bookmarkedItems,
    toggleBookmark,
    isBookmarked,
    addBookmark,
    removeBookmark,
    clearAllBookmarks,
    bookmarksCount: bookmarkedItems.size
  };
};

// Hook for managing card interactions
export const useCardInteraction = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const handleCardHover = useCallback((cardId: number | null) => {
    setHoveredCard(cardId);
  }, []);

  const handleCardSelect = useCallback((cardId: number | null) => {
    setSelectedCard(cardId);
  }, []);

  const handleCardClick = useCallback((cardId: number, onClick?: () => void) => {
    setSelectedCard(cardId);
    onClick?.();
  }, []);

  return {
    hoveredCard,
    selectedCard,
    handleCardHover,
    handleCardSelect,
    handleCardClick
  };
};

// Hook for managing card filters and search
export const useCardFilter = <T extends Record<string, any>>(
  items: T[],
  searchFields: (keyof T)[],
  filterField?: keyof T
) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filteredItems = items.filter(item => {
    const matchesSearch = searchFields.some(field => {
      const value = item[field];
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    const matchesFilter = filterField 
      ? selectedFilter === 'all' || item[filterField] === selectedFilter
      : true;
    
    return matchesSearch && matchesFilter;
  });

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedFilter('all');
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    selectedFilter,
    setSelectedFilter,
    filteredItems,
    resetFilters
  };
};

// Hook for managing card grid layout
export const useCardGrid = (items: any[], defaultItemsPerPage: number = 12) => {
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    totalPages,
    currentItems,
    itemsPerPage,
    setItemsPerPage,
    goToPage,
    nextPage,
    prevPage,
    resetPagination,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};

// Hook for managing card animations and transitions
export const useCardAnimation = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const animateCard = useCallback(async (animationType: 'enter' | 'exit' | 'hover') => {
    setIsAnimating(true);
    
    // Simulate animation duration
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setIsAnimating(false);
  }, []);

  const getAnimationClasses = useCallback((type: 'enter' | 'exit' | 'hover') => {
    const baseClasses = 'transition-all duration-300 ease-in-out';
    
    switch (type) {
      case 'enter':
        return `${baseClasses} animate-fade-in`;
      case 'exit':
        return `${baseClasses} animate-fade-out`;
      case 'hover':
        return `${baseClasses} hover:scale-105 hover:shadow-lg`;
      default:
        return baseClasses;
    }
  }, []);

  return {
    isAnimating,
    animateCard,
    getAnimationClasses
  };
};
