import { CompressionTypes, Partitioners } from 'kafkajs'
import kafka from '@Kafka/kafka'
import db from '@DB/clickhouse'
import { randomString, randomInt } from '$lib/random'

async function pushLogs(logs: string) {
	try {
		console.error(logs)
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
						values: [
							{ id: randomString(randomInt(30, 50), true, true, true), log: log.value?.toString() }
						],
						format: 'JSONEachRow'
					})
					resolveOffset(log.offset)
					await commitOffsetsIfNecessary(log.offset)
					await heartbeat()
				}
			}
		})
	} catch (e) {
		console.error('Error while pushing logs', e)
	}
}

export default pushLogs
