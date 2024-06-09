import { Elysia, t } from 'elysia'
import { checkState } from '$lib/auth'
import db from '@DB/orm'
import pushLogs from '$lib/logs'
import { randomString, randomInt } from '$lib/random'
import s3Client from '$lib/S3'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { serverErr } from '$lib/constant'
import { optimizeImage } from '$lib/utils'

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
						const coverUrl = await optimizeImage(
							await cover.arrayBuffer(),
							'tg-blog-images',
							'1600x900'
						)

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
				return { err: serverErr }
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
				return { err: serverErr }
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
				return { err: serverErr }
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
					let coverUrl
					if (cover) {
						if (Bun.env.AWS_SECRET_ACCESS_KEY) {
							await Promise.all([
								s3Client.send(
									new DeleteObjectCommand({
										Bucket: 'tg-blog-images',
										Key: check?.cover
									})
								),
								optimizeImage(await cover.arrayBuffer(), 'tg-blog-images', '1600x900')
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
				return { err: serverErr }
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
	.post(
		'/:id/like',
		async ({ params, set, headers }) => {
			try {
				const verify = checkState(headers.Authorization)

				if (verify?.state === 'LoggedIn') {
					const blog = await db.findUnique({
						table: 'blogs',
						where: { id: params.id },
						select: ['likes']
					})

					const user = await db.findUnique({
						table: 'users',
						where: { username: verify.username },
						select: ['liked']
					})

					if (blog) {
						if (!user?.liked?.blogs.some(() => params.id)) {
							await db.update({
								table: 'blogs',
								where: { id: params.id },
								data: { likes: blog.likes++ }
							})
							await db.update({
								table: 'users',
								where: { username: verify.username },
								data: { liked: { blogs: [...user?.liked?.blogs, params.id] } }
							})
						} else {
							await db.update({
								table: 'blogs',
								where: { id: params.id },
								data: { likes: blog.likes-- }
							})
							await db.update({
								table: 'users',
								where: { username: verify.username },
								data: { liked: { blogs: user.liked.blogs.filter(id => id !== params.id) } }
							})
						}
						set.status = 204
					} else {
						set.status = 404
						return { err: 'Blog not found' }
					}
				} else {
					set.status = 401
					return { err: 'Come on now bro u gotta login' }
				}
			} catch (e) {
				set.status = 500
				pushLogs(`Error liking blog id: ${params.id}, error: ${e}`)
				return { err: serverErr }
			}
		},
		{
			headers: t.Object({
				Authorization: t.String()
			})
		}
	)
	.post(
		'/:id/dislike',
		async ({ params, set, headers }) => {
			try {
				const verify = checkState(headers.Authorization)

				if (verify?.state === 'LoggedIn') {
					const blog = await db.findUnique({
						table: 'blogs',
						where: { id: params.id },
						select: ['dislikes']
					})

					const user = await db.findUnique({
						table: 'users',
						where: { username: verify.username },
						select: ['disliked']
					})

					if (blog) {
						if (!user?.disliked?.blogs.some(() => params.id)) {
							await db.update({
								table: 'blogs',
								where: { id: params.id },
								data: { dislikes: blog.dislikes++ }
							})
							await db.update({
								table: 'users',
								where: { username: verify.username },
								data: { disliked: { blogs: [...user?.disliked?.blogs, params.id] } }
							})
						} else {
							await db.update({
								table: 'blogs',
								where: { id: params.id },
								data: { dislikes: blog.dislikes-- }
							})
							await db.update({
								table: 'users',
								where: { username: verify.username },
								data: { disliked: { blogs: user.disliked.blogs.filter(id => id !== params.id) } }
							})
						}
						set.status = 204
					} else {
						set.status = 404
						return { err: 'Blog not found' }
					}
				} else {
					set.status = 401
					return { err: 'Come on now bro u gotta login' }
				}
			} catch (err) {
				set.status = 500
				pushLogs(`Error disliking blog id: ${params.id}, error: ${err}`)
				return { err: serverErr }
			}
		},
		{
			headers: t.Object({
				Authorization: t.String()
			})
		}
	)
	.post(
		'/:id/comment',
		async ({ params, body, set, headers }) => {
			try {
				const verify = checkState(headers.Authorization)
				if (verify?.state === 'LoggedIn') {
					const { msg } = body

					const blog = await db.findUnique({
						table: 'blogs',
						where: { id: params.id },
						select: ['comments']
					})
					if (blog) {
						await db.update({
							table: 'blogs',
							where: { id: params.id },
							data: {
								comments: [
									...blog?.comments,
									{
										id: randomString(randomInt(3, 62)),
										msg,
										who: verify.username,
										date: new Date(Date.now())
									}
								]
							}
						})
						await db.create({
							table: 'history',
							data: {
								id: randomString(randomInt(3, 65)),
								time: new Date(Date.now()),
								type: 'comment',
								user: verify.username,
								visit_url: `/blog/${params.id}`
							}
						})
						set.status = 204
					} else {
						set.status = 404
						return { err: 'Blog not found' }
					}
				} else {
					set.status = 401
					return { err: 'Come on now bro u gotta login' }
				}
			} catch (e) {
				set.status = 500
				pushLogs(`Error commenting on a blog id: ${params.id}, error: ${e}`)
				return { err: serverErr }
			}
		},
		{
			headers: t.Object({
				Authorization: t.String()
			}),
			body: t.Object({
				msg: t.String()
			})
		}
	)
	.put(
		'/:id/comment/:cid',
		async ({ body, headers, params, set }) => {
			try {
				const user = await db.findUnique({
					table: 'users',
					where: { username: checkState(headers?.Authorization)?.username || '' },
					select: ['username']
				})
				const verify = checkState(headers?.Authorization, user?.username)

				if (verify?.state === 'Owner') {
					const blog = await db.findUnique({
						table: 'blogs',
						where: { id: params.id },
						select: ['comments']
					})
					if (blog) {
						const commentIndex = blog.comments?.findIndex(c => c.id === params.cid)
						if (commentIndex !== -1) {
							blog.comments[commentIndex].msg = body.msg
							await db.update({
								table: 'blogs',
								where: { id: params.id },
								data: { comments: blog.comments }
							})
							set.status = 204
						}
					} else {
						set.status = 404
						return { err: "How are you even trying to edit a comment that doesn't even exist yo" }
					}
				} else {
					set.status = 401
					return {
						err: "You are trying to edit someone else's comment, what are you a hacker or something?"
					}
				}
			} catch (e) {
				set.status = 500
				pushLogs(
					`Error editing comment on blog id: ${params.id}, error: ${e}, comment id: ${params.cid}`
				)
				return { err: serverErr }
			}
		},
		{
			headers: t.Object({
				Authorization: t.String()
			}),
			body: t.Object({
				msg: t.String()
			})
		}
	)
	.delete(
		'/:id/comment/:cid',
		async ({ headers, params, set }) => {
			try {
				const user = await db.findUnique({
					table: 'users',
					where: { username: checkState(headers?.Authorization)?.username || '' },
					select: ['username', 'role']
				})
				const verify = checkState(headers?.Authorization, user?.username)
				if (
					verify?.state === 'Owner' ||
					user?.role === 'Admin' ||
					user?.role === 'Super Admin' ||
					user?.role === 'Moderator'
				) {
					const blog = await db.findUnique({
						table: 'blogs',
						where: { id: params.id },
						select: ['comments']
					})
					if (blog) {
						const commentIndex = blog.comments?.findIndex(c => c.id === params.cid)
						if (commentIndex !== -1) {
							blog.comments.splice(commentIndex, 1)
							await db.update({
								table: 'blogs',
								where: { id: params.id },
								data: { comments: blog.comments }
							})
							await db.delete({
								table: 'history',
								where: {
									id: params.cid,
									type: 'comment',
									user: verify?.username,
									visit_url: `/blog/${params.id}`
								}
							})
							set.status = 204
						}
					} else {
						set.status = 404
						return { err: "How are you even trying to delete a comment that doesn't even exist yo" }
					}
				} else {
					set.status = 401
					return {
						err: "You are trying to delete someone else's comment, what are you a hacker or something?"
					}
				}
			} catch (e) {
				set.status = 500
				pushLogs(
					`Error deleting comment on blog id: ${params.id}, error: ${e}, comment id: ${params.cid}`
				)
				return { err: serverErr }
			}
		},
		{
			headers: t.Object({
				Authorization: t.String()
			})
		}
	)

export default route
