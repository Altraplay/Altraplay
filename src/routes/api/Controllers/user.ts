import { Elysia, t } from 'elysia'
import { checkState } from '$lib/auth'
import db from '@DB/orm'
import pushLogs from '$lib/logs'
import type { User } from '$Types/user'

const route = new Elysia({ prefix: '/user' })
	.post(
		'/availability',
		async ({ body, set }) => {
			try {
				const { email } = body
				const username = `@${body.username.replaceAll(' ', '').toLowerCase()}`

				const checkUsernameAvailability = await db
					.findMany({
						tables: ['users'],
						where: { users: { username } },
						select: { users: ['is_email_verified'] }
					})
					.then(users => users.users)

				const checkEmailAvailability = await db
					.findMany({
						tables: ['users'],
						where: { users: { email } },
						select: { users: ['is_email_verified'] }
					})
					.then(users => users.users)

				if (
					checkEmailAvailability?.some(user => user?.is_email_verified) ||
					checkUsernameAvailability?.some(user => user?.is_email_verified)
				) {
					const tryUsernames = [
						`its${username.replace('@', '')}`,
						`real${username.replace('@', '')}`,
						`${username.replace('@', '')}official`,
						`${username.replace('@', '')}s`
					]

					for (const name of tryUsernames) {
						const user = (await db.findMany({
							tables: ['users'],
							where: { users: { username: name } },
							select: { users: ['username', 'is_email_verified'] }
						})) as User[]

						if (user.some(user => user?.is_email_verified)) {
							tryUsernames.splice(tryUsernames.indexOf(name), 1)
						}
					}
					return { err: 'Username or email already exists', tryUsernames }
				} else {
					set.status = 204
				}
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
	.post(
		'/checktoken',
		async ({ headers, set, body }) => {
			try {
				const isCorrect = checkState(headers.Authorization.replace('Bearer ', ''), body?.username)
				if (isCorrect?.state === 'LoggedIn' || isCorrect?.state === 'Owner') {
					const doUserExist = await db.findMany({
						tables: ['users'],
						where: { users: { username: isCorrect.username } },
						select: { users: ['is_email_verified'] }
					})

					if (doUserExist?.users.length > 0 && doUserExist?.users[0]?.is_email_verified) {
						return isCorrect
					} else {
						set.status = 400
						return { err: 'User does not exist' }
					}
				} else {
					set.status = 400
					return { err: 'Please login' }
				}
			} catch (e) {
				set.status = 500
				console.error(`Error checking token: ${e}`)
				pushLogs(`Error checking token: ${e}`)
				return { err: "Something went wrong on our server, We'll try to fix it ASAP!" }
			}
		},
		{
			headers: t.Object({
				Authorization: t.String()
			}),
			body: t.Optional(
				t.Object({
					username: t.String()
				})
			)
		}
	)

export default route
