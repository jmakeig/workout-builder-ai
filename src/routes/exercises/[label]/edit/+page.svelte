<script lang="ts">
	import { enhance } from '$app/forms';
	import Control from '$lib/components/Control.svelte';
	import { Validation } from '$lib/validation';

	let { data, form } = $props();

	let validation = $derived(form?.validation ?? new Validation());

	let values = $derived({
		name: form?.input?.name ?? data.exercise.name,
		description: form?.input?.description ?? data.exercise.description ?? '',
		duration: form?.input?.duration ?? data.exercise.duration,
		instructions: form?.input?.instructions ?? data.exercise.instructions ?? ''
	});
</script>

<svelte:head>
	<title>Edit {data.exercise.name}</title>
</svelte:head>

<h1>Edit {data.exercise.name}</h1>

<form method="POST" use:enhance novalidate>
	<Control name="name" {validation} value={values.name}>
		{#snippet input(props)}
			<input {...props} type="text" required />
		{/snippet}
	</Control>

	<Control name="description" {validation} value={values.description}>
		{#snippet input(props)}
			<textarea {...props}></textarea>
		{/snippet}
	</Control>

	<Control name="duration" {validation} value={values.duration} help="Duration in seconds">
		{#snippet input(props)}
			<input {...props} type="number" min="0" />
		{/snippet}
	</Control>

	<Control name="instructions" {validation} value={values.instructions}>
		{#snippet input(props)}
			<textarea {...props}></textarea>
		{/snippet}
	</Control>

	<p>
		<button type="submit">Save Changes</button>
	</p>
</form>

<p><a href="/exercises/{data.exercise.label}">Cancel</a></p>
