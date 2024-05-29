<script lang="ts">
	import { enhance } from '$app/forms'
	import Button from '@Components/Button.svelte'
	import Toast from '@Components/Toast.svelte'

	export let form

	let email = ''
	let status = 'filling'
	let submitBtn: HTMLButtonElement
	let counter = 5

	$: form?.success ? (status = 'success') : (status = 'filling')
</script>

<svelte:head>
	<title>Login - Tech Gunner</title>
	<meta name="description" content="Login to your Tech Gunner account" />
</svelte:head>
<main class="wrapper">
	<section>
		<form
			use:enhance
			class="flex h-72 w-72 flex-col gap-5 rounded-md p-2"
			method="POST"
			on:submit={e => {
				status = 'loading'
				setTimeout(() => {
					if (form?.success) {
						e.currentTarget.style.display = 'none'
						status = 'success'
						for (let i = 0; i < counter; i++) {
							setTimeout(() => {
								counter--
							}, 1000)
						}
						if (counter <= 0) {
							window.open(`https://${email?.split('@')[1]}`, '_blank', '')
						}
					}
				}, 500)
			}}>
			<h2 class="text-center">Login</h2>
			<input
				type="text"
				placeholder="E-mail"
				name="email"
				class="h-8 p-1 outline outline-primary focus:outline focus:outline-primary"
				on:change={e => (email = e.currentTarget.value)} />
			<input
				type="password"
				placeholder="Password"
				name="password"
				autocomplete="current-password"
				class="h-8 p-1 outline outline-primary focus:outline focus:outline-primary" />
			<Button type="submit" label="Login" bind:btn={submitBtn} loading={status === 'loading'} />
			<small class="text-center text-slate-400">
				Don't have an account? <a href="/sign-up" class="underline">Register</a>
			</small>
		</form>
		{#if status === 'success' && !form?.err}
			<div class="h-80 w-72 bg-highlight-1">
				<img src="./mailman" alt="Tech Gunner the Mailman" />
				<div class="text-center"
					>Opening <span class="capitalize">{email.split('@')[1].split('.')[0]}</span> in {counter} seconds</div>
			</div>
		{/if}
	</section>
</main>

{#if form?.err}
	<aside>
		<Toast type="error" message={form.err} />
	</aside>
{/if}
