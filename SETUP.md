# Quick Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory with the following:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
JWT_SECRET=your-secret-key-change-in-production
MONGODB_URI=mongodb://localhost:27017/whatsapp-clone
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### 3. Start MongoDB

Make sure MongoDB is running. If using local MongoDB:

**Windows:**
```bash
mongod
```

**macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

Or use MongoDB Atlas (cloud) and update the `MONGODB_URI` in `.env.local`.

### 4. Start the Backend Server

In one terminal window:

```bash
npm run dev:server
```

The server should start on `http://localhost:5000`

### 5. Start the Frontend

In another terminal window:

```bash
npm run dev
```

The frontend should start on `http://localhost:3000`

### 6. Open the Application

Navigate to `http://localhost:3000` in your browser.

## First Steps

1. **Register a new account** - Click "Sign up" and create your account
2. **Open another browser/incognito window** - Register a second account to test messaging
3. **Start chatting** - Search for the other user and start a conversation!

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check your `MONGODB_URI` in `.env.local`
- For MongoDB Atlas, make sure your IP is whitelisted

### Port Already in Use
- Change the `PORT` in `.env.local` for the backend
- Update `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SOCKET_URL` accordingly

### Images Not Uploading
- Ensure the `server/uploads` directory exists
- Check file permissions
- Verify the upload size limit (currently 5MB)

### Socket.io Connection Issues
- Ensure both frontend and backend are running
- Check CORS settings in `server/index.js`
- Verify `NEXT_PUBLIC_SOCKET_URL` matches your backend URL

## Production Deployment

Before deploying:

1. Change `JWT_SECRET` to a strong random string
2. Update all URLs to production domains
3. Configure proper MongoDB connection (Atlas recommended)
4. Set up proper file storage (AWS S3, Cloudinary, etc.)
5. Enable HTTPS
6. Configure environment variables on your hosting platform

