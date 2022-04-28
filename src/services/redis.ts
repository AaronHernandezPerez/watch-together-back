import { createClient } from "redis";

const redisClient = createClient({
  url: `redis://${process.env.REDIS_URL}:${process.env.REDIS_PORT || 6379}`,
  password: process.env.REDIS_PASSWORD,
});

(() => {
  redisClient.on("error", (err) => console.error("Redis Client Error", err));
  redisClient
    .connect()
    .then(() => {
      console.log("Connected to redis");
    })
    .catch((err) => {
      console.error("Error connecting to redis", err);
    });
})();

export default redisClient;
