<script lang="ts">
	let { name, onClick } = $props();
</script>

<button
	class="cursor-pointer text-left w-full h-fit border rounded-md border-solid border-blue-600 text-blue-600 p-5 hover:bg-blue-400 hover:text-blue-50 transition-colors"
	onclick={onClick}
>
	{name}
</button>
