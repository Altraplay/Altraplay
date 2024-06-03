import { executeQuery } from './db'
import { types as CassandraTypes } from 'cassandra-driver'
import type { User } from '../src/types/user'
import type { Blog } from '../src/types/blog'
import type { Video } from '../src/types/video'
import type { Post } from '../src/types/post'
import type { Message } from '../src/types/msg'
import type { History } from '../src/types/history'
import type { SearchHistory } from '../src/types/searchHistory'

type TableMap = {
	users: User
	blogs: Blog
	videos: Video
	posts: Post
	messages: Message
	history: History
	search_history: SearchHistory
}

type WhereClause<T> = Partial<Record<keyof T, any>>
type SelectFields<T> = (keyof T)[] | ['*']

type SelectedFields<T, U extends SelectFields<T>> = U extends ['*'] ? T : Pick<T, U[number]>

interface CreateParams<T extends keyof TableMap> {
	table: T
	data: TableMap[T]
}

interface FindUniqueParams<T extends keyof TableMap, U extends SelectFields<TableMap[T]> = ['*']> {
	table: T
	where: WhereClause<TableMap[T]>
	select?: U
}

interface FindManyParams<T extends keyof TableMap, U extends SelectFields<TableMap[T]> = ['*']> {
	tables: T[]
	where?: { [K in T]?: WhereClause<TableMap[K]> }
	select?: { [K in T]?: U }
	limit?: number
}

interface UpdateParams<T extends keyof TableMap> {
	table: T
	data: Partial<TableMap[T]>
	where: WhereClause<TableMap[T]>
	collectionUpdates?: {
		[K in keyof TableMap[T]]?: {
			add?: any[]
			remove?: any[]
			update?: { [key: string]: any }
		}
	}
}

interface DeleteParams<T extends keyof TableMap> {
	table: T
	where: WhereClause<TableMap[T]>
}

interface DeleteManyParams<T extends keyof TableMap> {
	tables: T[]
	where: { [K in T]?: WhereClause<TableMap[K]> }
	collectionDeletions?: {
		[K in keyof TableMap[K]]?: any[]
	}
}

async function create<T extends keyof TableMap>({ table, data }: CreateParams<T>): Promise<void> {
	try {
		const columns = Object.keys(data).join(', ')
		const placeholders = Object.keys(data)
			.map(() => '?')
			.join(', ')
		const values = Object.values(data)

		const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`
		await executeQuery(query, values)
	} catch (error) {
		console.error(`Error creating entry in ${table}:`, error)
		throw error
	}
}

function rowToPlainObject<T>(row: CassandraTypes.Row): T {
	const plainObject: Partial<T> = {}
	row.keys().forEach(key => {
		const value = row[key]
		plainObject[key as keyof T] =
			value instanceof CassandraTypes.Long ? value.toNumber() : value ?? null
	})
	return plainObject as T
}

async function findUnique<T extends keyof TableMap, U extends SelectFields<TableMap[T]> = ['*']>({
	table,
	where,
	select
}: FindUniqueParams<T, U>): Promise<SelectedFields<TableMap[T], U> | null> {
	try {
		const selectClause = select ? (select.includes('*') ? '*' : select.join(', ')) : '*'

		const whereEntries = Object.entries(where)
		const whereClause =
			whereEntries.length > 0
				? ' WHERE ' + whereEntries.map(([field]) => `${field} = ?`).join(' AND ')
				: ''
		const values = whereEntries.map(([, value]) => value)

		const query = `SELECT ${selectClause} FROM ${table}${whereClause} LIMIT 1`
		const result = await executeQuery(query, values, !!whereClause)

		if (result.rows.length === 0) {
			return null
		}

		return rowToPlainObject<SelectedFields<TableMap[T], U>>(result.rows[0])
	} catch (error) {
		console.error(`Error finding unique entry in ${table}:`, error)
		throw error
	}
}

async function findMany<T extends keyof TableMap, U extends SelectFields<TableMap[T]> = ['*']>({
	tables,
	where,
	select,
	limit
}: FindManyParams<T, U>): Promise<{ [K in T]?: SelectedFields<TableMap[K], U>[] }> {
	try {
		const results: { [K in T]?: SelectedFields<TableMap[K], U>[] } = {}

		for (const table of tables) {
			const selectClause =
				select && select[table]
					? select[table]!.includes('*')
						? '*'
						: select[table]!.join(', ')
					: '*'
			const limitClause = limit ? ` LIMIT ${limit}` : ''

			const whereEntries = where && where[table] ? Object.entries(where[table]!) : []
			const whereClause =
				whereEntries.length > 0
					? ' WHERE ' + whereEntries.map(([field]) => `${field} = ?`).join(' AND ')
					: ''
			const values =
				where && where[table] ? Object.values(where[table]!).map(condition => condition) : []

			const query = `SELECT ${selectClause} FROM ${table}${whereClause}${limitClause}`
			const result = await executeQuery(query, values, !!whereClause)

			results[table] = result.rows.map(row =>
				rowToPlainObject<SelectedFields<TableMap[typeof table], U>>(row)
			)
		}

		return results
	} catch (error) {
		console.error(`Error finding many entries in tables ${tables.join(', ')}:`, error)
		throw error
	}
}

async function update<T extends keyof TableMap>({
	table,
	data,
	where,
	collectionUpdates
}: UpdateParams<T>): Promise<void> {
	try {
		const setClause = Object.keys(data)
			.map(key => `${key} = ?`)
			.join(', ')
		const whereEntries = Object.entries(where)
		const whereClause =
			whereEntries.length > 0
				? ' WHERE ' + whereEntries.map(([field]) => `${field} = ?`).join(' AND ')
				: ''
		const values = [...Object.values(data), ...whereEntries.map(([, value]) => value)]

		const collectionClauses: string[] = []
		if (collectionUpdates) {
			for (const [field, operations] of Object.entries(collectionUpdates)) {
				if (operations.add) {
					collectionClauses.push(`${field} = ${field} + ?`)
					values.push(operations.add)
				}
				if (operations.remove) {
					collectionClauses.push(`${field} = ${field} - ?`)
					values.push(operations.remove)
				}
				if (operations.update) {
					collectionClauses.push(`${field} = ${field} + ?`)
					values.push(operations.update)
				}
			}
		}

		const query = `UPDATE ${table} SET ${setClause}${collectionClauses.length ? ', ' + collectionClauses.join(', ') : ''}${whereClause}`
		await executeQuery(query, values)
	} catch (error) {
		console.error(`Error updating entry in ${table}:`, error)
		throw error
	}
}

async function remove<T extends keyof TableMap>({ table, where }: DeleteParams<T>): Promise<void> {
	try {
		const whereEntries = Object.entries(where)
		const whereClause =
			whereEntries.length > 0
				? ' WHERE ' + whereEntries.map(([field]) => `${field} = ?`).join(' AND ')
				: ''
		const values = whereEntries.map(([, value]) => value)

		const query = `DELETE FROM ${table}${whereClause}`
		await executeQuery(query, values)
	} catch (error) {
		console.error(`Error deleting entry from ${table}:`, error)
		throw error
	}
}

async function deleteMany<T extends keyof TableMap>({
	tables,
	where,
	collectionDeletions
}: DeleteManyParams<T>): Promise<void> {
	try {
		for (const table of tables) {
			if (!where[table]) continue
			const whereEntries = Object.entries(where[table]!)
			const whereClause =
				whereEntries.length > 0
					? ' WHERE ' + whereEntries.map(([field]) => `${field} = ?`).join(' AND ')
					: ''
			const values = whereEntries.map(([, value]) => value)

			const collectionClauses: string[] = []
			if (collectionDeletions && collectionDeletions[table]) {
				for (const [field, elements] of Object.entries(collectionDeletions[table]!)) {
					collectionClauses.push(`${field} = ${field} - ?`)
					values.push(elements)
				}
			}

			const query = `DELETE FROM ${table}${whereClause}`
			await executeQuery(query, values)
		}
	} catch (error) {
		console.error(`Error deleting many entries from tables ${tables.join(', ')}:`, error)
		throw error
	}
}

const db = {
	create,
	findUnique,
	findMany,
	update,
	delete: remove,
	deleteMany
}

export default db
