import { Elysia, t } from 'elysia'
import { checkState } from '$lib/auth'
import db from '@DB/orm'
import pushLogs from '$lib/logs'
import { serverErr } from '$lib/constant'

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
						const user = (
							await db.findMany({
								tables: ['users'],
								where: { users: { username: name } },
								select: { users: ['username', 'is_email_verified'] }
							})
						).users

						if (user?.some(user => user?.is_email_verified)) {
							tryUsernames.splice(tryUsernames.indexOf(name), 1)
						}
					}
					return { err: 'Username or email already exists', tryUsernames }
				} else {
					set.status = 204
				}
			} catch (e) {
				set.status = 500
				pushLogs(`Error checking availability for username and email: ${e}`)
				return { err: serverErr }
			}
		},
		{
			body: t.Object({
				username: t.String(),
				email: t.String()
			})
		}
	)
	.post('/check-token-and-get-info', async ({ cookie: { auth }, set }) => {
		console.log(auth.value)
		try {
			const isCorrect = checkState(auth?.value)
			if (isCorrect?.state === 'LoggedIn' || isCorrect?.state === 'Owner') {
				const user = await db.findUnique({
					table: 'users',
					where: { id: isCorrect.id },
					select: ['username', 'name', 'profile_picture', 'following', 'notifications', 'verified']
				})

				if (user) {
					return { state: isCorrect, userData: user }
				} else {
					return isCorrect
				}
			} else {
				return isCorrect
			}
		} catch (e) {
			set.status = 500
			pushLogs(`Error checking token: ${e}`)
			return { err: serverErr }
		}
	})
	.get('/count', async ({ set }) => {
		try {
			const usersCount = await db.findMany({
				tables: ['users'],
				select: { users: ['username'] }
			})
			return usersCount.users?.length
		} catch (e) {
			set.status = 500
			pushLogs(`Error counting users ${e}`)
			return { err: serverErr }
		}
	})
	.get('/leaderboard', async ({ set }) => {
		try {
			const users = await db.findMany({
				tables: ['users'],
				select: { users: ['username', 'name', 'profile_picture', 'points', 'is_email_verified'] }
			})
			return users.users
				?.filter(user => user.points > 0 && user.is_email_verified)
				.map(user => {
					{
						user.name, user.profile_picture, user.username, user.points
					}
				})
		} catch (e) {
			set.status = 500
			pushLogs(`Error retrieving the leaderboard: ${e}`)
			return { err: serverErr }
		}
	})

export default route
