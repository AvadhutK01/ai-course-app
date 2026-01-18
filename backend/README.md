# ⚙️ AI Course App - Backend

The backend of the **AI Course Application** serves as the intelligence engine, handling API requests, managing the MongoDB database, and interfacing with AI services like **Google Gemini** and **OpenAI** to generate course content.

## 📂 Folder Structure

```bash
backend/
├── src/
│   ├── config/         # Database and app configuration
│   ├── controllers/    # Logic for handling requests (Course Gen, User Auth)
│   ├── models/         # Mongoose schemas (User, Course)
│   ├── routes/         # API route definitions
│   └── index.ts        # Entry point of the server
├── dist/               # Compiled JavaScript files
└── package.json        # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local or Atlas)
- **Gemini / OpenAI API Key**

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

Create a `.env` file in the `backend` root with the following variables:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ai-course-app
JWT_SECRET=your_super_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
OPENAI_API_KEY=your_openai_api_key (optional)
```

### Running the Server

**Development Mode** (with hot-reload):
```bash
npm run dev
```

**Production Build:**
```bash
npm run build
npm start
```

## 🔌 API Overview

The backend exposes RESTful endpoints for the frontend application:
- **Auth**: `/api/auth` - Login, Signup, Google Auth.
- **Courses**: `/api/courses` - Create, fetch, and update courses.
- **AI**: `/api/ai` - Endpoints to trigger course generation.

## 📦 Key Dependencies

- **express**: Web framework for Node.js.
- **mongoose**: MongoDB object modeling.
- **@google/generative-ai**: Google Gemini AI SDK.
- **openai**: OpenAI API client.
- **jsonwebtoken**: For secure authentication.
- **cors**: Cross-Origin Resource Sharing.
