<script lang="ts">
	let { children } = $props();
</script>

<ol class="w-full">
	<li class="w-full">{@render children()}</li>
</ol>
