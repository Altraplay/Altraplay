<script>
	import '../style.css'
	import Header from '@Components/Header.svelte'
	import Sidebar from '@Components/Sidebar.svelte'
	import Cursor from '@Components/Cursor.svelte'
	let show = false
</script>

<Header />
<div class="flex">
	<Sidebar bind:show />
	<slot class="{show ? 'ml-[250px]' : 'ml-[50px]'}"/>
</div>
<Cursor />

