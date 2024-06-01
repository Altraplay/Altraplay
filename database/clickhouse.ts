import { createClient } from '@clickhouse/client'

const db = createClient({
	url: Bun.env.CLICKHOUSE_URL || 'http://localhost:8123',
	username: Bun.env.CLICKHOUSE_USERNAME || 'default',
	password: Bun.env.CLICKHOUSE_PASSWORD,
	database: Bun.env.CLICKHOUSE_NAME || 'default',
	compression: { request: true, response: true },
	max_open_connections: 2000
})

export default db
