# Job Search Tracker Frontend

A modern, responsive React TypeScript application for managing job applications and interview processes. This frontend provides an intuitive interface for tracking job positions, managing interviews, and analyzing job search progress.

## 🚀 Features

### 🔐 **Authentication & Security**
- Secure user registration and login
- JWT token-based authentication
- Protected routes and session management
- Automatic token refresh and logout

### 📋 **Position Management**
- Create, edit, and delete job positions
- Track application status and progress
- Rich position details with company information
- Application date tracking and status updates

### 🎯 **Interview Management**
- **Comprehensive Interview Tracking**: Create, edit, and delete interviews with detailed information
- **Multiple Interview Types**: Support for HR, Technical, Behavioral, and Final interviews
- **Interview Formats**: Track phone, video, and on-site interviews
- **Smart Scheduling**: Date/time scheduling with validation and conflict detection
- **Outcome Management**: Track pending, passed, failed, and cancelled interview outcomes
- **Inline Editing**: Quick edit dates and status directly from cards
- **Quick Actions**: Fast operations like marking as passed/failed, rescheduling, and canceling
- **Visual Indicators**: Color-coded status, overdue warnings, and today's interview highlights

### 📊 **Statistics & Analytics Dashboard**
- **Interactive Data Visualization**: Professional charts with Chart.js integration
- **Key Performance Metrics**: Success rates, conversion funnels, and comprehensive KPI tracking
- **Advanced Filtering**: Date range selection with presets and real-time statistics updates
- **Export Capabilities**: Export statistics in JSON/CSV formats
- **Mobile-Optimized**: Responsive charts and analytics optimized for all device sizes

### 🔍 **Advanced Search & Filtering System**
- **Smart Filter Presets**: Default and custom presets with usage tracking
- **Enhanced Date Range Picker**: Quick select options with custom range support
- **Intelligent Validation**: Real-time filter validation with smart suggestions
- **Import/Export**: Save and share filter configurations via JSON files or URLs
- **Multi-field Search**: Full-text search across positions, companies, and descriptions

### 🛡️ **Error Handling & User Feedback System**
- **Global Error Boundaries**: Application-level protection with graceful degradation
- **Intelligent Retry Mechanisms**: Automatic API retries with exponential backoff
- **User-Friendly Error Messages**: Contextual error messages with actionable recovery options
- **Comprehensive Notification System**: Toast notifications for all user actions
- **Advanced Loading States**: Multiple loading indicators and progress tracking

### 📱 **Mobile-First Responsive Design**
- **Responsive Layout System**: Mobile-first architecture with adaptive grids
- **Advanced Touch Interactions**: Swipe gestures, pull-to-refresh, and touch feedback
- **Mobile-Optimized Components**: Enhanced forms, smart modals, and touch-friendly buttons
- **Performance Optimizations**: Lazy loading, progressive image loading, and memory management

## 🛠️ Technology Stack

### **Core Technologies**
- **React 18** - Modern React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **CRACO** - Custom webpack configuration

### **State Management**
- **React Query (TanStack Query)** - Server state management with caching
- **React Context** - Client state management
- **React Hook Form** - Efficient form handling

### **UI & UX**
- **Headless UI** - Accessible UI components
- **Heroicons** - Beautiful SVG icons
- **React Hot Toast** - Elegant notifications
- **date-fns** - Modern date utility library

### **Development Tools**
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Job Search Tracker API running (see [Backend Repository](https://github.com/haim9798/job-search-tracker-api))

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/haim9798/job-search-tracker-frontend.git
cd job-search-tracker-frontend
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
# Edit .env.local with your API configuration
```

4. **Start the development server:**
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_API_VERSION=v1

# Application Configuration
REACT_APP_APP_NAME=Job Search Tracker
REACT_APP_APP_VERSION=1.0.0

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_OFFLINE_MODE=true

# Development
REACT_APP_DEBUG_MODE=false
```

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── ui/            # Basic UI components (Button, Input, Modal, etc.)
│   ├── error/         # Error handling components
│   ├── auth/          # Authentication components
│   ├── dashboard/     # Dashboard components
│   ├── positions/     # Position management components
│   ├── interviews/    # Interview management components
│   └── layout/        # Layout components (Header, Sidebar)
├── pages/             # Page components
├── hooks/             # Custom React hooks
├── services/          # API service layer
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── contexts/          # React contexts
├── constants/         # Application constants
└── styles/            # Global styles and Tailwind config
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests in watch mode
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests once for CI
npm run test:ci
```

### Test Coverage
- **Coverage Thresholds**: 70% minimum across branches, functions, lines, and statements
- **Comprehensive Test Suite**: 100+ tests covering all major functionality
- **Accessibility Testing**: Automated WCAG 2.1 AA compliance testing

## 🚀 Production Build

### Build Commands
```bash
# Standard production build
npm run build

# Production build without source maps
npm run build:production

# Build with bundle analysis
npm run build:analyze
```

### Docker Deployment
```bash
# Build Docker image
docker build -t job-search-tracker-frontend .

# Run container
docker run -p 3000:80 job-search-tracker-frontend
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm start              # Start development server
npm run dev           # Alternative start command

# Building
npm run build         # Create production build
npm run build:analyze # Build with bundle analysis

# Testing
npm test              # Run tests in watch mode
npm run test:ci       # Run tests once for CI
npm run test:coverage # Run tests with coverage report

# Code Quality
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint issues
npm run format        # Format code with Prettier
npm run type-check    # Run TypeScript type checking
```

## 🌐 API Integration

This frontend is designed to work with the [Job Search Tracker API](https://github.com/haim9798/job-search-tracker-api).

### Authentication Flow
```typescript
// Login
const { mutate: login } = useLogin();
login({ email, password });

// Protected requests
const { data: positions } = usePositions(); // Automatically includes auth headers
```

### Data Fetching
```typescript
// Fetch positions with caching
const { data, isLoading, error } = usePositions({
  status: 'interviewing',
  company: 'TechCorp'
});

// Create position with optimistic updates
const { mutate: createPosition } = useCreatePosition();
createPosition(positionData);
```

## 📱 Mobile Features

- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Touch Interactions**: Swipe gestures, pull-to-refresh, and touch feedback
- **Progressive Web App**: PWA capabilities for native-like mobile experience
- **Offline Support**: Graceful degradation and offline queue management

## ♿ Accessibility

- **WCAG 2.1 AA Compliance**: Automated accessibility rule checking
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and roles
- **Color Contrast**: Minimum 4.5:1 contrast ratio
- **Focus Management**: Visible focus indicators

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Code Standards
- Follow TypeScript strict mode
- Write tests for new features
- Maintain accessibility standards
- Update documentation as needed

### Commit Convention
```
feat: add position filtering functionality
fix: resolve authentication token refresh issue
docs: update API integration guide
test: add unit tests for InterviewCard component
```

## 🐛 Troubleshooting

### Common Issues

**API Connection Issues:**
```bash
# Check if API is running
curl http://localhost:8000/health

# Verify CORS configuration in API
# Check browser network tab for CORS errors
```

**Build Issues:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
npm run clean
```

**Authentication Issues:**
```bash
# Check token storage in browser DevTools
# Verify API authentication endpoints
# Check network requests for 401/403 errors
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Related Projects

- [Job Search Tracker API](https://github.com/haim9798/job-search-tracker-api) - Backend API server
- [Job Search Tracker Documentation](https://github.com/haim9798/job-search-tracker-api/tree/main/docs) - Complete documentation

---

**Built with ❤️ using React, TypeScript, and modern web technologies.**