# 💬 ChatzKeep – Healthcare Recruitment Messaging Platform

ChatzKeep is an enterprise-grade, real-time healthcare staffing communication platform designed to seamlessly connect medical professionals, candidates, and healthcare recruiters. Built as a full-stack JavaScript application using Next.js, Node.js, and MongoDB, it bridges the gap in high-stakes clinical hiring through high-concurrency instant messaging, secure documentation workflows, and a crisp, accessibility-conscious minimalist clinical design aesthetic.

---

## 🚀 Features

*   ⚡ **Real-Time Messaging:** Instant message delivery powered by Socket.IO.
*   👥 **One-to-One Chat:** Private messaging system between registered users.
*   🟢 **Presence Indicators:** Live online/offline user status tracking.
*   📷 **Media Sharing:** Image sharing support integrated into chat windows.
*   😊 **Emoji Support:** Native or picker emoji support in the chat input.
*   🔐 **Secure Authentication:** JWT-based secure user authentication and Bcrypt password hashing.
*   📱 **Fully Responsive UI:** Optimized experience across mobile, tablet, and desktop views.
*   🧑 **Profile Management:** User profile modal view to update or display details.

---

## 🛠️ Tech Stack

### Frontend
*   **React.js** / **Next.js** (App Router)
*   **Tailwind CSS** (for styling)
*   **Axios** (for API communication)
*   **Socket.IO Client** (for real-time events)
*   **React Icons**

### Backend
*   **Node.js** & **Express.js** (Server framework)
*   **MongoDB** & **Mongoose** (Database and ODM)
*   **Socket.IO** (WebSockets)
*   **JSON Web Token (JWT)** (Authentication)
*   **Bcrypt** (Password encryption)

---

## 📁 Project Structure

```text
ChatzKeep/
│
├── backend/             # Backend server (Node.js/Express)
│   ├── config/          # Configuration files (Database config, etc.)
│   ├── controllers/     # Request handlers & business logic
│   ├── middleware/      # Auth and error middlewares
│   ├── models/          # MongoDB Mongoose schemas
│   ├── routes/          # Express API endpoints
│   ├── socket/          # Socket.IO event handlers
│   ├── util/            # Helper utilities
│   ├── .env             # Backend environment variables
│   └── server.js        # Entry point for backend
│
├── frontend/            # Frontend application (Next.js)
│   ├── src/
│   │   ├── app/         # Next.js App Router (pages & layouts)
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Global state contexts (Auth, Socket)
│   │   ├── hooks/       # Custom React hooks
│   │   └── services/    # API and socket service layers
│   ├── public/          # Static assets
│   ├── next.config.mjs  # Next.js configuration
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone [https://github.com/your_username/ChatzKeep.git](https://github.com/your_username/ChatzKeep.git)
cd ChatzKeep
```

### 2. Install dependencies
Client
```bash
cd client
npm install
```
Server
```bash
cd server
npm install
```

### 3. Environment Variables
Create a .env file in the **server** folder:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

### 4. Run the project
Start backend
```bash
cd server
npm run dev
```
Start frontend
```bash
cd client
npm run dev
```
---


## 🌐 API Endpoints (Sample)
*   `POST` `/auth/register` - Register user
*   `POST` `/auth/login` - Login user
*   `GET` `/users` - Fetch users
*   `GET` `/messages/:id` - Get chat messages

---


## 💡 Future Improvements
*   Group chat support
*   Voice & video calling
*   Message encryption
*   Message reactions
*   File sharing (PDF, docs)
*   Push notifications

---


## 🌐 Live Demo
*   🔗 **Frontend (Vercel):** https://chatzekeep.vercel.app

*   🔗 **Backend (Render):** https://chatzkeep-li2n.onrender.com


---


## 🚀 Deployment Details

🖥️ Frontend Deployment (Vercel)
The frontend of ChatzKeep is deployed on Vercel for fast and optimized performance.
*   Connected directly to GitHub repository
*   Auto-deploy enabled on every push to `main`
*   Environment variable configured for backend API URL

--- 


## 👤 Author
**Sadharudheen Sha**
*   GitHub: https://github.com/sadharuu
*   Project: ChatzKeep

## ⭐ Show Your Support
If you like this project, consider giving it a ⭐ on GitHub!
