<script lang="ts">
	import { enhance } from '$app/forms'
	import { randomString, randomInt } from '$lib/random'
	import Button from '@Components/Button.svelte'
	import Toast from '@Components/Toast.svelte'
	import type { ActionData } from './$types'

	export let form: ActionData

	let passwordInput: HTMLInputElement
	let usernameInput: HTMLInputElement
	let nameInput: HTMLInputElement
	let emailInput: string
	let eye: HTMLButtonElement
	let copyBtn: HTMLButtonElement
	let passwordMeter: HTMLDivElement
	let passwordStrength: HTMLDivElement
	let atSymbol: HTMLDivElement
	let usernameCounter: HTMLDivElement
	let nameCounter: HTMLDivElement

	let countdown = 6
	let status: 'filling' | 'loading' | 'success'

	$: status =
		Object.keys(form?.err || { bang: 1 }).length === 0 || form?.success ? 'success' : 'filling'

	$: {
		if (status === 'success') {
			const interval = setInterval(() => {
				countdown--
				if (countdown <= 0) {
					clearInterval(interval)
					window.open(`https://${emailInput.split('@')[1]}`, '_blank')?.focus()
				}
			}, 1000)
		}
	}

	function show() {
		passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password'
		eye.innerHTML =
			passwordInput.type === 'password'
				? '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" /></svg>'
				: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg>'
		passwordInput.focus()
	}

	function copy() {
		navigator.clipboard.writeText(passwordInput.value)

		copyBtn.innerHTML =
			'<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--Primary)"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>'
		setTimeout(() => {
			copyBtn.innerHTML =
				'<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" /></svg>'
		}, 2000)
	}

	function check() {
		const length = passwordInput.value.length

		const low = (passwordInput.value.match(/[a-z]/g) || []).length
		const up = (passwordInput.value.match(/[A-Z]/g) || []).length
		const num = (passwordInput.value.match(/[0-9]/g) || []).length
		const sym = (passwordInput.value.match(/[\W_]/gu) || []).length

		if (up >= 3 && low >= 3 && num >= 2 && sym >= 2 && length >= 30) {
			passwordStrength.innerText = `Strength: Strong | Length: ${length}`
			passwordMeter.style.width = '430px'
			passwordMeter.style.background = 'var(--Primary)'
			passwordInput.style.outlineColor = 'var(--Primary)'
		} else if (up >= 3 && low >= 3 && length >= 20) {
			passwordStrength.innerText = `Strength: Medium | Length: ${length}`
			passwordMeter.style.width = '215px'
			passwordMeter.style.background = '#fde047'
		} else if (length >= 1) {
			passwordStrength.innerText = `Strength: Weak | Length: ${length}`
			passwordMeter.style.width = '20px'
			passwordMeter.style.background = 'crimson'
		} else {
			passwordStrength.innerText = 'Start typing to measure the Strength & Length of the password'
			passwordMeter.style.width = '0'
		}
	}
</script>

<svelte:head>
	<title>Sign up - Tech Gunner</title>
	<meta name="description" content="Create a new account on Tech Gunner" />
</svelte:head>

<main class="wrapper">
	<section
		class="h-[350px] w-[1050px] rounded-[10px] bg-highlight-1 p-[15px] {status === 'success'
			? 'hidden'
			: ''} ">
		<h2 class="text-center">Sign up</h2>
		<form
			class="grid grid-cols-[2fr_1fr] gap-[25px]"
			method="POST"
			use:enhance={() => {
				localStorage.setItem('username', usernameInput.value)
			}}
			on:submit={() => (status = 'loading')}>
			<div class="flex">
				<div
					class="z-20 mt-[17px] h-[38px] w-fit rounded-l-[5px] {form?.err?.missing ||
					form?.err?.username ||
					form?.err?.unique
						? 'bg-[crimson]'
						: 'bg-primary'} px-[5px] py-0 text-[1.6rem] text-highlight-1 transition-all duration-500"
					bind:this={atSymbol}>@</div>
				<input
					type="text"
					placeholder="Username"
					name="username"
					class="mt-5 h-8 w-[402px] -translate-x-[2px] rounded-bl-none rounded-tl-none p-[5px] pl-2 outline {form
						?.err?.missing ||
					form?.err?.username ||
					form?.err?.unique
						? 'outline-[crimson] focus:outline-[crimson]'
						: 'outline-primary focus:outline-primary'} transition-all duration-500 focus:outline"
					on:input={e => {
						if (
							e.currentTarget.value.replaceAll(' ', '').length > 35 ||
							nameInput?.value?.length > 30
						) {
							e.currentTarget.value = e.currentTarget.value.slice(0, 35)
							nameInput.value = nameInput?.value?.slice(0, 30)
						}
						nameInput.value = e.currentTarget.value
						usernameCounter.innerText = 35 - e.currentTarget.value.replaceAll(' ', '').length
						nameCounter.innerText = 30 - nameInput.value.trim().length
					}}
					bind:this={usernameInput} />
				<div bind:this={usernameCounter} class="absolute ml-[25.2rem] mt-[22px] text-lg font-bold"
					>35</div>
			</div>
			{#if form?.tryUsername}
				<div class="absolute mt-16 text-base font-bold"
					>Try: <span class="text-primary">{form?.tryUsername.toString()}</span></div>
			{/if}
			<input
				type="text"
				name="name"
				placeholder="Full Name"
				class="mt-5 h-8 w-[430px] p-[5px] outline {form?.err?.name
					? 'outline-[crimson] focus:outline-[crimson]'
					: 'outline-primary focus:outline-primary'} transition-all duration-500 focus:outline"
				on:input={e => {
					if (e.currentTarget.value.length > 30) {
						e.currentTarget.value = e.currentTarget.value.slice(0, 30)
					}
					nameCounter.innerText = 30 - e.currentTarget.value.trim().length
				}}
				bind:this={nameInput} />

			<div bind:this={nameCounter} class="absolute ml-[62rem] mt-[22px] text-lg font-bold">30</div>

			<input
				type="email"
				name="email"
				placeholder="E-mail"
				class="mt-5 h-8 w-[430px] p-[5px] outline {form?.err?.missing ||
				form?.err?.email ||
				form?.err?.unique
					? 'outline-[crimson] focus:outline-[crimson]'
					: 'outline-primary focus:outline-primary'} transition-all duration-500 focus:outline"
				bind:value={emailInput} />
			<div class="flex">
				<div
					class="mt-5 h-8 w-[430px] rounded-[5px] outline {form?.err?.missing || form?.err?.password
						? 'outline-[crimson] focus:outline-[crimson]'
						: 'outline-primary focus:outline-primary'} transition-all duration-500 focus:outline">
					<input
						type="password"
						name="password"
						placeholder="Password"
						class="h-8 w-[365px] p-[5px]"
						on:input={check}
						on:focus={check}
						bind:this={passwordInput}
						autocomplete="off" />
				</div>
				<div class="absolute ml-[23em] mt-[25px] flex gap-1">
					<button on:click={copy} type="button" bind:this={copyBtn} data-tooltip="Copy to clipboard"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							height="24px"
							viewBox="0 -960 960 960"
							width="24px"
							fill="#e8eaed"
							><path
								d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" /></svg
						></button>
					<button type="button" bind:this={eye} on:click={show} data-tooltip="Show/Hide password"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							height="24px"
							viewBox="0 -960 960 960"
							width="24px"
							fill="#e8eaed"
							><path
								d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" /></svg
						></button>
				</div>
			</div>
			<div
				class="z-[51] -mt-3 ml-4 h-1.5 translate-x-[35.8em] rounded-[5px] transition-all duration-[1s] ease-[ease-in-out]"
				bind:this={passwordMeter} />
			<div
				class="-mt-3 before:relative before:block before:h-1.5 before:w-[430px] before:rounded-[5px] before:bg-highlight-2 before:content-['']"
				bind:this={passwordStrength}
				>Start typing to measure the Strength & Length of the password</div>
			<div class="absolute ml-[50em] mt-[11.2rem] flex">
				<span class="lock absolute ml-2 mt-1"
					><svg
						xmlns="http://www.w3.org/2000/svg"
						height="24px"
						viewBox="0 -960 960 960"
						width="24px"
						fill="#e8eaed"
						><path
							d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z" /></svg
					></span>
				<button
					class="h-8 w-[210px] rounded-[5px] bg-highlight-2 pl-[25px] pt-[3px]"
					type="button"
					on:click={() => {
						passwordInput.value = randomString(randomInt(30, 85), true, true, true, true, true)
						passwordInput.focus()
					}}>Auto Generate password</button>
			</div>
			<Button
				label="Submit"
				type="submit"
				size="lg"
				className="translate-x-[200px]"
				loading={status === 'loading'} />
		</form>
		<span class="text-slate-400">
			Already have an account? <a href="/login"><b class="underline"> Login</b></a>
		</span>
	</section>
	{#if status === 'success'}
		<section class="h-72 w-64 bg-highlight-1">
			<img src="./mailman" alt="Tech Gunner the Mailmen" />
			<div class="text-center"
				>Opening <span class="capitalize">{emailInput.split('@')[1].split('.')[0]}</span> in {countdown}
				seconds</div>
		</section>
	{/if}
</main>
{#if form?.err}
	<aside>
		{#if typeof form.err === 'string'}
			<Toast type="error" message={form.err} />
		{:else}
			{#each Object.values(form.err) as err}
				<Toast type="error" message={err} />
			{/each}
		{/if}
	</aside>
{/if}
