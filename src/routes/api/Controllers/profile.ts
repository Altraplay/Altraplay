import { Elysia, t } from 'elysia'
import { GenToken, checkState } from '$lib/auth'
import db from '@DB/db'
import type { User } from '$Types/user'
import pushLogs from '$lib/logs'

const route = new Elysia({ prefix: '/profile/:username' })
	.get('/', async ({ params, set }) => {
		try {
			const { username } = params

			const user = (await db
				.query({
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
				})
				.then(res => res.json())) as unknown as User[]

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
	.put(
		'/',
		async ({ params, body, set }) => {
			try {
				const { username } = params
				const { newUsername, password, bio, skills, languages, links, name, email } = body
				const token = checkState(body.auth, username)

				if (token?.state === 'Owner') {
					const hash = await Bun.password.hash(password, { algorithm: 'bcrypt', cost: 10 })

					const user = await db.command({
						query: `ALERT TABLE users UPDATE
						username = {newUsername:String},
						password = {password:String},
						name = {name:String},
                        bio = {bio:String},
                        links = {links:Array(String)},
                        skills = {skills:Array(String)},
                        language = {languages:Array(String)},
						email = {email:String}
						WHERE username = {username:String}
						`,
						query_params: {
							newUsername,
							password: hash,
							name,
							email,
							bio,
							links,
							skills,
							languages,
							username
						}
					})

					const token = GenToken({ username, password }, '365d')

					return { user, token }
				} else {
					set.status = 401
					return { err: 'You are not authorized to update this profile' }
				}
			} catch (e) {
				set.status = 500
				console.error(`Error updating profile: ${e}`)
				pushLogs(`Error updating profile: ${e}`)
				return { err: "Something went wrong on our server, We'll try to fix it ASAP!" }
			}
		},
		{
			params: t.Object({ username: t.String() }),
			body: t.Object({
				newUsername: t.String({
					maxLength: 25,
					error: 'Username can not be longer then 25 characters'
				}),
				email: t.String({ format: 'email', error: 'Please enter a valid email' }),
				password: t.String({
					minLength: 50,
					error: 'Password must contain 50 or more characters'
				}),
				name: t.String({ maxLength: 20, error: 'Name can not be longer than 20 characters' }),
				bio: t.String(),
				links: t.Array(t.String()),
				skills: t.Array(t.Object({ name: t.String(), level: t.String() })),
				languages: t.Array(t.Object({ name: t.String(), level: t.String() })),
				auth: t.String()
			})
		}
	)
	.delete(
		'/',
		async ({ set, body, params }) => {
			try {
				const { username } = params
				const { password } = body
				const token = await checkState(body.auth, username)
				if (token?.state === 'Owner') {
					const user = (await db
						.query({
							query: `SELECT password FROM users WHERE username = {username:String}`,
							query_params: {
								username
							},
							format: 'JSONEachRow'
						})
						.then(result => result.json())) as User[]

					if (user.length > 0) {
						const correct = await Bun.password.verify(password, user[0].password, 'bcrypt')
						if (correct) {
							await db.command({
								query: `DELETE FROM users WHERE username = {username:String}`,
								query_params: {
									username
								}
							})
						} else {
							set.status = 401
							return { err: 'Wrong password' }
						}
					} else {
						set.status = 404
						return { err: `User with the username of ${username}, does not exist` }
					}
				} else {
					set.status = 401
					return { err: 'You are not authorized to delete this profile' }
				}
			} catch (e) {
				set.status = 500
				console.error(`Failed to delete profile: ${e}`)
				pushLogs(`Failed to delete profile: ${e}`)
				return { err: "Something went wrong on our server, We'll try to fix it ASAP!" }
			}
		},
		{
			params: t.Object({ username: t.String() }),
			body: t.Object({ password: t.String(), auth: t.String() })
		}
	)
	.get('/blogs', async ({ params, set }) => {
		try {
			const { username } = params

			const blogs = await db
				.query({
					query: `SELECT 
				id,
				title,
				cover,
				views,
				published_at FROM blogs WHERE author = {username:String}`,
					query_params: {
						username
					},
					format: 'JSONEachRow'
				})
				.then(res => res.json())

			if (blogs.length === 0) {
				return { err: `${username} hasn't uploaded any Blog Posts` }
			} else {
				return { blogs }
			}
		} catch (e) {
			set.status = 500
			console.error(`Error retrieving blogs published by user: ${e}`)
			pushLogs(`Error retrieving blogs published by user: ${e}`)
			return { err: "Something went wrong on our server, We'll try to fix it ASAP!" }
		}
	})

export default route
