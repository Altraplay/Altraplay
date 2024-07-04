<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { slide } from 'svelte/transition'

	export let show = false

	function toggleMenu() {
		show = !show
	}

	onMount(() => {
		addEventListener('keydown', (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === ' ') {
				toggleMenu()
			}
			if (e.key === 'Escape' && show) {
				show = false
			}
		})
		document.getElementById('menu')?.addEventListener('click', toggleMenu)
	})
</script>

<nav
	class="sticky z-[125] flex h-[93.7vh] flex-col overflow-y-auto overflow-x-hidden bg-background text-[1.2rem] transition-all duration-700 [&>a]:rounded-[5px] [&>a]:transition-all [&>a]:duration-700 {show
		? 'w-[240px] gap-[5px] [&>a:focus]:ml-[25px] [&>a:focus]:bg-primary [&>a:focus]:text-highlight-1 [&>a:hover]:ml-[25px] [&>a:hover]:bg-primary [&>a:hover]:text-highlight-1 [&>a]:w-[210px] [&>a]:px-[10px] [&>a]:py-[5px]'
		: 'w-[50px] items-center gap-3 [&>a:focus]:bg-primary [&>a:focus]:text-highlight-1 [&>a:hover]:bg-primary [&>a:hover]:text-highlight-1 [&>a]:px-2 [&>a]:py-1'}"
	transition:slide={{ axis: 'x', duration: 500 }}>
	<a
		class={$page.url.pathname === '/'
			? `${show ? '!ml-[25px]' : ''} bg-primary text-highlight-1`
			: ''}
		data-sveltekit-preload-data
		href="/">
		<span class="fa-solid fa-house-chimney {show ? 'absolute mt-1' : ''}"></span>
		<b class="ml-10{show ? '' : ' hidden'}">Home</b>
	</a>
	<a
		class={$page.url.pathname === '/explore'
			? `${show ? '!ml-[25px]' : ''} bg-primary text-highlight-1`
			: ''}
		data-sveltekit-preload-data
		href="/explore">
		<span class="fa-solid fa-magnifying-glass {show ? 'absolute mt-1' : ''}"></span>
		<b class="ml-10{show ? '' : ' hidden'}">Explore</b>
	</a>
	<a
		class={$page.url.pathname === '/inbox'
			? `${show ? '!ml-[25px]' : ''} bg-primary text-highlight-1`
			: ''}
		data-sveltekit-preload-data
		href="/inbox">
		<span class="fa-solid fa-envelope {show ? 'absolute mt-1' : ''}"></span>
		<b class="ml-10{show ? '' : ' hidden'}">Inbox</b>
	</a>
	<a
		class={$page.url.pathname === '/blog'
			? `${show ? '!ml-[25px]' : ''} bg-primary text-highlight-1`
			: ''}
		data-sveltekit-preload-data
		href="/blog">
		<span class="fa-solid fa-pen {show ? 'absolute mt-1' : ''}"></span>
		<b class="ml-10{show ? '' : ' hidden'}">Blogs</b>
	</a>
	<a
		class={$page.url.pathname === '/freelance'
			? `${show ? '!ml-[25px]' : ''} bg-primary text-highlight-1`
			: ''}
		data-sveltekit-preload-data
		href="/freelance">
		<span class="fa-solid fa-briefcase {show ? 'absolute mt-1' : ''}"></span>
		<b class="ml-10{show ? '' : ' hidden'}">Freelance</b>
	</a>
	<a
		class={$page.url.pathname === '/tools'
			? `${show ? '!ml-[25px]' : ''} bg-primary text-highlight-1`
			: ''}
		data-sveltekit-preload-data
		href="/tools">
		<span class="fa-solid fa-wrench {show ? 'absolute mt-1' : ''}"></span>
		<b class="ml-10{show ? '' : ' hidden'}">Tools</b>
	</a>
	<a
		class={$page.url.pathname === '/wallpapers'
			? `${show ? '!ml-[25px]' : ''} bg-primary text-highlight-1`
			: ''}
		data-sveltekit-preload-data
		href="/wallpapers">
		<span class="fa-solid fa-image {show ? 'absolute mt-1' : ''}"></span>
		<b class="ml-10{show ? '' : ' hidden'}">Wallpapers</b>
	</a>
</nav>
