<script lang="ts">
	export let label = ''
	export let type: 'button' | 'submit' | 'reset' = 'button'
	export let variant: 'primary' | 'secondary' | 'danger' | 'warning' = 'primary'
	export let size: 'md' | 'lg' = 'md'
	export let disabled = false
	export let className = ''
	export let href = ''
	export let target: '_blank' | '_top' | '_parent' | '_self' = '_self'
	export let btn: HTMLButtonElement | HTMLAnchorElement | undefined = undefined
	export let loading = false

	export let onClick = (e: MouseEvent): any => {}
	export let onMouseEnter = (e: MouseEvent): any => {}
	export let onMouseLeave = (e: MouseEvent): any => {}
	export let onFocus = (e: FocusEvent): any => {}

	let buttonClass: string

	$: {
		buttonClass = `${variantClasses[variant]} ${sizeClasses[size]}`
	}

	const variantClasses: Record<string, string> = {
		primary: 'bg-primary text-highlight-1 hover:bg-primary-hover focus:bg-primary-hover',
		secondary: 'bg-highlight-2 hover:bg-secondary focus:bg-secondary',
		danger: 'bg-[crimson] hover:bg-red-600 focus:bg-red-600',
		warning: 'bg-yellow-300 text-highlight-1 hover:bg-yellow-700 focus:bg-yellow-700'
	}

	const sizeClasses: Record<string, string> = {
		md: 'px-[15px] py-[3px] text-base',
		lg: 'px-[255px] py-[2px] text-lg'
	}
</script>

{#if href}
	<a
		{href}
		class="rounded-[5px] font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 {buttonClass} flex items-center justify-center {className}"
		{target}
		data-sveltekit-preload-data
		aria-disabled={disabled || loading}
		tabindex={disabled || loading ? -1 : 0}
		bind:this={btn}>
		{#if loading}
			<span class="loader"></span>
		{:else}
			{label}
		{/if}
	</a>
{:else}
	<button
		{type}
		class="rounded-[5px] font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 {buttonClass} flex items-center justify-center {className}"
		disabled={disabled || loading}
		aria-disabled={disabled || loading}
		aria-busy={loading}
		aria-live="polite"
		aria-label={label}
		on:click={onClick}
		on:mouseenter={onMouseEnter}
		on:mouseleave={onMouseLeave}
		on:focus={onFocus}
		bind:this={btn}>
		{#if loading}
			<span class="loader"></span>
		{:else}
			{label}
		{/if}
	</button>
{/if}
