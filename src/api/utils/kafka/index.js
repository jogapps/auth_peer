const { Kafka, logLevel } = require('kafkajs');

const KAFKA_BROKERS = process.env.KAFKA_BROKERS || 'localhost:9092';
const kafka = new Kafka({
    clientId: 'cache-service',
    brokers: KAFKA_BROKERS.split(','),
    logLevel: logLevel.ERROR,
});

let producer = null;
let consumerMap = new Map();

const sanitizeTopicName = (key) => {
    const prefix = `${process.env.NAME || 'default'}`.replace(/[-\s]/g, '_').toLowerCase();
    return `${prefix}_${key}`.replace(/[^a-zA-Z0-9._-]/g, '_');
};

const ensureTopicExists = async (topic) => {
    const admin = kafka.admin();
    await admin.connect();
    const topics = await admin.listTopics();

    if (!topics.includes(topic)) {
        console.log(`Creating topic: ${topic}`);
        await admin.createTopics({
            topics: [{ topic, numPartitions: 1, replicationFactor: 1 }],
        });
    }

    await admin.disconnect();
};

const loadProducer = async () => {
    if (!producer) {
        producer = kafka.producer();
        await producer.connect();
        console.log('Kafka Producer Connected');
    }
    return producer;
};

const loadConsumer = async (topic) => {
    if (!consumerMap.has(topic)) {
        const consumer = kafka.consumer({ groupId: `cache-service-group-${topic}` });
        await consumer.connect();
        await consumer.subscribe({ topic, fromBeginning: true });
        consumerMap.set(topic, consumer);
        console.log(`Kafka Consumer Connected to Topic: ${topic}`);
    }
    return consumerMap.get(topic);
};

const get = async (key) => {
    if (!key) {
        console.warn('No key provided to fetch data');
        return null;
    }

    const topic = sanitizeTopicName(key);
    await ensureTopicExists(topic);

    try {
        const messages = [];
        const kafkaConsumer = await loadConsumer(topic);

        await kafkaConsumer.run({
            eachMessage: async ({ message }) => {
                messages.push(JSON.parse(message.value.toString()));
            },
        });

        return messages.length > 0 ? messages[messages.length - 1] : null;
    } catch (error) {
        console.error(`Error fetching Kafka message for key: ${key}`, error);
        return null;
    }
};

const set = async (key, data) => {
    if (!key) {
        console.warn('No key provided to save data');
        return false;
    }

    if (!data) {
        console.warn('No data provided to save');
        return false;
    }

    const topic = sanitizeTopicName(key);
    await ensureTopicExists(topic);

    try {
        const kafkaProducer = await loadProducer();
        const message = {
            key,
            value: JSON.stringify(data),
        };

        await kafkaProducer.send({
            topic,
            messages: [message],
        });

        console.log(`Message set in topic: ${topic}`);
        return true;
    } catch (error) {
        console.error(`Error sending message to Kafka topic: ${key}`, error);
        return false;
    }
};

const remove = async (key) => {
    if (!key) {
        console.warn('No key provided to delete cache');
        return false;
    }

    const topic = sanitizeTopicName(key);

    try {
        await ensureTopicExists(topic);

        const kafkaProducer = await loadProducer();

        // Produce a tombstone message (key with a null value)
        await kafkaProducer.send({
            topic,
            messages: [
                {
                    key,
                    value: null,
                },
            ],
        });

        console.log(`Tombstone message sent to topic: ${topic} for key: ${key}`);
        return true;
    } catch (error) {
        console.error(`Error sending tombstone message for key: ${key}`, error);
        return false;
    }
};


const getOrUpdate = async (key, callable) => {
    let data = await get(key);

    if (!data) {
        data = await callable();
        if (data) await set(key, data);
    }

    return data;
};

const destroyClient = async () => {
    if (producer) {
        await producer.disconnect();
        console.log('Kafka Producer Disconnected');
    }

    for (const [topic, consumer] of consumerMap.entries()) {
        await consumer.disconnect();
        console.log(`Kafka Consumer Disconnected from Topic: ${topic}`);
    }
    consumerMap.clear();
};

const isConnected = () => {
    return producer !== null && consumerMap.size > 0;
};

module.exports = {
    get,
    set,
    remove,
    isConnected,
    getOrUpdate,
    loadProducer,
    loadConsumer,
    destroyClient,
};