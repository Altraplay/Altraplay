import kafka from './kafka'

const admin = kafka.admin()

async function createTopics() {
	try {
		await admin.connect()
		await admin.createTopics({
			topics: [
				{
					topic: 'logs',
					numPartitions: 1,
					replicationFactor: -1
				},
				{
					topic: 'followers',
					numPartitions: 1,
					replicationFactor: -1
				},
				{
					topic: 'messages',
					numPartitions: 1,
					replicationFactor: -1
				},
                {
					topic: 'likes',
					numPartitions: 1,
                    replicationFactor: -1
				},
				{
                    topic: 'dislikes',
                    numPartitions: 1,
                    replicationFactor: -1
                },
                {
                    topic: 'comments',
                    numPartitions: 1,
                    replicationFactor: -1
                },
                {
                    topic:'analytics',
                    numPartitions: 1,
                    replicationFactor: -1
                },
                {
                    topic: 'notifications',
                    numPartitions: 1,
                    replicationFactor: -1
                }
			]
		})
		console.log('Topics created successfully !!!')
	} catch (e) {
		console.error('Error while creating topics:', e)
	} finally {
		admin.disconnect()
	}
}

createTopics()
