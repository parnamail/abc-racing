/**
 * Array utility functions for removing duplicates
 */

import React from 'react';

// 1. Using Set (Most efficient for primitive values)
export const removeDuplicates = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

// 2. Using Set with custom key function (for objects)
export const removeDuplicatesByKey = <T, K extends keyof T>(
  array: T[],
  key: K
): T[] => {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

// 3. Using filter with indexOf (for primitive values)
export const removeDuplicatesFilter = <T>(array: T[]): T[] => {
  return array.filter((item, index) => array.indexOf(item) === index);
};

// 4. Using reduce (for primitive values)
export const removeDuplicatesReduce = <T>(array: T[]): T[] => {
  return array.reduce((unique, item) => {
    return unique.includes(item) ? unique : unique.concat([item]);
  }, [] as T[]);
};

// 5. Using Map (for objects with custom key)
export const removeDuplicatesByKeyMap = <T, K extends keyof T>(
  array: T[],
  key: K
): T[] => {
  const map = new Map();
  array.forEach(item => {
    const keyValue = item[key];
    if (!map.has(keyValue)) {
      map.set(keyValue, item);
    }
  });
  return Array.from(map.values());
};

// 6. Using custom comparison function
export const removeDuplicatesWithComparator = <T>(
  array: T[],
  comparator: (a: T, b: T) => boolean
): T[] => {
  return array.filter((item, index) => {
    return !array.slice(0, index).some(prevItem => comparator(item, prevItem));
  });
};

// 7. React Hook for managing unique arrays
export const useUniqueArray = <T>(initialArray: T[] = []) => {
  const [uniqueArray, setUniqueArray] = React.useState<T[]>(() => 
    removeDuplicates(initialArray)
  );

  const addUnique = React.useCallback((item: T) => {
    setUniqueArray(prev => {
      if (!prev.includes(item)) {
        return prev.concat([item]);
      }
      return prev;
    });
  }, []);

  const addUniqueByKey = React.useCallback(<K extends keyof T>(
    item: T,
    key: K
  ) => {
    setUniqueArray(prev => {
      const keyValue = item[key];
      const exists = prev.some(existingItem => existingItem[key] === keyValue);
      if (!exists) {
        return prev.concat([item]);
      }
      return prev;
    });
  }, []);

  const removeItem = React.useCallback((item: T) => {
    setUniqueArray(prev => prev.filter(i => i !== item));
  }, []);

  const removeItemByKey = React.useCallback(<K extends keyof T>(
    item: T,
    key: K
  ) => {
    setUniqueArray(prev => {
      const keyValue = item[key];
      return prev.filter(i => i[key] !== keyValue);
    });
  }, []);

  const clear = React.useCallback(() => {
    setUniqueArray([]);
  }, []);

  return {
    array: uniqueArray,
    addUnique,
    addUniqueByKey,
    removeItem,
    removeItemByKey,
    clear,
    setArray: setUniqueArray
  };
};

// 8. Utility for merging arrays without duplicates
export const mergeArraysUnique = <T>(...arrays: T[][]): T[] => {
  const combined = arrays.flat();
  return removeDuplicates(combined);
};

// 9. Utility for merging objects by key
export const mergeObjectsByKey = <T, K extends keyof T>(
  arrays: T[][],
  key: K
): T[] => {
  const map = new Map();
  arrays.flat().forEach(item => {
    const keyValue = item[key];
    if (!map.has(keyValue)) {
      map.set(keyValue, item);
    }
  });
  return Array.from(map.values());
};

// 10. Performance optimized version for large arrays
export const removeDuplicatesOptimized = <T>(array: T[]): T[] => {
  if (array.length <= 1) return array;
  
  const seen = new Set();
  const result: T[] = [];
  
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    if (!seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }
  
  return result;
};

// 11. Deep comparison for objects (expensive but thorough)
export const removeDuplicatesDeep = <T>(array: T[]): T[] => {
  return array.filter((item, index) => {
    return !array.slice(0, index).some(prevItem => 
      JSON.stringify(item) === JSON.stringify(prevItem)
    );
  });
};

// 12. Type-safe version with type guards
export const removeDuplicatesTypeSafe = <T>(
  array: T[],
  isEqual: (a: T, b: T) => boolean = (a, b) => a === b
): T[] => {
  return array.filter((item, index) => {
    return !array.slice(0, index).some(prevItem => isEqual(item, prevItem));
  });
};

// 13. Utility for removing duplicates from multiple arrays simultaneously
export const removeDuplicatesFromMultiple = <T>(...arrays: T[][]): T[][] => {
  const allItems = arrays.flat();
  const uniqueItems = removeDuplicates(allItems);
  
  // Distribute unique items back to original arrays
  const result: T[][] = [];
  let currentIndex = 0;
  
  for (const originalArray of arrays) {
    const newArray: T[] = [];
    for (let i = 0; i < originalArray.length; i++) {
      if (currentIndex < uniqueItems.length) {
        newArray.push(uniqueItems[currentIndex]);
        currentIndex++;
      }
    }
    result.push(newArray);
  }
  
  return result;
};

// 14. Utility for maintaining order while removing duplicates
export const removeDuplicatesPreserveOrder = <T>(array: T[]): T[] => {
  const seen = new Set();
  return array.filter(item => {
    if (seen.has(item)) {
      return false;
    }
    seen.add(item);
    return true;
  });
};

// 15. Utility for removing duplicates with custom transformation
export const removeDuplicatesWithTransform = <T, U>(
  array: T[],
  transform: (item: T) => U
): T[] => {
  const seen = new Set<U>();
  return array.filter(item => {
    const transformed = transform(item);
    if (seen.has(transformed)) {
      return false;
    }
    seen.add(transformed);
    return true;
  });
};
