<script lang="ts">
	let { data } = $props();

	function format_duration(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		if (mins === 0) return `${secs}s`;
		if (secs === 0) return `${mins}m`;
		return `${mins}m ${secs}s`;
	}
</script>

<svelte:head>
	<title>{data.exercise.name}</title>
</svelte:head>

<h1>{data.exercise.name}</h1>

<dl>
	<dt>Label</dt>
	<dd>{data.exercise.label}</dd>

	<dt>Duration</dt>
	<dd>{format_duration(data.exercise.duration)}</dd>

	{#if data.exercise.description}
		<dt>Description</dt>
		<dd>{data.exercise.description}</dd>
	{/if}

	{#if data.exercise.instructions}
		<dt>Instructions</dt>
		<dd>{data.exercise.instructions}</dd>
	{/if}
</dl>

<p><a href="/exercises">Back to exercises</a></p>
