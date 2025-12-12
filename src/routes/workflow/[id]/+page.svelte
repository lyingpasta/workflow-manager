<script lang="ts">
	import Canvas from '$lib/components/canvas/canvas.svelte';
	import type { CanvasNode, Coordinates } from '$lib/types/canvas';
	import type { NodeType } from '$lib/types/nodes';

	let width: number = $state(0);
	let height: number = $state(0);
	let canvasNodes: CanvasNode[] = $state([]);
	let selectedNode: CanvasNode | undefined = $state(undefined);

	function createNewNode(canvasNode: CanvasNode, type: NodeType) {
		canvasNodes.push(canvasNode);
	}

	function selectNode(nodeId: string) {
		selectedNode = canvasNodes.find((node) => node.id === nodeId);
	}

	function moveNode(newCoordinates: Coordinates) {
		if (selectedNode) {
			selectedNode.coordinates = newCoordinates;
		}
	}
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<div class="relative h-full w-full">
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
