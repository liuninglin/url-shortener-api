const { env } = require('process');
const redis = require('redis');

const redisClient = redis.createClient({
    // using rediss for in-trainsit encryption
    url: 'rediss://' + env.REDIS_HOST + ':' + env.REDIS_PORT,
});

redisClient.on('error', (err) => {
    console.error(`Redis Error: ${err}`);
});

redisClient.on('connect', () => {
    console.info('Redis Client Connected.');
});

// keep the connection open
redisClient.connect();

async function saveAllHashFields(hashKey, urlMapping) {
    console.info('saveAllHashFields, parameters{hashKey:' + hashKey + ', urlMapping:' + urlMapping + '}');
    try {
        let res = await redisClient.hSet(hashKey, urlMapping);
        console.info('saveAllHashFields, res:' + res); 
        return res ? true: false;
    } catch (err) {
        console.error('saveAllHashFields, err:' + err);
        return false;
    }
}

async function getHashField(hashKey, fieldToRead) {
    console.info('getHashField, parameters{hashKey:' + hashKey + ', fieldToRead:' + fieldToRead + '}');
    try {
        let res = await redisClient.hGet(hashKey, fieldToRead);
        console.info('getHashField, res:' + res);
        return res;
    } catch (err) {
        console.error('getHashField, err:' + err);
        return false;
    }
}

async function checkHashFieldExists(hashKey, fieldToCheck) {
    console.info('checkHashFieldExists, parameters{hashKey:' + hashKey + ', fieldToCheck:' + fieldToCheck + '}');
    try {
        let res = await redisClient.hExists(hashKey, fieldToCheck);
        console.info("checkHashFieldExists, res:" + res);
        return res ? true: false;
    } catch (err) {
        console.err('checkHashFieldExists, err:' + err);
    }
}

async function getAllHashFields(hashKey) {
    console.info('getAllHashFields, parameters{hashKey:' + hashKey + '}');
    try {
        let res = await redisClient.hGetAll(hashKey);
        console.info("getAllHashFields, res:" + res);
        return res ? true: false;
    } catch (err) {
        console.error('getAllHashFields, err:' + err);
    }
}

module.exports = { saveAllHashFields, getHashField, checkHashFieldExists, getAllHashFields };