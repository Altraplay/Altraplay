<script lang="ts">
	export let src: string
	export let width = ''
	export let height = ''
	export let minWidth = ''
	export let minHeight = ''
	export let maxWidth = ''
	export let maxHeight = ''
	export let alt: string
	export let glowEffect = true
	export let className = ''
</script>

<div
	style="{height ? `height: ${height};` : ''} {width ? `width: ${width};` : ''} {maxWidth
		? `max-width: ${maxWidth}`
		: ''}; {minWidth ? `min-width: ${minWidth};` : ''} {maxHeight
		? `max-hight: ${maxHeight};`
		: ''} {minHeight ? `min-hight: ${minHeight};` : ''}"
	class="flex items-center justify-center {className}">
	{#if glowEffect}
		<img
			{src}
			{alt}
			style="{height ? `height: ${height};` : ''} {width ? `width: ${width};` : ''} {maxWidth
				? `max-width: ${maxWidth};`
				: ''} {minWidth ? `min-width: ${minWidth};` : ''} {maxHeight
				? `max-hight: ${maxHeight};`
				: ''} {minHeight ? `min-hight: ${minHeight};` : ''}"
			class="absolute blur-lg" />
	{/if}
	<img {src} {alt} class="relative h-full w-full object-cover" />
</div>
