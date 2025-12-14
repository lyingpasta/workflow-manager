<script lang="ts">
	import type { Notification } from '$lib/stores/notification';
	import { blur, fly } from 'svelte/transition';
	import { match } from 'ts-pattern';

	let { message, type }: Pick<Notification, 'message' | 'type'> = $props();

	// svelte-ignore state_referenced_locally
	const icon = match(type)
		.with('info', () => 'pixelarticons--info-box text-green-500')
		.with('error', () => 'pixelarticons--warning-box text-amber-300')
		.exhaustive();
</script>

<div
	class="w-100 flex flex-row items-center pl-5 pr-5 pt-3 pb-3 gap-3 mb-3 border border-solid border-gray-600 rounded-md bg-gray-50"
	in:fly={{ x: 300, duration: 300 }}
	out:blur={{ duration: 1000 }}
>
	<span class={icon}>{type}</span>
	<p class="text-wrap">{message}</p>
</div>

<style>
	.pixelarticons--info-box {
		display: inline-block;
		width: 24px;
		height: 24px;
		--svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M3 3h2v18H3zm16 0H5v2h14v14H5v2h16V3zm-8 6h2V7h-2zm2 8h-2v-6h2z'/%3E%3C/svg%3E");
		background-color: currentColor;
		-webkit-mask-image: var(--svg);
		mask-image: var(--svg);
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-size: 100% 100%;
		mask-size: 100% 100%;
	}

	.pixelarticons--warning-box {
		display: inline-block;
		width: 24px;
		height: 24px;
		--svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M3 3h16v2H5v14h14v2H3zm18 0h-2v18h2zM11 15h2v2h-2zm2-8h-2v6h2z'/%3E%3C/svg%3E");
		background-color: currentColor;
		-webkit-mask-image: var(--svg);
		mask-image: var(--svg);
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-size: 100% 100%;
		mask-size: 100% 100%;
	}
</style>
