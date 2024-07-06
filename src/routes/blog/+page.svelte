<script lang="ts">
	import type { PageData } from './$types'
	import Card from '@Components/Card.svelte'
	export let data: PageData
	const { blogs } = data
</script>

<svelte:head>
	<title>Blogs - Tech Gunner</title>
</svelte:head>

{#if blogs.length === 0}
	<main class="wrapper">
		<p>
			No blog has been published yet. <br />
			Be the first one to <a href="/blog/compose" class="text-primary"><b>publish</b></a> a blog !!!
		</p>
	</main>
{:else}
	<main class="gap-[25px] p-3 w-full cards">
		{#each blogs as blog}
			<Card
				data={{
					...blog,
					user: {
						username: blog.author.username,
						name: blog.author.name,
						profile_picture: blog.author.profile_picture,
						verified: blog.author.verified
					}
				}}
				href="blog" />
		{/each}
	</main>
{/if}

<style>
	.cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		grid-template-rows: repeat(auto-fill, minmax(280px, .48fr));
    }

    @media (max-width: 600px) {
        .cards {
            grid-template-columns: 1fr;
        }
    }
</style>