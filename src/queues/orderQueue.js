const { Queue } = require("bullmq");

// Redis connection configuration
const connection = {
  host: process.env.REDIS_HOST || "redis",
  port: Number(process.env.REDIS_PORT) || 6379
};

// Create queue named "orders"
const orderQueue = new Queue("orders", { connection });

module.exports = orderQueue;