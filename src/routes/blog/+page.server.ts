import axios from '$lib/axios.config'
import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load = (async () => {
	try {
		return {blogs:(await axios.get('/blog')).data}
	} catch (e) {
		error(e?.response?.status, e?.response?.data?.e)
	}
}) satisfies PageServerLoad
