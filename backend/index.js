const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const redisClient = require('./redisclient');
const { verifyToken } = require('./utils/auth');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const { authLimiter, generalApiLimiter } = require('./middlewares/rateLimiter');
// importing the Redis redisClient

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//mongoDB connections
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Error connecting to MongoDB', err));

//api base routes
app.get('/', (req, res) => {
  res.send('API is running. . .');
});

app.get('/api/users', generalApiLimiter, userRoutes); //User-related routes
app.get('/api/products', generalApiLimiter, productRoutes); //product related routes
app.get('/api/orders', generalApiLimiter, orderRoutes); //order related routes
app.get('/api/auth', authLimiter, authRoutes); //auth related routes
app.get('api/payments', generalApiLimiter, paymentRoutes); //payment related routes

//example route that uses redis
app.get('/cache-test', async (req, res) => {
  if (!redisClient.isOpen) {
    return res.status(500).send('Redis redisClient is not connected');
  }

  const key = 'test-key';

  try {
    const data = await redisClient.get(key);

    if (data) {
      res.send(`Cached value: ${data}`);
    } else {
      const newValue = 'This is a test value';
      await redisClient.set(key, newValue, 'EX', 60); // Cache for 60 seconds
      res.send(`New value: ${newValue}`);
    }
  } catch (err) {
    console.error('Error handling Redis request:', err);
    res.status(500).send('Error');
  }
});

//graceful shutdown
process.on('SIGINT', async () => {
  console.log('SIGINT signal recieved: closing the redis redisClient . . .');
  await redisClient.quit();
  process.exit();
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal recieved: closing redis redisClient. . .');
  await redisClient.quit();
  process.exit();
});

app.get('/protected-route', (req, res) => {
  const authHeader = req.headers['authorization'];
  console.log(req.headers);
  if (!authHeader) return res.status(403).send('authHeader is missing');
  const token = authHeader.split(' ')[1];
  console.log({ token });
  if (!token) return res.status(403).send('Token is required');
  const decoded = verifyToken(token);
  console.log({ decoded });
  if (!decoded) return res.status(401).send('Token is invalid');
  res.send('Welcome to the Protected route!. . .');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
