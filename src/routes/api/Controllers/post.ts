import { checkState } from '$lib/auth'
import { randomInt, randomString } from '$lib/random'
import s3Client from '$lib/S3'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import db from '@DB/orm'
import { Elysia, t } from 'elysia'

const route = new Elysia({ prefix: '/post' }).post(
	'/',
	async ({ body, cookie: { auth }, set }) => {
		const token = checkState(auth?.value)
		if (token?.state === 'LoggedIn' || !auth.value) {
			const user = await db.findUnique({
				table: 'users',
				where: {
					id: token?.id,
					is_email_verified: true
				},
                select: ['only_visible_to']
			})
			if (user) {
				const url = `${randomString(randomInt(5, 62))}.${body.picture.name.split('.')[1]}`
				if (Bun.env.AWS_SECRET_ACCESS_KEY) {
					await s3Client.send(
						new PutObjectCommand({
							Bucket: 'tg-blog-images',
							Key: url,
							Body: body.picture,
							ContentType: body.picture.type
						})
					)
				} else {
					Bun.write(`../../../../static/${url}`, body.picture)
				}

				await db.create({
					table: 'posts',
					data: {
						id: randomString(randomInt(5, 52)),
						owner: token?.id,
						title: body.title,
						url,
						tags: body.title.replace(/^[^\/]+/, '').split('/'),
                        visible_to: user.only_visible_to,
						published_at: new Date(Date.now())
					}
				})
				set.status = 204
			} else {
				set.status = 401
				return { err: 'Login or sign-up' }
			}
		} else {
			set.status = 401
			return { err: 'Login or sign-up' }
		}
	},
	{
		body: t.Object({
			title: t.String(),
			picture: t.File()
		})
	}
)

export default route
