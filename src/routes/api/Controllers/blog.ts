import { Elysia, t } from 'elysia'
import { checkState } from '$lib/auth'
import db from '@DB/orm'
import pushLogs from '$lib/logs'
import { randomString, randomInt } from '$lib/random'
import s3Client from '$lib/S3'
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'

const bodySchema = {
	body: t.Object({
		title: t.String({ maxLength: 30, error: 'Title Cannot be longer than 30 characters' }),
		content: t.String({
			minLength: 300,
			error: "Blog's body must be at least 300 characters long"
		}),
		tags: t.Array(t.String(), {
			maxItems: 30,
			error: 'You can only add 30 slashtags to the blog'
		}),
		categories: t.Array(t.String(), {
			maxItems: 10,
			error: 'You cannot add more than 10 categories to your blog'
		}),
		visible_to: t.Array(t.String()),
		cover: t.File({
			maxSize: '50m',
			type: ['image', 'image/avif', 'image/jpeg', 'image/png', 'image/tiff', 'image/webp']
		})
	}),
	headers: t.Object({
		Authorization: t.String()
	})
}

const route = new Elysia({ prefix: '/blog' })
	.post(
		'/',
		async ({ body, set, headers }) => {
			try {
				const { title, content, tags, categories, visible_to, cover } = body

				const token = checkState(headers.Authorization.split('Bearer ')[1])

				if (token?.state === 'LoggedIn') {
					const user = await db.findUnique({
						table: 'users',
						where: { username: token.username, is_email_verified: true },
						select: ['username', 'is_email_verified']
					})

					if (user) {
						const coverUrl = `${randomString(randomInt(20, 52))}.${cover.name.split('.')[1]}`
						if (Bun.env.AWS_SECRET_ACCESS_KEY) {
							await s3Client.send(
								new PutObjectCommand({
									Bucket: 'tg-blog-images',
									Key: coverUrl,
									Body: cover,
									ContentType: cover.type
								})
							)
						} else {
							Bun.write(`../../../../static/${coverUrl}`, cover)
						}
						await db.create({
							table: 'blogs',
							data: {
								id: randomString(randomInt(20, 52)),
								title,
								content,
								tags,
								categories,
								visible_to,
								author: token.username,
								cover: coverUrl,
								published_at: new Date(Date.now()),
								likes: 0,
								dislikes: 0,
								views: 0
							}
						})
					}
				}
			} catch (e) {
				set.status = 500
				pushLogs(`Error publishing blog post: ${e}`)
				return { err: "Something went wrong on our server, We'll try to fix it ASAP!" }
			}
		},
		bodySchema
	)
	.get(
		'/',
		async ({ set, headers }) => {
			try {
				const blogs = await db.findMany({
					tables: ['blogs'],
					where: {
						blogs: { visible_to: checkState(headers?.Authorization)?.username || 'everyone' }
					},
					select: {
						blogs: ['id', 'title', 'author', 'cover', 'published_at']
					}
				})
				const list = blogs.blogs?.map(async blog => {
					const author = (
						await db.findMany({
							tables: ['users'],
							where: {
								users: { is_email_verified: true, username: blog.author }
							},
							select: {
								users: ['username', 'name', 'profile_picture', 'verified']
							}
						})
					).users
					return { ...blog, author }
				})
				return list
			} catch (e) {
				pushLogs(`Failed to retrieve all blog posts ${e}`)
				set.status = 500
				return { err: "Something went wrong on our server, We'll try to fix it ASAP!" }
			}
		},
		{
			headers: t.Optional(
				t.Object({
					Authorization: t.String()
				})
			)
		}
	)
	.get(
		'/:id',
		async ({ params, set, headers }) => {
			try {
				const blog = await db.findUnique({
					table: 'blogs',
					where: {
						id: params.id,
						visible_to: checkState(headers.Authorization)?.username || 'everyone'
					}
				})
				const author = await db.findUnique({
					table: 'users',
					where: {
						username: blog?.author,
						is_email_verified: true
					},
					select: ['username', 'name', 'profile_picture', 'verified', 'followers']
				})
				if (!blog) {
					set.status = 404
					return { err: "This Blog doesn't exist" }
				} else return { ...blog, author }
			} catch (e) {
				set.status = 500
				pushLogs(`Error fetching blog by id: ${params.id}, error: ${e}`)
				return { err: "Something went wrong on our server, We'll try to fix it ASAP!" }
			}
		},
		{
			headers: t.Optional(
				t.Object({
					Authorization: t.String()
				})
			)
		}
	)
	.put(
		'/:id',
		async ({ params, body, set, headers }) => {
			try {
				const check = await db.findUnique({
					table: 'blogs',
					where: { id: params.id },
					select: ['author', 'cover']
				})

				const token = checkState(headers.Authorization, check?.author)

				if (token?.state === 'Owner') {
					const { title, content, tags, categories, visible_to, cover } = body
					const coverUrl = `${randomString(randomInt(20, 52))}.${cover.name.split('.')[1]}`
					if (cover) {
						if (Bun.env.AWS_SECRET_ACCESS_KEY) {
							await Promise.all([
								s3Client.send(
									new DeleteObjectCommand({
										Bucket: 'tg-blog-images',
										Key: check?.cover
									})
								),
								s3Client.send(
									new PutObjectCommand({
										Bucket: 'tg-blog-images',
										Key: coverUrl,
										Body: cover,
										ContentType: cover.type
									})
								)
							])
						} else Bun.write(`../../../../static/${coverUrl}`, cover)
					}
					await db.update({
						table: 'blogs',
						where: { id: params.id },
						data: { title, content, tags, categories, visible_to, cover: coverUrl }
					})

					set.status = 204
				} else {
					set.status = 401
					return { err: 'You are not authorized to update this blog' }
				}
			} catch (e) {
				set.status = 500
				pushLogs(`Error updating blog id: ${params.id}, error: ${e}`)
				return { err: "Something went wrong on our server, We'll try to fix it ASAP!" }
			}
		},
		bodySchema
	)
	.delete(
		'/:id',
		async ({ params, set, headers }) => {
			try {
				const check = await db.findUnique({
					table: 'blogs',
					where: { id: params.id },
					select: ['author', 'cover']
				})
				const token = checkState(headers.Authorization, check?.author)
				if (token?.state === 'Owner') {
					await s3Client.send(
						new DeleteObjectCommand({
							Bucket: 'tg-blog-images',
							Key: check?.cover
						})
					)
					await db.delete({
						table: 'blogs',
						where: { id: params.id }
					})
					set.status = 204
				} else {
					set.status = 401
					return { err: 'You are not authorized to delete this blog' }
				}
			} catch (e) {
				set.status = 500
			}
		},
		{
			headers: t.Object({
				Authorization: t.String()
			})
		}
	)

export default route
