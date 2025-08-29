# ABC Racing - Formula 1 Dashboard

A modern React TypeScript application with microfrontend architecture for Formula 1 racing statistics, driver profiles, and news.

## 🏁 Features

- **Dashboard**: Real-time F1 statistics, championship standings, and race information
- **Drivers**: Comprehensive driver profiles with search and filtering capabilities
- **News**: Latest F1 news with category filtering and search functionality
- **Bookmarks**: Save and manage your favorite drivers, news articles, and races
- **Microfrontend Architecture**: Modular design with lazy-loaded components
- **Shimmer UI**: Modern loading states instead of traditional spinners
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **TypeScript**: Full type safety and better development experience

## 🚀 Tech Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Microfrontend Architecture** with lazy loading
- **Shimmer UI** for loading states

## 📁 Project Structure

```
src/
├── components/          # Shared components
│   ├── Card.tsx        # Reusable card component
│   ├── Navigation.tsx  # Main navigation
│   └── ShimmerUI.tsx   # Loading shimmer effects
├── microfrontends/     # Microfrontend modules
│   ├── Dashboard.tsx   # Dashboard page
│   ├── Drivers.tsx     # Drivers page
│   ├── News.tsx        # News page
│   └── Bookmarks.tsx   # Bookmarks page
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## 🎯 Microfrontend Architecture

The application follows a microfrontend pattern with:

- **Host Application**: Main shell with navigation and routing
- **Dashboard Microfrontend**: Racing statistics and overview
- **Drivers Microfrontend**: Driver profiles and search
- **News Microfrontend**: News articles with filtering
- **Bookmarks Microfrontend**: Saved content management

Each microfrontend is lazy-loaded for optimal performance.

## 🎨 Design Features

- **Card Components**: Consistent card-based UI throughout
- **Shimmer Loading**: Modern loading states with animated placeholders
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Color-coded Categories**: Visual distinction for different content types
- **Hover Effects**: Interactive elements with smooth transitions

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
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## 📱 Pages

### Dashboard
- Championship standings
- Next race information
- Recent results
- Team standings
- Quick statistics
- Season progress

### Drivers
- Driver profiles with statistics
- Search functionality
- Team filtering
- Position indicators
- Performance metrics

### News
- Latest F1 news articles
- Category filtering
- Search functionality
- Featured articles
- Reading time estimates

### Bookmarks
- Save favorite drivers, news articles, and races
- Tabbed interface for different content types
- Search and filter bookmarks
- Remove bookmarks functionality
- Bookmark timestamps

## 🎨 Customization

### Styling
The application uses Tailwind CSS with custom configurations in `tailwind.config.js`. You can customize:

- Color schemes
- Typography
- Spacing
- Animations

### Components
All components are built with TypeScript interfaces for type safety. You can extend or modify:

- Card component for different layouts
- ShimmerUI for custom loading states
- Navigation for additional routes

## 🔧 Development

### TypeScript
The project is fully typed with TypeScript. Key interfaces include:

- `Driver` - Driver profile data
- `NewsArticle` - News article structure
- `DashboardStats` - Dashboard statistics
- Component props interfaces

### State Management
Each microfrontend manages its own state using React hooks:

- `useState` for local state
- `useEffect` for side effects
- Custom hooks for reusable logic

## 🚀 Performance

- **Lazy Loading**: Microfrontends load on demand
- **Code Splitting**: Automatic code splitting with React.lazy
- **Optimized Images**: Responsive image handling
- **Minimal Bundle**: Tree-shaking and optimization

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository.
