const { Worker } = require("bullmq");

// Redis connection
const connection = {
  host: process.env.REDIS_HOST || "redis",
  port: Number(process.env.REDIS_PORT) || 6379
};

// Worker listens for jobs
const worker = new Worker(
  "orders",

  async (job) => {

    console.log("Processing order job:", job.data);

    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("Order email sent to:", job.data.email);

  },

  { connection }
);

// Job completed
worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

// Job failed
worker.on("failed", (job, err) => {
  console.log(`Job ${job.id} failed`, err);
});

// Worker errors
worker.on("error", (err) => {
  console.error("Worker error:", err);
});