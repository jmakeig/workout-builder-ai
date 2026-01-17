<script>
	import { enhance, applyAction } from '$app/forms';
	import { Control } from '$lib/index.js';
	import { validate_pending_exercise, is_invalid, slug } from '$lib/entities.js';

	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	let { data, form } = $props();

	const exercise = $derived(form?.exercise ?? data.exercise);
	// svelte-ignore state_referenced_locally
	let label = $state(data.exercise.label);

	/** @param {FocusEvent & { currentTarget: HTMLInputElement }} e */
	function populate_label(e) {
		if (!label) {
			label = slug(e.currentTarget.value);
		}
	}
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
		name="name"
		value={exercise.name}
		validation={form?.validation}
		help="The name of the exercise"
		onblur={populate_label}
	/>

	<Control
		name="label"
		bind:value={label}
		validation={form?.validation}
		help="URL-friendly identifier; defaults to a slug of the name"
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

	<div class="control actions">
		<button class="default" type="submit">Save</button>
		<a href="/exercises/{data.exercise.label}">Cancel</a>
	</div>
</form>

<hr />

<form method="post" action="?/delete" use:enhance>
	<div class="control actions">
		<button type="submit">Delete</button>
	</div>
</form>
