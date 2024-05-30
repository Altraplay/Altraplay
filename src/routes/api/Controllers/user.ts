import { Elysia, t } from 'elysia'
import { checkState } from '$lib/auth'
import db from '@DB/clickhouse'
import pushLogs from '$lib/logs'
import type { User } from '$Types/user'

const route = new Elysia({ prefix: '/user' })
	.post(
		'/availability',
		async ({ body, set }) => {
			try {
				const { email } = body
				const username = `@${body.username.replaceAll(' ', '').toLowerCase()}`

				const checkUsernameAvailability = (await db
					.query({
						query: 'SELECT is_email_verified FROM users WHERE username = {username:String}',
						query_params: { username },
						format: 'JSONEachRow'
					})
					.then(async rows => await rows.json())) as User[]

				const checkEmailAvailability = (await db
					.query({
						query: 'SELECT is_email_verified FROM users WHERE email = {email:String}',
						query_params: { email },
						format: 'JSONEachRow'
					})
					.then(async rows => await rows.json())) as User[]

				if (
					checkEmailAvailability.some(user => user?.is_email_verified) ||
					checkUsernameAvailability.some(user => user?.is_email_verified)
				) {
					const tryUsernames = [
						`its${username.replace('@', '')}`,
						`real${username.replace('@', '')}`,
						`${username.replace('@', '')}official`,
						`${username.replace('@', '')}s`
					]
					tryUsernames.forEach(async name => {
						const user = await db
							.query({
								query:
									'SELECT username, is_email_verified FROM users WHERE username = {username:String}',
								query_params: { username: name },
								format: 'JSONEachRow'
							})
							.then(async rows => (await rows.json()) as User[])
						if (user.some(user => user?.is_email_verified)) {
							tryUsernames.splice(tryUsernames.indexOf(name), 1)
						}
					})
					return { err: 'Username or email already exists', tryUsernames }
				} else set.status = 204
			} catch (e) {
				set.status = 500
				console.error('Error checking availability for username and email:' + e)
				pushLogs(`Error checking availability for username and email: ${e}`)
				return { err: "Something went wrong on our server, We'll try to fix it ASAP!" }
			}
		},
		{
			body: t.Object({
				username: t.String(),
				email: t.String()
			})
		}
	)

export default route
