# Removing Duplicates from Arrays in React

This guide provides various methods to remove duplicates from arrays in React applications, from simple to advanced approaches.

## Quick Start - Most Common Methods

### 1. For Primitive Values (Strings, Numbers, etc.)

```typescript
// Most Efficient - Using Set
const removeDuplicates = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

// Usage
const numbers = [1, 2, 2, 3, 3, 4];
const uniqueNumbers = removeDuplicates(numbers); // [1, 2, 3, 4]

const fruits = ['apple', 'banana', 'apple', 'cherry'];
const uniqueFruits = removeDuplicates(fruits); // ['apple', 'banana', 'cherry']
```

### 2. For Objects (by specific key)

```typescript
// Remove duplicates by object key
const removeDuplicatesByKey = <T, K extends keyof T>(
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

// Usage
const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 1, name: 'John' }, // Duplicate
  { id: 3, name: 'Bob' }
];

const uniqueUsers = removeDuplicatesByKey(users, 'id');
// Result: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }, { id: 3, name: 'Bob' }]
```

## All Available Methods

### 1. Using Set (Most Efficient)
```typescript
const unique = Array.from(new Set(array));
- **Best for**: Primitive values
- **Performance**: O(n)
- **Pros**: Simple, fast, maintains order
- **Cons**: Only works with primitive values

### 2. Using Filter with indexOf
```typescript
const unique = array.filter((item, index) => array.indexOf(item) === index);
```
- **Best for**: Primitive values
- **Performance**: O(n²)
- **Pros**: Simple, works with any value type
- **Cons**: Slower for large arrays

### 3. Using Reduce
```typescript
const unique = array.reduce((acc, item) => {
  return acc.includes(item) ? acc : [...acc, item];
}, [] as T[]);
```
- **Best for**: Primitive values
- **Performance**: O(n²)
- **Pros**: Functional programming style
- **Cons**: Slower for large arrays

### 4. Using Map for Objects
```typescript
const map = new Map();
array.forEach(item => {
  const keyValue = item[key];
  if (!map.has(keyValue)) {
    map.set(keyValue, item);
  }
});
const unique = Array.from(map.values());
```
- **Best for**: Objects with unique keys
- **Performance**: O(n)
- **Pros**: Fast, preserves object structure
- **Cons**: More complex

### 5. Using Custom Comparator
```typescript
const unique = array.filter((item, index) => {
  return !array.slice(0, index).some(prevItem => 
    comparator(item, prevItem)
  );
});
```
- **Best for**: Complex comparison logic
- **Performance**: O(n²)
- **Pros**: Flexible comparison
- **Cons**: Slow for large arrays

## React-Specific Solutions

### 1. Custom Hook for Managing Unique Arrays

```typescript
import React from 'react';

export const useUniqueArray = <T>(initialArray: T[] = []) => {
  const [uniqueArray, setUniqueArray] = React.useState<T[]>(() => 
    removeDuplicates(initialArray)
  );

  const addUnique = React.useCallback((item: T) => {
    setUniqueArray(prev => {
      if (!prev.includes(item)) {
        return [...prev, item];
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
        return [...prev, item];
      }
      return prev;
    });
  }, []);

  const removeItem = React.useCallback((item: T) => {
    setUniqueArray(prev => prev.filter(i => i !== item));
  }, []);

  const clear = React.useCallback(() => {
    setUniqueArray([]);
  }, []);

  return {
    array: uniqueArray,
    addUnique,
    addUniqueByKey,
    removeItem,
    clear,
    setArray: setUniqueArray
  };
};

// Usage in component
const MyComponent = () => {
  const { array, addUnique, removeItem, clear } = useUniqueArray<string>([]);

  return (
    <div>
      <button onClick={() => addUnique('new item')}>Add Item</button>
      <button onClick={clear}>Clear All</button>
      {array.map(item => (
        <div key={item}>
          {item}
          <button onClick={() => removeItem(item)}>Remove</button>
        </div>
      ))}
    </div>
  );
};
```

### 2. useState with Duplicate Removal

```typescript
const [items, setItems] = useState<string[]>([]);

// Add item without duplicates
const addItem = (newItem: string) => {
  setItems(prev => {
    if (!prev.includes(newItem)) {
      return prev.concat([newItem]);
    }
    return prev;
  });
};

// Remove duplicates from existing array
const removeDuplicates = () => {
  setItems(prev => Array.from(new Set(prev)));
};
```

## Performance Comparison

| Method | Time Complexity | Space Complexity | Best For |
|--------|----------------|------------------|----------|
| Set | O(n) | O(n) | Primitive values |
| Filter + indexOf | O(n²) | O(n) | Small arrays |
| Reduce | O(n²) | O(n) | Functional style |
| Map | O(n) | O(n) | Objects by key |
| Custom Comparator | O(n²) | O(n) | Complex logic |

## Real-World Examples

### 1. Managing Selected Items

```typescript
const [selectedItems, setSelectedItems] = useState<string[]>([]);

const toggleItem = (item: string) => {
  setSelectedItems(prev => {
    if (prev.includes(item)) {
      return prev.filter(i => i !== item);
    } else {
      return prev.concat([item]);
    }
  });
};
```

### 2. Merging Arrays Without Duplicates

```typescript
const mergeArraysUnique = <T>(...arrays: T[][]): T[] => {
  const combined = arrays.flat();
  return Array.from(new Set(combined));
};

// Usage
const array1 = ['a', 'b', 'c'];
const array2 = ['b', 'c', 'd'];
const merged = mergeArraysUnique(array1, array2); // ['a', 'b', 'c', 'd']
```

### 3. Filtering API Results

```typescript
const [users, setUsers] = useState<User[]>([]);

const addUsers = (newUsers: User[]) => {
  setUsers(prev => {
    const combined = prev.concat(newUsers);
    return removeDuplicatesByKey(combined, 'id');
  });
};
```

### 4. Managing Tags/Categories

```typescript
const [tags, setTags] = useState<string[]>([]);

const addTag = (tag: string) => {
  setTags(prev => {
    const trimmedTag = tag.trim().toLowerCase();
    if (!prev.includes(trimmedTag)) {
      return prev.concat([trimmedTag]);
    }
    return prev;
  });
};
```

## Best Practices

1. **Choose the right method**: Use Set for primitives, Map for objects
2. **Consider performance**: For large arrays, avoid O(n²) methods
3. **Maintain immutability**: Always create new arrays, don't mutate existing ones
4. **Use TypeScript**: Leverage type safety for better code quality
5. **Test edge cases**: Handle empty arrays, null values, and edge cases
6. **Consider order**: Some methods preserve order, others don't

## Common Pitfalls

1. **Mutating arrays**: Always use immutable operations
2. **Ignoring case sensitivity**: Consider case when comparing strings
3. **Not handling null/undefined**: Add proper checks for edge cases
4. **Using wrong comparison**: Objects need custom comparison logic
5. **Performance issues**: Choose appropriate method for array size

## Utility Functions Available

The project includes a comprehensive utility file (`src/utils/arrayUtils.ts`) with:

- `removeDuplicates()` - Basic Set-based removal
- `removeDuplicatesByKey()` - Object removal by key
- `removeDuplicatesFilter()` - Filter-based removal
- `removeDuplicatesReduce()` - Reduce-based removal
- `removeDuplicatesOptimized()` - Performance-optimized version
- `removeDuplicatesDeep()` - Deep object comparison
- `useUniqueArray()` - React hook for managing unique arrays
- `mergeArraysUnique()` - Merge multiple arrays without duplicates
- And many more...

## Components Available

1. **SimpleDuplicateExamples** - Basic examples with interactive UI
2. **DuplicateRemover** - Comprehensive demonstration with all methods

These components provide interactive examples and can be used as reference implementations.
