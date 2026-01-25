<script lang="ts">
	import InputText from '../input-text.svelte';

	let { source = $bindable(), paths = $bindable(), mode, onPathAdd, onPathRemove } = $props();
	let newPath = $state('');
</script>

<div>
	<span class="mb-2">Source</span>
	<select bind:value={source} disabled={mode === 'readonly'}>
		<option>node</option>
		<option>job</option>
	</select>
</div>

<div>
	<span class="mb-2">Path</span>
	<div class="flex flex-row">
		<InputText bind:value={newPath} disabled={mode === 'readonly'} />
		<button
			class="cursor-pointer border border-solid bg-gray-100 border-gray-400 hover:bg-gray-300 px-2 items-center flex"
			title="add-path"
			onclick={() => {
				onPathAdd(newPath);
				newPath = '';
			}}><span class="pixelarticons--plus"></span></button
		>
	</div>
	<div class="flex flex-wrap w-full gap-2 mt-2">
		{#each paths as { path, outputPath }}
			<button
				class="rounded border border-solid bg-gray-100 border-gray-400 hover:bg-gray-300 cursor-pointer px-2 py"
				onclick={() => onPathRemove(path)}
			>
				{path}:{outputPath}
			</button>
		{/each}
	</div>
</div>

<style>
	.pixelarticons--plus {
		display: inline-block;
		width: 24px;
		height: 24px;
		--svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7z'/%3E%3C/svg%3E");
		background-color: currentColor;
		-webkit-mask-image: var(--svg);
		mask-image: var(--svg);
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-size: 100% 100%;
		mask-size: 100% 100%;
	}
</style>
