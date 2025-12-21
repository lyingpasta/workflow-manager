<script lang="ts">
	import { blur } from 'svelte/transition';

	let { onSubmit, onCancel, initialName } = $props();

	let workflowName = $derived(initialName);
</script>

<div
	in:blur={{ duration: 700 }}
	out:blur={{ duration: 700 }}
	class="w-full flex flex-row justify-between items-center border border-solid border-amber-600 bg-amber-100 px-5 py-3 rounded-sm"
>
	<input type="text" bind:value={workflowName} />
	<div class="flex flex-row gap-4">
		<button
			class="flex justify-center items-center"
			onclick={() => onSubmit(workflowName)}
			title="Save"><span class="pixelarticons--check"></span></button
		>
		<button class="flex justify-center items-center" onclick={onCancel} title="Cancel"
			><span class="pixelarticons--close"></span></button
		>
	</div>
</div>

<style>
	.pixelarticons--check {
		display: inline-block;
		width: 24px;
		height: 24px;
		--svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M18 6h2v2h-2zm-2 4V8h2v2zm-2 2v-2h2v2zm-2 2h2v-2h-2zm-2 2h2v-2h-2zm-2 0v2h2v-2zm-2-2h2v2H6zm0 0H4v-2h2z'/%3E%3C/svg%3E");
		background-color: currentColor;
		-webkit-mask-image: var(--svg);
		mask-image: var(--svg);
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-size: 100% 100%;
		mask-size: 100% 100%;
	}

	.pixelarticons--close {
		display: inline-block;
		width: 24px;
		height: 24px;
		--svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M5 5h2v2H5zm4 4H7V7h2zm2 2H9V9h2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2zm2-2v2h-2V9zm2-2v2h-2V7zm0 0V5h2v2z'/%3E%3C/svg%3E");
		background-color: currentColor;
		-webkit-mask-image: var(--svg);
		mask-image: var(--svg);
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-size: 100% 100%;
		mask-size: 100% 100%;
	}
</style>
