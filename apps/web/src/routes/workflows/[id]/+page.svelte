<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import Canvas from '$lib/components/canvas/canvas.svelte';
	import ModalContainer from '$lib/components/modal/modal-container.svelte';
	import Toolbox from '$lib/components/toolbox.svelte';
	import { notificationStore } from '$lib/stores/notification';
	import type { CanvasNode, Coordinates } from '$lib/types/canvas';
	import type { NodeFlowArrow, NodeType } from '$lib/types/nodes';
	import { mount, unmount } from 'svelte';
	import { match, P } from 'ts-pattern';
	import type { PageData } from './$types';
	import { buildNodeTree, buildSchemaFromTree } from '$lib/utils/nodes';
	import { submitWorkflowSchema } from './save-workflow-schema.remote';

	let { data }: { data: PageData } = $props();

	const { nodes, arrowFlows } = buildNodeTree(data.schema);

	let width: number = $state(0);
	let height: number = $state(0);
	let canvasNodes: Map<string, CanvasNode> = $state(nodes);
	let nodeFlowArrows: NodeFlowArrow[] = $state(arrowFlows);
	let selectedNode: CanvasNode | undefined = $state(undefined);
	let shouldSave: boolean = $state(false);
	let editNodeModal: any | undefined = $state.raw(undefined);

	function createNewNode(canvasNode: CanvasNode, type: NodeType) {
		canvasNodes.set(canvasNode.id, canvasNode);
		notificationStore.add(`New ${type} node has been added`, 'info', undefined);
		updateShouldSave();
	}

	function selectNode(node: CanvasNode) {
		selectedNode = node;
	}

	function moveNode(newCoordinates: Coordinates) {
		if (selectedNode) {
			canvasNodes.set(selectedNode.id, { ...selectedNode, coordinates: newCoordinates });
			selectedNode.coordinates = newCoordinates;
			shouldSave = true;
		}
	}

	function deleteNode() {
		return match(selectedNode)
			.with(P.nonNullable, (node) => {
				canvasNodes.delete(node.id);
				nodeFlowArrows = nodeFlowArrows.filter(
					(arrow) => arrow.fromNodeId !== node.id && arrow.toNodeId !== node.id
				);
				selectedNode = undefined;
				notificationStore.add(`Node ${node.title} has been deleted`, 'info', undefined);
				updateShouldSave();
			})
			.run();
	}

	function editNode() {
		editNodeModal = mount(ModalContainer, {
			target: document.getElementById('workflow-container')!,
			props: {
				node: selectedNode,
				onCancelButtonPressed: () => {
					unmount(editNodeModal);
					editNodeModal = undefined;
					notificationStore.add(`Node edit canceled`, 'info', undefined);
				},
				onCommitButtonPressed: (node: CanvasNode) => {
					canvasNodes.set(node.id, node);
					selectedNode = canvasNodes.get(node.id);
					unmount(editNodeModal);
					editNodeModal = undefined;
					notificationStore.add(`Node ${node.title} has been updated`, 'info', undefined);
					updateShouldSave();
				}
			}
		});
	}

	function createFlowArrow(from: CanvasNode, to: CanvasNode) {
		nodeFlowArrows.push({
			fromNodeId: from.id,
			toNodeId: to.id
		});
		updateShouldSave();
	}

	function updateShouldSave() {
		shouldSave = true;
	}

	async function saveWorkflowSchema() {
		await submitWorkflowSchema({
			id: data.schema.id,
			...buildSchemaFromTree({ nodes: canvasNodes, arrowFlows: nodeFlowArrows })
		});
		shouldSave = false;
		notificationStore.add(`Workflow has been saved successfully!`, 'info', undefined);
	}
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<div id="workflow-container" class="relative h-full w-full">
	<div class={` absolute w-full flex  top-4 left-4 z-50`}>
		<Button
			onClick={saveWorkflowSchema}
			position="standalone"
			type={shouldSave ? 'save' : 'normal'}
			disabled={!shouldSave}
			><span class={`pixelarticons--save  ${shouldSave ? 'text-green-600' : 'text-gray-600'}`}
			></span></Button
		>
	</div>

	<Canvas
		{canvasNodes}
		{width}
		{height}
		{selectedNode}
		{nodeFlowArrows}
		onFlowArrowAttached={createFlowArrow}
		onNodeDraw={createNewNode}
		onNodeSelected={selectNode}
		onNodeMoved={moveNode}
	/>

	<div
		class={`${selectedNode ? 'visible' : 'hidden'} absolute w-full flex justify-center bottom-10 z-50`}
	>
		<Toolbox
			onDeleteButtonPressed={deleteNode}
			onEditButtonPressed={editNode}
			onDuplicateButtonPressed={() => {}}
		/>
	</div>
</div>

<style>
	.pixelarticons--save {
		display: inline-block;
		width: 24px;
		height: 24px;
		--svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M4 2h14v2H4v16h2v-6h12v6h2V6h2v16H2V2zm4 18h8v-4H8zM20 6h-2V4h2zM6 6h9v4H6z'/%3E%3C/svg%3E");
		background-color: currentColor;
		-webkit-mask-image: var(--svg);
		mask-image: var(--svg);
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-size: 100% 100%;
		mask-size: 100% 100%;
	}
</style>
