# PandaFit

A gamified health & fitness app built with React Native (Expo). Track workouts, scan food with AI, log your weight, complete quests to earn coins, and collect panda companions for your virtual grassland.

## Features

- **Grassland Home** — Watch your collected pandas wander around a green gradient landscape. Tap them for fun animations with haptic feedback.
- **Quests** — Daily and weekly challenges (log workouts, scan meals, track weight) that reward coins on completion.
- **Workouts** — Log exercises with name, duration, and calories burned. View your full history.
- **Food Scanner** — Take a photo or pick from gallery, and OpenAI Vision analyzes the meal for calories, protein, carbs, and fat. Log results to your daily tracker.
- **Weight Tracking** — Log daily weight and view progress over time with a line chart.
- **Panda Shop** — Spend earned coins to unlock new panda variants that appear on your home grassland.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18–v22 recommended; v24 may require workarounds)
- [Expo Go](https://expo.dev/go) app on your iOS or Android device
- An [OpenAI API key](https://platform.openai.com/api-keys) (for the food scanner feature)

## Setup

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd QuestFit
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root:

   ```
   EXPO_PUBLIC_OPENAI_API_KEY=sk-your-openai-api-key-here
   ```

   The food scanner will not work without a valid OpenAI API key. All other features work without it.

4. **Start the development server**

   ```bash
   npx expo start
   ```

   If you encounter issues with Node v24, use:

   ```bash
   node node_modules/expo/bin/cli start
   ```

5. **Run on your device**

   - Scan the QR code with Expo Go (Android) or the Camera app (iOS)
   - Or press `w` to open in a web browser

## Project Structure

```
QuestFit/
├── app/
│   ├── _layout.tsx              # Root layout with theme
│   └── (tabs)/
│       ├── _layout.tsx          # Tab navigator (6 tabs)
│       ├── index.tsx            # Home — grassland with pandas
│       ├── quests.tsx           # Daily/weekly quest cards
│       ├── workouts.tsx         # Workout log form + history
│       ├── food.tsx             # AI food scanner + daily log
│       ├── weight.tsx           # Weight log + chart
│       └── shop.tsx             # Panda shop (2-column grid)
├── components/
│   ├── Panda.tsx                # Animated panda (idle/walk/dance)
│   ├── CoinDisplay.tsx          # Coin balance widget
│   ├── QuestCard.tsx            # Quest progress card
│   ├── WorkoutCard.tsx          # Workout history entry
│   ├── FoodResultCard.tsx       # AI scan result display
│   ├── FoodLogEntry.tsx         # Logged food item
│   ├── MacroBar.tsx             # Macro breakdown bar
│   ├── WeightChart.tsx          # Weight line chart
│   └── ShopCard.tsx             # Shop item card
├── hooks/
│   ├── useCoins.ts              # Coin balance (starts at 200)
│   ├── usePandas.ts             # Owned panda collection
│   ├── useWorkouts.ts           # Workout log CRUD
│   ├── useFoodLog.ts            # Food entry CRUD
│   ├── useWeight.ts             # Weight entry CRUD
│   ├── useQuests.ts             # Quest state + daily/weekly reset
│   └── useQuestCheck.ts         # Auto-updates quest progress
├── constants/
│   ├── colors.ts                # Color tokens
│   ├── quests.ts                # Quest definitions
│   └── pandaTypes.ts            # Shop panda definitions
├── assets/
│   └── pandas/
│       ├── Gifs/                # Animated GIFs (Idle, Walk, Roll, etc.)
│       └── Spritesheets/        # PNG spritesheets
├── app.json                     # Expo config
├── package.json
└── .env                         # API keys (not committed)
```

## Tech Stack

- **Framework:** React Native with [Expo](https://expo.dev/) (SDK 54)
- **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/) (file-based)
- **Animations:** [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Images/GIFs:** [expo-image](https://docs.expo.dev/versions/latest/sdk/image/)
- **Storage:** [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- **Charts:** [react-native-chart-kit](https://github.com/indiespirit/react-native-chart-kit)
- **AI:** [OpenAI Vision API](https://platform.openai.com/docs/guides/vision) (gpt-4o-mini)
- **Haptics:** [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)
- **Camera:** [expo-image-picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)

## Notes

- All data is stored locally on-device via AsyncStorage. No backend required.
- Daily quests reset at midnight; weekly quests reset on Monday.
- New users start with 200 coins and one Classic Panda.
