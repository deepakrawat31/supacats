<script lang="ts">
	import { IconBookmark, IconSlashes } from '@tabler/icons-svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	type ToastType = 'error' | 'saved';
	export let data;

	const supabase = data.supabase;
	const fact: string = data.fact.fact;

	const cats: string[] = ['😼', '😹', '😿', '🙀', '😺', '😾'];
	let catId: number = Math.floor(Math.random() * cats.length);
	let cat: string = cats[catId];
	const catChange = () => {
		catId += 1;
		if (catId > cats.length - 1) {
			catId = 0;
		}
		cat = cats[catId];
	};

	let facts: { fact: string }[] = [];
	let alreadySaved: boolean = false;

	const checkSaved = () => {
		facts.map((item) => {
			if (item.fact === fact) {
				return true;
			}
		});
		return false;
	};

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
		alreadySaved = checkSaved();
	});

	const logoutUser = async () => {
		supabase.auth.signOut();
		window.location.reload();
	};

	const insertFact = async () => {
		const { data, error } = await supabase.from('facts').insert([{ fact: fact }]);
		if (error) {
			console.log(error);
			toast('error', error.message);
		}
		toast('saved', 'fact saved! heading to profile...');
		window.location.href = '/profile';
	};

	let isMenuOpen = false;
</script>

<svelte:head>
	<title>Supacats</title>
</svelte:head>

<main class="min-h-dvh grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 bg-zinc-200 relative">
	{#if toastOpen}
		<div
			class={`absolute bottom-4 right-4 max-w-60 p-2 uppercase font-semibold ring-2 ring-black ${toastType === 'saved' ? 'bg-amber-400' : 'bg-rose-400'}`}
			transition:fade={{
				delay: 300,
				duration: 300
			}}
		>
			{toastMsg}
		</div>
	{/if}
	<div class="flex flex-col gap-4 text-neutral-900 p-4 h-dvh">
		<span class="text-4xl md:text-6xl uppercase font-semibold max-w-80">random cat facts.</span>
		<button
			class="flex-1 flex items-center justify-center text-9xl ring-2 ring-black bg-purple-600"
			on:click={catChange}>{cat}</button
		>
	</div>
	<div class="flex flex-col p-4">
		<nav class="flex gap-1 items-center justify-end">
			{#if data.session === null}
				<a href="/login" class="capitalize font-semibold hover:text-purple-600 transition-colors"
					>login</a
				>
				<span class="text-purple-600"><IconSlashes /></span>
				<a href="/register" class="capitalize font-semibold hover:text-purple-600 transition-colors"
					>register</a
				>
			{:else}
				<button
					on:click={() => (isMenuOpen = !isMenuOpen)}
					class={`relative text-2xl p-2 bg-purple-500 rounded-full transition-all ${isMenuOpen ? 'ring-2 ring-black' : ''}`}
				>
					{cats[Math.floor(Math.random() * cats.length)]}
					{#if isMenuOpen}
						<div
							class="absolute flex flex-col gap-4 items-start justify-start text-base right-0 -bottom-28 bg-purple-500 p-4 ring-2 ring-black overflow-hidden"
						>
							<a href="/profile" class="font-semibold">
								{#if data.session.user.user_metadata.user_name != null}
									{data.session.user.user_metadata.user_name}
								{:else}
									{data.session.user.email}
								{/if}
							</a>
							<button on:click={() => logoutUser()} class="font-semibold capitalize">
								logout
							</button>
						</div>
					{/if}
				</button>
			{/if}
		</nav>
		<div
			class="flex-1 flex items-center justify-center text-2xl md:text-4xl capitalize font-semibold"
		>
			<span class="flex items-start justify-start gap-4">
				<span>
					{fact}
				</span>
				{#if data.session != null && !alreadySaved}
					<button
						on:click={() => insertFact()}
						class="p-1 hover:bg-purple-400 transition-all ring-2 ring-black"
					>
						<IconBookmark size={24} />
					</button>
				{/if}
			</span>
		</div>
	</div>
</main>
