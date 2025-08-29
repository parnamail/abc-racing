import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import ShimmerUI from '../components/ShimmerUI';

interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishedAt: string;
  category: 'race' | 'team' | 'driver' | 'technical' | 'general';
  image?: string;
  readTime: number;
  featured?: boolean;
}

const News: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Set<number>>(new Set());
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState<boolean>(false);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const newsData: NewsArticle[] = [
        {
          id: 1,
          title: 'Verstappen Dominates Monaco Qualifying',
          summary: 'Max Verstappen secured pole position for the Monaco Grand Prix with a stunning lap that was 0.3 seconds faster than his nearest rival.',
          content: 'The Red Bull driver showed exceptional pace throughout the qualifying session, setting the fastest time in all three segments. His final lap in Q3 was a masterclass in precision driving around the tight and twisty Monaco circuit.',
          author: 'Sarah Johnson',
          publishedAt: '2024-05-25T14:30:00Z',
          category: 'race',
          readTime: 3,
          featured: true
        },
        {
          id: 2,
          title: 'Ferrari Introduces Major Aero Updates',
          summary: 'Ferrari has brought significant aerodynamic improvements to Monaco, including a new front wing and revised floor design.',
          content: 'The Italian team has been working hard to close the gap to Red Bull, and these updates represent their biggest development push of the season so far.',
          author: 'Michael Chen',
          publishedAt: '2024-05-25T12:15:00Z',
          category: 'technical',
          readTime: 5
        },
        {
          id: 3,
          title: 'Hamilton Confirms Mercedes Contract Extension',
          summary: 'Lewis Hamilton has signed a new two-year contract with Mercedes, keeping him with the team until the end of 2026.',
          content: 'The seven-time world champion has been with Mercedes since 2013 and has won six of his seven titles with the team. This extension shows his commitment to the project.',
          author: 'David Williams',
          publishedAt: '2024-05-25T10:45:00Z',
          category: 'driver',
          readTime: 4
        },
        {
          id: 4,
          title: 'McLaren Shows Strong Pace in Practice',
          summary: 'McLaren continued their impressive form with both Lando Norris and Oscar Piastri showing strong pace in the Monaco practice sessions.',
          content: 'The team has made significant progress since the start of the season and could be in contention for podium positions this weekend.',
          author: 'Emma Thompson',
          publishedAt: '2024-05-25T09:20:00Z',
          category: 'team',
          readTime: 3
        },
        {
          id: 5,
          title: 'New Safety Car Rules for 2024 Season',
          summary: 'The FIA has announced updated safety car procedures that will be implemented from the next race onwards.',
          content: 'The changes include improved communication protocols and faster response times to ensure better race flow and safety.',
          author: 'James Wilson',
          publishedAt: '2024-05-24T16:30:00Z',
          category: 'general',
          readTime: 6
        },
        {
          id: 6,
          title: 'Alonso Reflects on Aston Martin Progress',
          summary: 'Fernando Alonso discusses the team\'s development and his hopes for the remainder of the 2024 season.',
          content: 'The two-time world champion has been impressed with the team\'s progress and believes they can continue to improve throughout the season.',
          author: 'Lisa Rodriguez',
          publishedAt: '2024-05-24T14:15:00Z',
          category: 'driver',
          readTime: 4
        }
      ];
      setArticles(newsData);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { value: 'all', label: 'All News' },
    { value: 'race', label: 'Race Reports' },
    { value: 'team', label: 'Team News' },
    { value: 'driver', label: 'Driver News' },
    { value: 'technical', label: 'Technical' },
    { value: 'general', label: 'General' }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesBookmark = !showBookmarkedOnly || isBookmarked(article.id);
    return matchesSearch && matchesCategory && matchesBookmark;
  });

  const featuredArticles = filteredArticles.filter(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

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

  const toggleBookmark = (articleId: number) => {
    setBookmarkedArticles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(articleId)) {
        newSet.delete(articleId);
      } else {
        newSet.add(articleId);
      }
      return newSet;
    });
  };

  const isBookmarked = (articleId: number): boolean => {
    return bookmarkedArticles.has(articleId);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">F1 News</h1>
          <p className="text-gray-600">Latest Formula 1 news and updates</p>
        </div>
        <ShimmerUI type="news" count={6} />
      </div>
    );
  }

    return (
    <div className="max-w-7xl mx-auto mobile-padding">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-responsive-xl font-bold text-gray-900 mb-2">F1 News</h1>
        <p className="text-responsive text-gray-600">Latest Formula 1 news and updates</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
                   <div className="flex-1">
            <input
              type="text"
              placeholder="Search news articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
             {categories.map(category => (
               <option key={category.value} value={category.value}>
                 {category.label}
               </option>
             ))}
           </select>
         </div>
         <div className="sm:w-auto">
           <button
             onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
             className={`px-4 py-2 border rounded-md transition-colors duration-200 flex items-center space-x-2 ${
               showBookmarkedOnly
                 ? 'bg-yellow-100 border-yellow-300 text-yellow-800'
                 : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
             }`}
           >
             <span>🔖</span>
             <span>{showBookmarkedOnly ? 'Show All' : 'Bookmarks'}</span>
             {bookmarkedArticles.size > 0 && (
               <span className="ml-1 px-2 py-0.5 text-xs bg-yellow-200 text-yellow-800 rounded-full">
                 {bookmarkedArticles.size}
               </span>
             )}
           </button>
         </div>
       </div>

             {/* Featured Articles */}
       {featuredArticles.length > 0 && (
         <div className="mb-6 sm:mb-8">
           <h2 className="text-responsive-lg font-bold text-gray-900 mb-4">Featured News</h2>
           <div className="responsive-grid-2 gap-4 sm:gap-6">
            {featuredArticles.map((article) => (
              <Card
                key={article.id}
                header={article.title}
                className="border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-white"
              >
                <div className="space-y-4">
                  <p className="text-gray-700">{article.summary}</p>
                                     <div className="flex items-center justify-between text-sm">
                     <div className="flex items-center space-x-4">
                       <span className="text-gray-600">By {article.author}</span>
                       <span className="text-gray-500">{formatDate(article.publishedAt)}</span>
                     </div>
                     <div className="flex items-center space-x-2">
                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                         {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                       </span>
                       <span className="text-gray-500">{article.readTime} min read</span>
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           toggleBookmark(article.id);
                         }}
                         className={`p-2 rounded-full transition-colors duration-200 border ${
                           isBookmarked(article.id)
                             ? 'text-yellow-500 hover:text-yellow-600 border-yellow-300 bg-yellow-50'
                             : 'text-gray-400 hover:text-yellow-500 border-gray-300 hover:border-yellow-300'
                         }`}
                         title={isBookmarked(article.id) ? 'Remove from bookmarks' : 'Add to bookmarks'}
                       >
                         {isBookmarked(article.id) ? '🔖' : '🔖'}
                       </button>
                     </div>
                   </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

             {/* Regular Articles */}
       <div>
         <h2 className="text-responsive-lg font-bold text-gray-900 mb-4">Latest News</h2>
         <div className="responsive-grid gap-4 sm:gap-6">
          {regularArticles.map((article) => (
            <Card
              key={article.id}
              header={article.title}
              className="hover:scale-105 transition-transform duration-200"
            >
              <div className="space-y-4">
                <p className="text-gray-700 line-clamp-3">{article.summary}</p>
                                 <div className="flex items-center justify-between text-sm">
                   <div className="flex items-center space-x-4">
                     <span className="text-gray-600">By {article.author}</span>
                     <span className="text-gray-500">{formatDate(article.publishedAt)}</span>
                   </div>
                   <div className="flex items-center space-x-2">
                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                       {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                     </span>
                     <span className="text-gray-500">{article.readTime} min</span>
                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         toggleBookmark(article.id);
                       }}
                       className={`p-2 rounded-full transition-colors duration-200 border ${
                         isBookmarked(article.id)
                           ? 'text-yellow-500 hover:text-yellow-600 border-yellow-300 bg-yellow-50'
                           : 'text-gray-400 hover:text-yellow-500 border-gray-300 hover:border-yellow-300'
                       }`}
                       title={isBookmarked(article.id) ? 'Remove from bookmarks' : 'Add to bookmarks'}
                     >
                       {isBookmarked(article.id) ? '🔖' : '🔖'}
                     </button>
                   </div>
                 </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📰</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default News;
