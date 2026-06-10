require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const linkRoutes = require('./routes/linkRoutes');
const publicRoutes = require('./routes/publicRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'https://linktree-clone-new.onrender.com',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`CORS blocked: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// API routes с /api
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/user', userRoutes);

// 🔧 Также принимаем запросы без /api (для фронтенда)
app.use('/auth', authRoutes);
app.use('/links', linkRoutes);
app.use('/public', publicRoutes);
app.use('/user', userRoutes);

// Отдача статического React-приложения
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
console.log(`Looking for frontend at: ${frontendDistPath}`);

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  console.error(`❌ Frontend dist not found! Build may have failed.`);
  app.get('*', (req, res) => {
    res.status(404).json({ error: 'Frontend not built. Please check build logs.' });
  });
}

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    await sequelize.sync();
    console.log('Database synced');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

start();
