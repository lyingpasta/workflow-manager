<script lang="ts">
	import { goto } from '$app/navigation';
	import Item from '$lib/components/workflow-execution-list/item.svelte';
	import Banner from '$lib/components/workflow-list/banner.svelte';
	import List from '$lib/components/workflow-list/list.svelte';
	import dayjs from 'dayjs';

	let isOpened = $state(true);

	let { children, data } = $props();
	const executions = $derived(data.executions);
	const selectedExecutionId = $derived(data.selectedExecution);
</script>

<div id="main-executions" class="relative w-screen h-screen overflow-hidden">
	<div
		class="absolute top-0 h-full bg-blue-200 pl-3 py-3 border-r border-solid border-blue-500 z-100 flex flex-row"
	>
		{#if isOpened}
			{#if executions && executions.length > 0}
				<List>
					{#each executions as execution}
						<Item
							display={dayjs(execution.updatedAt ?? execution.createdAt).format('YYYY/MM/DD HH:mm')}
							createdAt={dayjs(execution.createdAt).format('YYYY/MM/DD HH:mm')}
							status={execution.status}
							isSelected={execution.id === selectedExecutionId}
							onClick={() => goto(execution.url)}
						></Item>
					{/each}
				</List>
				<button onclick={() => (isOpened = false)} title="close" class="cursor-pointer"
					><span class="pixelarticons--arrow-left-box text-gray-400"></span></button
				>
			{:else}
				<div class="flex h-full items-center">
					<Banner></Banner>
				</div>
			{/if}
		{:else}
			<button onclick={() => (isOpened = true)} title="open" class="cursor-pointer"
				><span class="pixelarticons--arrow-right-box text-gray-600"></span></button
			>
		{/if}
	</div>
	{@render children()}
</div>

<style>
	.pixelarticons--arrow-left-box {
		display: inline-block;
		width: 24px;
		height: 24px;
		--svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M21 3v18H3V3zM5 19h14V5H5zm12-8v2h-6v2H9v-2H7v-2h2V9h2v2zm-4-2h-2V7h2zm0 8v-2h-2v2z'/%3E%3C/svg%3E");
		background-color: currentColor;
		-webkit-mask-image: var(--svg);
		mask-image: var(--svg);
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-size: 100% 100%;
		mask-size: 100% 100%;
	}

	.pixelarticons--arrow-right-box {
		display: inline-block;
		width: 24px;
		height: 24px;
		--svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M3 21V3h18v18zM19 5H5v14h14zM7 13v-2h6V9h2v2h2v2h-2v2h-2v-2zm4 2h2v2h-2zm0-8v2h2V7z'/%3E%3C/svg%3E");
		background-color: currentColor;
		-webkit-mask-image: var(--svg);
		mask-image: var(--svg);
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-size: 100% 100%;
		mask-size: 100% 100%;
	}
</style>
