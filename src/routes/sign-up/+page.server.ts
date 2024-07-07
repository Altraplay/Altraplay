import type { Actions } from './$types'
import axios from '$lib/axios.config'
import { error, fail } from '@sveltejs/kit'

export const actions: Actions = {
	default: async ({ request }) => {
		let err = {}
		try {
			const data = await request.formData()
			const username = data.get('username')
			const password = data.get('password')
			const email = data.get('email')
			const name = data.get('name')

			if (!username || !password || !email) {
				err = { ...err, missing: 'Username, Email and Password are required' }
			}

			if (username!.toString().replaceAll(' ', '').length > 35) {
				err = { ...err, username: 'Username must be less than 35 characters' }
			}

			if (name!.toString().trim().length > 30) {
				err = { ...err, name: 'Name must be less than 30 characters' }
			}

			if (
				!/^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+)*)@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(
					email!.toString().toLowerCase()
				)
			) {
				err = { ...err, email: 'Email is invalid' }
			}

			if (
				password!.toString().length < 30 ||
				!/(?=(.*[a-z]){3})(?=(.*[A-Z]){3})(?=(.*\d){2})(?=(.*[^\w\s]){2})(.*)/.test(
					password!.toString()
				)
			) {
				err = { ...err, password: 'Password must be strong' }
			}
			let availability
			if (Object.keys(err).length < 1) {
				availability = await axios.post('/user/availability', {
					username,
					email
				})

				if (availability.data) {
					err = { ...err, unique: availability?.data?.err }
				}
			}
			if (Object.keys(err).length > 0) {
				return fail(400, {
					err,
					tryUsername: availability?.status ?? 204 >= 200 ? availability?.data?.tryUsernames : null
				})
			}

			await axios.post('/auth/sign-up', {
				email,
				password,
				username,
				name
			})

			return { success: true }
		} catch (e: any) {
			if (e.response?.status >= 400 && e.response?.status < 500) {
				return fail(e.response?.status, {
					err: e?.response?.data?.err || e?.response?.data
				})
			} else {
				error(e.response?.status, e.response?.data?.err || e?.response?.data)
			}
		}
	}
}
