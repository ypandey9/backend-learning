// Import redis client
const { createClient } = require("redis");

// Create redis client instance
const redisClient = createClient({
  url: "redis://localhost:6379"
});

// Connect to redis
redisClient.connect()
  .then(() => {
    console.log("Redis Connected");
  })
  .catch(err => {
    console.error("Redis Error", err);
  });

// Export client
module.exports = redisClient;