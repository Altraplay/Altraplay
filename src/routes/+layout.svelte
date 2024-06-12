<script>
	import '../style.css'
	import Header from '@Components/Header.svelte'
	import Sidebar from '@Components/Sidebar.svelte'
	import Cursor from '@Components/Cursor.svelte'
</script>

<Header />
<Sidebar />
<Cursor />
<slot></slot>
