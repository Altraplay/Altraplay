import cassandra from 'cassandra-driver'

export const client = new cassandra.Client({
	contactPoints: Bun.env.SCYLLADB_CONTACTPOINTS?.split(','),
	localDataCenter: Bun.env.SCYLLADB_LOCALDATACENTER,
	credentials: { username: Bun.env.SCYLLADB_USERNAME!, password: Bun.env.SCYLLADB_PASSWORD! },
	keyspace: 'tg'
})

export async function executeQuery(query: string, params: any[] = [], allowFiltering = false) {
	try {
		const fullQuery = allowFiltering ? `${query} ALLOW FILTERING` : query
		const result = await client.execute(fullQuery, params, { prepare: true })
		console.log(fullQuery)
		return result
	} catch (error) {
		console.error('Query execution error:', error)
		throw error
	}
}
