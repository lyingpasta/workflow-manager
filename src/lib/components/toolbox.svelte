<script lang="ts">
	import Button from './button.svelte';
	let { onDeleteButtonPressed, onDuplicateButtonPressed, onEditButtonPressed } = $props();
</script>

<div class="flex flex-row">
	<Button position="left" onClick={onEditButtonPressed}>Edit</Button>
	<Button position="middle" onClick={onDuplicateButtonPressed}>Duplicate</Button>
	<Button position="right" onClick={onDeleteButtonPressed}>Delete</Button>
</div>
