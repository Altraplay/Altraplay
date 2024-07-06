<script>
	import '../style.css'
	import Header from '@Components/Header.svelte'
	import Sidebar from '@Components/Sidebar.svelte'
	import Cursor from '@Components/Cursor.svelte'
</script>

<Header />
<div class="flex *:transition-all *:duration-700">
	<Sidebar />
	<slot />
</div>
<Cursor />

