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
			.with('created', () => 'bg-gray-300 text-gray-700')
			.with('started', () => 'bg-yellow-300 text-yellow-700')
			.with('ongoing', () => 'bg-amber-300 text-amber-700')
			.with('succeeded', () => 'bg-green-300 text-green-600')
			.with('failed', () => 'bg-red-300 text-red-700')
			.exhaustive();
</script>

<li
	role="menuitem"
	tabindex="0"
	class={`w-full px-3 py-2  border border-solid rounded-sm flex flex-row justify-between items-center border-blue-500 text-blue-700 transition-colors cursor-pointer ${isSelected ? 'bg-blue-300' : 'bg-blue-50 hover:bg-blue-400'}`}
	onclick={onClick}
>
	<div>
		<div>{display}</div>
		<div>{createdAt}</div>
	</div>
	<div class={`rounded-sm px-2 text-sm ${statusClass(status)}`}>{status}</div>
</li>
