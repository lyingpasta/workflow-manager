<script lang="ts">
	import { goto } from '$app/navigation';
	import Item from '$lib/components/workflow-execution-list/item.svelte';
	import Banner from '$lib/components/workflow-list/banner.svelte';
	import List from '$lib/components/workflow-list/list.svelte';
	import dayjs from 'dayjs';

	let { children, data } = $props();
	const executions = $derived(data.executions);
	const selectedExecutionId = $derived(data.selectedExecution);
</script>

<div id="main-executions" class="relative w-screen h-screen overflow-hidden">
	<div class="absolute top-0 h-full w-1/4 bg-blue-200 p-3 border-r border-solid border-blue-500">
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
		{:else}
			<div class="flex h-full items-center">
				<Banner></Banner>
			</div>
		{/if}
	</div>
	{@render children()}
</div>
