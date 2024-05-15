<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { slide, fade } from 'svelte/transition'

	let show = false

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

{#if show}
	<div class="bg" on:click={() => (show = false)} transition:fade />
	<nav
		class="fixed z-[125] flex h-[93vh] w-[255px] flex-col overflow-y-auto bg-background text-[1.2rem] [&>a]:ml-[5px] [&>a]:mt-[5px] [&>a]:rounded-[5px] [&>a]:px-[10px] [&>a]:py-[5px] [&>a]:transition-all [&>a]:duration-700"
		transition:slide={{ axis: 'x', duration: 700 }}>
		<a
			class="hover:ml-[25px] hover:bg-primary hover:text-highlight-1 focus:ml-[25px] focus:bg-primary focus:text-highlight-1 {$page
				.url.pathname === '/'
				? '!ml-[25px] bg-primary text-highlight-1'
				: ''}"
			data-sveltekit-preload-data
			href="/">
			<b class="fa-solid fa-house-chimney absolute mt-1"></b>
			<b class="ml-10">Home</b>
		</a>
		<a
			class="hover:ml-[25px] hover:bg-primary hover:text-highlight-1 focus:ml-[25px] focus:bg-primary focus:text-highlight-1 {$page
				.url.pathname === '/explore'
				? '!ml-[25px] bg-primary text-highlight-1'
				: ''}"
			data-sveltekit-preload-data
			href="/explore">
			<b class="fa-solid fa-magnifying-glass absolute mt-1"></b>
			<b class="ml-10">Explore</b>
		</a>
		<a
			class="hover:ml-[25px] hover:bg-primary hover:text-highlight-1 focus:ml-[25px] focus:bg-primary focus:text-highlight-1 {$page
				.url.pathname === '/inbox'
				? '!ml-[25px] bg-primary text-highlight-1'
				: ''}"
			data-sveltekit-preload-data
			href="/inbox">
			<b class="fa-solid fa-envelope absolute mt-1"></b>
			<b class="ml-10">Inbox</b>
		</a>
		<a
			class="hover:ml-[25px] hover:bg-primary hover:text-highlight-1 focus:ml-[25px] focus:bg-primary focus:text-highlight-1 {$page
				.url.pathname === '/blog'
				? '!ml-[25px] bg-primary text-highlight-1'
				: ''}"
			data-sveltekit-preload-data
			href="/blog">
			<b class="fa-solid fa-pen absolute mt-1"></b>
			<b class="ml-10">Blogs</b>
		</a>
		<a
			class="hover:ml-[25px] hover:bg-primary hover:text-highlight-1 focus:ml-[25px] focus:bg-primary focus:text-highlight-1 {$page
				.url.pathname === '/freelance'
				? '!ml-[25px] bg-primary text-highlight-1'
				: ''}"
			data-sveltekit-preload-data
			href="/freelance">
			<b class="fa-solid fa-briefcase absolute mt-1"></b>
			<b class="ml-10">Freelance</b>
		</a>
		<a
			class="hover:ml-[25px] hover:bg-primary hover:text-highlight-1 focus:ml-[25px] focus:bg-primary focus:text-highlight-1 {$page
				.url.pathname === '/tools'
				? '!ml-[25px] bg-primary text-highlight-1'
				: ''}"
			data-sveltekit-preload-data
			href="/tools">
			<b class="fa-solid fa-wrench absolute mt-1"></b>
			<b class="ml-10">Tools</b>
		</a>
		<a
			class="hover:ml-[25px] hover:bg-primary hover:text-highlight-1 focus:ml-[25px] focus:bg-primary focus:text-highlight-1 {$page
				.url.pathname === '/wallpapers'
				? '!ml-[25px] bg-primary text-highlight-1'
				: ''}"
			data-sveltekit-preload-data
			href="/wallpapers">
			<b class="fa-solid fa-image absolute mt-1"></b>
			<b class="ml-10">Wallpapers</b>
		</a>
	</nav>
{/if}

<style>
	.bg {
		width: 100%;
		height: 100%;
		z-index: 100;
		position: fixed;
		background: rgba(255, 255, 255, 0.03);
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(1.8px);
		-webkit-backdrop-filter: blur(1.8px);
	}
</style>
