<script lang="ts">
	export let src: string
	export let width = 'auto'
	export let height = 'auto'
	export let alt: string
	export let glowEffect = true
	export let className = ''
</script>

<div style="height: {height}; width: {width};" class="{className}">
	{#if glowEffect}
		<img {src} {alt} style="height: {height}; width: {width}" class="absolute blur-lg" />
	{/if}
    <img {src} {alt} class="h-full w-full object-cover relative">
</div>
