const { Kafka, Partitioners } = require('kafkajs');
const axios = require('axios');

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['kafka:29092']
});

const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner
});

const topic = 'test-topic';

const produceMessage = async () => {


    try {
        await producer.connect();
        const response = await axios.get('https://serpapi.com/search.json?', {
            params: {
                engine: 'google',
                q: 'UFRRJ',
                api_key: ''
            }
        });

        if (typeof response.data === 'object') {
            const message = JSON.stringify(response.data);
            await producer.send({
                topic,
                messages: [{ value: message }]
            });
        } else {
            console.error('A resposta da API não é um objeto JSON:', response.data);
        }


    } catch (error) {
        console.error('Erro ao fazer a requisição para a API ou ao enviar a mensagem:', error);
    } finally {
    }

    try {

        await producer.send({
            topic,
            messages: [
                { value: 'Teste' },
            ],
        });
    } catch (error) {
        console.error('Erro ao enviar a mensagem:', error);
    } finally {
        await producer.disconnect();
    }

};

produceMessage().catch(console.error);

const consumer = kafka.consumer({ groupId: 'test-group' });

const consumeMessage = async () => {
    try {
        await consumer.connect();
        await consumer.subscribe({ topic });
        console.log('Consumer ativo');

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log('Nova mensagem:', message.value.toString());
            },
        });
    } catch (error) {
        console.error('Erro ao consumir a mensagem:', error);
    }
};

consumeMessage().catch(console.error);
