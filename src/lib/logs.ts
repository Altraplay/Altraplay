import { CompressionTypes, Partitioners } from 'kafkajs'
import kafka from '@Kafka/kafka'
import db from '@DB/clickhouse'

async function pushLogs(logs: string, type: 'error' | 'warning' | 'info' = 'error') {
	try {
		console[type](logs)
		const producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner })
		await producer.connect()
		await producer.send({
			topic: 'logs',
			messages: [{ key: 'log', value: logs, partition: 0 }],
			compression: CompressionTypes.GZIP
		})

		const consumer = kafka.consumer({ groupId: 'logs' })
		await consumer.connect()
		await consumer.subscribe({ topic: 'logs', fromBeginning: true })
		await consumer.run({
			eachBatch: async ({ batch, heartbeat, commitOffsetsIfNecessary, resolveOffset }) => {
				const logs = batch.messages
				for (const log of logs) {
					await db.insert({
						table: 'logs',
						values: [{ type, log: log.value?.toString() }],
						format: 'JSONEachRow'
					})
					resolveOffset(log.offset)
					await commitOffsetsIfNecessary()
					await heartbeat()
				}
			}
		})
	} catch (e) {
		console.error('Error while pushing logs', e)
	}
}

export default pushLogs
