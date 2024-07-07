<script lang="ts">
	import { page } from '$app/stores'

</script>

<div class="w-[60px]"></div>

<nav
	class="fixed z-[125] flex border-r border-gray-800 h-[93.7vh] flex-col items-center overflow-y-auto overflow-x-hidden bg-background text-[1.2rem] transition-all duration-700 *:rounded-[5px] *:transition-all *:duration-700 w-[60px] gap-3 [&>*:focus]:bg-primary [&>*:focus]:text-highlight-1 [&>*:hover]:bg-primary [&>*:hover]:text-highlight-1 *:px-2 *:py-1">
	<a
		class={$page.url.pathname === '/'
			? 'bg-primary text-highlight-1'
			: ''}
		data-sveltekit-preload-data
		data-tooltip="Home"
		href="/">
		<span class="fa-solid fa-house-chimney"></span>
	</a>
	<a
		class={$page.url.pathname === '/explore'
			? 'bg-primary text-highlight-1'
			: ''}
		data-sveltekit-preload-data
		data-tooltip="Explore"
		href="/explore">
		<span class="fa-solid fa-magnifying-glass"></span>
	</a>
	<a
		class={$page.url.pathname === '/inbox'
			? 'bg-primary text-highlight-1'
			: ''}
		data-sveltekit-preload-data
		data-tooltip="Inbox"
		href="/inbox">
		<span class="fa-solid fa-envelope"></span>
	</a>
	<a
		class={$page.url.pathname === '/blog'
			? 'bg-primary text-highlight-1'
			: ''}
		data-sveltekit-preload-data
		data-tooltip="Blogs"
		href="/blog">
		<span class="fa-solid fa-pen"></span>
	</a>
	<a
		class={$page.url.pathname === '/freelance'
			? 'bg-primary text-highlight-1'
			: ''}
		data-sveltekit-preload-data
		data-tooltip="Freelance"
		href="/freelance">
		<span class="fa-solid fa-briefcase"></span>
	</a>
	<a
		class={$page.url.pathname === '/tools'
			? 'bg-primary text-highlight-1'
			: ''}
		data-sveltekit-preload-data
		data-tooltip="Tools"
		href="/tools">
		<span class="fa-solid fa-wrench"></span>
	</a>
	<a
		class={$page.url.pathname === '/wallpapers'
			? 'bg-primary text-highlight-1'
			: ''}
		data-sveltekit-preload-data
		data-tooltip="Wallpapers"
		href="/wallpapers">
		<span class="fa-solid fa-image"></span>
	</a>
</nav>
