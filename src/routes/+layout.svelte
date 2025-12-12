<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div id="main" class="w-screen h-screen">
	{@render children()}
</div>

<style>
	#main {
		/* Prioritizes Helvetica Neue or Helvetica, with fallbacks */
		font-family: 'JetBrains Mono', Helvetica, Arial, sans-serif;
	}
</style>
