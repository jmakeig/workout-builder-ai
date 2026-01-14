import { error, fail, redirect } from '@sveltejs/kit';
import { get_exercise, update_exercise, delete_exercise } from '$lib/server/api.js';
import { is_invalid } from '$lib/entities.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const exercise = await get_exercise(params.label);

	if (!exercise) {
		error(404, 'Exercise not found');
	}

	return { exercise };
}

/** @type {import('./$types').Actions} */
export const actions = {
	update: async ({ request, params }) => {
		const existing = await get_exercise(params.label);
		if (!existing) {
			error(404, 'Exercise not found');
		}

		const form_data = await request.formData();
		/** @type {import('$lib/entities.js').PendingExercise} */
		const pending = {
			exercise: existing.exercise,
			label: form_data.get('label')?.toString() ?? null,
			name: form_data.get('name')?.toString() ?? null,
			description: form_data.get('description')?.toString() ?? null
		};

		const result = await update_exercise(pending);

		if (is_invalid(result)) {
			return fail(422, {
				exercise: result.exercise,
				validation: result.validation
			});
		}

		redirect(303, `/exercises/${result.label}`);
	},

	delete: async ({ params }) => {
		await delete_exercise(params.label);
		redirect(303, '/exercises');
	}
};
