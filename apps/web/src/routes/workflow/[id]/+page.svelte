<script lang="ts">
	import Canvas from '$lib/components/canvas/canvas.svelte';
	import ModalContainer from '$lib/components/modal/modal-container.svelte';
	import Toolbox from '$lib/components/toolbox.svelte';
	import { notificationStore } from '$lib/stores/notification';
	import type { CanvasNode, Coordinates } from '$lib/types/canvas';
	import type { NodeFlowArrow, NodeType } from '$lib/types/nodes';
	import { mount, unmount } from 'svelte';
	import { match, P } from 'ts-pattern';

	let width: number = $state(0);
	let height: number = $state(0);
	let canvasNodes: CanvasNode[] = $state([]);
	let nodeFlowArrows: NodeFlowArrow[] = $state([]);
	let selectedNode: CanvasNode | undefined = $state(undefined);
	let editNodeModal: any | undefined = $state.raw(undefined);

	function createNewNode(canvasNode: CanvasNode, type: NodeType) {
		canvasNodes.push(canvasNode);
		notificationStore.add(`New ${type} node has been added`, 'info', undefined);
	}

	function selectNode(node: CanvasNode) {
		selectedNode = node;
	}

	function moveNode(newCoordinates: Coordinates) {
		if (selectedNode) {
			selectedNode.coordinates = newCoordinates;
		}
	}

	function deleteNode() {
		return match(selectedNode)
			.with(P.nonNullable, (node) => {
				canvasNodes = canvasNodes.filter((node) => node.id !== node.id);
				nodeFlowArrows = nodeFlowArrows.filter(
					(arrow) => arrow.fromNodeId !== node.id || arrow.toNodeId !== node.id
				);
				selectedNode = undefined;
				notificationStore.add(`Node ${node.title} has been deleted`, 'info', undefined);
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
					const nodeIndex = canvasNodes.findIndex(({ id }) => id === selectedNode!.id);
					canvasNodes[nodeIndex] = node;
					selectedNode = canvasNodes[nodeIndex];
					unmount(editNodeModal);
					editNodeModal = undefined;
					notificationStore.add(`Node ${node.title} has been updated`, 'info', undefined);
				}
			}
		});
	}

	function createFlowArrow(from: CanvasNode, to: CanvasNode) {
		nodeFlowArrows.push({
			fromNodeId: from.id,
			toNodeId: to.id
		});
	}
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<div id="workflow-container" class="relative h-full w-full">
	<div
		class={`${selectedNode ? 'visible' : 'hidden'} absolute w-full flex justify-center top-4 z-50`}
	>
		<Toolbox
			onDeleteButtonPressed={deleteNode}
			onEditButtonPressed={editNode}
			onDuplicateButtonPressed={() => {}}
		/>
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
</div>
