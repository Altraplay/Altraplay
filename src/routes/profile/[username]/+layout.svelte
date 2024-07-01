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
	<section class="flex translate-x-[340px] flex-col">
		<div class="p-3 *:px-5">
			<a
				href={$page.url.pathname}
				class={activeTab === $page.url.pathname ? 'border-b-[3px] border-primary font-bold' : ''}
				>Home</a>
			<a
				href="{$page.url.pathname}/blog"
				class={activeTab === `${$page.url.pathname}/blog`
					? 'border-b-[3px] border-primary font-bold'
					: ''}>Blogs</a>
			<a
				href="{$page.url.pathname}/vidieo"
				class={activeTab === `${$page.url.pathname}/vidieo`
					? 'border-b-[3px] border-primary font-bold'
					: ''}>Videos</a>
			<a
				href="{$page.url.pathname}/post"
				class={activeTab === `${$page.url.pathname}/post`
					? 'border-b-[3px] border-primary font-bold'
					: ''}>Posts</a>
			<a
				href="{$page.url.pathname}/collaction"
				class={activeTab === `${$page.url.pathname}/collaction`
					? 'border-b-[3px] border-primary font-bold'
					: ''}>Collections</a>
			<a
				href="{$page.url.pathname}/achivement"
				class={activeTab === `${$page.url.pathname}/achivement`
					? 'border-b-[3px] border-primary font-bold'
					: ''}>Achievements</a>
			<a
				href="{$page.url.pathname}/service"
				class={activeTab === `${$page.url.pathname}/service`
					? 'border-b-[3px] border-primary font-bold'
					: ''}>Services</a>
			<a
				href="{$page.url.pathname}/about"
				class={activeTab === `${$page.url.pathname}/about`
					? 'border-b-[3px] border-primary font-bold'
					: ''}>About</a>
		</div>
		<slot />
	</section>
	<Profile {data} className="translate-y-[39vh] translate-x-10 absolute" />
</main>
