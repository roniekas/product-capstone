const Redis = require('redis');
const { redis } = require('./config'); // Replace with your config path

const url = `redis://${redis.host}:${redis.port}?database=1`;

(async () => {
    try {
        const client = await Redis.createClient({ url });

        if (redis.usePassword.toUpperCase() === 'YES') {
            await client.auth(redis.password);
        }

        await client.connect();

        console.log('Redis client connected successfully!'); // Guaranteed after connection
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
})();