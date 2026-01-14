<script>
	import { enhance, applyAction } from '$app/forms';
	import { Control } from '$lib/index.js';
	import { validate_pending_exercise, is_invalid } from '$lib/entities.js';

	/** @type {{ form: import('./$types').ActionData }} */
	let { form } = $props();
</script>

<h1>New Exercise</h1>

<form
	novalidate
	method="post"
	action="?/create"
	use:enhance={({ formData, cancel }) => {
		const pending = /** @type {import('$lib/entities.js').PendingExercise} */ ({
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
		name="name"
		value={form?.exercise?.name}
		validation={form?.validation}
		help="The name of the exercise"
	/>

	<Control
		name="label"
		value={form?.exercise?.label}
		validation={form?.validation}
		help="URL-friendly identifier; defaults to a slug of the name"
	/>

	<Control
		name="description"
		value={form?.exercise?.description}
		validation={form?.validation}
		help="A short summary"
	>
		{#snippet input(provided)}
			<textarea {...provided}></textarea>
		{/snippet}
	</Control>

	<div class="control actions">
		<button class="default" type="submit">Create</button>
		<a href="/exercises">Cancel</a>
	</div>
</form>
