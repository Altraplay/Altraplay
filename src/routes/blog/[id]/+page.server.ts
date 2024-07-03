import type { PageServerLoad } from './$types'
import axios from '$lib/axios.config'
import { error } from '@sveltejs/kit'

export const load = (async ({ params }) => {
	try {
		return (await axios.get(`/blog/${params.id}`)).data
	} catch (e: any) {
		error(e.response?.status as number, e?.response?.data?.err as string)
	}
}) satisfies PageServerLoad
