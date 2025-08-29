import React, { useState } from 'react';

const SimpleDuplicateExamples: React.FC = () => {
  const [examples, setExamples] = useState({
    primitive: ['apple', 'banana', 'apple', 'cherry', 'banana'],
    objects: [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 1, name: 'John' }, // Duplicate
      { id: 3, name: 'Bob' }
    ]
  });

  // 1. Remove duplicates from primitive array using Set
  const removePrimitiveDuplicates = () => {
    const unique = Array.from(new Set(examples.primitive));
    setExamples(prev => ({ ...prev, primitive: unique }));
  };

  // 2. Remove duplicates from object array by key
  const removeObjectDuplicates = () => {
    const seen = new Set();
    const unique = examples.objects.filter(item => {
      if (seen.has(item.id)) {
        return false;
      }
      seen.add(item.id);
      return true;
    });
    setExamples(prev => ({ ...prev, objects: unique }));
  };

  // 3. Using filter with indexOf
  const removeWithFilter = () => {
    const unique = examples.primitive.filter((item, index) => 
      examples.primitive.indexOf(item) === index
    );
    setExamples(prev => ({ ...prev, primitive: unique }));
  };

  // 4. Using reduce
  const removeWithReduce = () => {
    const unique = examples.primitive.reduce((acc, item) => {
      return acc.includes(item) ? acc : [...acc, item];
    }, [] as string[]);
    setExamples(prev => ({ ...prev, primitive: unique }));
  };

  // 5. Reset to original
  const reset = () => {
    setExamples({
      primitive: ['apple', 'banana', 'apple', 'cherry', 'banana'],
      objects: [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 1, name: 'John' },
        { id: 3, name: 'Bob' }
      ]
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Simple Duplicate Removal Examples</h1>
      
      {/* Primitive Array */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Primitive Array</h2>
        
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Original:</h3>
          <div className="bg-gray-100 p-3 rounded-md">
            <code className="text-sm">{JSON.stringify(examples.primitive)}</code>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={removePrimitiveDuplicates}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Remove with Set
          </button>
          
          <button
            onClick={removeWithFilter}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
          >
            Remove with Filter
          </button>
          
          <button
            onClick={removeWithReduce}
            className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors"
          >
            Remove with Reduce
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Result:</h3>
          <div className="bg-green-100 p-3 rounded-md">
            <code className="text-sm">{JSON.stringify(examples.primitive)}</code>
          </div>
        </div>
      </div>

      {/* Object Array */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Object Array</h2>
        
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Original:</h3>
          <div className="bg-gray-100 p-3 rounded-md">
            <code className="text-sm">{JSON.stringify(examples.objects, null, 2)}</code>
          </div>
        </div>

        <div className="mb-4">
          <button
            onClick={removeObjectDuplicates}
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors"
          >
            Remove by ID
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Result:</h3>
          <div className="bg-green-100 p-3 rounded-md">
            <code className="text-sm">{JSON.stringify(examples.objects, null, 2)}</code>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <div className="text-center">
        <button
          onClick={reset}
          className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
        >
          Reset All
        </button>
      </div>

      {/* Quick Reference */}
      <div className="bg-blue-50 rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Quick Reference</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Primitive Values:</h3>
            <pre className="bg-white p-3 rounded text-sm overflow-x-auto">
{`// Using Set (Most Efficient)
const unique = Array.from(new Set(array));

// Using Filter
const unique = array.filter((item, index) => 
  array.indexOf(item) === index
);

// Using Reduce
const unique = array.reduce((acc, item) => 
  acc.includes(item) ? acc : acc.concat([item]), []
);`}
            </pre>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Objects by Key:</h3>
            <pre className="bg-white p-3 rounded text-sm overflow-x-auto">
{`// Remove duplicates by object key
const seen = new Set();
const unique = objects.filter(item => {
  if (seen.has(item.id)) return false;
  seen.add(item.id);
  return true;
});

// Using Map
const map = new Map();
objects.forEach(item => {
  if (!map.has(item.id)) {
    map.set(item.id, item);
  }
});
const unique = Array.from(map.values());`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleDuplicateExamples;
