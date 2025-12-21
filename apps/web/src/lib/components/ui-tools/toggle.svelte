<script lang="ts">
	let { toggled, onToggle } = $props();

	let hovered = $state(false);
</script>

<button
	title="activation"
	class={`h-6 w-12 cursor-pointer rounded-xs border border-solid p-0.5 ${toggled ? 'left-1/2 border-blue-500 bg-amber-500 ' : 'border-gray-400 bg-gray-100'}`}
	onclick={(event) => {
		event.stopPropagation();
		onToggle();
	}}
	onmouseenter={() => (hovered = true)}
	onmouseleave={() => (hovered = false)}
>
	<div
		class={`relative h-full w-6 rounded-xs transition-all ${hovered && !toggled ? 'translate-x-0.5' : ''} ${toggled ? 'translate-x-4.5 bg-blue-500' : 'bg-gray-400'}`}
	></div>
</button>
