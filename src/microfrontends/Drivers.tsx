import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';
import ShimmerUI from '../components/ShimmerUI';
import { useBookmark, useCardFilter } from '../utils/cardHooks';

import { 
  withPerformanceMonitoring,
  withMobileOptimization,
  withErrorBoundary,
  withMemo,
  composeHOCs
} from '../utils/performanceHOCs';

interface Driver {
  id: number;
  name: string;
  team: string;
  country: string;
  number: number;
  points: number;
  position: number;
  wins: number;
  podiums: number;
  image?: string;
}

// Base Drivers component
const DriversBase: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  // Use custom hooks for better organization
  const { 
    bookmarkedItems, 
    toggleBookmark, 
    isBookmarked, 
    bookmarksCount 
  } = useBookmark();

  const { 
    searchTerm, 
    setSearchTerm, 
    selectedFilter, 
    setSelectedFilter, 
    filteredItems 
  } = useCardFilter(drivers, ['name', 'team', 'country'], 'team');

  useEffect(() => {
    // Simulate API call
    const loadDrivers = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const driversData = [
        {
          id: 1,
          name: 'Max Verstappen',
          team: 'Red Bull Racing',
          country: 'Netherlands',
          number: 1,
          points: 85,
          position: 1,
          wins: 3,
          podiums: 5,
          image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&h=400&fit=crop&crop=face'
        },
        {
          id: 2,
          name: 'Charles Leclerc',
          team: 'Ferrari',
          country: 'Monaco',
          number: 16,
          points: 72,
          position: 2,
          wins: 1,
          podiums: 4,
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
        },
        {
          id: 3,
          name: 'Lando Norris',
          team: 'McLaren',
          country: 'United Kingdom',
          number: 4,
          points: 58,
          position: 3,
          wins: 0,
          podiums: 3,
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
        },
        {
          id: 4,
          name: 'Carlos Sainz',
          team: 'Ferrari',
          country: 'Spain',
          number: 55,
          points: 55,
          position: 4,
          wins: 1,
          podiums: 3,
          image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face'
        },
        {
          id: 5,
          name: 'George Russell',
          team: 'Mercedes',
          country: 'United Kingdom',
          number: 63,
          points: 47,
          position: 5,
          wins: 0,
          podiums: 2,
          image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face'
        },
        {
          id: 6,
          name: 'Lewis Hamilton',
          team: 'Mercedes',
          country: 'United Kingdom',
          number: 44,
          points: 42,
          position: 6,
          wins: 0,
          podiums: 1,
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
        },
        {
          id: 7,
          name: 'Oscar Piastri',
          team: 'McLaren',
          country: 'Australia',
          number: 81,
          points: 38,
          position: 7,
          wins: 0,
          podiums: 1,
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
        },
        {
          id: 8,
          name: 'Fernando Alonso',
          team: 'Aston Martin',
          country: 'Spain',
          number: 14,
          points: 35,
          position: 8,
          wins: 0,
          podiums: 1,
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
        }
      ];
      
      setDrivers(driversData);
      setLoading(false);
    };
    
    loadDrivers();
  }, []);

  if (loading) {
    return <ShimmerUI type="driver" count={8} />;
  }

  // Get unique teams for filter
  const teams = ['all', ...Array.from(new Set(drivers.map(driver => driver.team)))];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('drivers.title')}</h1>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="flex-1">
            <input
              type="text"
              placeholder={t('drivers.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          {/* Team Filter */}
          <div className="sm:w-48">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {teams.map(team => (
                <option key={team} value={team}>
                  {team === 'all' ? t('drivers.allTeams') : team}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Results Count */}
        <p className="text-gray-600 mb-4">
          {filteredItems.length === 0 
            ? t('drivers.noDriversFound')
            : `${filteredItems.length} ${filteredItems.length === 1 ? t('drivers.driver') : t('drivers.drivers')}`
          }
        </p>
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((driver) => (
          <Card
            key={driver.id}
            id={driver.id}
            variant="default"
            size="md"
            className="hover:shadow-lg transition-shadow duration-200"
            header={
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">{t('drivers.driverNumber', { number: driver.number })}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">{driver.country}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(driver.id);
                    }}
                    className={`flex-shrink-0 p-1.5 rounded-full transition-all duration-200 border-2 ${
                      isBookmarked(driver.id)
                        ? 'text-yellow-500 border-yellow-300 bg-yellow-50 hover:bg-yellow-100 hover:border-yellow-400'
                        : 'text-gray-400 border-gray-200 hover:text-yellow-500 hover:border-yellow-300 hover:bg-yellow-50'
                    }`}
                    title={isBookmarked(driver.id) ? t('drivers.removeBookmark') : t('drivers.addBookmark')}
                  >
                    🔖
                  </button>
                </div>
              </div>
            }
            image={driver.image}
            imageAlt={`${driver.name} - ${driver.team}`}
            footer={
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('drivers.points', { points: driver.points })}</span>
                  <span className="text-gray-600">{t('drivers.wins', { wins: driver.wins })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('drivers.podiums', { podiums: driver.podiums })}</span>
                  <span className="text-gray-600">P#{driver.position}</span>
                </div>
              </div>
            }
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{driver.name}</h3>
              <p className="text-gray-600">{driver.team}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const Drivers = composeHOCs(
  withMemo,
  withPerformanceMonitoring,
  withMobileOptimization,
  withErrorBoundary
 )(DriversBase);

export default Drivers;
