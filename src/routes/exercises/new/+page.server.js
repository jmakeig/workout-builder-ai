import { fail, redirect } from '@sveltejs/kit';
import { create_exercise } from '$lib/server/api.js';
import { is_invalid } from '$lib/entities.js';

/** @type {import('./$types').Actions} */
export const actions = {
	create: async ({ request }) => {
		const form_data = await request.formData();
		/** @type {import('$lib/entities.js').PendingExercise} */
		const pending = {
			label: form_data.get('label')?.toString() ?? null,
			name: form_data.get('name')?.toString() ?? null,
			description: form_data.get('description')?.toString() ?? null
		};

		const result = create_exercise(pending);

		if (is_invalid(result)) {
			return fail(422, {
				exercise: result.exercise,
				validation: result.validation
			});
		}

		redirect(303, `/exercises/${result.label}`);
	}
};
