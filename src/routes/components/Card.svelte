<script lang="ts">
	import Verified from './icons/Verified.svelte'
	import { formatTime, abbreviateNumber } from '$lib/utils'
	import Img from './Img.svelte'

	export let data: {
		id: string
		cover: string
		title: string
		user: {
			username: string
			name: string
			profile_picture: string
			verified: boolean
		}
		views: number
		created_at: string
	}
	export let href: string
	export let className = ''
</script>

<div class="h-fit max-w-[22rem] min-w-[20rem] overflow-hidden {className}">
	<a
		href="/{href}/{data.id}"
		data-sveltekit-preload-data>
		<Img src={data.cover} alt="Cover Image" minWidth="20rem" maxWidth="22rem" height="13rem" />
		<a href="/profile/{data.user.username}" class="mt-4 w-fit" data-sveltekit-preload-data>
			<!-- svelte-ignore a11y-img-redundant-alt -->
			<div class="size-10">
				<img
					src={data.user.profile_picture}
					alt="profile picture"
					class="mt-5 h-full w-full rounded-md" />
			</div>
		</a>
		<div class="-mt-11 ml-12">
			<h5 class="line-clamp-2 text-[1.19rem]">{data.title}</h5>
			<div class="flex">
				<a href="/profile/{data.user.username}">
					<h6 class="text-slate-400">{data.user.name}</h6>
				</a>
				{#if data.user.verified}
					<Verified className="translate-x-1 translate-y-1" />
				{/if}
			</div>
			<div class="text-slate-400"
				>views: {abbreviateNumber(data.views)} • {formatTime(new Date(data.created_at))}</div>
		</div>
	</a>
</div>
