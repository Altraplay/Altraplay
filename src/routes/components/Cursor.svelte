<script lang="ts">
	import { onMount, onDestroy } from 'svelte'

	let x: string
	let y: string
	let hover = false

	let elements: NodeListOf<Element>

	const handleMouseMove = (e: MouseEvent) => {
		x = `${e.clientX}px`
		y = `${e.clientY}px`
	}

	const handleHover = () => {
		hover = true
	}

	const handleHoverExit = () => {
		hover = false
	}

	onMount(() => {
		if (typeof document !== 'undefined') {
			document.addEventListener('mousemove', handleMouseMove)

			elements = document.querySelectorAll('img, a, button')

			elements.forEach(element => {
				element.addEventListener('mouseover', handleHover)
				element.addEventListener('mouseout', handleHoverExit)
			})
		}
	})

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.removeEventListener('mousemove', handleMouseMove)

			elements.forEach(element => {
				element.removeEventListener('mouseover', handleHover)
				element.removeEventListener('mouseout', handleHoverExit)
			})
		}
	})
</script>

<div class="cursor" class:hover style="left: {x || '50%'}; top: {y || '50%'};" />

<style>
	.cursor {
		position: fixed;
		width: 10px;
		height: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		border: 5px solid var(--Primary);
		z-index: 99999;
		pointer-events: none;
		transition:
			width 0.3s,
			height 0.3s ease;
	}

	.cursor.hover {
		width: 150px;
		height: 150px;
		background: none;
		border: 5px solid var(--Primary);
	}

	.cursor.hover::before {
		content: '';
		position: absolute;
		width: 25px;
		height: 25px;
		border-radius: 50%;
		background: var(--Primary);
		border: 4px solid var(--Highlight-1);
		transition: 0.5s;
	}
</style>
