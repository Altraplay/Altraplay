import { Elysia } from 'elysia'
import db from '@DB/orm'
import pushLogs from '$lib/logs'
import { serverErr } from '$lib/constant'

const route = new Elysia()
.get('/:type/:id/comments', async ({ params, query, error }) => {
	try {
		return await db.findMany({
			table: 'comments',
			where: { comment_on: `${params.type}/${params.id}` },
			select: ['id', 'comment', 'author', 'time', 'likes', 'dislikes'],
			orderBy: { likes: 'desc' },
			limit: query?.limit || 10,
		})
	} catch (err) {
        await pushLogs(`Error fetching comments for ${params.type}: ${params.id}, ${err}`);
		error(500, serverErr)
	}
})

export default route
