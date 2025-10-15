# REST API Learning Project

A beginner-friendly full-stack application to practice REST API usage with React (frontend) and Node.js + Express (backend).

## 🎯 Learning Goals

This project demonstrates:
- **REST API** - GET, POST, DELETE operations
- **JWT Authentication** - Token-based security
- **React State Management** - useState and useEffect hooks
- **API Integration** - Axios for HTTP requests
- **Pagination** - Server-side pagination implementation

## 📁 Project Structure

```
react-api-satesoft-trials/
├── backend/               # Node.js + Express backend
│   ├── server.js         # Main server file with all routes
│   └── package.json      # Backend dependencies
├── src/                  # React frontend
│   ├── App.jsx          # Main app component (routing logic)
│   ├── Login.jsx        # Login page component
│   ├── Dashboard.jsx    # Main dashboard component
│   ├── AddUser.jsx      # Form to add new users
│   ├── UserList.jsx     # Display users with pagination
│   └── api.js           # API utility with axios
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation & Setup

1. **Clone or navigate to the project directory:**
   ```bash
   cd react-api-satesoft-trials
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

### Running the Application

You need to run **both** the backend and frontend servers:

#### 1. Start the Backend Server (Terminal 1)

```bash
cd backend
npm start
```

✅ Backend will run on **http://localhost:4000**

#### 2. Start the Frontend React App (Terminal 2)

```bash
npm run dev
```

✅ Frontend will run on **http://localhost:5173**

### 🔐 How to Use

1. **Login:**
   - Open http://localhost:5173 in your browser
   - Enter any username (e.g., "john", "admin", "test")
   - Click "Login" to get a JWT token
   - Token is stored in localStorage

2. **View Users:**
   - Dashboard shows a list of users (5 per page)
   - Use "Previous" and "Next" buttons to navigate pages

3. **Add User:**
   - Fill in the form with name and email
   - Click "Add User" to create a new user via POST request

4. **Delete User:**
   - Click "🗑️ Delete" button next to any user
   - Confirm deletion in the popup

5. **Logout:**
   - Click "🚪 Logout" to clear token and return to login

## 📚 API Endpoints

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | Get JWT token with username |

### Protected Routes (Requires JWT Token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users?page=1&limit=5` | Get paginated users |
| POST | `/users` | Create new user |
| DELETE | `/users/:id` | Delete user by ID |

## 🔑 Key Concepts Explained

### 1. **JWT Authentication**
- Login gives you a token
- Token is sent with every API request
- Backend verifies token before allowing access

### 2. **REST API Principles**
- **GET** - Retrieve data (read-only)
- **POST** - Create new data
- **DELETE** - Remove data

### 3. **Pagination**
- Server sends limited results per page
- Reduces data transfer and improves performance
- Query params: `?page=1&limit=5`

### 4. **React Hooks Used**
- `useState` - Manage component state
- `useEffect` - Fetch data when component loads
- Props - Pass functions between components

### 5. **Axios Interceptors**
- Automatically add JWT token to requests
- Handle errors globally (expired tokens)

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite (build tool)
- Axios (HTTP client)

**Backend:**
- Node.js
- Express (web framework)
- jsonwebtoken (JWT authentication)
- cors (cross-origin requests)

## 📝 Notes for Learning

- The backend uses an **in-memory array** for data storage (resets on restart)
- In production, you'd use a real database (MongoDB, PostgreSQL, etc.)
- JWT secret key should be stored in environment variables
- This project uses simple inline styles for focus on functionality

## 🐛 Troubleshooting

**Problem:** Can't connect to backend
- ✅ Make sure backend is running on port 4000
- ✅ Check CORS is enabled in server.js

**Problem:** Token expired error
- ✅ Login again to get a new token
- ✅ Tokens expire after 1 hour

**Problem:** Port already in use
- ✅ Kill the process using that port
- ✅ Or change the port in server.js and api.js

## 🎓 Next Steps

After mastering this project, try:
- Adding UPDATE (PUT/PATCH) functionality
- Connecting to a real database (MongoDB/PostgreSQL)
- Adding user roles (admin, user)
- Implementing refresh tokens
- Adding form validation
- Using React Router for proper routing

---

**Happy Learning! 🚀**

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
