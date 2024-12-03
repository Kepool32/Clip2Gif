require('dotenv').config();

const config = {
    redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        password: process.env.REDIS_PASSWORD || 'mysecretpassword',
    },
    queue: {
        max: parseInt(process.env.QUEUE_MAX, 10) || 1000,
        duration: parseInt(process.env.QUEUE_DURATION, 10) || 60000,
    },
    port: process.env.PORT || 3001,
};

module.exports = config;
