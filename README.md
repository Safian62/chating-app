# WhatsApp Clone - Full Stack Application

A fully functional WhatsApp-like messaging application built with Next.js, Redux Toolkit, Node.js, Express.js, and MongoDB.

## Features

- ✅ User Authentication (Register/Login)
- ✅ Real-time messaging with Socket.io
- ✅ Send text messages
- ✅ Send images
- ✅ Emoji support with emoji picker
- ✅ Online/Offline status
- ✅ Typing indicators
- ✅ Chat list with last message preview
- ✅ Search users and chats
- ✅ Modern UI with Tailwind CSS

## Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Redux Toolkit** - State management
- **Socket.io Client** - Real-time communication
- **Emoji Picker React** - Emoji selection

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - Real-time server
- **JWT** - Authentication
- **Multer** - File uploads
- **Bcrypt** - Password hashing

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd whatsapp-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   JWT_SECRET=your-secret-key-change-in-production
   MONGODB_URI=mongodb://localhost:27017/whatsapp-clone
   PORT=5000
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system. If using local MongoDB:
   ```bash
   mongod
   ```

5. **Run the development servers**

   In one terminal, start the backend:
   ```bash
   npm run dev:server
   ```

   In another terminal, start the frontend:
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:3000`

## Project Structure

```
whatsapp-clone/
├── app/                    # Next.js app directory
│   ├── chat/              # Chat page
│   ├── login/             # Login/Register page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ChatSidebar.tsx    # Sidebar with chats list
│   ├── ChatWindow.tsx     # Main chat window
│   ├── MessageInput.tsx   # Message input with emoji/image
│   ├── MessageList.tsx    # Messages display
│   └── ReduxProvider.tsx  # Redux provider wrapper
├── store/                 # Redux store
│   ├── store.ts           # Store configuration
│   └── slices/            # Redux slices
│       ├── authSlice.ts   # Authentication state
│       ├── chatSlice.ts   # Chat state
│       └── messageSlice.ts # Message state
├── server/                # Backend server
│   ├── index.js           # Express server setup
│   ├── models/            # MongoDB models
│   │   ├── User.js
│   │   ├── Chat.js
│   │   └── Message.js
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── chats.js
│   │   └── messages.js
│   ├── middleware/        # Express middleware
│   │   └── auth.js
│   └── uploads/           # Uploaded images directory
└── utils/                 # Utility functions
    └── socket.ts          # Socket.io client setup
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users` - Get all users (contacts)
- `GET /api/users/me` - Get current user

### Chats
- `GET /api/chats` - Get all chats for current user
- `POST /api/chats` - Create or get chat with user
- `GET /api/chats/:chatId` - Get single chat

### Messages
- `GET /api/messages/:chatId` - Get messages for a chat
- `POST /api/messages/upload-image` - Upload image

## Socket.io Events

### Client to Server
- `join-room` - Join a chat room
- `leave-room` - Leave a chat room
- `send-message` - Send a message
- `typing` - Send typing indicator

### Server to Client
- `receive-message` - Receive new message
- `user-typing` - Receive typing indicator
- `error` - Error occurred

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Start Chat**: Click on a user from the sidebar to start a conversation
3. **Send Messages**: Type a message and press Enter or click Send
4. **Send Images**: Click the camera icon to upload and send an image
5. **Send Emojis**: Click the emoji icon to open the emoji picker
6. **Search**: Use the search bar to find users or chats

## Development

- Frontend runs on `http://localhost:3000`
- Backend API runs on `http://localhost:5000`
- Socket.io server runs on the same port as the backend

## Production Deployment

Before deploying to production:

1. Change `JWT_SECRET` to a strong, random secret
2. Update MongoDB connection string to production database
3. Set proper CORS origins
4. Configure environment variables on your hosting platform
5. Set up proper file storage for images (consider using cloud storage)
6. Enable HTTPS for secure connections

## License

MIT

