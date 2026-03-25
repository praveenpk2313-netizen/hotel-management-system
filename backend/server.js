const app = require('./app');
const connectDB = require('./config/db');
const http = require('http');
const { initSocket } = require('./utils/socket');
const passport = require('passport');

const startServer = async () => {
  try {
    // Connect Database
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.use(passport.initialize());

    const server = http.createServer(app);

    // Initialize Socket.io using the utility
    const io = initSocket(server);
    app.set('io', io);

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (err) {
    console.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
};

startServer();
