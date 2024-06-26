import type { PageServerLoad } from './$types'
import axios from '$lib/axios.config'
import { error } from '@sveltejs/kit'

export const load = (async ({ url }) => {
	return await axios
		.get(url.pathname)
		.then(result => {
			return result.data
		})
		.catch(err => {
			if ((err.response?.status as number) >= 400) {
				error(err.response?.status as number, err?.response?.data?.err as string)
			} else {
				console.error(err)
			}
		})
}) satisfies PageServerLoad
