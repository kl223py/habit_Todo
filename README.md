# HabitFlow - Habit and Todo Tracker

A React Native app for tracking daily habits and managing todos, built with Expo, React Navigation, and React Native Paper.

## Features

### Habits
- ✨ Add, edit, and delete habits with custom emojis
- 🔥 Track daily streaks with automatic calculation
- ✅ Mark habits as complete each day
- 🔄 Automatic daily reset at midnight
- 📊 View streak progress for each habit
- 🎯 Set custom frequency for habits

### Todos
- 📝 Create and manage todo items
- ✏️ Add descriptions to todos
- ☑️ Mark todos as done/undone
- 🗑️ Delete completed or unwanted todos
- 👁️ Visual indication for completed items

## Technology Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and toolchain
- **React Navigation** - Bottom tab navigation
- **React Native Paper** - Material Design components
- **AsyncStorage** - Local data persistence
- **React Hooks** - Modern functional components
- **L2HabitTracker** - Advanced habit tracking and streak calculation module by [@lissovkevin](https://github.com/lissovkevin/L2HabitTracker)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (optional, will be installed automatically)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kl223py/habit_Todo.git
   cd habit_Todo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

### Running the App

#### On iOS (requires macOS)
```bash
npm run ios
```

#### On Android
```bash
npm run android
```

#### On Web
```bash
npm run web
```

Alternatively, scan the QR code with the Expo Go app on your mobile device.

## Project Structure

```
habitflow/
├── src/
│   ├── lib/
│   │   └── habitTracker/      # L2HabitTracker module
│   │       ├── habit.js       # Habit class
│   │       ├── habitManager.js # Habit management
│   │       ├── streakCalculator.js # Streak calculation logic
│   │       └── index.js       # Module entry point
│   ├── screens/
│   │   ├── HabitsScreen.js    # Habits management screen
│   │   └── TodosScreen.js     # Todos management screen
│   └── utils/
│       ├── habitTrackerAdapter.js # Adapter for L2HabitTracker integration
│       └── storage.js         # AsyncStorage utilities
├── App.js                     # Main app with navigation setup
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## How It Works

### Daily Habit Reset
The app automatically checks if a new day has started when you open it. If so, all habits are reset (marked as incomplete), allowing you to track them fresh each day.

### Streak Calculation (Powered by L2HabitTracker)
The app uses the **L2HabitTracker** module by [@lissovkevin](https://github.com/lissovkevin/L2HabitTracker) for sophisticated streak tracking:
- **Accurate Streak Counting**: Streaks are calculated by analyzing your complete completion history
- **Consecutive Day Tracking**: Maintains streaks when you complete habits on consecutive days
- **Smart Reset Logic**: If you miss a day, the streak resets appropriately
- **Completion History**: All habit completions are tracked and stored for accurate calculations
- **Real-time Updates**: Streaks update immediately when you mark habits as complete or incomplete

The module provides a robust, well-tested streak calculation system that handles edge cases and ensures accurate tracking of your habit consistency.

### Data Persistence
All data is stored locally on your device using AsyncStorage, so your habits and todos persist between app sessions.

## Screenshots

*To be added after running the app*

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.
