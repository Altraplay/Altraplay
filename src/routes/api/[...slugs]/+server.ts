import { Elysia } from 'elysia'
import { helmet } from 'elysia-helmet'
import { rateLimit } from 'elysia-rate-limit'
import { compression } from 'elysia-compress'

import auth from '../Controllers/auth'
import profile from '../Controllers/profile'
import user from '../Controllers/user'
import blog from '../Controllers/blog'

import type { RequestHandler } from './$types'

const app = new Elysia({ prefix: '/api', precompile: true })
	.use(helmet())
	.use(
		rateLimit({
			duration: 300000,
			max: 5200,
			errorResponse: 'Our server needs a 5 min coffee break'
		})
	)
	.use(compression())
	.use(auth)
	.use(profile)
	.use(user)
	.use(blog)

export const GET: RequestHandler = ({ request }) => app.handle(request)
export const POST: RequestHandler = ({ request }) => app.handle(request)
export const PUT: RequestHandler = ({ request }) => app.handle(request)
export const DELETE: RequestHandler = ({ request }) => app.handle(request)
