# 🎓 AI Course App

![Tech Stack](https://img.shields.io/badge/Stack-MERN%2BExpo-blue.svg?style=for-the-badge)
![License](https://img.shields.io/badge/license-ISC-green.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Development-orange.svg?style=for-the-badge)

Welcome to the **AI Course Application**! This project is a cutting-edge mobile learning platform built using **React Native (Expo)** for the frontend and a **Node.js/Express** backend. It leverages powerful AI models (Google Gemini / OpenAI) to allow users to generate and participate in custom courses.

---

## 🌟 Key Features

- **🤖 AI Course Generation**: Create custom courses instantly using **Google Gemini** or **OpenAI**.
- **📱 Cross-Platform Mobile Experience**: Built with **Expo** for seamless performance on Android, iOS, and Web.
- **🔐 Secure Authentication**: Integrated Google Sign-In and secure JWT-based session management.
- **📚 Interactive Learning**: Dynamic course content, progress tracking, and user-friendly interface.
- **☁️ Cloud Data Management**: Robust data handling with **MongoDB** and efficient media serving.

---

## 🏗️ Project Structure

```bash
.
├── 📂 backend         # Node.js & Express API
│   ├── 📂 src         # Source Code
│   │   ├── 📂 controllers # Request Handlers (AI Generation, User Mgmt)
│   │   ├── 📂 models      # Mongoose Schemas (Courses, Users)
│   │   ├── 📂 routes      # API Endpoints
│   │   └── 📄 index.ts    # Server Entry Point
│   └── 📄 package.json    # Backend Dependencies & Scripts
├── 📂 frontend        # React Native (Expo) App
│   ├── 📂 app         # Expo Router Pages/Screens
│   ├── 📂 components  # Reusable UI Components
│   ├── 📂 services    # API Connectors & Utilities
│   └── 📄 package.json    # Frontend Dependencies & Scripts
└── 📄 package.json    # Root Configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local installation
- Expo Go App on your mobile device (or Android Studio/Xcode for simulation)
- Google Gemini / OpenAI API Keys

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AvadhutK01/ai-course-app.git
   cd ai-course-app
   ```

2. **Install Dependencies**
   ```bash
   # Install backend dependencies
   cd backend && npm install

   # Install frontend dependencies
   cd ../frontend && npm install
   ```

3. **Environment Variables**
   Create `.env` files in both `backend` and `frontend` directories.
   
   **Backend (.env)**
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_key
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the Application**

   **Start the Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   **Start the Frontend:**
   ```bash
   cd frontend
   npm start
   ```
   - Scan the QR code with **Expo Go** to run on your phone.
   - Press `w` for Web, `a` for Android Emulator, `i` for iOS Simulator.

---

## 🛠️ Tech Stack

| Frontend | Backend | Tools & AI |
| :-- | :-- | :-- |
| React Native (Expo) | Node.js | Google Gemini AI |
| TypeScript | Express.js | OpenAI API |
| Expo Router | MongoDB | Mongoose |
| Google Sign-In | JWT Auth | Dotenv |

---

## 📄 License
Distributed under the ISC License. See `LICENSE` for more information.

---
Built with ❤️ by AvadhutK01(https://github.com/AvadhutK01)
