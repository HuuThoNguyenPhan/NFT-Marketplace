const Redis = require("ioredis");
const redis = new Redis();

redis.on("connect", () => {
  // console.log("----------", CONFIGS);
  console.log("Client connected to redis Push...");
});
redis.on("ready", () => {
  console.log("Client connected to redis push and ready to use...");
});
redis.on("error", (error) => {
  console.log("fail");
});
redis.on("end", () => {
  console.log("Client disconnected from redis push");
});
redis.on("SIGINT", () => {
  redis.quit();
});

//create function set object to redis
exports.setObject = async (key, value) => {
  await redis.hmset(key, value);
};
exports.getObject = async (key) => await redis.hgetall(key);
exports.updateObject = async (key, value, newvalue) => {
  await redis.hset(key, value, newvalue);
};
exports.deleteObject = async (key) => await redis.del(key);
exports.deleteAllObject = async () => await redis.flushall();
exports.deleteObjectByKey = async (key) => await redis.hdel(key, key);

exports.getAllNftHashes = async () => {
  const pattern = "nft*";
  const result = [];
  for await (const key of redis.scanStream({ match: pattern })) {
    result.push(key);
  }
  return result;
};
