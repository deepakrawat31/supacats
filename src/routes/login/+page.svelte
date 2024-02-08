<script lang="ts">
	import { IconBrandGithub } from '@tabler/icons-svelte';

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
</script>

<svelte:head>
	<title>Supacats | Login</title>
</svelte:head>

<main class="min-h-dvh grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 bg-zinc-200">
	<div class="flex flex-col gap-4 text-neutral-900 p-4 h-dvh">
		<a href="/" class="capitalize font-semibold hover:text-purple-600 transition-colors w-fit"
			>home</a
		>
		<button
			class="flex-1 flex items-center justify-center text-9xl ring-2 ring-black bg-purple-600"
			on:click={catChange}>{cat}</button
		>
	</div>
	<div class="p-4 flex flex-col justify-center gap-12">
		<span class="flex flex-col gap-4">
			<h1 class="text-4xl uppercase font-semibold text-neutral-900">login with github</h1>
			<p class="font-semibold uppercase text-neutral-800">get your cat facts straight!</p>
			<span class="font-semibold uppercase text-neutral-800"
				>still ain't registered? <a href="/register" class="text-purple-600 underline"
					>head to register</a
				></span
			>
		</span>
		<form method="post" class="flex items-end justify-start gap-4">
			<button
				formaction="?/login"
				type="submit"
				class="uppercase text-2xl font-semibold p-1 bg-purple-400 ring-2 ring-black"
				><IconBrandGithub size={40} stroke={1.5} /></button
			>
			<span class="text-2xl font-semibold uppercase">github</span>
		</form>
	</div>
</main>
