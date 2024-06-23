/* eslint-disable @typescript-eslint/no-explicit-any */
import { executeQuery } from './db'
import { types as CassandraTypes } from 'cassandra-driver'
import type { Tables } from '../src/types/schema'

type TableMap = {
	[K in keyof Tables]: Tables[K]
}

type WhereCondition<T> = {
	value: any
	operator?: '=' | 'CONTAINS' | 'IN' | '>' | '<' | '>=' | '<='
} | any
type WhereClause<T> = Partial<Record<keyof T, WhereCondition<T[keyof T]> | T[keyof T]>>
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
	orderBy?: Partial<Record<keyof TableMap[T], 'ASC' | 'DESC'>>
}

interface FindManyParamsSingle<
	T extends keyof TableMap,
	U extends SelectFields<TableMap[T]> = ['*']
> {
	table: T
	where?: WhereClause<TableMap[T]>
	select?: U
	orderBy?: Partial<Record<keyof TableMap[T], 'ASC' | 'DESC'>>
	limit?: number
}

interface FindManyParamsMulti<
	T extends keyof TableMap,
	U extends SelectFields<TableMap[T]> = ['*']
> {
	tables: T[]
	where?: { [K in T]?: WhereClause<TableMap[K]> }
	select?: { [K in T]?: U }
	orderBy?: { [K in T]?: Partial<Record<keyof TableMap[K], 'ASC' | 'DESC'>> }
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
	select,
	orderBy
}: FindUniqueParams<T, U>): Promise<SelectedFields<TableMap[T], U> | null> {
	try {
		const selectClause = select ? (select.includes('*') ? ['*'] : select) : ['*']

		const whereEntries = Object.entries(where)
		const whereClause =
			whereEntries.length > 0
				? ' WHERE ' +
					whereEntries
						.map(([field, condition]) => {
							if (typeof condition === 'object' && condition?.operator) {
								return `${field} ${condition?.operator} ?`
							}
							return Array.isArray(condition) ? `${field} CONTAINS ?` : `${field} = ?`
						})
						.join(' AND ')
				: ''
		const values = Object.values(where).map(condition =>
			typeof condition === 'object' ? condition?.value : condition
		)

		const orderByFields = orderBy ? Object.entries(orderBy) : []

		const query = `SELECT ${selectClause.join(', ')} FROM ${table}${whereClause} LIMIT 1`
		const result = await executeQuery(query, values, !!whereClause)
		let rows = result.rows.map(row => rowToPlainObject<SelectedFields<TableMap[T], U>>(row))

		if (orderByFields.length > 0) {
			rows.sort((a, b) => {
				for (const [field, direction] of orderByFields) {
					if (a[field] < b[field]) return direction === 'ASC' ? -1 : 1		
					if (a[field] > b[field]) return direction === 'ASC' ? 1 : -1
				}
				return 0
			})
		}

		return rows.length > 0 ? rows[0] : null
	} catch (error) {
		console.error(`Error finding unique entry in table ${table}:`, error)
		throw error
	}
}

async function findMany<T extends keyof TableMap, U extends SelectFields<TableMap[T]> = ['*']>({
	table,
	tables,
	where,
	select,
	orderBy,
	limit
}: FindManyParamsSingle<T, U> | FindManyParamsMulti<T, U>): Promise<{
	[K in T]?: SelectedFields<TableMap[K], U>[]
}> {
	try {
		const results: { [K in T]?: SelectedFields<TableMap[K], U>[] } = {}

		const getData = async (
			tableName: T,
			selectFields: string[],
			whereClause: string,
			values: any[],
			orderByFields: [string, string][],
			limitClause: string
		) => {
			const query = `SELECT ${selectFields.join(', ')} FROM ${tableName}${whereClause}${limitClause}`
			const result = await executeQuery(query, values, !!whereClause)
			const rows = result.rows.map(row => rowToPlainObject<SelectedFields<TableMap[T], U>>(row))

			if (orderByFields.length > 0) {
				rows.sort((a, b) => {
					for (const [field, direction] of orderByFields) {
						if (a[field] < b[field]) return direction === 'ASC' ? -1 : 1
						if (a[field] > b[field]) return direction === 'ASC' ? 1 : -1
					}
					return 0
				})
			}
			return rows
		}

		if (table) {
			const selectClause = select ? (select.includes('*') ? ['*'] : select) : ['*']
			const limitClause = limit ? ` LIMIT ${limit}` : ''

			const whereEntries = where ? Object.entries(where) : []
			const whereClause =
				whereEntries.length > 0
					? ' WHERE ' +
						whereEntries
							.map(([field, condition]) => {
								if (typeof condition === 'object' && condition?.operator) {
									return `${field} ${condition?.operator} ?`
								}
								return Array.isArray(condition) ? `${field} CONTAINS ?` : `${field} = ?`
							})
							.join(' AND ')
					: ''
			const values = where
				? Object.values(where).map(condition =>
						typeof condition === 'object' ? condition?.value : condition
					)
				: []

			const orderByFields = orderBy ? Object.entries(orderBy) : []

			results[table as T] = await getData(
				table as T,
				selectClause,
				whereClause,
				values,
				orderByFields,
				limitClause
			)
		} else {
			for (const table of tables!) {
				const selectClause =
					select && select[table] ? (select[table]!.includes('*') ? ['*'] : select[table]!) : ['*']
				const limitClause = limit ? ` LIMIT ${limit}` : ''

				const whereEntries = where && where[table] ? Object.entries(where[table]!) : []
				const whereClause =
					whereEntries.length > 0
						? ' WHERE ' +
							whereEntries
								.map(([field, condition]) => {
									if (typeof condition === 'object' && condition?.operator) {
										return `${field} ${condition?.operator} ?`
									}
									return Array.isArray(condition) ? `${field} CONTAINS ?` : `${field} = ?`
								})
								.join(' AND ')
						: ''
				const values =
					where && where[table]
						? Object.values(where[table]!).map(condition =>
								typeof condition === 'object' ? condition?.value : condition
							)
						: []

				const orderByFields = orderBy && orderBy[table] ? Object.entries(orderBy[table]!) : []

				results[table] = await getData(
					table,
					selectClause,
					whereClause,
					values,
					orderByFields,
					limitClause
				)
			}
		}

		return results
	} catch (error) {
		console.error(`Error finding many entries in tables ${tables?.join(', ') || table}:`, error)
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
		const setEntries = Object.entries(data)
		const setClause = setEntries.map(([field]) => `${field} = ?`).join(', ')
		const values = setEntries.map(([, value]) => value)

		const whereEntries = Object.entries(where)
		const whereClause =
			whereEntries.length > 0
				? ' WHERE ' +
					whereEntries
						.map(([field, condition]) => {
							if (typeof condition === 'object' && condition?.operator) {
								return `${field} ${condition?.operator} ?`
							}
							return `${field} = ?`
						})
						.join(' AND ')
				: ''
		values.push(
			...whereEntries.map(([, condition]) =>
				typeof condition === 'object' ? condition?.value : condition
			)
		)

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
					const updateEntries = Object.entries(operations.update)
					collectionClauses.push(
						`${field} = ${field} + {${updateEntries.map(([k]) => k).join(', ')}}`
					)
					values.push(operations.update)
				}
			}
		}

		const query = `UPDATE ${table} SET ${setClause}${
			collectionClauses.length ? ', ' + collectionClauses.join(', ') : ''
		}${whereClause}`
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
				? ' WHERE ' +
					whereEntries
						.map(([field, condition]) => {
							if (typeof condition === 'object' && condition?.operator) {
								return `${field} ${condition?.operator} ?`
							}
							return `${field} = ?`
						})
						.join(' AND ')
				: ''
		const values = whereEntries.map(([, condition]) =>
			typeof condition === 'object' ? condition?.value : condition
		)

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
			const whereEntries = where && where[table] ? Object.entries(where[table]!) : []
			const whereClause =
				whereEntries.length > 0
					? ' WHERE ' +
						whereEntries
							.map(([field, condition]) => {
								if (typeof condition === 'object' && condition?.operator) {
									return `${field} ${condition?.operator} ?`
								}
								return `${field} = ?`
							})
							.join(' AND ')
					: ''
			const values =
				where && where[table]
					? Object.values(where[table]!).map(condition =>
							typeof condition === 'object' ? condition?.value : condition
						)
					: []

			const collectionClauses: string[] = []
			if (collectionDeletions && collectionDeletions[table]) {
				for (const [field, deletions] of Object.entries(collectionDeletions[table]!)) {
					collectionClauses.push(`${field} = ${field} - ?`)
					values.push(deletions)
				}
			}

			const query = `DELETE FROM ${table}${whereClause}${
				collectionClauses.length ? ' AND ' + collectionClauses.join(' AND ') : ''
			}`
			await executeQuery(query, values)
		}
	} catch (error) {
		console.error(`Error deleting entries from tables ${tables.join(', ')}:`, error)
		throw error
	}
}

type ColumnDefinition = {
	type: string | object | object[]
	isPrimaryKey?: boolean
	index?: boolean
	frozen?: boolean
}

type SchemaDefinition = {
	[table: string]: {
		columns: {
			[column: string]: string | ColumnDefinition
		}
	}
}

async function schema(newSchema: SchemaDefinition): Promise<void> {
	const currentTables = await getCurrentTables()
	const currentUdts = await getCurrentUdts()

	for (const tableName of Object.keys(newSchema)) {
		const tableSchema = newSchema[tableName]
		const columns = tableSchema.columns

		if (currentTables.includes(tableName)) {
			await alterTable(tableName, columns, currentUdts)
		} else {
			await createTable(tableName, columns, currentUdts)
		}
	}
}

async function getCurrentTables(): Promise<string[]> {
	const result = await executeQuery('SELECT table_name FROM system_schema.tables')
	return result.rows.map((row: any) => row.table_name)
}

async function getCurrentUdts(): Promise<Record<string, any>> {
	const result = await executeQuery(
		'SELECT type_name, field_names, field_types FROM system_schema.types'
	)
	const udts: Record<string, any> = {}
	result.rows.forEach((row: any) => {
		const fields: Record<string, string> = {}
		row.field_names.forEach((name: string, index: number) => {
			fields[name] = row.field_types[index]
		})
		udts[row.type_name] = fields
	})
	return udts
}

async function createTable(
	tableName: string,
	columns: Record<string, ColumnDefinition | string>,
	currentUdts: Record<string, any>
): Promise<void> {
	const columnDefinitions = []
	const primaryKeys: string[] = []
	const indexes: string[] = []

	for (const columnName in columns) {
		const columnDefinition = columns[columnName]
		const columnType =
			typeof columnDefinition === 'string' ? columnDefinition : columnDefinition.type

		if (typeof columnType === 'object' && !Array.isArray(columnType)) {
			const udtName = await getOrCreateUdt(columnType, currentUdts)
			columnDefinitions.push(
				`${columnName} ${columnDefinition?.frozen ? `frozen<${udtName}>` : udtName}`
			)
		} else if (Array.isArray(columnType)) {
			const udtName = await getOrCreateUdt(columnType[0], currentUdts)
			columnDefinitions.push(`${columnName} list<frozen<${udtName}>>`)
		} else {
			columnDefinitions.push(`${columnName} ${columnType}`)
		}

		if (typeof columnDefinition === 'object' && columnDefinition.isPrimaryKey) {
			primaryKeys.push(columnName)
		}

		if (typeof columnDefinition === 'object' && columnDefinition.index) {
			indexes.push(columnName)
		}
	}

	const primaryKeyClause = primaryKeys.length > 0 ? `, PRIMARY KEY (${primaryKeys.join(', ')})` : ''
	const createTableQuery = `CREATE TABLE ${tableName} (${columnDefinitions.join(', ')}${primaryKeyClause})`
	console.log(`Creating table ${tableName} with query: ${createTableQuery}`)
	await executeQuery(createTableQuery)

	for (const index of indexes) {
		const createIndexQuery = `CREATE INDEX ON ${tableName} (${index})`
		console.log(`Creating index on ${index} with query: ${createIndexQuery}`)
		await executeQuery(createIndexQuery)
	}
}

async function alterTable(
	tableName: string,
	columns: Record<string, ColumnDefinition | string>,
	currentUdts: Record<string, any>
): Promise<void> {
	const currentColumns = await getCurrentColumns(tableName)
	const alterQueries: string[] = []
	const dropQueries: string[] = []
	const indexes: string[] = []

	for (const columnName in columns) {
		const columnDefinition = columns[columnName]
		let columnType = typeof columnDefinition === 'string' ? columnDefinition : columnDefinition.type

		if (typeof columnType === 'object' && !Array.isArray(columnType)) {
			const udtName = await getOrCreateUdt(columnType, currentUdts)
			columnType = columnDefinition.frozen ? `frozen<${udtName}>` : udtName
		} else if (Array.isArray(columnType)) {
			const udtName = await getOrCreateUdt(columnType[0], currentUdts)
			columnType = `list<frozen<${udtName}>>`
		}

		if (currentColumns[columnName]) {
			const currentColumnType = currentColumns[columnName]
			if (currentColumnType !== columnType) {
				console.warn(
					`Column type mismatch for ${columnName} in ${tableName}. Current type: ${currentColumnType}, new type: ${columnType}`
				)
				alterQueries.push(`ALTER TABLE ${tableName} ALTER ${columnName} TYPE ${columnType}`)
			}
		} else {
			alterQueries.push(`ALTER TABLE ${tableName} ADD ${columnName} ${columnType}`)
			if (typeof columnDefinition === 'object' && columnDefinition.index) {
				indexes.push(columnName)
			}
		}
	}

	for (const currentColumn in currentColumns) {
		if (!columns[currentColumn]) {
			dropQueries.push(`ALTER TABLE ${tableName} DROP ${currentColumn}`)
		}
	}

	for (const query of alterQueries) {
		console.log(`Altering table ${tableName} with query: ${query}`)
		await executeQuery(query)
	}

	for (const query of dropQueries) {
		console.log(`Dropping column from table ${tableName} with query: ${query}`)
		await executeQuery(query)
	}

	for (const index of indexes) {
		const createIndexQuery = `CREATE INDEX ON ${tableName} (${index})`
		console.log(`Creating index on ${index} with query: ${createIndexQuery}`)
		await executeQuery(createIndexQuery)
	}
}

async function getCurrentColumns(tableName: string): Promise<Record<string, string>> {
	const result = await executeQuery(
		'SELECT column_name, type FROM system_schema.columns WHERE table_name = ?',
		[tableName]
	)
	const columns: Record<string, string> = {}
	result.rows.forEach((row: any) => {
		columns[row.column_name] = row.type
	})
	return columns
}

async function getOrCreateUdt(
	udtDefinition: object,
	currentUdts: Record<string, any>
): Promise<string> {
	const nestedUdtPromises = []

	for (const [fieldName, fieldType] of Object.entries(udtDefinition)) {
		if (typeof fieldType === 'object' && !Array.isArray(fieldType)) {
			nestedUdtPromises.push(
				getOrCreateUdt(fieldType, currentUdts).then(udtName => {
					;(udtDefinition as any)[fieldName] = udtName
				})
			)
		} else if (Array.isArray(fieldType)) {
			nestedUdtPromises.push(
				getOrCreateUdt(fieldType[0], currentUdts).then(udtName => {
					;(udtDefinition as any)[fieldName] = `list<frozen<${udtName}>>`
				})
			)
		}
	}

	await Promise.all(nestedUdtPromises)

	const udtName = findMatchingUdt(udtDefinition, currentUdts)
	if (udtName) {
		return udtName
	}

	const newUdtName = generateUdtName(udtDefinition)
	await createUdt(newUdtName, udtDefinition)
	currentUdts[newUdtName] = udtDefinition
	return newUdtName
}

function findMatchingUdt(udtDefinition: object, currentUdts: Record<string, any>): string | null {
	for (const [udtName, fields] of Object.entries(currentUdts)) {
		if (areFieldsEqual(fields, udtDefinition)) {
			return udtName
		}
	}
	return null
}

function areFieldsEqual(fields1: Record<string, any>, fields2: Record<string, any>): boolean {
	const keys1 = Object.keys(fields1).sort()
	const keys2 = Object.keys(fields2).sort()
	if (keys1.length !== keys2.length) {
		return false
	}

	return keys1.every(key => fields1[key] === fields2[key])
}

function generateUdtName(udtDefinition: object): string {
	return `udt_${Object.keys(udtDefinition).join('_').toLowerCase()}`
}

async function createUdt(name: string, udtDefinition: object): Promise<void> {
	const fieldDefinitions = Object.entries(udtDefinition).map(
		([fieldName, fieldType]) => `${fieldName} ${fieldType}`
	)
	const createUdtQuery = `CREATE TYPE IF NOT EXISTS ${name} (${fieldDefinitions.join(', ')})`
	console.log(`Creating UDT ${name} with query: ${createUdtQuery}`)
	await executeQuery(createUdtQuery)
}

const db = {
	create,
	findUnique,
	findMany,
	update,
	delete: remove,
	deleteMany,
	schema
}

export default db
