<script lang="ts">
	import type { CanvasNode, ExtendedCanvasNode } from '$lib/types/canvas';
	import { scale } from 'svelte/transition';
	import InputText from '../input-text.svelte';
	import { bounceOut, expoIn } from 'svelte/easing';
	import ExtractProps from './extract-props.svelte';
	import { match } from 'ts-pattern';
	import LoadProps from './load-props.svelte';
	import type { NodeType } from '$lib/types/nodes';

	let { node, onCancelButtonPressed, onCommitButtonPressed, mode = 'edit' } = $props();

	const initialTitle = $derived(node?.title);

	let initialSource: 'node' | 'job' = $derived(node?.source ?? 'node');
	let initialPaths: string[] = $derived(node?.paths ?? []);
	let initialPath: string = $derived(node?.path);

	// svelte-ignore state_referenced_locally
	let nodeTitle: string | undefined = $state.raw(initialTitle);
	// svelte-ignore state_referenced_locally
	let source: 'node' | 'job' = $state.raw(initialSource);
	// svelte-ignore state_referenced_locally
	let paths: any[] = $state.raw(initialPaths);
	// svelte-ignore state_referenced_locally
	let path: string = $state.raw(initialPath);

	function cancel() {
		onCancelButtonPressed();
	}

	function commit() {
		const newNode: ExtendedCanvasNode = match(node as CanvasNode & { type: NodeType })
			.with({ type: 'extract' }, (node) => ({
				id: node.id,
				coordinates: node.coordinates,
				title: nodeTitle ?? node.title,
				type: 'extract' as const,
				source,
				paths
			}))
			.with({ type: 'load' }, (node) => ({
				id: node.id,
				coordinates: node.coordinates,
				title: nodeTitle ?? node.title,
				type: 'load' as const,
				path
			}))
			.run();
		onCommitButtonPressed(newNode);
	}

	function addPath(newPath: string) {
		if (newPath.length === 0) return;

		const [from, to] = newPath.split(':', 2);
		match(node.type)
			.with('load', () => {
				path = newPath;
			})
			.with('extract', () => {
				paths = [...paths, { path: from, outputPath: to ?? from }];
			})
			.run();
	}

	function removePath(path: string) {
		paths = match(node.type)
			.with('load', () => paths.filter((p) => p !== path))
			.with('extract', () => paths.filter((p) => p.from !== path))
			.run();
	}

	function customeBounceOut(t: number): number {
		return Math.min(bounceOut(t) * 1.2, 1);
	}
</script>

<div
	class="absolute w-full h-full p-5 z-60"
	in:scale={{ duration: 500, easing: customeBounceOut, opacity: 0.9 }}
	out:scale={{ duration: 300, easing: expoIn }}
>
	<div
		class="rounded-lg w-full h-full bg-white border border-solid border-gray-500 p-2 justify-evenly flex flex-col gap-2"
	>
		<div class="flex flex-row justify-evenly gap-2 grow">
			<div class="w-full h-full border border-solid border-gray-300 bg-gray-50 p-2">
				<code>{JSON.stringify(node.input, null, 2)}</code>
			</div>
			<div class="w-full h-full pt-6 pb-2 pl-4 pr-4 gap-3 flex flex-col">
				<div>
					<span class="mb-2">Node Title</span>
					<InputText bind:value={nodeTitle} disabled={mode === 'readonly'} />
				</div>
				{#if node.type === 'extract'}
					<ExtractProps
						bind:source
						bind:paths
						{mode}
						onPathAdd={addPath}
						onPathRemove={removePath}
					/>
				{:else if node.type === 'load'}
					<LoadProps bind:path {mode} onPathAdd={addPath} onPathRemove={removePath} />
				{/if}
			</div>
			<div class="w-full h-full border border-solid border-gray-300 bg-gray-50 p-2">
				<code>{JSON.stringify(node.output, null, 2)}</code>
			</div>
		</div>
		<div class="w-full h-fit grow-0 flex flex-row justify-end gap-5">
			<button
				class="w-25 p-2 bg-gray-300 rounded-sm hover:bg-gray-500 hover:text-gray-100 cursor-pointer transition-colors"
				onclick={cancel}>Cancel</button
			>
			{#if mode === 'edit'}
				<button
					class="w-25 p-2 hover:bg-blue-700 hover:text-gray-50 rounded-sm bg-blue-500 text-gray-900 cursor-pointer transition-colors"
					onclick={commit}>Commit</button
				>
			{/if}
		</div>
	</div>
</div>
