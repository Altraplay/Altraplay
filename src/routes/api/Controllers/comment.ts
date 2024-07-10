import { Elysia } from 'elysia'
import db from '@DB/orm'
import pushLogs from '$lib/logs'
import { serverErr } from '$lib/constant'

const route = new Elysia({ prefix: '/:type/:id/comment' }).get(
	'/',
	async ({ params, query, error }) => {
		try {
			const { comments } = await db.findMany({
				table: 'comments',
				where: { comment_on: `${params.type}/${params.id}` },
				select: ['id', 'comment', 'author', 'time', 'likes', 'dislikes'],
				orderBy: { likes: 'DESC' },
				limit: query?.limit || 10
			})

			if (comments) {
				const list = await Promise.all(
					comments?.map(async comment => {
						const author = await db.findUnique({
							table: 'users',
							where: { is_email_verified: true, id: comment.author },
							select: ['username', 'name', 'profile_picture', 'verified']
						})

						return { ...comment, author }
					})
				)
				return { comments: list }
			}
		} catch (err) {
			await pushLogs(`Error fetching comments for ${params.type}: ${params.id}, ${err}`)
			error(500, serverErr)
		}
	}
)

export default route
