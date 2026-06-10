require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const seedDatabase = require('./utils/seed');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Gắn io vào app để dùng trong controllers
app.set('io', io);

app.use(cors());
app.use(express.json());

// Configure static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to Database
connectDB();

// Seed Database when connected
mongoose.connection.once('open', () => {
  seedDatabase();
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const menuRoutes = require('./routes/menuRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const menuSetRoutes = require('./routes/menuSetRoutes');
const menuPanelRoutes = require('./routes/menuPanelRoutes');
const eventRoutes = require('./routes/eventRoutes');
const pressRoutes = require('./routes/pressRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/menu-sets', menuSetRoutes);
app.use('/api/menu-panels', menuPanelRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/press', pressRoutes);
app.use('/api/reservations', reservationRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Backend đang chạy với MongoDB!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT} với WebSockets!`);
});