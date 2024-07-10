<script lang="ts">
	import type { PageData } from './$types'
	import { abbreviateNumber, removeHtmlTags } from '$lib/utils'
	import Tags from '@Components/Tags.svelte'
	import VerifiedBadge from '@Components/icons/Verified.svelte'
	import Img from '@Components/Img.svelte'
	import Comments from '@Components/Comments.svelte'

	export let data: PageData
</script>

<svelte:head>
	<title>{data.title} - Tech Gunner</title>
	<meta name="description" content={removeHtmlTags(data.content).replace(/\s+/g, ' ')} />
	<meta property="og:title" content={data.title} />
	<meta property="og:description" content={removeHtmlTags(data.content).replace(/\s+/g, ' ')} />
	<meta name="author" content={data.author.name} />
	<meta name="keywords" content={data.slashtags.join(', ')} />
	<meta property="og:image" content={data.cover} />
	<meta property="og:type" content="article" />
</svelte:head>

<main class="wrapper">
	<div class="wrapper max-w-[56rem] gap-5">
		<h2>{data.title}</h2>
		<a href="/profile/{data.author.username}" class="flex self-start">
			<!-- svelte-ignore a11y-img-redundant-alt -->
			<img
				src={data.author.profile_picture}
				alt="profile picture"
				class="size-[40px] rounded-[5px]" />
			<b class="ml-2">{data.author.name}</b>
			{#if data.author.verified}
				<VerifiedBadge className="translate-x-1 translate-y-1" />
			{/if}
			<small class="absolute ml-[48px] mt-5 text-slate-400">{data.author.username}</small>
		</a>
		<small class="-mt-3 self-start text-slate-400"
			>views: {abbreviateNumber(data.views)} • {new Date(data.created_at).toLocaleDateString(
				undefined,
				{
					dateStyle: 'long'
				}
			)}</small>

		<Img src={data.cover} alt="Blog cover" height="520px" width="905px" />

		<article class="flex flex-col flex-wrap gap-8 pt-8">{@html data.content}</article>
		<h3 class="ml-9">Slashtags:</h3>
		{#if data.slashtags.length === 0}
			<b class="text-lg">This Blog post doesn't have any Slashtags</b>
		{:else}
			<Tags defaultTags={data.slashtags} readOnly className="self-start" />
		{/if}
		<Comments />
	</div>
</main>
