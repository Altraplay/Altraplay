<script lang="ts">
	import { onMount } from 'svelte'
	import { writable } from 'svelte/store'
	import type { Unsubscriber } from 'svelte/store'

	interface Tag {
		value: string
		editable: boolean
	}

	export let defaultTags: string[] = []
	export let maxTags = 30
	export let readOnly: boolean = false
	export let placeholder: string = 'Slashtag'
	export let showCount: boolean = false
	export let className: string = ''
	export let getValues: string[] = []

	$: tagsCount = tags.length

	$: editableTags = tags.map(tag => {
		if (readOnly) {
			return { ...tag, editable: false }
		}
		return tag
	})

	$: getValues = tags.map(tag => tag.value)

	let tagsStore = writable<Tag[]>(defaultTags?.map(tag => ({ value: tag, editable: false })) || [])
	let inputValue: string = ''
	let tags: Tag[] = []

	let undoStack: Tag[][] = []
	let redoStack: Tag[][] = []

	let unsubscribeTagsStore: Unsubscriber

	function addTag(tag: string) {
		if (readOnly) return
		const trimmedTag = tag.trim()
		if (trimmedTag !== '' && tags.length < maxTags && !tags.some(t => t.value === trimmedTag)) {
			tagsStore.update(value => {
				const newValue = [...value, { value: trimmedTag, editable: false }]
				undoStack.push([...value])
				redoStack = []
				return newValue
			})
			inputValue = ''
		}
	}

	function removeTag(index: number) {
		if (readOnly) return
		tagsStore.update(value => {
			const newValue = value.filter((_, i) => i !== index)
			undoStack.push([...value])
			redoStack = []
			return newValue
		})
	}

	function toggleEdit(index: number) {
		if (readOnly) return
		tagsStore.update(value => {
			const newValue = [...value]
			newValue[index].editable = !newValue[index].editable
			return newValue
		})
	}

	function handleTagEditKeyDown(e: KeyboardEvent, index: number) {
		if (readOnly) return
		if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
			tagsStore.update(value => {
				value[index].editable = false
				return value
			})
			addTag(tags[index].value)
		} else if (e.key === 'Escape') {
			tagsStore.update(value => {
				value[index].editable = false
				return value
			})
		}
	}

	function shortcuts(e: KeyboardEvent) {
		if (readOnly) return
		if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
			e.preventDefault()
			addTag(inputValue)
		}

		if (e.ctrlKey && e.key === 'z') {
			undo()
		}

		if (e.ctrlKey && e.key === 'y') {
			redo()
		}
	}

	function undo() {
		if (readOnly) return
		if (undoStack.length > 0) {
			redoStack.push([...tags])
			tagsStore.set(undoStack.pop() || [])
		}
	}

	function redo() {
		if (readOnly) return
		if (redoStack.length > 0) {
			undoStack.push([...tags])
			tagsStore.set(redoStack.pop() || [])
			setTimeout(() => {
				inputValue = ''
			}, 0)
		}
	}

	function handlePaste(e: ClipboardEvent) {
		if (readOnly) return
		const clipboardData = e.clipboardData

		if (!clipboardData) {
			return
		}

		const pastedText = clipboardData.getData('text') || ''
		const pastedTags = pastedText.split(/[,\s]+/)

		const uniquePastedTags = pastedTags
			.map(tag => tag.trim())
			.filter((tag, index, self) => tag !== '' && self.indexOf(tag) === index)

		if (tags.length + uniquePastedTags.length > maxTags) {
			uniquePastedTags.splice(maxTags - tags.length)
		}

		tagsStore.update(value => {
			const newValue = [...value, ...uniquePastedTags.map(tag => ({ value: tag, editable: false }))]
			undoStack.push([...value])
			redoStack = []
			return newValue
		})
		setTimeout(() => {
			inputValue = ''
		}, 1)
	}

	onMount(() => {
		unsubscribeTagsStore = tagsStore.subscribe(value => {
			tags = value
		})

		window.addEventListener('keydown', shortcuts)

		return () => {
			unsubscribeTagsStore()
			window.removeEventListener('keydown', shortcuts)
		}
	})
</script>

<div class="flex flex-wrap gap-3 {className}">
	{#each editableTags as tag, index (tag)}
		<div class="flex *:transition-all *:duration-300">
			<div
				class="w-fit rounded-l-[.3rem] bg-primary px-3 py-[2px] text-lg font-black text-highlight-1"
				>/</div>
			<button
				type="button"
				class="bg-secondary px-3 py-[3px] text-center rounded-r-[.3rem]{!readOnly && !tag.editable
					? ' hover:bg-secondary-hover focus:bg-secondary-hover'
					: ''}"
				on:click={() => toggleEdit(index)}>
				{#if tag.editable}
					<!-- svelte-ignore a11y-autofocus -->
					<input
						type="text"
						bind:value={tag.value}
						on:keydown={e => handleTagEditKeyDown(e, index)}
						class="-ml-[2px] h-full w-full rounded-r-[.3rem] bg-secondary pl-2"
						autofocus
						on:focusout={() => {
							tagsStore.update(value => {
								value[index].editable = false
								return value
							})
							addTag(tags[index].value)
						}} />
				{:else}
					<b>{tag.value}</b>
					{#if !readOnly}
						<button
							type="button"
							class="fa-solid fa-xmark relative top-[2px]"
							on:click={() => removeTag(index)} />
					{/if}
				{/if}
			</button>
		</div>
	{/each}
	{#if !readOnly}
		<div class="flex">
			<div
				class="z-10 w-fit rounded-l-[.3rem] bg-primary px-3 py-[2px] text-lg font-black text-highlight-1"
				>/</div>
			<input
				type="text"
				bind:value={inputValue}
				{placeholder}
				on:keydown={shortcuts}
				on:paste={handlePaste}
				class="-ml-[2px] rounded-r-[.3rem] bg-secondary pl-2" />
		</div>
	{/if}
</div>

{#if showCount}
	<div>{tagsCount}/{maxTags}</div>
{/if}
