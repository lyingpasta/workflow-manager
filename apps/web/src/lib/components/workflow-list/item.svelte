<script lang="ts">
	import Toggle from '../ui-tools/toggle.svelte';

	let { name, onClick, onActivationToggled, activated } = $props();
</script>

<li>
	<div
		role="menuitem"
		tabindex="0"
		class="w-full flex flex-row cursor-pointer text-left w-full h-fit border rounded-md border-solid border-blue-600 text-blue-600 p-5 hover:bg-blue-400 hover:text-blue-50 transition-colors justify-between"
		onclick={onClick}
	>
		<div>
			{name}
		</div>
		<Toggle toggled={activated} onToggle={onActivationToggled}></Toggle>
	</div>
</li>
