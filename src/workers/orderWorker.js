const { Worker } = require("bullmq");

// Redis connection
const connection = {
  host: "127.0.0.1",
  port: 6379
};

// Worker listens for jobs
const worker = new Worker(

  "orders",

  async job => {

    console.log("Processing order job:", job.data);

    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("Order email sent to:", job.data.email);

  },

  { connection }

);

worker.on("completed", job => {

  console.log(`Job ${job.id} completed`);

});

worker.on("failed", (job, err) => {

  console.log(`Job ${job.id} failed`, err);

});