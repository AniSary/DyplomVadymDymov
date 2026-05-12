# Spendly

Personal finance management application built with React Native and Expo.

## About

Spendly is a mobile application for tracking financial transactions, analyzing spending patterns, and managing personal budgets. The app provides comprehensive analytics, category-based organization, and multi-language support.

## Key Features

- Transaction tracking with multiple categories
- Advanced financial analytics and statistics
- Spending trends and forecasting
- Category management
- Multi-language support (English, Polish, Russian)
- Responsive design for all screen sizes
- Local data storage with SQLite

## Tech Stack

### Frontend
- React Native 54.0.32
- Expo for development and building
- React Navigation for routing
- AsyncStorage for local persistence
- i18n-js for internationalization

### Backend
- Node.js with Express.js
- SQLite3 for database
- Soft delete and audit logging support

### Database
- SQLite3 for reliable local storage
- Schema includes transactions, categories, and audit logs

## Project Structure

```
finansowy-tracker/          # Mobile app (React Native + Expo)
├── src/
│   ├── components/        # Reusable UI components
│   ├── screens/           # Application screens
│   ├── services/          # Business logic services
│   ├── constants/         # App constants (colors, categories)
│   ├── locales/           # Translations (EN, PL, RU)
│   ├── navigation/        # Navigation configuration
│   ├── context/           # React context for state management
│   └── utils/             # Utility functions
├── app.json               # Expo configuration
└── package.json           # Dependencies

backend/                    # Express server
├── src/
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   └── services/          # Business logic
└── package.json           # Dependencies
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (for development)

### Installation

1. Clone the repository
```bash
git clone https://github.com/AniSary/DyplomVadymDymov.git
cd DyplomVadymDymov
```

2. Install mobile app dependencies
```bash
cd finansowy-tracker
npm install
```

3. Install backend dependencies (optional for local development)
```bash
cd ../backend
npm install
```

### Running the App

#### For Development
```bash
cd finansowy-tracker
npm start
```

Then scan the QR code with Expo Go app on your mobile device, or press:
- `i` for iOS simulator
- `a` for Android emulator

#### Building APK
```bash
cd finansowy-tracker
npm run build:android
```

#### Building IPA
```bash
cd finansowy-tracker
npm run build:ios
```

## Supported Languages

- English (EN)
- Polish (PL)
- Russian (RU)

The app automatically detects device language or allows manual selection in settings.

## Database

The app uses SQLite3 for local data storage. Database includes:
- Transactions table with income/expense tracking
- Categories for transaction organization
- Audit logs for data integrity

## Architecture

### Frontend Architecture
- Centralized state management via React Context
- Services layer for business logic (Analytics, Storage, Sync)
- Component-based UI with reusable components
- Responsive design supporting all screen sizes

### Data Flow
- User interactions trigger component state updates
- Services handle business logic and data persistence
- Context provides global state to components
- Transactions stored locally in SQLite

## Contributing

This is a thesis project. For modifications or improvements, create a feature branch and submit a pull request.

## License

This project is part of a thesis submission. All rights reserved.

## Author

Vadym Dymov

## Status

Active development for thesis submission.
