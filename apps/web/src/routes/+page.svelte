<script lang="ts">
	import { goto } from '$app/navigation';
	import Item from '$lib/components/workflow-list/item.svelte';
	import List from '$lib/components/workflow-list/list.svelte';
	import NewItem from '$lib/components/workflow-list/new-item.svelte';
	import { mount, unmount } from 'svelte';
	import type { PageData } from './$types';
	import { createWorkflow } from '$lib/client/core';

	let mountedNewWorkflowWizard: any = $state.raw(undefined);
	let { data }: { data: PageData } = $props();

	function createNewWorkflow() {
		const target = document.getElementById('new-workflow-container');
		if (target) {
			mountedNewWorkflowWizard = mount(NewItem, {
				target,
				props: {
					onSubmit: submitCreationNewWorkflow,
					onCancel: cancelNewWorkflowCreation,
					initialName: 'Workflow #?'
				}
			});
		}
	}

	function cancelNewWorkflowCreation() {
		if (mountedNewWorkflowWizard) {
			console.log('unmounting');
			unmount(mountedNewWorkflowWizard, { outro: true });
		}
	}

	async function submitCreationNewWorkflow(name: string) {
		await createWorkflow({ name });
	}
</script>

<div
	class="w-full bg-blue-100 text-blue-600 pl-10 pt-5 pb-5 flex flex-row items-center gap-15 border-b border-solid"
>
	<span class="mdi--dinosaur-pixel"></span>
	<h1>Workflow Manager</h1>
</div>
<div class="w-full h-full bg-blue-50 flex flex-row p-10">
	<div class="w-1/4 text-blue-600">Connected as LyingPasta</div>
	<div class="w-full flex flex-col">
		<div class="w-full flex flex-row justify-between mb-3 items-center">
			<h2 class="text-lg text-blue-600">Your workflows:</h2>
			<button
				class="bg-blue-500 text-blue-50 border border-solid border-blue-700 rounded-sm px-7 py-2 hover:bg-blue-800 cursor-pointer"
				onclick={createNewWorkflow}>New</button
			>
		</div>
		<div id="new-workflow-container"></div>
		<List
			>{#each data.workflows as workflow}
				<Item onClick={() => goto(`/workflows/${workflow.id}`)} name={workflow.name}></Item>
			{/each}</List
		>
	</div>
</div>

<style>
	.mdi--dinosaur-pixel {
		display: inline-block;
		width: 42px;
		height: 42px;
		--svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M13 2v1h-1v6h-1v1H9v1H8v1H7v1H5v-1H4v-1H3V9H2v6h1v1h1v1h1v1h1v4h2v-1H7v-1h1v-1h1v-1h1v1h1v3h2v-1h-1v-4h1v-1h1v-1h1v-3h1v1h1v-2h-2V9h5V8h-3V7h5V3h-1V2m-7 1h1v1h-1Z'/%3E%3C/svg%3E");
		background-color: currentColor;
		-webkit-mask-image: var(--svg);
		mask-image: var(--svg);
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-size: 100% 100%;
		mask-size: 100% 100%;
	}
</style>
