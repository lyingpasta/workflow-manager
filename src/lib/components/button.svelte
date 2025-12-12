<script lang="ts">
	let { children, onClick, position, type } = $props();

	let classes = $state('');
	let colors = $state('');

	$effect(() => {
		if (position === 'right') {
			classes = 'rounded-r-sm border ';
		} else if (position === 'left') {
			classes = 'rounded-l-sm border ';
		} else {
			classes = 'border-t border-b';
		}

		if (type === 'danger') {
			colors = `bg-red-600 hover:bg-red-700`;
		} else {
			colors = ` bg-gray-100 hover:bg-gray-300`;
		}
		console.log(type, colors);
	});
</script>

<button
	class={`w-12 h-10 flex items-center justify-center  cursor-pointer border-solid  border-gray-600 ${classes} ${colors} transition-colors`}
	onclick={onClick}
>
	{@render children()}
</button>
