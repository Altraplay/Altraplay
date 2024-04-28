import { createClient } from '@clickhouse/client'

const db = createClient({
	url: Bun.env.CLICKHOUSE_URL,
	username: Bun.env.CLICKHOUSE_USERNAME,
	password: Bun.env.CLICKHOUSE_PASSWORD,
	database: Bun.env.CLICKHOUSE_NAME,
	compression: { request: true, response: true },
	request_timeout: 0,
	max_open_connections: 2000,
})

export default db
