<script lang="ts">
	let workflowId = $state('');
	let input = $state('');
	let response = $state(undefined);

	async function submit() {
		const coreUrl = 'http://localhost:3000';
		const req = await fetch(`${coreUrl}/executions/${workflowId}/start`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ test: input })
		});
		console.log(req);
		const res = await req.json();

		response = res;
	}
</script>

<div class="w-full flex items-center justify-center mt-10">
	<div class="flex flex-col items-center gap-3 w-fit">
		<div class="flex grow justify-between w-full">
			<div>id:</div>
			<input type="text" bind:value={workflowId} class="w-100 border border-solid" />
		</div>
		<div class="flex gap-3">
			<div>input:</div>
			<input type="text" bind:value={input} class="w-100 border border-solid" />
		</div>
		<button title="submit" onclick={submit} class="w-30 border border-solid">submit</button>
	</div>
</div>

{#if response}
	<div>{response}</div>
{/if}
