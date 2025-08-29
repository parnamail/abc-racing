# ABC Racing - Formula 1 Dashboard

A modern React TypeScript application with microfrontend architecture for Formula 1 racing statistics, driver profiles, and news. Features internationalization, performance optimizations, offline capabilities, and a modular component system.

## 🏁 Features

- **Dashboard**: Real-time F1 statistics, championship standings, and race information
- **Drivers**: Comprehensive driver profiles with search and filtering capabilities
- **News**: Latest F1 news with category filtering and search functionality
- **Bookmarks**: Save and manage your favorite drivers, news articles, and races
- **Microfrontend Architecture**: Modular design with lazy-loaded components
- **Internationalization**: Multi-language support (EN, ES, FR, DE, IT, PT, JA, ZH, AR, HI)
- **Performance Optimization**: HOCs, custom hooks, and memoization for optimal performance
- **Offline Support**: IndexedDB storage, service worker caching, and offline-first design
- **Shimmer UI**: Modern loading states instead of traditional spinners
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **TypeScript**: Full type safety and better development experience
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## 🚀 Tech Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **React i18next** for internationalization
- **Tailwind CSS** for styling
- **Microfrontend Architecture** with lazy loading
- **Performance HOCs** for optimization
- **Custom Hooks** for reusable logic
- **IndexedDB** for offline storage
- **Service Workers** for caching
- **Shimmer UI** for loading states

## 📁 Project Structure

```
src/
├── components/          # Shared components
│   ├── Card.tsx        # Enhanced reusable card component with hooks
│   ├── Navigation.tsx  # Main navigation with i18n
│   ├── LanguageSelector.tsx # Language selection component
│   ├── OfflineControls.tsx  # Offline settings and content management
│   └── ShimmerUI.tsx   # Loading shimmer effects
├── microfrontends/     # Microfrontend modules
│   ├── Dashboard.tsx   # Dashboard with enhanced Card usage
│   ├── Drivers.tsx     # Drivers with performance HOCs and i18n
│   ├── News.tsx        # News with pagination and enhanced Card
│   └── Bookmarks.tsx   # Bookmarks management
├── utils/              # Utility functions and hooks
│   ├── performanceHOCs.tsx # Performance optimization HOCs
│   ├── cardHooks.ts   # Custom hooks for Card components
│   ├── offlineHooks.ts # Custom hooks for offline functionality
│   ├── offlineManager.ts # Offline data management
│   ├── assetOptimization.ts # CDN-based asset optimization
│   └── accessibility.ts # Accessibility utilities
├── i18n/               # Internationalization
│   ├── index.ts        # i18n configuration
│   └── locales/        # Translation files (EN, ES, FR, DE, IT, PT, JA, ZH, AR, HI)
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## 🎯 Microfrontend Architecture

The application follows a microfrontend pattern with:

- **Host Application**: Main shell with navigation, routing, and language selection
- **Dashboard Microfrontend**: Racing statistics, overview, and bookmark management
- **Drivers Microfrontend**: Driver profiles, search, filtering, and performance optimization
- **News Microfrontend**: News articles with filtering, pagination, and enhanced Card usage
- **Bookmarks Microfrontend**: Saved content management across all content types

Each microfrontend is lazy-loaded for optimal performance and uses performance optimization HOCs.

## 🌍 Internationalization

The application supports 10 languages:
- **English** (EN) - Default language
- **Spanish** (ES)
- **French** (FR)
- **German** (DE)
- **Italian** (IT)
- **Portuguese** (PT)
- **Japanese** (JA)
- **Chinese** (ZH)
- **Arabic** (AR)
- **Hindi** (HI)

Language selection is available in the navigation header with automatic language detection and fallback support.

## ⚡ Performance Features

### Higher-Order Components (HOCs)
- **withMemo**: Memoization for expensive components
- **withPerformanceMonitoring**: Performance tracking and metrics
- **withMobileOptimization**: Mobile-specific optimizations
- **withErrorBoundary**: Error boundary wrapper
- **composeHOCs**: Utility to combine multiple HOCs

### Custom Hooks
- **useBookmark**: Bookmark management across components
- **useCardInteraction**: Card hover and selection states
- **useCardFilter**: Search and filtering functionality
- **useCardGrid**: Pagination and grid management
- **useCardAnimation**: Animation and transition effects
- **useOfflineStatus**: Network status monitoring
- **useOfflineContent**: Offline content management
- **useStorageUsage**: Storage quota monitoring

### Asset Optimization
- **CDN Integration**: Cloud-based image optimization
- **Responsive Images**: Automatic image sizing and formats
- **Preloading**: Strategic asset preloading
- **Performance Monitoring**: Asset load time tracking

## 🔌 Offline Capabilities

### Storage Management
- **IndexedDB**: Client-side database for offline data
- **Service Worker**: Background caching and sync
- **Storage Quota**: Automatic storage management
- **Content Types**: Configurable offline content preferences

### Offline Features
- **Content Caching**: Cache drivers, news, and dashboard data
- **Sync Operations**: Background data synchronization
- **Storage Monitoring**: Real-time storage usage tracking
- **Database Reset**: Troubleshooting and maintenance tools

## 🎨 Design Features

- **Enhanced Card Components**: Flexible card system with variants, sizes, and custom hooks
- **Shimmer Loading**: Modern loading states with animated placeholders
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Color-coded Categories**: Visual distinction for different content types
- **Hover Effects**: Interactive elements with smooth transitions
- **Bookmark Integration**: Seamless bookmark functionality across all components
- **Accessibility**: ARIA labels, keyboard navigation, and focus management

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd abc-racing
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 📱 Pages

### Dashboard
- Championship standings and statistics
- Next race information and countdown
- Recent results and team standings
- Quick statistics with bookmark integration
- Season progress tracking
- Enhanced Card components with custom hooks

### Drivers
- Comprehensive driver profiles with statistics
- Advanced search and team filtering
- Position indicators and performance metrics
- Bookmark functionality for favorite drivers
- Performance optimization with HOCs
- Internationalization support

### News
- Latest F1 news articles with categories
- Advanced filtering and search functionality
- Featured articles with enhanced styling
- Pagination and grid management
- Reading time estimates and author information
- Bookmark integration for articles

### Bookmarks
- Unified bookmark management across all content types
- Tabbed interface for different content categories
- Search and filter bookmarks
- Remove bookmarks functionality
- Bookmark timestamps and metadata
- Enhanced Card display for bookmarked items

### Offline Controls
- Network status monitoring
- Content caching management
- Storage usage tracking
- Sync operations and preferences
- Database maintenance tools

## 🎨 Customization

### Styling
The application uses Tailwind CSS with custom configurations in `tailwind.config.js`. You can customize:

- Color schemes and themes
- Typography and spacing
- Animations and transitions
- Responsive breakpoints

### Components
All components are built with TypeScript interfaces for type safety. You can extend or modify:

- **Card Component**: Multiple variants, sizes, and custom hooks
- **ShimmerUI**: Custom loading states and animations
- **Navigation**: Additional routes and language support
- **Offline Controls**: Custom offline functionality

### Internationalization
Add new languages by:
1. Creating a new locale file in `src/i18n/locales/`
2. Adding language metadata to the language selector
3. Translating all UI strings

## 🔧 Development

### TypeScript
The project is fully typed with TypeScript. Key interfaces include:

- `Driver` - Driver profile data
- `NewsArticle` - News article structure
- `DashboardStats` - Dashboard statistics
- `OfflineContent` - Offline content management
- `OfflinePreferences` - User preferences
- Component props interfaces for all components

### State Management
Each microfrontend manages its own state using React hooks and custom hooks:

- **useState** for local state
- **useEffect** for side effects
- **Custom hooks** for reusable logic
- **Performance HOCs** for optimization

### Performance Optimization
- **HOC Composition**: Combine multiple optimization HOCs
- **Memoization**: Prevent unnecessary re-renders
- **Custom Hooks**: Encapsulate complex logic
- **Asset Optimization**: CDN and bundler optimization

## 🚀 Performance

- **Lazy Loading**: Microfrontends load on demand
- **Code Splitting**: Automatic code splitting with React.lazy
- **HOC Optimization**: Performance monitoring and memoization
- **Custom Hooks**: Efficient state management and logic reuse
- **Asset Optimization**: CDN-based image optimization and preloading
- **Bundle Optimization**: Tree-shaking and production builds

## 🔒 Offline & Storage

- **IndexedDB**: Client-side database for offline data
- **Service Worker**: Background caching and sync
- **Storage Management**: Automatic quota management
- **Content Caching**: Configurable offline content
- **Sync Operations**: Background data synchronization

## ♿ Accessibility

- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Proper focus handling
- **Screen Reader Support**: Comprehensive accessibility features
- **Internationalization**: Multi-language accessibility

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure accessibility compliance
6. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository.

## 🔄 Recent Updates

- **Internationalization**: Added 10-language support with react-i18next
- **Performance HOCs**: Implemented performance optimization HOCs
- **Custom Hooks**: Created reusable hooks for Card and offline functionality
- **Enhanced Card Component**: Flexible card system with variants and custom hooks
- **Offline Capabilities**: Comprehensive offline support with IndexedDB
- **Asset Optimization**: CDN-based image optimization and performance monitoring
- **Code Cleanup**: Removed unnecessary files and optimized bundle size
