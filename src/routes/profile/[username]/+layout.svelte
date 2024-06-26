<script lang="ts">
	import type { PageData } from './$types'
import Profile from '@Components/ProfileCard.svelte'
	export let data: PageData
</script>

<svelte:head>
	<title>{data.name} - Tech Gunner</title>
	<meta name="description" content={data.bio} />
</svelte:head>
<main class="flex flex-col gap-5">
	<div class="m-5 h-[28vh] w-[95vw] absolute self-center"
	><img src={data.banner} alt="banner" class="h-full w-full object-cover blur-xl" /></div>
	<div class="m-5 h-[28vh] w-[95vw] z-30 self-center"
		><img src={data.banner} alt="banner" class="h-full w-full object-cover" /></div>
<Profile {data} className='ml-12 mt-6' />
<slot/>
</main>