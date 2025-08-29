import React, { useState, useEffect } from 'react';
import {
  removeDuplicates,
  removeDuplicatesByKey,
  removeDuplicatesFilter,
  removeDuplicatesReduce,
  useUniqueArray,
  mergeArraysUnique,
  removeDuplicatesOptimized,
  removeDuplicatesDeep,
  removeDuplicatesTypeSafe
} from '../utils/arrayUtils';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

const DuplicateRemover: React.FC = () => {
  const [inputArray, setInputArray] = useState<string>('');
  const [result, setResult] = useState<string[]>([]);
  const [method, setMethod] = useState<string>('set');
  const [users, setUsers] = useState<User[]>([]);

  // Example data
  const sampleArray = ['apple', 'banana', 'apple', 'cherry', 'banana', 'date'];
  const sampleUsers: User[] = [
    { id: 1, name: 'John', email: 'john@example.com', age: 25 },
    { id: 2, name: 'Jane', email: 'jane@example.com', age: 30 },
    { id: 1, name: 'John', email: 'john@example.com', age: 25 }, // Duplicate
    { id: 3, name: 'Bob', email: 'bob@example.com', age: 35 },
    { id: 2, name: 'Jane', email: 'jane@example.com', age: 30 }, // Duplicate
  ];

  // Using the custom hook
  const { array: uniqueUsers, addUnique, removeItem, clear } = useUniqueArray<User>([]);

  useEffect(() => {
    setUsers(sampleUsers);
  }, []);

  const processArray = () => {
    const array = inputArray.split(',').map(item => item.trim()).filter(Boolean);
    let processed: string[] = [];

    switch (method) {
      case 'set':
        processed = removeDuplicates(array);
        break;
      case 'filter':
        processed = removeDuplicatesFilter(array);
        break;
      case 'reduce':
        processed = removeDuplicatesReduce(array);
        break;
      case 'optimized':
        processed = removeDuplicatesOptimized(array);
        break;
      case 'deep':
        processed = removeDuplicatesDeep(array);
        break;
      case 'typesafe':
        processed = removeDuplicatesTypeSafe(array);
        break;
      default:
        processed = removeDuplicates(array);
    }

    setResult(processed);
  };

  const removeUserDuplicates = () => {
    const uniqueUsers = removeDuplicatesByKey(users, 'id');
    setUsers(uniqueUsers);
  };

  const mergeArrays = () => {
    const array1 = ['a', 'b', 'c'];
    const array2 = ['b', 'c', 'd'];
    const array3 = ['c', 'd', 'e'];
    const merged = mergeArraysUnique(array1, array2, array3);
    setResult(merged);
  };

  const addUser = () => {
    const newUser: User = {
      id: Math.floor(Math.random() * 1000),
      name: `User ${Math.floor(Math.random() * 100)}`,
      email: `user${Math.floor(Math.random() * 100)}@example.com`,
      age: Math.floor(Math.random() * 50) + 18
    };
    addUnique(newUser);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Array Duplicate Remover</h1>
      
      {/* Basic Array Processing */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Remove Duplicates from Array</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter comma-separated values:
          </label>
          <input
            type="text"
            value={inputArray}
            onChange={(e) => setInputArray(e.target.value)}
            placeholder="apple, banana, apple, cherry, banana"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select method:
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="set">Using Set (Most Efficient)</option>
            <option value="filter">Using Filter</option>
            <option value="reduce">Using Reduce</option>
            <option value="optimized">Optimized Version</option>
            <option value="deep">Deep Comparison</option>
            <option value="typesafe">Type-Safe Version</option>
          </select>
        </div>

        <button
          onClick={processArray}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Remove Duplicates
        </button>

        {result.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Result:</h3>
            <div className="bg-gray-100 p-3 rounded-md">
              <code className="text-sm">{JSON.stringify(result)}</code>
            </div>
          </div>
        )}
      </div>

      {/* Sample Array Examples */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Sample Array Examples</h2>
        
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Original Array:</h3>
          <div className="bg-gray-100 p-3 rounded-md mb-4">
            <code className="text-sm">{JSON.stringify(sampleArray)}</code>
          </div>
          
          <h3 className="text-lg font-medium text-gray-700 mb-2">After removing duplicates:</h3>
          <div className="bg-green-100 p-3 rounded-md">
            <code className="text-sm">{JSON.stringify(removeDuplicates(sampleArray))}</code>
          </div>
        </div>

        <button
          onClick={mergeArrays}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Merge Multiple Arrays
        </button>
      </div>

      {/* Object Array Examples */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Object Array Examples</h2>
        
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Original Users (with duplicates):</h3>
          <div className="bg-gray-100 p-3 rounded-md mb-4 max-h-40 overflow-y-auto">
            <code className="text-sm">{JSON.stringify(users, null, 2)}</code>
          </div>
          
          <button
            onClick={removeUserDuplicates}
            className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors mr-2"
          >
            Remove Duplicates by ID
          </button>
          
          <button
            onClick={() => setUsers(sampleUsers)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            Reset Users
          </button>
        </div>

        {users.length !== sampleUsers.length && (
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">After removing duplicates:</h3>
            <div className="bg-green-100 p-3 rounded-md max-h-40 overflow-y-auto">
              <code className="text-sm">{JSON.stringify(users, null, 2)}</code>
            </div>
          </div>
        )}
      </div>

      {/* Custom Hook Example */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Custom Hook Example</h2>
        
        <div className="mb-4">
          <button
            onClick={addUser}
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors mr-2"
          >
            Add Random User
          </button>
          
          <button
            onClick={clear}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Unique Users (using hook):</h3>
          <div className="bg-blue-100 p-3 rounded-md max-h-40 overflow-y-auto">
            <code className="text-sm">{JSON.stringify(uniqueUsers, null, 2)}</code>
          </div>
        </div>

        {uniqueUsers.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Remove individual users:</h3>
            <div className="flex flex-wrap gap-2">
              {uniqueUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => removeItem(user)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition-colors text-sm"
                >
                  Remove {user.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Performance Comparison */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Performance Comparison</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-gray-700 mb-2">Most Efficient:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Using Set (O(n))</li>
              <li>• Optimized version (O(n))</li>
              <li>• Filter with indexOf (O(n²))</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-gray-700 mb-2">Use Cases:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Primitive values: Use Set</li>
              <li>• Objects by key: Use removeDuplicatesByKey</li>
              <li>• Deep comparison: Use removeDuplicatesDeep</li>
              <li>• React state: Use useUniqueArray hook</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuplicateRemover;
