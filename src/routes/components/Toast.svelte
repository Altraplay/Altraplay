<script lang="ts">
	import { onMount, onDestroy } from 'svelte'

	export let message = ''
	export let duration = 10000
	export let type: 'success' | 'error' | 'warning' | 'tip' = 'tip'
	export let className = ''
	export let onDismiss = (): any => {}

	let isVisible: boolean = true
	let progressBarWidth: number = 100
	let timer: number | null = null
	let hoverPause: boolean = false
	let remainingTime: number = duration
	let toast: HTMLDivElement

	const pauseTimer = () => {
		hoverPause = true

		remainingTime = (progressBarWidth / 100) * duration
		if (timer) {
			clearInterval(timer)
			timer = null
		}
	}

	const resumeTimer = () => {
		hoverPause = false
		startTimer(remainingTime)
	}

	const startTimer = (time: number = duration) => {
		if (timer) return

		timer = window.setInterval(() => {
			if (!hoverPause) {
				progressBarWidth -= 100 / (time / 100)

				if (progressBarWidth <= 0) {
					clearInterval(timer)
					timer = null
					dismiss()
				}
			}
		}, 100)
	}

	const dismiss = () => {
		toast.style.transform = 'translateX(120%)'
		setTimeout(() => {
			isVisible = false
			onDismiss()
			if (timer) {
				clearInterval(timer)
				timer = null
			}
		}, 800)
	}

	onMount(() => {
		setTimeout(() => {
			toast.style.transform = 'translateX(0)'
			startTimer()
		}, 500)

		document.querySelectorAll<HTMLDivElement>('.toast').forEach((toast, i) => {
			toast.style.bottom = `${i * 75}px`
			if (toast.style.bottom == '0px') {
				toast.style.bottom = '6px'
			}
		})

		document.addEventListener('visibilitychange', () =>
			document.visibilityState === 'hidden' ? pauseTimer() : resumeTimer()
		)
	})

	onDestroy(() => {
		if (timer) {
			clearInterval(timer)
			timer = null
		}
	})
</script>

{#if isVisible}
	<div
		class="toast {type} fixed right-3 z-[500] flex h-14 min-w-[350px] max-w-[520px] translate-x-[125%] items-center justify-between rounded-md bg-highlight-1 p-4 font-bold transition-all duration-700 ease-in-out {className}"
		on:mouseenter={pauseTimer}
		on:mouseleave={resumeTimer}
		role="alert"
		aria-live="assertive"
		aria-atomic="true"
		bind:this={toast}>
		<div class="inline-flex items-center">
			<span class="mr-2 flex self-center">
				{#if type === 'success'}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 13l4 4L19 7" />
					</svg>
					<span class="ml-1">Success:</span>
				{/if}
				{#if type === 'error'}
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
						><path
							d="M368 128c0 44.4-25.4 83.5-64 106.4V256c0 17.7-14.3 32-32 32H176c-17.7 0-32-14.3-32-32V234.4c-38.6-23-64-62.1-64-106.4C80 57.3 144.5 0 224 0s144 57.3 144 128zM168 176a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm144-32a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM3.4 273.7c7.9-15.8 27.1-22.2 42.9-14.3L224 348.2l177.7-88.8c15.8-7.9 35-1.5 42.9 14.3s1.5 35-14.3 42.9L295.6 384l134.8 67.4c15.8 7.9 22.2 27.1 14.3 42.9s-27.1 22.2-42.9 14.3L224 419.8 46.3 508.6c-15.8 7.9-35 1.5-42.9-14.3s-1.5-35 14.3-42.9L152.4 384 17.7 316.6C1.9 308.7-4.5 289.5 3.4 273.7z"
							fill="currentColor" /></svg> <span class="ml-1">Error:</span>
				{/if}

				{#if type === 'warning'}
					<svg
						width="130px"
						height="130px"
						viewBox="0 0 512 512"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						><g stroke-width="0"></g><g stroke-linecap="round" stroke-linejoin="round"></g><g
							><path
								d="M85.57,446.25H426.43a32,32,0,0,0,28.17-47.17L284.18,82.58c-12.09-22.44-44.27-22.44-56.36,0L57.4,399.08A32,32,0,0,0,85.57,446.25Z"
								style="fill:currentColor;stroke:currentColor
					;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></path
							><path
								d="M250.26,195.39l5.74,122,5.73-121.95a5.74,5.74,0,0,0-5.79-6h0A5.74,5.74,0,0,0,250.26,195.39Z"
								style="fill:none;stroke:#000
					;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></path
							><path d="M256,397.25a20,20,0,1,1,20-20A20,20,0,0,1,256,397.25Z"></path></g
						></svg>
					<span class="ml-1">Warning:</span>
				{/if}
				{#if type === 'tip'}
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
						><path
							d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288H175.5L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7H272.5L349.4 44.6z"
							fill="currentColor" /></svg>
					<span class="ml-1">ProTip:</span>
				{/if}
			</span>
			<span class="-ml-1">{message}</span>
		</div>
		<div class="absolute mt-7 flex h-1 w-[93%] self-start">
			<div
				class="h-[3px] rounded-3xl bg-current transition-all ease-linear"
				style="width: {progressBarWidth}%;"></div>
		</div>
		<button class="fa-solid fa-xmark translate-x-2 self-center" on:click={dismiss}></button>
	</div>
{/if}

<style>
	.success {
		color: #0effbd;
	}
	.error {
		color: crimson;
	}
	.warning {
		color: #fde047;
	}
	.tip {
		color: #005eff;
	}
	svg {
		width: 24px;
		height: 24px;
	}
</style>
