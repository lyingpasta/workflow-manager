<script lang="ts">
	let { children } = $props();
</script>

<ol class="w-full flex flex-col gap-2 h-full overflow-scroll mb-15">
	{@render children()}
</ol>
