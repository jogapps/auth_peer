const Redis = require('ioredis');

const REDIS_URL = process.env.REDIS_URL || 'localhost';

let client = null;
let connected = false;
const urls = REDIS_URL.split(',');

const loadClient = () => {
  if (client) return client;
  client = new Redis({ host: urls[0], lazyConnect: true });
  client.on('error', (err) => console.log('Redis Client Error', err));

  client.on('connect', () => {
    console.log('Redis Connected');
    connected = true;
  });

  client.on('end', () => {
    console.log('Redis Ended');
    connected = false;
  });

  return client;
};

const destroyClient = async () => {
  if (client && connected) {
    try {
      await client.quit();
    } catch (e) {
      console.log(e);
      console.log('failed to close');
    }
  }
};

const isConnected = () => {
  return connected;
};

const getKeyMapping = (key) => {
    const prefix = `${process.env.NAME}`.replace(/[-\s]/g, '_').toLowerCase();
    return `${prefix}_${key}`;
  };

const remove = async (key) => {
  if (!key) {
    console.warn('no key present to delete cache');
    return false;
  }
  try {
    const redisClient = loadClient();
    if (redisClient.status !== 'connecting' && redisClient.status !== 'ready') {
      await redisClient.connect();
    }
    const keyMap = getKeyMapping(key);
    await redisClient.del(keyMap);
    return true;
  } catch (e) {
    console.error(`Error deleting cache: ${key}`, e);
    return false;
  }
};

const get = async (key) => {
  if (!key) {
    console.warn('no key present to get cache');
    return false;
  }
  try {
    const redisClient = loadClient();
    if (redisClient.status !== 'connecting' && redisClient.status !== 'ready') {
      await redisClient.connect();
    }
    const keyMap = getKeyMapping(key);
    const data = await redisClient.get(keyMap);
    return JSON.parse(data);
  } catch (e) {
    console.log(`Error fetching cache: ${key}`, e);
    return null;
  }
};

const getRaw = async (key) => {
  if (!key) {
    console.warn('no key present to get cache');
    return false;
  }
  try {
    const redisClient = loadClient();
    if (redisClient.status !== 'connecting' && redisClient.status !== 'ready') {
      await redisClient.connect();
    }
    const data = await redisClient.get(key);
    return JSON.parse(data);
  } catch (e) {
    console.log(`Error fetching cache: ${key}`, e);
    return null;
  }
};

const loadClientAsync = async () => {
  let redisClient = loadClient();
  if (redisClient.status !== 'connecting' && redisClient.status !== 'ready') {
    redisClient = await redisClient.connect();
  }
  return redisClient;
};

const set = async (key, data, expireInSecs = null) => {
  if (!key) {
    console.warn('no key present to save cache');
    return false;
  }
  if (!data) {
    console.warn('no data present to save cache');
    return false;
  }
  try {
    const redisClient = loadClient();

    if (redisClient.status !== 'connecting' && redisClient.status !== 'ready') {
      await redisClient.connect();
    }

    const dataString = JSON.stringify(data);
    const keyMap = getKeyMapping(key);
    await redisClient.set(keyMap, dataString);
    const expire = expireInSecs || process.env.CACHE_EXPIRY || 60 * 60 * 24 * 7;
    if (expire) {
      await redisClient.expire(key, expire);
    }

    return true;
  } catch (e) {
    console.error(`Error setting cache: ${key}: ${data}`, e);
    return false;
  }
};

const setRaw = async (key, data, expireInSecs = null) => {
    if (!key) {
      console.warn('no key present to save cache');
      return false;
    }
    if (!data) {
      console.warn('no data present to save cache');
      return false;
    }
    try {
      const redisClient = loadClient();
  
      if (redisClient.status !== 'connecting' && redisClient.status !== 'ready') {
        await redisClient.connect();
      }
  
      const dataString = JSON.stringify(data);
      await redisClient.set(key, dataString);
      const expire = expireInSecs || process.env.CACHE_EXPIRY || 60 * 60;
      if (expire) {
        await redisClient.expire(key, expire);
      }
  
      return true;
    } catch (e) {
      console.error(`Error setting cache: ${key}: ${data}`, e);
      return false;
    }
  };
  
  const getOrUpdate = async (key, callable, expireInSecs = null) => {
    let data = await get(key);
    if (!data) {
      data = await callable();
      if (data) await set(key, data, expireInSecs)
    }
    return data;
  };

module.exports = { loadClient, loadClientAsync, destroyClient, isConnected, get, set, setRaw, getRaw, remove, getOrUpdate };
