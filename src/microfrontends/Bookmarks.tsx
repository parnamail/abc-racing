import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import ShimmerUI from '../components/ShimmerUI';

interface BookmarkedDriver {
  id: number;
  name: string;
  team: string;
  country: string;
  number: number;
  points: number;
  position: number;
  bookmarkedAt: string;
}

interface BookmarkedNews {
  id: number;
  title: string;
  summary: string;
  author: string;
  category: 'race' | 'team' | 'driver' | 'technical' | 'general';
  bookmarkedAt: string;
}

interface BookmarkedRace {
  id: number;
  name: string;
  date: string;
  circuit: string;
  country: string;
  bookmarkedAt: string;
}

interface Bookmarks {
  drivers: BookmarkedDriver[];
  news: BookmarkedNews[];
  races: BookmarkedRace[];
}

const Bookmarks: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [bookmarks, setBookmarks] = useState<Bookmarks>({
    drivers: [],
    news: [],
    races: []
  });
  const [activeTab, setActiveTab] = useState<'all' | 'drivers' | 'news' | 'races'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    // Simulate API call to load bookmarks
    const timer = setTimeout(() => {
      const mockBookmarks: Bookmarks = {
        drivers: [
          {
            id: 1,
            name: 'Max Verstappen',
            team: 'Red Bull Racing',
            country: 'Netherlands',
            number: 1,
            points: 85,
            position: 1,
            bookmarkedAt: '2024-05-20T10:30:00Z'
          },
          {
            id: 2,
            name: 'Charles Leclerc',
            team: 'Ferrari',
            country: 'Monaco',
            number: 16,
            points: 72,
            position: 2,
            bookmarkedAt: '2024-05-19T14:15:00Z'
          }
        ],
        news: [
          {
            id: 1,
            title: 'Verstappen Dominates Monaco Qualifying',
            summary: 'Max Verstappen secured pole position for the Monaco Grand Prix with a stunning lap that was 0.3 seconds faster than his nearest rival.',
            author: 'Sarah Johnson',
            category: 'race',
            bookmarkedAt: '2024-05-25T16:45:00Z'
          },
          {
            id: 2,
            title: 'Ferrari Introduces Major Aero Updates',
            summary: 'Ferrari has brought significant aerodynamic improvements to Monaco, including a new front wing and revised floor design.',
            author: 'Michael Chen',
            category: 'technical',
            bookmarkedAt: '2024-05-25T12:20:00Z'
          }
        ],
        races: [
          {
            id: 1,
            name: 'Monaco Grand Prix',
            date: '2024-05-26',
            circuit: 'Circuit de Monaco',
            country: 'Monaco',
            bookmarkedAt: '2024-05-15T09:00:00Z'
          },
          {
            id: 2,
            name: 'Canadian Grand Prix',
            date: '2024-06-09',
            circuit: 'Circuit Gilles Villeneuve',
            country: 'Canada',
            bookmarkedAt: '2024-05-10T11:30:00Z'
          }
        ]
      };
      setBookmarks(mockBookmarks);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const removeBookmark = (type: 'drivers' | 'news' | 'races', id: number) => {
    setBookmarks(prev => {
      const updatedBookmarks = { ...prev };
      switch (type) {
        case 'drivers':
          updatedBookmarks.drivers = prev.drivers.filter(item => item.id !== id);
          break;
        case 'news':
          updatedBookmarks.news = prev.news.filter(item => item.id !== id);
          break;
        case 'races':
          updatedBookmarks.races = prev.races.filter(item => item.id !== id);
          break;
      }
      return updatedBookmarks;
    });
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'race': return 'bg-red-100 text-red-800';
      case 'team': return 'bg-blue-100 text-blue-800';
      case 'driver': return 'bg-green-100 text-green-800';
      case 'technical': return 'bg-purple-100 text-purple-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookmarks = {
    drivers: bookmarks.drivers.filter(driver =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.team.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    news: bookmarks.news.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    races: bookmarks.races.filter(race =>
      race.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      race.circuit.toLowerCase().includes(searchTerm.toLowerCase())
    )
  };

  const totalBookmarks = bookmarks.drivers.length + bookmarks.news.length + bookmarks.races.length;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookmarks</h1>
          <p className="text-gray-600">Your saved drivers, news, and races</p>
        </div>
        <ShimmerUI type="card" count={6} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mobile-padding">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-responsive-xl font-bold text-gray-900 mb-2">My Bookmarks</h1>
        <p className="text-responsive text-gray-600">Your saved drivers, news, and races</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search bookmarks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
        />
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { key: 'all', label: 'All', count: totalBookmarks },
            { key: 'drivers', label: 'Drivers', count: bookmarks.drivers.length },
            { key: 'news', label: 'News', count: bookmarks.news.length },
            { key: 'races', label: 'Races', count: bookmarks.races.length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeTab === tab.key
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
                 {/* Drivers */}
         {(activeTab === 'all' || activeTab === 'drivers') && filteredBookmarks.drivers.length > 0 && (
           <div>
             <h2 className="text-responsive-lg font-bold text-gray-900 mb-4">Bookmarked Drivers</h2>
             <div className="responsive-grid gap-4 sm:gap-6">
              {filteredBookmarks.drivers.map((driver) => (
                <Card
                  key={driver.id}
                  header={`#${driver.number} ${driver.name}`}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold">
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

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-green-600">{driver.points}</div>
                        <div className="text-xs text-gray-500">Points</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-600">🇳🇱</div>
                        <div className="text-xs text-gray-500">{driver.country}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Bookmarked {formatDate(driver.bookmarkedAt)}</span>
                      <button
                        onClick={() => removeBookmark('drivers', driver.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

                 {/* News */}
         {(activeTab === 'all' || activeTab === 'news') && filteredBookmarks.news.length > 0 && (
           <div>
             <h2 className="text-responsive-lg font-bold text-gray-900 mb-4">Bookmarked News</h2>
             <div className="responsive-grid gap-4 sm:gap-6">
              {filteredBookmarks.news.map((article) => (
                <Card
                  key={article.id}
                  header={article.title}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <div className="space-y-4">
                    <p className="text-gray-700 line-clamp-3">{article.summary}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                          {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                        </span>
                        <span className="text-gray-600">By {article.author}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Bookmarked {formatDate(article.bookmarkedAt)}</span>
                      <button
                        onClick={() => removeBookmark('news', article.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

                 {/* Races */}
         {(activeTab === 'all' || activeTab === 'races') && filteredBookmarks.races.length > 0 && (
           <div>
             <h2 className="text-responsive-lg font-bold text-gray-900 mb-4">Bookmarked Races</h2>
             <div className="responsive-grid gap-4 sm:gap-6">
              {filteredBookmarks.races.map((race) => (
                <Card
                  key={race.id}
                  header={race.name}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 hover:scale-105 transition-transform duration-200"
                >
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-900 mb-2">{race.name}</div>
                      <div className="text-gray-600">
                        <p><strong>Date:</strong> {new Date(race.date).toLocaleDateString()}</p>
                        <p><strong>Circuit:</strong> {race.circuit}</p>
                        <p><strong>Country:</strong> {race.country}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        🏁 Upcoming
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Bookmarked {formatDate(race.bookmarkedAt)}</span>
                      <button
                        onClick={() => removeBookmark('races', race.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {totalBookmarks === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔖</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarks yet</h3>
            <p className="text-gray-600 mb-6">Start bookmarking your favorite drivers, news articles, and races</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => window.location.href = '/drivers'}
                className="btn-primary"
              >
                Browse Drivers
              </button>
              <button
                onClick={() => window.location.href = '/news'}
                className="btn-secondary"
              >
                Read News
              </button>
            </div>
          </div>
        )}

        {/* No Results */}
        {totalBookmarks > 0 && 
         filteredBookmarks.drivers.length === 0 && 
         filteredBookmarks.news.length === 0 && 
         filteredBookmarks.races.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarks found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
