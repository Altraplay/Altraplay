import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import axios from '$lib/axios.config'

export const load: PageServerLoad = async ({ url, cookies }) => {
		const response = await axios(`/auth/verify?token=${url.searchParams.get('token')}`, {
			method: 'POST',
			headers: {
				'Content-Type': ''
			}
		}).catch(e => 
			error(e.response?.status, e.response?.data?.err || e?.response?.data))
		const user = await response.data
		cookies.set('auth', user.token, {
			expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
			path: '/',
			sameSite: 'strict',
			secure: Bun.env.NODE_ENV === 'production',
			httpOnly: true,
			priority: 'high'
		})

		redirect(308, `/profile/${user.username}`)
}
