<script>
	let { style, onExtractClick, onTransformClick, onLoadClick } = $props();
	import ActionButton from './action-button.svelte';
</script>

<div
	tabindex="-1"
	role="dialog"
	oncontextmenu={(event) => event.preventDefault()}
	class="absolute w-120 h-40 flex flex-col justify-evenly"
	{style}
>
	<div class="w-full flex align-top justify-center grow">
		<ActionButton onClick={onExtractClick}>Exctract</ActionButton>
	</div>
	<div class="h-fit w-full flex grow-0 justify-between items-center text-gray-400">
		<ActionButton onClick={onExtractClick}>Input Listener</ActionButton>
		<div><span class="pixelarticons--circle"></span></div>
		<ActionButton onClick={onExtractClick}>Control</ActionButton>
	</div>
	<div class="w-full flex items-end justify-center grow gap-4">
		<ActionButton onClick={onTransformClick}>Transform</ActionButton>
		<ActionButton onClick={onLoadClick}>Load</ActionButton>
	</div>
</div>

<style>
	.pixelarticons--circle {
		display: inline-block;
		width: 24px;
		height: 24px;
		--svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M17 3H7v2H5v2H3v10h2v2h2v2h10v-2h2v-2h2V7h-2V5h-2zm0 2v2h2v10h-2v2H7v-2H5V7h2V5z'/%3E%3C/svg%3E");
		background-color: currentColor;
		-webkit-mask-image: var(--svg);
		mask-image: var(--svg);
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-size: 100% 100%;
		mask-size: 100% 100%;
	}
</style>
