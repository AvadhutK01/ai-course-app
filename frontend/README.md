# 📱 AI Course App - Frontend

The frontend of the **AI Course Application** is built with **React Native** and **Expo**, delivering a high-performance cross-platform mobile experience. It handles user interaction, navigates through generated courses, and manages state using modern React hooks and Context/Redux.

## 📂 Folder Structure

```bash
frontend/
├── app/               # Expo Router screens (file-based routing)
├── components/        # Reusable UI components (Buttons, Cards, Modals)
├── services/          # API services & helper functions
├── assets/            # Images, Fonts, and Icons
├── constants/         # App-wide constants (Colors, Strings)
└── package.json       # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher) installed.
- **Expo Go** app installed on your iOS or Android device.
- (Optional) **Android Studio** or **Xcode** for running on emulators.

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the development server:

```bash
npm start
```

This will ensure the Metro bundler is running. You will see a QR code in the terminal.

- **Run on Phone:** Scan the QR code using the **Expo Go** app (Android) or Camera app (iOS).
- **Run on Emulator:** Press `a` for Android or `i` for iOS (requires setup).
- **Run on Web:** Press `w` to open in the browser.

### Other Scripts

| Command | Description |
| :--- | :--- |
| `npm run android` | Run the app on a connected Android device or emulator |
| `npm run ios` | Run the app on an iOS simulator |
| `npm run web` | Run the app in a web browser |
| `npm run reset-project` | Reset the project cache and start fresh |

## 📦 Key Dependencies

- **expo**: The core framework for React Native.
- **expo-router**: File-based routing for navigation.
- **axios**: HTTP client for API requests.
- **@react-native-google-signin/google-signin**: For Google Authentication.
- **expo-secure-store**: Securely storing tokens on the device.
