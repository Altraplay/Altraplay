import { Elysia, t } from 'elysia'
import { checkState } from '$lib/auth'
import db from '@DB/orm'
import pushLogs from '$lib/logs'
import { randomString, randomInt } from '$lib/random'
import s3Client from '$lib/S3'
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { serverErr } from '$lib/constant'

const bodySchema = {
	body: t.Object({
		title: t.String({ maxLength: 30, error: 'Title Cannot be longer than 30 characters' }),
		content: t.String({
			minLength: 300,
			error: "Blog's body must be at least 300 characters long"
		}),
		slashtags: t.Array(t.String(), {
			maxItems: 30,
			error: 'You can only add 30 slashtags to the blog'
		}),
		visibility: t.Array(t.String()),
		cover: t.File({
			maxSize: '50m',
			type: ['image', 'image/avif', 'image/jpeg', 'image/png', 'image/tiff', 'image/webp']
		})
	}),
	headers: t.Object({
		authorization: t.String()
	})
}

const route = new Elysia({ prefix: '/blog' })
	.post(
		'/',
		async ({ body, set, headers }) => {
			try {
				const { title, content, slashtags, visibility, cover } = body

				const token = checkState(headers.authorization.split('Bearer ')[1])

				if (token?.state === 'LoggedIn') {
					const user = await db.findUnique({
						table: 'users',
						where: { id: token.id, is_email_verified: true },
						select: ['is_email_verified']
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
								id: randomString(randomInt(15, 52)),
								title,
								content,
								slashtags,
								visibility,
								author: token.id,
								cover: coverUrl,
								likes: 0,
								dislikes: 0,
								views: 0,
								created_at: new Date(Date.now())
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
				const { blogs } = await db.findMany({
					table: 'blogs',
					select: ['id', 'title', 'author', 'views', 'cover', 'created_at'],
					where: {
						visibility: {
							value: checkState(headers?.authorization || '') || 'public',
							operator: 'CONTAINS'
						}
					}
				})

				if (blogs) {
					const list = await Promise.all(
						blogs?.map(async blog => {
							const author = await db.findUnique({
								table: 'users',
								where: { is_email_verified: true, id: blog.author },
								select: ['username', 'name', 'profile_picture', 'verified']
							})

							return { ...blog, author }
						})
					)

					return list
				}
			} catch (e) {
				pushLogs(`Failed to retrieve all blog posts ${e}`)
				set.status = 500
				return { err: serverErr }
			}
		},
		{
			headers: t.Object({
				authorization: t.Optional(t.String())
			})
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
						visibility: {
							value: checkState(headers?.authorization || '') || 'public',
							operator: 'CONTAINS'
						}
					}
				})
				if (blog) {
					const author = await db.findUnique({
						table: 'users',
						where: {
							id: blog?.author,
							is_email_verified: true
						},
						select: ['username', 'name', 'profile_picture', 'verified', 'followers']
					})
					return { ...blog, author }
				} else {
					set.status = 404
					return { err: "This Blog doesn't exist" }
				}
			} catch (e) {
				set.status = 500
				pushLogs(`Error fetching blog by id: ${params.id}, error: ${e}`)
				return { err: serverErr }
			}
		},
		{
			headers: t.Object({
				authorization: t.Optional(t.String())
			})
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

				const token = checkState(headers.authorization, check?.author)

				if (token?.state === 'Owner') {
					const { title, content, slashtags, visibility, cover } = body
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
						data: { title, content, slashtags, visibility, cover: coverUrl }
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
				const token = checkState(headers.authorization, check?.author)
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
				authorization: t.String()
			})
		}
	)
	.post(
		'/:id/like',
		async ({ params, set, headers }) => {
			try {
				const verify = checkState(headers.authorization)

				if (verify?.state === 'LoggedIn') {
					const blog = await db.findUnique({
						table: 'blogs',
						where: { id: params.id },
						select: ['likes']
					})

					const user = await db.findUnique({
						table: 'users',
						where: { id: verify.id },
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
								where: { id: verify.id },
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
								where: { id: verify.id },
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
				authorization: t.String()
			})
		}
	)
	.post(
		'/:id/dislike',
		async ({ params, set, headers }) => {
			try {
				const verify = checkState(headers.authorization)

				if (verify?.state === 'LoggedIn') {
					const blog = await db.findUnique({
						table: 'blogs',
						where: { id: params.id },
						select: ['dislikes']
					})

					const user = await db.findUnique({
						table: 'users',
						where: { id: verify.id },
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
								where: { id: verify.id },
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
								where: { id: verify.id },
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
				authorization: t.String()
			})
		}
	)
	.post(
		'/:id/comment',
		async ({ params, body, set, headers }) => {
			try {
				const verify = checkState(headers.authorization)
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
										who: verify.id,
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
								user: verify.id,
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
				authorization: t.String()
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
					where: { id: checkState(headers?.authorization || '')?.id || '' },
					select: ['id']
				})
				const verify = checkState(headers?.authorization, user?.id)

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
				authorization: t.String()
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
					where: { id: checkState(headers?.authorization || '')?.id || '' },
					select: ['id', 'roles']
				})
				const verify = checkState(headers?.authorization, user?.id)
				if (
					verify?.state === 'Owner' ||
					user?.roles.includes('Admin') ||
					user?.roles.includes('Super Admin') ||
					user?.roles.includes('Moderator')
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
									user: verify?.id,
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
				authorization: t.String()
			})
		}
	)

export default route
