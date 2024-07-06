<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { slide } from 'svelte/transition'

	typeof localStorage !== 'undefined' ? localStorage.setItem('sidebar-open', String(false)) : null

	let show = typeof localStorage !== 'undefined' ? localStorage.getItem('sidebar-open') : false

	function toggleMenu() {
		show = !show
	if (typeof localStorage !== 'undefined') {
			localStorage.setItem('sidebar-open', String(show))
	}
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

<div class="{show ? 'w-[250px]' : 'w-[60px]'} transition-all duration-700"></div>

<nav
	class="fixed z-[125] flex border-r border-gray-800 h-[93.7vh] flex-col items-center overflow-y-auto overflow-x-hidden bg-background text-[1.2rem] transition-all duration-700 *:rounded-[5px] *:transition-all *:duration-700 {show
		? 'w-[230px] gap-2 [&>*:focus]:ml-[15px] [&>*:focus]:bg-primary [&>*:focus]:text-highlight-1 [&>*:hover]:ml-[15px] [&>*:hover]:bg-primary [&>*:hover]:text-highlight-1 *:w-[210px] *:px-[10px] *:py-[3px]'
		: 'w-[60px] gap-3 [&>*:focus]:bg-primary [&>*:focus]:text-highlight-1 [&>*:hover]:bg-primary [&>*:hover]:text-highlight-1 *:px-2 *:py-1'}"
	transition:slide={{ axis: 'x', duration: 700 }}>
	<a
		class={$page.url.pathname === '/'
			? `${show ? 'ml-[15px]' : ''} bg-primary text-highlight-1`
			: ''}
		data-sveltekit-preload-data
		href="/">
		<span class="fa-solid fa-house-chimney {show ? 'absolute mt-1' : ''}"></span>
		<b class="ml-10{show ? '' : ' hidden'}">Home</b>
	</a>
	<a
		class={$page.url.pathname === '/explore'
			? `${show ? 'ml-[15px]' : ''} bg-primary text-highlight-1`
			: ''}
		data-sveltekit-preload-data
		href="/explore">
		<span class="fa-solid fa-magnifying-glass {show ? 'absolute mt-1' : ''}"></span>
		<b class="ml-10{show ? '' : ' hidden'}">Explore</b>
	</a>
	<a
		class={$page.url.pathname === '/inbox'
			? `${show ? 'ml-[15px]' : ''} bg-primary text-highlight-1`
			: ''}
		data-sveltekit-preload-data
		href="/inbox">
		<span class="fa-solid fa-envelope {show ? 'absolute mt-1' : ''}"></span>
		<b class="ml-10{show ? '' : ' hidden'}">Inbox</b>
	</a>
	<a
		class={$page.url.pathname === '/blog'
			? `${show ? 'ml-[15px]' : ''} bg-primary text-highlight-1`
			: ''}
		data-sveltekit-preload-data
		href="/blog">
		<span class="fa-solid fa-pen {show ? 'absolute mt-1' : ''}"></span>
		<b class="ml-10{show ? '' : ' hidden'}">Blogs</b>
	</a>
	<a
		class={$page.url.pathname === '/freelance'
			? `${show ? 'ml-[15px]' : ''} bg-primary text-highlight-1`
			: ''}
		data-sveltekit-preload-data
		href="/freelance">
		<span class="fa-solid fa-briefcase {show ? 'absolute mt-1' : ''}"></span>
		<b class="ml-10{show ? '' : ' hidden'}">Freelance</b>
	</a>
	<a
		class={$page.url.pathname === '/tools'
			? `${show ? 'ml-[15px]' : ''} bg-primary text-highlight-1`
			: ''}
		data-sveltekit-preload-data
		href="/tools">
		<span class="fa-solid fa-wrench {show ? 'absolute mt-1' : ''}"></span>
		<b class="ml-10{show ? '' : ' hidden'}">Tools</b>
	</a>
	<a
		class={$page.url.pathname === '/wallpapers'
			? `${show ? 'ml-[15px]' : ''} bg-primary text-highlight-1`
			: ''}
		data-sveltekit-preload-data
		href="/wallpapers">
		<span class="fa-solid fa-image {show ? 'absolute mt-1' : ''}"></span>
		<b class="ml-10{show ? '' : ' hidden'}">Wallpapers</b>
	</a>
</nav>
