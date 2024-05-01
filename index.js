const { Kafka, Partitioners } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'] 
});

const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner
});
const topic = 'test-topic'; 

const produceMessage = async () => {
    await producer.connect();
    console.log('O produtor está pronto.');

    setInterval(async () => {
        const message = `USL cu de Frango`;
        await producer.send({
            topic,
            messages: [{ value: message }]
        });
        console.log('Mensagem do producer:', message);
    }, 1000);
};

produceMessage().catch(console.error);

const consumer = kafka.consumer({ groupId: 'test-group' });

const consumeMessage = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic });
    console.log('Consumer ativo');

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log('Nova mensagem:', message.value.toString());
        },
    });
};

consumeMessage().catch(console.error);
