# URL Shortener with Analytics 🔗

A full-stack URL Shortener application with user authentication, real-time analytics tracking, and a beautiful purple glassmorphism UI design.

![Purple Glassmorphism Design](https://img.shields.io/badge/Design-Glassmorphism-8B5CF6)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248)

## 🎯 Features

### Mandatory Features ✅

#### Authentication
- ✅ User signup and login with email/password
- ✅ JWT-based authentication
- ✅ Protected dashboard routes
- ✅ Each user manages only their own URLs

#### URL Shortening
- ✅ Submit long URL and generate unique short URL
- ✅ 6-8 character unique short codes
- ✅ Automatic redirect from short URL to original URL
- ✅ URL validation before shortening

#### User Dashboard
- ✅ View all created short URLs
- ✅ Display original URL, short URL, created date, and total clicks
- ✅ Delete shortened URLs
- ✅ Copy short URL to clipboard with one click

#### Analytics
- ✅ Track click count for each short URL
- ✅ Record timestamp of each visit
- ✅ Analytics page showing:
  - Total click count
  - Last visited time
  - Recent visit history (last 10 visits)

#### UI Requirements
- ✅ Fully responsive interface
- ✅ Clean, modern dashboard layout
- ✅ Loading, success, and error states
- ✅ Form validation with error messages
- ✅ Purple glassmorphism design inspired by HireUp

### Bonus Features 🎁
- 🔄 Custom alias for short URLs (optional)
- 📊 Visual analytics with charts
- 🎨 Beautiful gradient backgrounds
- 🌙 Smooth animations and transitions

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management
- **CSS3** - Glassmorphism styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd url-shortener
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/url-shortener
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

```bash
# Start MongoDB (if not running as service)
mongod

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit the `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

```bash
# Start the frontend development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## 📁 Project Structure

```
url-shortener/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── urlController.js      # URL shortening logic
│   │   └── analyticsController.js # Analytics logic
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   └── validation.js         # Input validation
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── URL.js                # URL schema
│   │   └── Analytics.js          # Analytics schema
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   ├── urls.js               # URL routes
│   │   └── analytics.js          # Analytics routes
│   ├── utils/
│   │   ├── generateShortCode.js  # Short code generator
│   │   └── validateUrl.js        # URL validator
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── server.js                 # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/             # Login & Signup
│   │   │   ├── Dashboard/        # Dashboard components
│   │   │   ├── URLShortener/     # URL creation
│   │   │   ├── Analytics/        # Analytics display
│   │   │   └── Common/           # Reusable components
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Auth state management
│   │   ├── services/
│   │   │   └── api.js            # API calls
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   └── glassmorphism.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   └── vite.config.js
├── README.md
└── PLANNING.md
```

## 🎨 Design System

### Purple Glassmorphism Theme

The application features a modern glassmorphism design with a purple color scheme:

- **Primary Purple:** `#8B5CF6`
- **Light Purple:** `#A78BFA`
- **Dark Purple:** `#6D28D9`
- **Background:** Gradient from violet to pink
- **Glass Effect:** `backdrop-filter: blur(10px)` with semi-transparent backgrounds

### Key Design Elements
- Frosted glass cards with blur effects
- Smooth gradient backgrounds
- Rounded corners and soft shadows
- Hover animations and transitions
- Responsive grid layouts

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### URLs
- `POST /api/urls` - Create short URL (protected)
- `GET /api/urls` - Get user's URLs (protected)
- `DELETE /api/urls/:id` - Delete URL (protected)
- `GET /:shortCode` - Redirect to original URL (public)

### Analytics
- `GET /api/analytics/:urlId` - Get analytics for URL (protected)

## 🧪 Testing

### Manual Testing Checklist

1. **Authentication**
   - [ ] Sign up with new account
   - [ ] Login with existing account
   - [ ] Access protected routes
   - [ ] Logout functionality

2. **URL Shortening**
   - [ ] Create short URL with valid long URL
   - [ ] Validate invalid URLs are rejected
   - [ ] Verify unique short codes are generated
   - [ ] Test redirect functionality

3. **Dashboard**
   - [ ] View all user URLs
   - [ ] Copy short URL to clipboard
   - [ ] Delete URL
   - [ ] View analytics for each URL

4. **Analytics**
   - [ ] Click tracking works
   - [ ] Timestamps are recorded
   - [ ] Visit history displays correctly

5. **UI/UX**
   - [ ] Responsive on mobile, tablet, desktop
   - [ ] Loading states display correctly
   - [ ] Error messages are clear
   - [ ] Success notifications work

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### URL Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  originalUrl: String,
  shortCode: String (unique),
  createdAt: Date,
  clicks: Number,
  lastVisited: Date
}
```

### Analytics Collection
```javascript
{
  _id: ObjectId,
  urlId: ObjectId (ref: URL),
  timestamp: Date,
  userAgent: String,
  referer: String,
  ipAddress: String
}
```

## 🎥 Demo Video

**[Link to Demo Video]** - *(If you don't submit an explanatory video, your submission will not be reviewed)*

The demo video demonstrates:
1. User signup and login
2. Creating shortened URLs
3. Copying and using short URLs
4. Viewing analytics
5. Managing URLs (delete functionality)
6. Responsive design showcase

## 🔒 Security Features

- Passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens for secure authentication
- Protected API routes with middleware
- Input validation on all endpoints
- CORS configuration for frontend access
- Environment variables for sensitive data

## 🚀 Deployment

### Backend Deployment (Render/Railway)
1. Create new web service
2. Connect GitHub repository
3. Set environment variables
4. Deploy from main branch

### Frontend Deployment (Vercel/Netlify)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL`

### Database (MongoDB Atlas)
1. Create free cluster
2. Get connection string
3. Update `MONGODB_URI` in backend

## 📝 Assumptions Made

1. Users will provide valid email addresses
2. MongoDB is running locally or connection string is provided
3. Short codes are 6-8 characters (alphanumeric)
4. Analytics tracking is basic (timestamp, user agent, IP)
5. No rate limiting implemented (can be added)
6. Single-page application (SPA) architecture

## 🎯 AI Planning Document

See [`PLANNING.md`](./PLANNING.md) for detailed:
- Architecture diagrams
- Feature breakdown
- Development workflow
- Timeline and milestones

## 👨‍💻 Development Notes

This project was built using AI code generation tools following proper workflow:
1. Planning and architecture design
2. Feature listing and prioritization
3. Step-by-step implementation
4. Testing and refinement
5. Documentation

All generated code has been reviewed and understood by the developer.

## 📄 License

This project is part of a hackathon submission.

## 🙏 Acknowledgments

- Design inspired by HireUp's beautiful glassmorphism UI
- Built for hackathon hosted by [Katomaran](https://katomaran.com)

---

**This project is a part of a hackathon run by https://katomaran.com**

**Submission Deadline:** 12 PM on Sunday, June 14th, 2026

---

Made with 💜 and ☕#   S h o r t L Q  
 