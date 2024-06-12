<script lang="ts">
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'
	import Button from './Button.svelte'

	onMount(() => {
		addEventListener('keyup', jump)
	})

	let search: HTMLInputElement

	function jump(e: KeyboardEvent) {
		if (
			e.key == '/' &&
			!(document.activeElement instanceof HTMLInputElement) &&
			!(document.activeElement instanceof HTMLTextAreaElement) &&
			!document.activeElement?.hasAttribute('contenteditable')
		) {
			search.focus()
		}
	}
</script>

<header class="sticky left-0 top-0 z-[150] flex w-screen items-center justify-evenly py-2 h-[58px] bg-background">
	<button
		id="menu"
		class="hover:fill-white focus:fill-white"
		aria-label="Toggle menu"
		aria-keyshortcuts="Control+Space">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			height="30px"
			viewBox="0 -960 960 960"
			width="30px"
			class="fill-slate-400"
			><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg>
	</button>
	<a href="/"><h3>Tech Gunner</h3></a>
	<form
		class="flex h-10 w-[78vw] items-center justify-center"
		use:enhance
		method="POST"
		action="?search">
		<span class="fa-solid fa-magnifying-glass p-2 text-slate-400 transition hover:text-white" />
		<input
			type="text"
			name="search"
			class="w-[74vw] placeholder-slate-400"
			placeholder="Search..."
			autocomplete="off"
			aria-keyshortcuts="/"
			aria-autocomplete="none"
			aria-label="Search Input"
			bind:this={search} />
		<button type="reset">
			<span class="fa-solid fa-xmark p-2 text-center text-slate-400 transition duration-300 hover:text-white focus:text-white" />
		</button>
		<button type="submit">
			<span class="fa-solid fa-magnifying-glass p-2 text-slate-400 transition duration-300 hover:text-white focus:text-white" />
		</button>
	</form>
	<Button label="Login" href="/login" variant="secondary" />
	<Button label="Sign up" href="/sign-up" />
</header>
