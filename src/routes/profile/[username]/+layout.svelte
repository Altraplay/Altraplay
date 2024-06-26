<script lang="ts">
	import type { PageData } from './$types'
	import { page } from '$app/stores'
	import Profile from '@Components/ProfileCard.svelte'

	export let data: PageData
	let activeTab = $page.url.pathname
</script>

<svelte:head>
	<title>{data.name} - Tech Gunner</title>
	<meta name="description" content={data.bio} />
</svelte:head>
<main class="flex flex-col gap-5">
	<div class="absolute m-5 h-[28vh] w-[95vw] self-center"
		><img src={data.banner} alt="banner" class="h-full w-full object-cover blur-xl" /></div>
	<div class="z-30 m-5 h-[28vh] w-[95vw] self-center"
		><img src={data.banner} alt="banner" class="h-full w-full object-cover" /></div>
	<Profile {data} className="ml-12 mt-6" />
	<div
		class="-mt-[58rem] flex h-12 w-[37rem] translate-x-[360px] items-center gap-3 bg-highlight-1 p-3"
		><a
			href={$page.url.pathname}
			class="rounded-[5px] bg-highlight-2 px-3 {activeTab === $page.url.pathname
				? 'bg-primary font-bold text-background'
				: ''}">Home</a>
		<a
			href="{$page.url.pathname}/blog"
			class="rounded-[5px] bg-highlight-2 px-3 {activeTab === `${$page.url.pathname}/blog`
				? 'bg-primary font-bold text-background'
				: ''}">Blogs</a>
		<a
			href="{$page.url.pathname}/vidieo"
			class="rounded-[5px] bg-highlight-2 px-3 {activeTab === `${$page.url.pathname}/vidieo`
				? 'bg-primary font-bold text-background'
				: ''}">Videos</a>
		<a
			href="{$page.url.pathname}/post"
			class="rounded-[5px] bg-highlight-2 px-3 {activeTab === `${$page.url.pathname}/post`
				? 'bg-primary font-bold text-background'
				: ''}">Posts</a>
		<a
			href="{$page.url.pathname}/collaction"
			class="rounded-[5px] bg-highlight-2 px-3 {activeTab === `${$page.url.pathname}/collaction`
				? 'bg-primary font-bold text-background'
				: ''}">Collections</a>
		<a
			href="{$page.url.pathname}/service"
			class="rounded-[5px] bg-highlight-2 px-3 {activeTab === `${$page.url.pathname}/service`
				? 'bg-primary font-bold text-background'
				: ''}">Services</a>
		<a
			href="{$page.url.pathname}/about"
			class="rounded-[5px] bg-highlight-2 px-3 {activeTab === `${$page.url.pathname}/about`
				? 'bg-primary font-bold text-background'
				: ''}">About</a>
	</div>
	<slot />
</main>
