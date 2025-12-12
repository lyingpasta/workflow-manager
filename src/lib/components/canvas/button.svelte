<script lang="ts">
	let { children, onClick, position } = $props();
</script>

<button
	class={`w-12 h-10 flex items-center justify-center cursor-pointer bg-gray-100 border-solid border hover:bg-gray-300 border-gray-600 ${position === 'right' ? 'rounded-r-sm' : 'rounded-l-sm'}`}
	onclick={onClick}
>
	{@render children()}
</button>
