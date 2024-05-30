import { createClient } from '@clickhouse/client'

const db = createClient({
	url: Bun.env.DB_URL || 'http://localhost:8123',
	username: Bun.env.DB_USERNAME || 'default',
	password: Bun.env.DB_PASSWORD,
	database: Bun.env.DB_NAME || 'default',
	compression: { request: true, response: true },
	max_open_connections: 2000
})

export default db
