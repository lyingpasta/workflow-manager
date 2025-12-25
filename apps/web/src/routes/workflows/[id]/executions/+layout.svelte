<script lang="ts">
	import SlidePanel from '$lib/components/workflow-execution-list/slide-panel.svelte';
	import { mount, unmount } from 'svelte';

	let mountedSlider: any | undefined = $state.raw(undefined);

	let { children, data } = $props();
	const executions = $derived(data.executions);
	const selectedExecutionId = $derived(data.selectedExecution);

	function openExecutionsMenuSlider() {
		if (mountedSlider) return;

		const target = document.getElementById('main-executions');
		if (!target) return;

		mountedSlider = mount(SlidePanel, {
			target,
			props: {
				executions,
				selectedExecutionId,
				onClose: closeExecutionsMenuSlider
			}
		});
	}

	function closeExecutionsMenuSlider() {
		unmount(mountedSlider, { outro: true });
		mountedSlider = undefined;
	}
</script>

<div id="main-executions" class="relative w-screen h-screen overflow-hidden">
	<div class="absolute top-3 left-3 z-99">
		<button onclick={openExecutionsMenuSlider} title="open" class="cursor-pointer"
			><span class="pixelarticons--arrow-right-box text-gray-600"></span></button
		>
	</div>
	{@render children()}
</div>

<style>
	.pixelarticons--arrow-right-box {
		display: inline-block;
		width: 24px;
		height: 24px;
		--svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M3 21V3h18v18zM19 5H5v14h14zM7 13v-2h6V9h2v2h2v2h-2v2h-2v-2zm4 2h2v2h-2zm0-8v2h2V7z'/%3E%3C/svg%3E");
		background-color: currentColor;
		-webkit-mask-image: var(--svg);
		mask-image: var(--svg);
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-size: 100% 100%;
		mask-size: 100% 100%;
	}
</style>
