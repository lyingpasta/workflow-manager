<script lang="ts">
	let { value = $bindable(), disabled = false } = $props();
</script>

<input
	class="w-full border border-solid rounded-sm border-gray-400 p-2"
	type="text"
	bind:value
	{disabled}
/>
