<script lang="ts">
	let { children, onClick } = $props();
</script>

<button
	onclick={onClick}
	class="rounded-sm border border-solid border-gray-700 flex justify-center items-center h-fit w-40 pt-1 pb-1 transition-colors bg-gray-300 text-gray-700 hover:bg-gray-500 hover:text-gray-100 hover:border-gray-100 cursor-pointer"
>
	{@render children()}
</button>
