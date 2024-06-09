import db from './clickhouse'

async function logs() {
	try {
		await db.command({
			query: `CREATE TABLE IF NOT EXISTS logs (
                type String,
                log String,
                time DateTime64 DEFAULT now()
            ) ENGINE MergeTree()
            ORDER BY (type, time)
            PRIMARY KEY type`
		})
	} catch (e) {
		console.error(`Error creating table for logs, error: ${e}`)
	}
}

async function analytics() {
	try {
		await db.command({
			query: `CREATE TABLE IF NOT EXISTS analytics (
            responseTime String,
            responseCode String,
            cpuUsage String,
            memoryUsage String,
            requestNumber String,
            path String,
            time DateTime64 DEFAULT now()
            ) ENGINE MergeTree()
             ORDER BY (requestNumber, responseTime, responseCode, path, time)
             PRIMARY KEY requestNumber`
		})
	} catch (e) {
		console.error(`Error creating table for analytics, error: ${e}`)
	}
}

async function push() {
	await logs()
	await analytics()
	console.log('Tables created')
	process.exit(0)
}

push()
