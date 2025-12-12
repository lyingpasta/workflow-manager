<script lang="ts">
	let { children, onClick, position } = $props();

	let classes = $state('');

	$effect(() => {
		if (position === 'right') {
			classes = 'rounded-r-sm border ';
		} else if (position === 'left') {
			classes = 'rounded-l-sm border ';
		} else {
			classes = 'border-t border-b';
		}
	});
</script>

<button
	class={`w-12 h-10 flex items-center justify-center cursor-pointer bg-gray-100 border-solid hover:bg-gray-300 border-gray-600 ${classes}`}
	onclick={onClick}
>
	{@render children()}
</button>
