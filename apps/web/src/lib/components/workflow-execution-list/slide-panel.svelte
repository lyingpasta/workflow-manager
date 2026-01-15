<script lang="ts">
	import { goto } from '$app/navigation';
	import dayjs from 'dayjs';
	import Item from './item.svelte';
	import List from '../workflow-list/list.svelte';
	import Banner from '../workflow-list/banner.svelte';
	import { fly } from 'svelte/transition';

	let { executions, selectedExecutionId, onClose } = $props();
</script>

<div
	class="absolute top-0 h-full bg-blue-200 pl-3 py-3 border-r border-solid border-blue-500 z-100 flex flex-row"
	in:fly={{ x: -300, duration: 300 }}
	out:fly={{ x: -300, duration: 300 }}
>
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
		<button onclick={onClose} title="close" class="cursor-pointer"
			><span class="pixelarticons--arrow-left-box text-gray-400"></span></button
		>
	{:else}
		<div class="flex h-full items-center">
			<Banner></Banner>
		</div>
		<button onclick={onClose} title="close" class="cursor-pointer"
			><span class="pixelarticons--arrow-left-box text-gray-400"></span></button
		>
	{/if}
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
</style>
