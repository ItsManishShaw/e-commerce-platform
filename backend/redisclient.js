const { createClient } = require('redis');

const redisClient = createClient({
  url: 'redis://:ymTCo4pZ3bntwHr2bSRwy2zSPE968cGK@redis-10684.c212.ap-south-1-1.ec2.redns.redis-cloud.com:10684',
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient
  .connect()
  .catch((err) => console.error('Failed to connect to Redis:', err));
module.exports = redisClient;
