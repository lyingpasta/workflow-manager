<script lang="ts">
	import type { CanvasNode } from '$lib/types/canvas';
	import InputText from '../input-text.svelte';

	let { node, onCancelButtonPressed, onCommitButtonPressed } = $props();

	const initialTitle = $derived(node?.title);

	// svelte-ignore state_referenced_locally
	let nodeTitle: string | undefined = $state.raw(initialTitle);

	function cancel() {
		onCancelButtonPressed();
	}

	function commit() {
		const newNode: CanvasNode = {
			id: node.id,
			coordinates: node.coordinates,
			title: nodeTitle ?? node.title
		};
		onCommitButtonPressed(newNode);
	}
</script>

<div class="absolute w-full h-full p-5 z-60">
	<div
		class="rounded-lg w-full h-full bg-white border border-solid border-gray-500 p-2 justify-evenly flex flex-col gap-2"
	>
		<div class="flex flex-row justify-evenly gap-2 grow">
			<div class="w-full h-full border border-solid border-gray-300 bg-gray-50"></div>
			<div class="w-full h-full pt-6 pb-2 pl-4 pr-4">
				<div>
					<p class="mb-2">Node Title</p>
					<InputText bind:value={nodeTitle} />
				</div>
			</div>
			<div class="w-full h-full border border-solid border-gray-300 bg-gray-50"></div>
		</div>
		<div class="w-full h-fit grow-0 flex flex-row justify-end gap-5">
			<button
				class="w-25 p-2 bg-gray-300 rounded-sm hover:bg-gray-500 hover:text-gray-100 cursor-pointer transition-colors"
				onclick={cancel}>Cancel</button
			>
			<button
				class="w-25 p-2 hover:bg-amber-700 hover:text-gray-50 rounded-sm bg-amber-500 text-gray-900 cursor-pointer transition-colors"
				onclick={commit}>Commit</button
			>
		</div>
	</div>
</div>
