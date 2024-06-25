import { Elysia, t } from 'elysia'
import { GenToken, checkState } from '$lib/auth'
import db from '@DB/orm'
import pushLogs from '$lib/logs'
import { serverErr } from '$lib/constant'

const route = new Elysia({ prefix: '/profile/:username' })
	.get('/', async ({ params, set }) => {
		try {
			const { username } = params

			const user = await db.findUnique({
				table: 'users',
				where: { username },
				select: [
					'username',
					'name',
					'bio',
					'profile_picture',
					'banner',
					'level',
					'points',
					'needs_for_next_level',
					'links',
					'verified',
					'skills',
					'languages',
					'team',
					'is_email_verified',
					'followers',
					'joined_at'
				]
			})

			if (user && user.is_email_verified) {
				return {
					username: user.username,
					name: user.name,
					bio: user.bio,
					profile_picture: user.profile_picture,
					banner: user.banner,
					level: user.level,
					points: user.points,
					needs_for_next_level: user.needs_for_next_level,
					links: user.links,
					verified: user.verified,
					skills: user.skills,
					languages: user.languages,
					team: user.team.length,
					followers: user.followers.length,
					joined_at: user.joined_at
				}
			} else {
				set.status = 404
				return { err: 'User not found' }
			}
		} catch (e) {
			set.status = 500
			pushLogs(`Failed to retrieve user's profile: ${e}`)
			return { err: serverErr }
		}
	})
	.put(
		'/',
		async ({ params, body, set }) => {
			try {
				const { username } = params
				const { newUsername, password, bio, skills, languages, links, name, email } = body
				const user = await db.findUnique({
					table: 'users',
					where: { username, is_email_verified: true },
					select: ['id']
				})
				const token = checkState(body.auth, user?.id)

				if (token?.state === 'Owner' || !user?.id) {
					const hash = await Bun.password.hash(password, { algorithm: 'bcrypt', cost: 10 })

					await db.update({
						table: 'users',
						data: {
							username: newUsername,
							password: hash,
							name,
							bio,
							links,
							skills,
							languages,
							email
						},
						where: { id: user?.id }
					})

					const token = GenToken({ id: user?.id, verified: true }, '365d')

					return { token }
				} else {
					set.status = 401
					return { err: 'You are not authorized to update this profile' }
				}
			} catch (e) {
				set.status = 500
				pushLogs(`Error updating profile: ${e}`)
				return { err: serverErr }
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

				const user = await db.findUnique({
					table: 'users',
					where: { username, is_email_verified: true },
					select: ['password', 'id']
				})

				const token = checkState(body.auth, user?.id)

				if (token?.state === 'Owner' || !user?.id) {
					const correct = await Bun.password.verify(password, user?.password, 'bcrypt')
					if (correct) {
						await db.delete({
							table: 'users',
							where: { id: user?.id }
						})
						set.status = 204
					} else {
						set.status = 401
						return { err: 'Wrong password' }
					}
				} else {
					set.status = 401
					return { err: 'You are not authorized to delete this profile' }
				}
			} catch (e) {
				set.status = 500
				pushLogs(`Failed to delete profile: ${e}`)
				return { err: serverErr }
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

			const blogs = await db.findMany({
				tables: ['blogs'],
				where: { blogs: { author: username } },
				select: { blogs: ['id', 'title', 'cover', 'views', 'created_at'] }
			})

			if (blogs.blogs?.length === 0) {
				return { err: `${username} hasn't uploaded any Blog Posts` }
			} else {
				return { blogs }
			}
		} catch (e) {
			set.status = 500
			pushLogs(`Error retrieving blogs published by user: ${e}`)
			return { err: serverErr }
		}
	})
	.get('/videos', async ({ params, set }) => {
		const { username } = params

		try {
			const videos = await db.findMany({
				tables: ['videos'],
				where: { videos: { creator: username } },
				select: { videos: ['id', 'title', 'cover', 'views', 'created_at'] }
			})

			if (videos.videos?.length === 0) {
				return { err: `${username} hasn't uploaded any videos yet` }
			} else {
				return videos.videos
			}
		} catch (e) {
			set.status = 500
			pushLogs(`Error retrieving videos uploaded by ${username}: ${e}`)
			return { err: serverErr }
		}
	})
	.get('/posts', async ({ params, set }) => {
		const { username } = params
		try {
			const { posts } = await db.findMany({
				tables: ['posts'],
				where: { posts: { posted_by: username } }
			})

			if (posts?.length === 0) {
				return { err: `${username} hasn't uploaded any photos yet` }
			} else {
				return { post: posts }
			}
		} catch (e) {
			set.status = 500
			pushLogs(`Failed to retrieve photos from ${username}, ${e}`)
			return { err: serverErr }
		}
	})
	.get('/services', async ({ params, set }) => {
		const { username } = params
		try {
			const { services } = await db.findMany({
				tables: ['services'],
				where: { services: { provider: username } }
			})

			if (services?.length === 0) {
				set.status = 404
			} else {
				return { services }
			}
		} catch (e) {
			set.status = 500
			pushLogs(`An error occurred while fetching services from ${username}: ${e}`)
			return { err: serverErr }
		}
	})
	.get('/collections', async ({ params, set }) => {
		const { username } = params
		try {
			const { collections } = await db.findMany({
				tables: ['collections'],
				where: { owner: username }
			})

			if (collections?.collections.length === 0) {
				return { err: `${username} don't have any public collections` }
			} else return { collections }
		} catch (e) {
			set.status = 500
			pushLogs(`Ran into an error while fetching collections uploaded by ${username}: ${e}`)
			return { err: serverErr }
		}
	})

export default route
