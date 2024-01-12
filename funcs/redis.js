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

async function saveHashFields(hashKey, hashFields) {
    console.info('saveHashFields, parameters{hashKey:' + hashKey + ', urlMapping:' + hashFields + '}');
    try {
        let res = await redisClient.hSet(hashKey, hashFields);
        console.info('saveHashFields, res:' + res); 
        return res ? true: false;
    } catch (err) {
        console.error('saveHashFields, err:' + err);
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

async function hashFieldExists(hashKey, fieldToCheck) {
    console.info('hashFieldExists, parameters{hashKey:' + hashKey + ', fieldToCheck:' + fieldToCheck + '}');
    try {
        let res = await redisClient.hExists(hashKey, fieldToCheck);
        console.info("hashFieldExists, res:" + res);
        return res ? true: false;
    } catch (err) {
        console.err('hashFieldExists, err:' + err);
    }
}

async function getHashFields(hashKey) {
    console.info('getHashFields, parameters{hashKey:' + hashKey + '}');
    try {
        let res = await redisClient.hGetAll(hashKey);
        console.info("getHashFields, res:" + JSON.stringify(res));
        return res;
    } catch (err) {
        console.error('getHashFields, err:' + err);
    }
}

async function deleteHash(hashKey) {
    console.info('deleteHash, parameters{hashKey:' + hashKey + '}');
    try {
        let res = await redisClient.del(hashKey);
        console.info('deleteHash, res:' + res);
        return res ? true: false;
    } catch (err) {
        console.error('deleteHash, err:' + err);
        return false;
    }
}

async function deleteHashField(hashKey, fieldToDelete) {
    console.info('deleteHashField, parameters{hashKey:' + hashKey + ', fieldToDelete:' + fieldToDelete + '}');
    try {
        let res = await redisClient.hDel(hashKey, fieldToDelete);
        console.info('deleteHashField, res:' + res);
        return res ? true: false;
    } catch (err) {
        console.error('deleteHashField, err:' + err);
        return false;
    }
}

async function getAllKeys(keyword) {
    console.info('getAllKeys, parameters{keyword:' + keyword + '}');
    try {
        let res = await redisClient.scanIterator({
            TYPE: 'hash',
            MATCH: keyword + '*',
            COUNT: 100
        });
        console.info('getAllKeys, res:' + res);
        return res;
    } catch (err) {
        console.error('getAllKeys, err:' + err);
    }
}

async function getType(key) {
    console.info('getType, parameters{key:' + key + '}');
    try {
        let res = await redisClient.type(key);
        console.info('getType, res:' + res);
        return res;
    } catch (err) {
        console.error('getType, err:' + err);
    }
}

module.exports = { saveHashFields, getHashField, hashFieldExists, getHashFields, deleteHash, deleteHashField, getAllKeys, getType };