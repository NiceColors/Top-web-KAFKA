const { Kafka, Partitioners } = require('kafkajs');
const axios = require('axios');

const kafka = new Kafka({
    clientId: 'top-web',
    brokers: ['kafka:29092']
});

const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner
});

const topic = 'searchs';


const examples = [
    'UFRRJ', 'Web', 'Banco de Dados', 'Linguagem Natural', 'KAFKA',
]

const produceMessage = async () => {
    try {

        await producer.connect();

        const response = await axios.get('https://serpapi.com/search.json?', {
            params: {
                engine: 'google',
                q: 'UFRRJ',
                api_key: '2b2d8777551446eebc72adad724eb95aa87e117450c6567f0c903f964e03b101'
            }
        });


        if (typeof response.data === 'object') {
            const organic_results = response.data.organic_results;
            const message = JSON.stringify(organic_results);
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
        await producer.disconnect();
    }

};

examples.forEach(async (example) => {
    await produceMessage(example);
});

const consumer = kafka.consumer({ groupId: 'top-web' });

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
