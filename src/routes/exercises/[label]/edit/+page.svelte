<script>
	import { enhance, applyAction } from '$app/forms';
	import { Control } from '$lib/index.js';
	import { validate_pending_exercise, is_invalid } from '$lib/entities.js';

	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	let { data, form } = $props();

	const exercise = $derived(form?.exercise ?? data.exercise);
</script>

<h1>Edit Exercise</h1>

<form
	novalidate
	method="post"
	action="?/update"
	use:enhance={({ formData, cancel }) => {
		const pending = /** @type {import('$lib/entities.js').PendingExercise} */ ({
			exercise: data.exercise.exercise,
			...Object.fromEntries(formData)
		});
		const result = validate_pending_exercise(pending);
		if (is_invalid(result)) {
			applyAction({
				type: 'failure',
				status: 422,
				data: { validation: result.validation, exercise: pending }
			});
			cancel();
		}
	}}
>
	<Control
		name="label"
		value={exercise.label}
		validation={form?.validation}
		help="URL-friendly identifier (lowercase letters, numbers, hyphens)"
	/>

	<Control
		name="name"
		value={exercise.name}
		validation={form?.validation}
		help="The name of the exercise"
	/>

	<Control
		name="description"
		value={exercise.description}
		validation={form?.validation}
		help="A short summary"
	>
		{#snippet input(provided)}
			<textarea {...provided}></textarea>
		{/snippet}
	</Control>

	<p>
		<button type="submit">Save</button>
		<a href="/exercises/{data.exercise.label}">Cancel</a>
	</p>
</form>

<hr />

<form method="post" action="?/delete" use:enhance>
	<p>
		<button type="submit">Delete</button>
	</p>
</form>
