import type { Actions } from './$types'
import axios from '$lib/axios.config'
import { error, fail } from '@sveltejs/kit'

export const actions: Actions = {
	default: async ({ request }) => {
		try {
			const data = await request.formData()
			const password = data.get('password')
			const email = data.get('email')

			if (!email?.toString() || !password?.toString()) {
				return fail(400, { err: 'Come on now bro fill out the form' })
			}

			await axios.post('/auth/login', {
				email,
				password
			})
			return { success: true }
		} catch (e: any) {
			if (e.response?.status >= 400 && e.response?.status < 500) {
				return fail(e.response?.status, {
					err: e?.response?.data?.err || e?.response?.data
				})
			} else {
				console.error('Error logging in user from frontend:', e)
				error(e.response?.status, e.response?.data?.err || e?.response?.data)
			}
		}
	}
}
