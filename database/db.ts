import cassandra from 'cassandra-driver'

export const client = new cassandra.Client({
	contactPoints: Bun.env.SCYLLADB_CONTACTPOINTS?.split(','),
	localDataCenter: Bun.env.SCYLLADB_LOCALDATACENTER,
	credentials: { username: Bun.env.SCYLLADB_USERNAME!, password: Bun.env.SCYLLADB_PASSWORD! },
	keyspace: 'tg'
})

export async function executeQuery(query: string, params: any[] = [], allowFiltering = false) {
	const fullQuery = allowFiltering ? `${query} ALLOW FILTERING` : query
	const result = await client.execute(fullQuery, params, { prepare: true })
	return result
}
