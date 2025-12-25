<script lang="ts">
	import type { ExecutionStatus } from '$lib/types/workflow';
	import { match } from 'ts-pattern';

	let {
		display,
		status,
		createdAt,
		isSelected,
		onClick
	}: {
		display: string;
		status: ExecutionStatus;
		createdAt: string;
		isSelected: boolean;
		onClick: () => void;
	} = $props();

	const statusClass = (status: ExecutionStatus) =>
		match(status)
			.with('created', () => 'bg-gray-200 text-gray-600')
			.with('started', () => 'bg-yellow-200 text-yellow-600')
			.with('ongoing', () => 'bg-amber-200 text-amber-600')
			.with('succeeded', () => 'bg-green-200 text-green-600')
			.with('failed', () => 'bg-red-200 text-red-600')
			.exhaustive();
</script>

<li
	role="menuitem"
	tabindex="0"
	class={`w-full px-3 py-2  border border-solid rounded-sm flex flex-row gap-30 justify-between items-center border-blue-700 text-blue-500 transition-colors cursor-pointer ${isSelected ? 'bg-blue-300' : 'bg-gray-50  hover:bg-blue-200'}`}
	onclick={onClick}
>
	<div>
		<div>{display}</div>
		<div>{createdAt}</div>
	</div>
	<div class={`rounded-sm px-2 text-sm ${statusClass(status)}`}>{status}</div>
</li>
