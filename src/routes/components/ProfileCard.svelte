<script lang="ts">
	import { enhance } from '$app/forms'
	import { abbreviateNumber, formatTime } from '$lib/utils'
	import Button from '@Components/Button.svelte'
	import VerifiedIcon from '@Components/icons/Verified.svelte'
	import Img from './Img.svelte'

	function calculateLevel(level: number) {
		if (level >= 100) {
			return '220px'
		} else if (level >= 90) {
			return '200px'
		} else if (level >= 60) {
			return '150px'
		} else if (level >= 30) {
			return '100px'
		} else if (level >= 8) {
			return '50px'
		} else {
			return '0'
		}
	}
	export let className = ''
	export let data: any
</script>

<section
	class="flex max-w-[280px] flex-col items-center justify-center gap-[15px] rounded-lg bg-highlight-1 p-4 {className}">
	<Img src={data.profile_picture} alt="Profile Picture" width="235px" className="-mt-[65px]" />
	<div class="flex items-center justify-center gap-[3px]">
		<h3>{data.name}</h3>
		{#if data.verified}
			<VerifiedIcon className="-mr-5 mt-[2px]" />
		{/if}
	</div>
	<b class="-mt-5 text-lg capitalize text-slate-400">{data.username}</b>
	<b>{abbreviateNumber(data.followers)}</b>
	<b class="-mt-3 text-slate-400">Followers</b>
	<form action="/api/profile/{data.username}/follow" method="POST" use:enhance>
		<Button label="Follow" className="w-[13rem]" type="submit" /></form>
	<a href="/profile/{data.username}/message">
		<Button label="Message" className="w-[13rem]" variant="secondary" />
	</a>
	{#if data.bio}
		<b class="mr-auto">Bio:</b>
		<p class="-mt-2 mr-auto line-clamp-2 text-base">
			{@html data.bio}
		</p>
	{/if}
	{#if data.links}
		<b class="mr-auto">Links</b>
		{#each data.links as link}
			<a href={link} target="_blank" class="mr-auto flex gap-2 pt-2"
				><img
					src="https://icons.duckduckgo.com/ip3/{link.replace('https://', '').split('/')[0]}.ico"
					alt="favicon"
					class="size-6" /><div class="-mt-1 capitalize"
					>{link.replace('https://', '').split('.')[0]} -{#if link
						.replace('https://', '')
						.split('/')[1]}
						{link.replace('https://', '').split('/')[1]}{/if}
					<div class="-mt-1 overflow-hidden text-[.8rem] font-bold lowercase text-primary"
						>{link}</div>
				</div>
			</a>
		{/each}
	{/if}
	<b class="mr-auto">Level: {data.level}</b>
	<b class="mr-auto">Points: {abbreviateNumber(data.points)}</b>
	<b class="mr-auto">Needs for next level: {abbreviateNumber(data.needs_for_next_level)}</b>
	<b class="mr-auto">Members in team: {abbreviateNumber(data.team)}</b>
	{#if data.skills.some(e => e.name)}
		<b class="mr-auto">Skills:</b>
		<div>
			{#each data.skills as skill}
				<span class="text-[.9rem]">{skill.name}:</span>

				<div
					class="absolute m-2 h-[7px] rounded-full bg-primary"
					style="width: {calculateLevel(skill.level)};"></div>
				<div class="m-2 h-[7px] w-[220px] rounded-full bg-highlight-2"></div>
			{/each}
		</div>
	{/if}
	{#if data.languages.some(e => e.name)}
		<b class="mr-auto">Languages:</b>
		<div>
			{#each data.languages as language}
				<span class="text-[.9rem]">{language.name}:</span>

				<div
					class="absolute m-2 h-[7px] rounded-full bg-primary"
					style="width: {calculateLevel(language.level)};"></div>
				<div class="m-2 h-[7px] w-[220px] rounded-full bg-highlight-2"></div>
			{/each}
		</div>
	{/if}
	<b class="mr-auto">Joined: {formatTime(new Date(data.joined_at))}</b>
</section>
