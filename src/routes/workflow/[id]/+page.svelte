<script lang="ts">
	import Canvas from '$lib/components/canvas/canvas.svelte';
	import ModalContainer from '$lib/components/modal/modal-container.svelte';
	import Toolbox from '$lib/components/toolbox.svelte';
	import type { CanvasNode, Coordinates } from '$lib/types/canvas';
	import type { NodeType } from '$lib/types/nodes';
	import { mount, unmount } from 'svelte';

	let width: number = $state(0);
	let height: number = $state(0);
	let canvasNodes: CanvasNode[] = $state([]);
	let selectedNode: CanvasNode | undefined = $state(undefined);
	let editNodeModal: any | undefined = $state.raw(undefined);

	function createNewNode(canvasNode: CanvasNode, type: NodeType) {
		canvasNodes.push(canvasNode);
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
		if (selectedNode) {
			canvasNodes = canvasNodes.filter((node) => node.id !== selectedNode!.id);
			selectedNode = undefined;
		}
	}

	function editNode() {
		editNodeModal = mount(ModalContainer, {
			target: document.getElementById('workflow-container')!,
			props: {
				node: selectedNode,
				onCancelButtonPressed: () => {
					unmount(editNodeModal);
					editNodeModal = undefined;
				},
				onCommitButtonPressed: (node: CanvasNode) => {
					const nodeIndex = canvasNodes.findIndex(({ id }) => id === selectedNode!.id);
					canvasNodes[nodeIndex] = node;
					selectedNode = canvasNodes[nodeIndex];
					unmount(editNodeModal);
					editNodeModal = undefined;
				}
			}
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
		onNodeDraw={createNewNode}
		onNodeSelected={selectNode}
		onNodeMoved={moveNode}
	/>
</div>
