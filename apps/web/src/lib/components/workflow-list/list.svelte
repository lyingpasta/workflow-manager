<script lang="ts">
	let { children } = $props();
</script>

<ol class="w-full flex flex-col gap-2">
	{@render children()}
</ol>
