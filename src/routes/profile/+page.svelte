<script lang="ts">
	import { IconTrash } from '@tabler/icons-svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	type ToastType = 'error' | 'deleted';

	export let data;
	const supabase = data.supabase;
	const session = data.session;

	const cats: string[] = ['😼', '😹', '😿', '🙀', '😺', '😾'];
	let facts: { fact: string }[] = [];
	let toastType: ToastType;
	let toastMsg: string | null = '';
	let toastOpen: boolean = false;

	const toast = (type: ToastType, msg: string | null) => {
		toastType = type;
		toastMsg = msg;
		toastOpen = true;
		setTimeout(() => {
			toastOpen = false;
		}, 3000);
	};

	onMount(async () => {
		const { data, error } = await supabase.from('facts').select('fact');

		if (error) {
			console.log(error);
			return;
		}

		if (data) {
			facts = data.slice();
		}
	});

	const deleteFact = async (fact: string) => {
		const { error } = await supabase.from('facts').delete().eq('fact', fact);
		if (error) {
			toast('error', error.message);
			console.log(error);
			return;
		}
		toast('deleted', 'fact deleted! refreshing page...');
		window.location.reload();
	};
</script>

<svelte:head>
	<title>Supacats | {session?.user.user_metadata.user_name}</title>
</svelte:head>

<main class="min-h-dvh flex flex-col gap-8 bg-zinc-200 p-8 relative">
	{#if toastOpen}
		<div
			class={`absolute bottom-4 right-4 max-w-60 p-2 uppercase font-semibold ring-2 ring-black ${toastType === 'deleted' ? 'bg-amber-400' : 'bg-rose-400'}`}
			transition:fade={{
				delay: 300,
				duration: 300
			}}
		>
			{toastMsg}
		</div>
	{/if}
	<div class="flex gap-4 justify-between items-start">
		<h1 class="md:text-xl tracking-wide font-bold">
			<strong class="text-purple-600 lowercase">
				{#if session?.user.user_metadata.user_name != null}
					{session?.user.user_metadata.user_name}
				{:else}
					{session?.user.email}
				{/if}
			</strong>'s fact list.
		</h1>
		<nav class="font-semibold capitalize">
			<a href="/">home</a>
		</nav>
	</div>
	<div class="flex-1 grid-cols-1 sm:grid-cols-2 grid md:grid-cols-3 gap-4">
		{#each facts as item}
			<span
				class="bg-purple-700 flex flex-col justify-between gap-4 p-4 ring-2 ring-black aspect-square h-fit"
			>
				<span class="flex justify-between items-center">
					<span class="text-2xl p-2 bg-zinc-200 ring-2 ring-black rounded-full"
						>{cats[Math.floor(Math.random() * cats.length)]}</span
					>
					<button
						on:click={() => deleteFact(item.fact)}
						class="text-2xl p-2 bg-zinc-200 ring-2 ring-black rounded-full"
						><IconTrash size={32} stroke={1.5} /></button
					>
				</span>
				<span class="text-2xl font-semibold text-zinc-100 uppercase tracking-wide">
					{item.fact}
				</span>
			</span>
		{/each}
	</div>
</main>
