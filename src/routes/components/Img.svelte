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
	class="relative flex items-center justify-center *:transition-all *:duration-700 *:rounded-xl [&>*:hover]:rounded-md [&>*:hover]:scale-[1.02] {className}"
	style="
	  {height ? `height: ${height};` : ''} 
	  {width ? `width: ${width};` : ''} 
	  {maxWidth ? `max-width: ${maxWidth};` : ''} 
	  {minWidth ? `min-width: ${minWidth};` : ''} 
	  {maxHeight ? `max-height: ${maxHeight};` : ''} 
	  {minHeight ? `min-height: ${minHeight};` : ''}
	">
	{#if glowEffect}
		<div
			class="absolute inset-0 bg-cover bg-center blur-lg"
			style="background-image: url('{src}');"></div>
	{/if}
	<img {src} {alt} class="relative h-full w-full object-cover" />
</div>

<style>
	div:hover .absolute {
		filter: blur(30px);
	}
</style>
