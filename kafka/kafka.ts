import { Kafka } from 'kafkajs'

const kafka = new Kafka({
	clientId: 'techgunner',
	brokers: [Bun.env.KAFKA_URL!],
	ssl: {},
	sasl: {
		// @ts-expect-error: don't know why
		username: Bun.env.KAFKA_USERNAME,
		password: Bun.env.KAFKA_PASSWORD,
		mechanism: Bun.env.KAFKA_MECHANISM || 'plain'
	}
})

export default kafka
