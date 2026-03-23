const { Server } = require('socket.io');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');

let io;
const connectedUsers = new Map(); // userId -> socketId

const initSocket = (server) => {
  const envUrl = process.env.CLIENT_URL;
  const allowedOrigins = envUrl 
    ? envUrl.split(',').map(url => url.trim().replace(/\/$/, ""))
    : ["http://localhost:5173", "https://hotel-management-system-zeta-neon.vercel.app"];

  // Guarantee common deployment origins for the user
  if (!allowedOrigins.includes('https://hotel-management-system-zeta-neon.vercel.app')) {
    allowedOrigins.push('https://hotel-management-system-zeta-neon.vercel.app');
  }

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Authentication Middleware for Sockets
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    if (userId) {
      connectedUsers.set(userId.toString(), socket.id);
      console.log(`🔗 User connected & registered: ${userId} -> Socket: ${socket.id}`);
    }

    socket.on('disconnect', () => {
      if (userId) {
        connectedUsers.delete(userId.toString());
        console.log(`🔌 User disconnected: ${userId}`);
      }
    });
  });

  return io;
};

const sendNotification = async ({ userId, title, message, type, metaData }) => {
  try {
    // 1. Save to database
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      metaData
    });

    // 2. Emit real-time if user is online
    const socketId = connectedUsers.get(userId.toString());
    if (socketId && io) {
      io.to(socketId).emit('notification', notification);
    }

    return notification;
  } catch (error) {
    console.error('❌ Notification Error:', error.message);
  }
};

// For broadcasting to specific roles (optional enhancement)
const notifyAdmins = async ({ title, message, type, metaData }) => {
   // This would require a more complex role-based socket room setup
   // For now, we'll just manually call sendNotification for specific IDs in controllers
};

module.exports = { initSocket, sendNotification, getIO: () => io };
