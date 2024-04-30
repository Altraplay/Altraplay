import { CompressionTypes } from 'kafkajs'
import kafka from '../kafka'

async function publishLogsToKafka(logs: string) {
	const producer = kafka.producer()
	await producer.connect()
	await producer.send({
		topic: 'logs',
		messages: [{ key: 'log', value: logs }],
		compression: CompressionTypes.GZIP
	})
}

export default publishLogsToKafka
