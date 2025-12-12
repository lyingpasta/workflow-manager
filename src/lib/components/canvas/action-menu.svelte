<script>
	let { style, onExtractClick, onTransformClick, onLoadClick } = $props();
	import ActionButton from './action-button.svelte';
</script>

<div
	tabindex="-1"
	role="dialog"
	oncontextmenu={(event) => event.preventDefault()}
	class="absolute w-90 h-30 flex flex-col justify-evenly"
	{style}
>
	<div class="w-full flex align-top justify-center grow">
		<ActionButton onClick={onExtractClick}>Exctract</ActionButton>
	</div>
	<div class="h-fit w-full flex grow-0 justify-center items-center text-gray-400">.</div>
	<div class="w-full flex items-end justify-between grow">
		<ActionButton onClick={onTransformClick}>Transform</ActionButton>
		<ActionButton onClick={onLoadClick}>Load</ActionButton>
	</div>
</div>
