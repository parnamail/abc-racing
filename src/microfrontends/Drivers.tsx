import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import ShimmerUI from '../components/ShimmerUI';
import OptimizedImage from '../components/OptimizedImage';
import { MobileOptimizer, performanceMonitor } from '../utils/performanceOptimization';

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

const Drivers: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');

  useEffect(() => {
    // Optimize for mobile performance
    MobileOptimizer.optimizeForMobile();
    
    // Simulate API call with performance monitoring
    const loadDrivers = async () => {
      const driversData = await performanceMonitor.measureAsync('drivers-load', async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return [
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
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face'
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
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
          },
          {
            id: 8,
            name: 'Fernando Alonso',
            team: 'Aston Martin',
            country: 'Spain',
            number: 14,
            points: 33,
            position: 8,
            wins: 0,
            podiums: 1,
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face'
          }
        ];
      });
      
      setDrivers(driversData);
      setLoading(false);
    };

    loadDrivers();
  }, []);

  const teams = ['all', ...Array.from(new Set(drivers.map(driver => driver.team)))];

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = selectedTeam === 'all' || driver.team === selectedTeam;
    return matchesSearch && matchesTeam;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">F1 Drivers</h1>
          <p className="text-gray-600">Formula 1 driver profiles and statistics</p>
        </div>
        <ShimmerUI type="driver" count={8} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mobile-padding">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-responsive-xl font-bold text-gray-900 mb-2">F1 Drivers</h1>
        <p className="text-responsive text-gray-600">Formula 1 driver profiles and statistics</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search drivers or teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="input-field"
          >
            {teams.map(team => (
              <option key={team} value={team}>
                {team === 'all' ? 'All Teams' : team}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Drivers Grid */}
      <div className="responsive-grid gap-4 sm:gap-6">
                 {filteredDrivers.map((driver) => (
           <Card
             key={driver.id}
             header={`#${driver.number} ${driver.name}`}
             image={driver.image}
             imageAlt={`${driver.name} - ${driver.team}`}
             className="hover:scale-105 transition-transform duration-200"
           >
             <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold border-2 border-primary-200">
                    {driver.number}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{driver.name}</div>
                    <div className="text-sm text-gray-600">{driver.team}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">{driver.position}</div>
                  <div className="text-xs text-gray-500">Position</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">{driver.points}</div>
                  <div className="text-xs text-gray-500">Points</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-600">{driver.wins}</div>
                  <div className="text-xs text-gray-500">Wins</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-600">{driver.podiums}</div>
                  <div className="text-xs text-gray-500">Podiums</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">🇳🇱 {driver.country}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  driver.position <= 3 ? 'bg-yellow-100 text-yellow-800' :
                  driver.position <= 10 ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {driver.position <= 3 ? 'Top 3' : 
                   driver.position <= 10 ? 'Points' : 'Outside Points'}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredDrivers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏎️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No drivers found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default Drivers;
