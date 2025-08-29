import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';
import ShimmerUI from '../components/ShimmerUI';

interface DashboardStats {
  // Simplified interface since we removed most cards
}

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookmarkedStats, setBookmarkedStats] = useState<Set<string>>(new Set());
  const [bookmarkCounts, setBookmarkCounts] = useState({
    drivers: 0,
    news: 0,
    races: 0,
    teams: 0
  });

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setStats({});
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Load bookmark counts from localStorage or simulate from other pages
    const loadBookmarkCounts = () => {
      // Simulate loading bookmark counts from other pages
      const mockCounts = {
        drivers: 2, // From Bookmarks page mock data
        news: 2,    // From Bookmarks page mock data
        races: 1,   // From Bookmarks page mock data
        teams: 0    // No teams bookmarked yet
      };
      setBookmarkCounts(mockCounts);
    };

    loadBookmarkCounts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('dashboard.title')}</h1>
          <p className="text-gray-600">{t('dashboard.subtitle')}</p>
        </div>
        <ShimmerUI type="card" count={6} />
      </div>
    );
  }

  const toggleBookmark = (statKey: string) => {
    setBookmarkedStats(prev => {
      const newSet = new Set(prev);
      if (newSet.has(statKey)) {
        newSet.delete(statKey);
      } else {
        newSet.add(statKey);
      }
      return newSet;
    });

    // Update bookmark counts when toggling
    setBookmarkCounts(prev => {
      const newCounts = { ...prev };
      if (statKey === 'races') {
        newCounts.races = bookmarkedStats.has('races') ? newCounts.races - 1 : newCounts.races + 1;
      } else if (statKey === 'teams') {
        newCounts.teams = bookmarkedStats.has('teams') ? newCounts.teams - 1 : newCounts.teams + 1;
      } else if (statKey === 'drivers') {
        newCounts.drivers = bookmarkedStats.has('drivers') ? newCounts.drivers - 1 : newCounts.drivers + 1;
      } else if (statKey === 'countries') {
        // Countries count as races for now
        newCounts.races = bookmarkedStats.has('countries') ? newCounts.races - 1 : newCounts.races + 1;
      }
      return newCounts;
    });
  };

  const isBookmarked = (statKey: string): boolean => {
    return bookmarkedStats.has(statKey);
  };

  if (!stats) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto mobile-padding">
      <div className="mb-6 sm:mb-8 text-center">
        <h1 className="text-responsive-xl font-bold text-gray-900 mb-2">{t('dashboard.title')}</h1>
        <p className="text-responsive text-gray-600">{t('dashboard.subtitle')}</p>
      </div>

      <div className="flex justify-center">
        <div className="responsive-grid gap-4 sm:gap-6 max-w-4xl w-full">
        {/* Quick Stats */}
        <Card header={t('dashboard.quickStats')}>
          <div className="responsive-grid-2 gap-3 sm:gap-4">
            <div className="relative text-center p-4 bg-green-50 rounded-lg group">
              <button
                onClick={() => toggleBookmark('races')}
                className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 border-2 ${
                  isBookmarked('races')
                    ? 'text-yellow-500 border-yellow-300 bg-yellow-50 hover:bg-yellow-100 hover:border-yellow-400'
                    : 'text-gray-400 border-gray-200 hover:text-yellow-500 hover:border-yellow-300 hover:bg-yellow-50'
                }`}
                title={isBookmarked('races') ? t('dashboard.removeFromBookmarks') : t('dashboard.addToBookmarks')}
              >
                🔖
              </button>
              <div className="text-2xl font-bold text-green-600">20</div>
              <div className="text-sm text-gray-600">{t('dashboard.races')}</div>
            </div>
            <div className="relative text-center p-4 bg-purple-50 rounded-lg group">
              <button
                onClick={() => toggleBookmark('teams')}
                className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 border-2 ${
                  isBookmarked('teams')
                    ? 'text-yellow-500 border-yellow-300 bg-yellow-50 hover:bg-yellow-100 hover:border-yellow-400'
                    : 'text-gray-400 border-gray-200 hover:text-yellow-500 hover:border-yellow-300 hover:bg-yellow-50'
                }`}
                title={isBookmarked('teams') ? t('dashboard.removeFromBookmarks') : t('dashboard.addToBookmarks')}
              >
                🔖
              </button>
              <div className="text-2xl font-bold text-purple-600">10</div>
              <div className="text-sm text-gray-600">{t('dashboard.teams')}</div>
            </div>
            <div className="relative text-center p-4 bg-red-50 rounded-lg group">
              <button
                onClick={() => toggleBookmark('drivers')}
                className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 border-2 ${
                  isBookmarked('drivers')
                    ? 'text-yellow-500 border-yellow-300 bg-yellow-50 hover:bg-yellow-100 hover:border-yellow-400'
                    : 'text-gray-400 border-gray-200 hover:text-yellow-500 hover:border-yellow-300 hover:bg-yellow-50'
                }`}
                title={isBookmarked('drivers') ? t('dashboard.removeFromBookmarks') : t('dashboard.addToBookmarks')}
              >
                🔖
              </button>
              <div className="text-2xl font-bold text-red-600">20</div>
              <div className="text-sm text-gray-600">{t('dashboard.drivers')}</div>
            </div>
            <div className="relative text-center p-4 bg-blue-50 rounded-lg group">
              <button
                onClick={() => toggleBookmark('countries')}
                className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 border-2 ${
                  isBookmarked('countries')
                    ? 'text-yellow-500 border-yellow-300 bg-yellow-50 hover:bg-yellow-100 hover:border-yellow-400'
                    : 'text-gray-400 border-gray-200 hover:text-yellow-500 hover:border-yellow-300 hover:bg-yellow-50'
                }`}
                title={isBookmarked('countries') ? t('dashboard.removeFromBookmarks') : t('dashboard.addToBookmarks')}
              >
                🔖
              </button>
              <div className="text-2xl font-bold text-blue-600">24</div>
              <div className="text-sm text-gray-600">{t('dashboard.countries')}</div>
            </div>
          </div>
        </Card>

        {/* Bookmarks Summary */}
        <Card header={t('dashboard.bookmarksSummary')} className="bg-gradient-to-br from-yellow-50 to-yellow-100">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-blue-600">
                  {bookmarkCounts.races}
                </div>
                <div className="text-xs text-gray-600">{t('dashboard.races')}</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                  {bookmarkCounts.teams}
                </div>
                <div className="text-xs text-gray-600">{t('dashboard.teams')}</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-red-600">
                  {bookmarkCounts.drivers}
                </div>
                <div className="text-xs text-gray-600">{t('dashboard.drivers')}</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-purple-600">
                  {bookmarkCounts.news}
                </div>
                <div className="text-xs text-gray-600">{t('dashboard.news')}</div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">
                {t('dashboard.totalBookmarks')}: {bookmarkCounts.drivers + bookmarkCounts.news + bookmarkCounts.races + bookmarkCounts.teams}
              </div>
              <button
                onClick={() => window.location.href = '/bookmarks'}
                className="btn-primary text-sm py-2 px-4"
              >
                {t('dashboard.viewAllBookmarks')}
              </button>
            </div>
          </div>
        </Card>

        {/* Season Progress */}
        <Card header={t('dashboard.seasonProgress')}>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>{t('dashboard.seasonProgressTitle')}</span>
                <span>25%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary-600 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>{t('dashboard.racesCompletedText', { completed: 5, total: 20 })}</p>
              <p>{t('dashboard.nextRace', { race: 'Monaco Grand Prix' })}</p>
            </div>
          </div>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
