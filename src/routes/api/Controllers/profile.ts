import { Elysia } from 'elysia'
import db from '@DB/db'
import type { User } from '$Types/user'
import pushLogs from '$lib/logs'

const route = new Elysia({ prefix: '/profile/:username' })
	.get('/', async ({ params, set }) => {
		try {
			const { username } = params

			const user = (await db.query({
				query: `SELECT
				username,
				name,
				bio,
				profile_picture,
				banner,
				level,
				role,
				points,
				needs,
				links,
				verified,
				skills,
				language,
				team,
				is_email_verified,
				joined
			 FROM users WHERE username = {username:String}`,
				query_params: {
					username
				},
				format: 'JSONEachRow'
			})) as unknown as User[]

			if (user.length > 0 && user[0]?.is_email_verified) {
				return {
					user: user[0]
				}
			} else {
				set.status = 404
				return { err: 'User not found' }
			}
		} catch (e) {
			set.status = 500
			console.error(`Failed to retrieve user's profile: ${e}`)
			pushLogs(`Failed to retrieve user's profile: ${e}`)
			return { err: "Something went wrong on our server, We'll try to fix it ASAP!" }
		}
	})

export default route
