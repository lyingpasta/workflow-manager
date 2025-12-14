<script lang="ts">
	import Button from './button.svelte';
	let { onDeleteButtonPressed, onDuplicateButtonPressed, onEditButtonPressed } = $props();
</script>

<div class="flex flex-row">
	<Button position="left" type="normal" onClick={onEditButtonPressed}
		><span class="pixelarticons--edit"></span></Button
	>
	<Button position="middle" type="normal" onClick={onDuplicateButtonPressed}
		><span class="dinkie-icons--duplicate-filled"></span></Button
	>
	<Button position="right" type="danger" onClick={onDeleteButtonPressed}
		><span class="pixel--trash-solid text-gray-200"></span></Button
	>
</div>

<style>
	.pixel--trash-solid {
		display: inline-block;
		width: 24px;
		height: 24px;
		--svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M20 6v8h-1v8h-1v1H6v-1H5v-8H4V6zm1-3v2H3V3h1V2h5V1h6v1h5v1z'/%3E%3C/svg%3E");
		background-color: currentColor;
		-webkit-mask-image: var(--svg);
		mask-image: var(--svg);
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-size: 100% 100%;
		mask-size: 100% 100%;
	}

	.dinkie-icons--duplicate-filled {
		display: inline-block;
		width: 24px;
		height: 24px;
		--svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath fill='%23000' d='M3 12h6v-1H8V9h2v1h1V3H3Zm-3-2h2V2h6V1H0Zm5 0V9h2v1Zm4 1h1v-1H9ZM5 8V7h4v1Zm0-2V5h4v1Zm0 0'/%3E%3C/svg%3E");
		background-color: currentColor;
		-webkit-mask-image: var(--svg);
		mask-image: var(--svg);
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-size: 100% 100%;
		mask-size: 100% 100%;
	}

	.pixelarticons--edit {
		display: inline-block;
		width: 24px;
		height: 24px;
		--svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M18 2h-2v2h-2v2h-2v2h-2v2H8v2H6v2H4v2H2v6h6v-2h2v-2h2v-2h2v-2h2v-2h2v-2h2V8h2V6h-2V4h-2zm0 8h-2v2h-2v2h-2v2h-2v2H8v-2H6v-2h2v-2h2v-2h2V8h2V6h2v2h2zM6 16H4v4h4v-2H6z'/%3E%3C/svg%3E");
		background-color: currentColor;
		-webkit-mask-image: var(--svg);
		mask-image: var(--svg);
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-size: 100% 100%;
		mask-size: 100% 100%;
	}
</style>
