<script lang="ts">
	import Canvas from '$lib/components/canvas/canvas.svelte';
	import type { CanvasNode } from '$lib/types/canvas';
	import type { NodeType } from '$lib/types/nodes';

	let width: number = $state(0);
	let height: number = $state(0);

	function createNewNode(canvasNode: CanvasNode, type: NodeType) {}
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<div class="relative h-full w-full">
	<Canvas {width} {height} onNodeDraw={createNewNode} />
</div>
