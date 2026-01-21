<script lang="ts">
	import Canvas from '$lib/components/canvas/canvas.svelte';
	import ModalContainer from '$lib/components/modal/modal-container.svelte';
	import type { CanvasNode } from '$lib/types/canvas';
	import type { NodeFlowArrow } from '$lib/types/nodes';
	import { buildNodeTree } from '$lib/utils/nodes.js';
	import { mount, unmount } from 'svelte';

	let { data } = $props();

	let width: number = $state(0);
	let height: number = $state(0);
	let canvasNodes: Map<string, CanvasNode> = $state(new Map());
	let nodeFlowArrows: NodeFlowArrow[] = $state([]);
	let selectedNode: CanvasNode | undefined = $state(undefined);
	let schema = $derived(data.workflowExecution.workflowSchema);
	let viewNodeModal: any | undefined = $state.raw(undefined);

	function selectNodeAndView(node: CanvasNode) {
		selectedNode = node;
		viewNodeExecution();
	}

	function viewNodeExecution() {
		viewNodeModal = mount(ModalContainer, {
			target: document.getElementById('execution-container')!,
			props: {
				node: selectedNode,
				mode: 'readonly',
				onCancelButtonPressed: () => {
					unmount(viewNodeModal, { outro: true });
					viewNodeModal = undefined;
				},
				onCommitButtonPressed: () => {}
			}
		});
	}

	$effect(() => {
		console.log(data);
		const { nodes, arrowFlows } = buildNodeTree(schema);
		canvasNodes = nodes;
		nodeFlowArrows = arrowFlows;
	});
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<div id="execution-container" class="relative h-full w-full">
	<div
		class="absolute top-3 right-1/2 z-90 flex flex-row bg-gray-200 px-4 py-1 rounded-md gap-3 items-center justify-center"
	>
		<span class="pixelarticons--eye text-gray-700"></span>
		<div class="text-gray-700">Readonly</div>
	</div>

	<Canvas
		{canvasNodes}
		{width}
		{height}
		{selectedNode}
		{nodeFlowArrows}
		onNodeSelected={selectNodeAndView}
	/>
</div>

<style>
	.pixelarticons--eye {
		display: inline-block;
		width: 24px;
		height: 24px;
		--svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M8 6h8v2H8zm-4 4V8h4v2zm-2 2v-2h2v2zm0 2v-2H0v2zm2 2H2v-2h2zm4 2H4v-2h4zm8 0v2H8v-2zm4-2v2h-4v-2zm2-2v2h-2v-2zm0-2h2v2h-2zm-2-2h2v2h-2zm0 0V8h-4v2zm-10 1h4v4h-4z'/%3E%3C/svg%3E");
		background-color: currentColor;
		-webkit-mask-image: var(--svg);
		mask-image: var(--svg);
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-size: 100% 100%;
		mask-size: 100% 100%;
	}
</style>
