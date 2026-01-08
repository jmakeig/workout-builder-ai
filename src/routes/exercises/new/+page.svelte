<script lang="ts">
	import { enhance } from '$app/forms';
	import Control from '$lib/components/Control.svelte';
	import { Validation } from '$lib/validation';

	let { form } = $props();

	let validation = $derived(form?.validation ?? new Validation());
</script>

<svelte:head>
	<title>New Exercise</title>
</svelte:head>

<h1>New Exercise</h1>

<form method="POST" use:enhance novalidate>
	<Control name="name" {validation} value={form?.input?.name}>
		{#snippet input(props)}
			<input {...props} type="text" required />
		{/snippet}
	</Control>

	<Control
		name="label"
		{validation}
		value={form?.input?.label}
		help="URL-friendly identifier (optional)"
	>
		{#snippet input(props)}
			<input {...props} type="text" pattern="[a-z0-9\-]+" />
		{/snippet}
	</Control>

	<Control name="description" {validation} value={form?.input?.description ?? ''}>
		{#snippet input(props)}
			<textarea {...props}></textarea>
		{/snippet}
	</Control>

	<Control
		name="duration"
		{validation}
		value={form?.input?.duration ?? 30}
		help="Duration in seconds"
	>
		{#snippet input(props)}
			<input {...props} type="number" min="0" />
		{/snippet}
	</Control>

	<p>
		<button type="submit">Create Exercise</button>
	</p>
</form>

<p><a href="/exercises">Back to exercises</a></p>
