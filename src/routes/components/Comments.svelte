<script lang="ts">
	import { page } from '$app/stores'
	import Verified from './icons/Verified.svelte'
	import Like from './icons/Like.svelte'
	import Dislike from './icons/Dislike.svelte'
	import { abbreviateNumber, formatTime } from '$lib/utils'
	import axios from '$lib/axios.config'
	import { onMount } from 'svelte'

	export let className = ''
	let comments = []
	let loading = false
	let hasMoreComments = true
	let limit = 10
	let offset = 0

	async function fetchComments() {
		if (loading || !hasMoreComments) return
		loading = true
		const response = await axios.get(
			`${$page.url.pathname}/comments?limit=${limit}&offset=${offset}`
		)
		const newComments = response.data.comments

		if (newComments.length < limit) {
			hasMoreComments = false
		}

		comments = [...comments, ...newComments]
		offset += limit
		loading = false
	}

	onMount(() => {
		fetchComments()
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	})

	function handleScroll() {
		if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
			fetchComments()
		}
	}
</script>

<section class="w-full {className} space-y-2">
	<h4 class="ml-auto">Comments ({comments?.length})</h4>
	{#if comments?.length > 0}
		{#each comments as comment}
			<div class="flex flex-col">
				<a href="/profile/{comment?.author?.username}" class="flex">
					<img
						src={comment?.author?.profile_picture}
						alt="profile picture"
						class="mr-3 size-[38px] rounded-[5px]" />
					<b>{comment?.author?.name}</b>
					{#if comment?.author?.verified}
						<Verified className="translate-x-1 translate-y-1" />
					{/if}
					<b class="ml-4 mt-[2px] text-[.9rem] text-slate-400">{formatTime(comment?.time)}</b>
				</a>
				<div class="-mt-3 translate-x-[3.1rem] space-y-2">
					<p class="line-clamp-2 max-w-[23rem] text-base text-slate-300">{comment?.comment}</p>
					<div class="flex items-center gap-4 text-sm text-slate-300">
						<div class="flex gap-1">
							<form action="?{$page.url.pathname}/comment/{comment?.id}/like" method="POST">
								<button><Like /></button>
							</form>
							{abbreviateNumber(comment?.likes)}
						</div>
						<div class="flex gap-1">
							{abbreviateNumber(comment?.dislikes)}
							<form action="?{$page.url.pathname}/comment/{comment?.id}/dislike" method="POST">
								<button><Dislike /></button>
							</form>
						</div>
						<form action="?{$page.url.pathname}/comment/{comment?.id}/reply" method="POST">
							<button class="text-slate-300">Reply</button>
						</form>
					</div>
				</div>
			</div>
		{/each}
	{:else}
		<p class="text-center text-base text-slate-300">No comments yet.</p>
	{/if}
</section>

<style>
	form {
		background: none;
	}
</style>
