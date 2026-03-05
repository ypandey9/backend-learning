const { Queue } = require("bullmq");

// Redis connection configuration
const connection = {
  host: "127.0.0.1",
  port: 6379
};

// Create queue named "orders"
const orderQueue = new Queue("orders", { connection });

module.exports = orderQueue;