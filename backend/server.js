const app = require('./app');
const connectDB = require('./config/db');
const http = require('http');
const { initSocket } = require('./utils/socket');
const passport = require('passport');

const startServer = () => {
  try {
    const PORT = process.env.PORT || 5000;

    app.use(passport.initialize());

    const server = http.createServer(app);

    // Initialize Socket.io using the utility
    const io = initSocket(server);
    app.set('io', io);

    // Bind to 0.0.0.0 immediately to pass Render's port scan
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`[STARTUP] Server is ACTUALLY LISTENING on port ${PORT}`);
      console.log(`[STARTUP] Server running in ${process.env.NODE_ENV || 'development'} mode`);
      
      // Connect Database asynchronously without blocking server startup
      connectDB().catch(err => {
        console.error(`[DB] Uncaught DB connection error: ${err.message}`);
      });
    });
  } catch (err) {
    console.error(`[STARTUP] Failed to configure server: ${err.message}`);
  }
};

startServer();
