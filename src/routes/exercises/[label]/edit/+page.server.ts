import { error, fail, redirect } from '@sveltejs/kit';
import { exercise_api } from '$lib/api';
import { is_invalid } from '$lib/validation';

export function load({ params }) {
	const exercise = exercise_api.get(params.label);

	if (!exercise) {
		error(404, 'Exercise not found');
	}

	return {
		exercise: {
			label: exercise.label,
			name: exercise.name,
			description: exercise.description,
			duration: exercise.duration,
			instructions: exercise.instructions
		}
	};
}

export const actions = {
	default: async ({ params, request }) => {
		const form_data = await request.formData();
		const input = {
			name: form_data.get('name') as string,
			description: (form_data.get('description') as string) || null,
			duration: parseInt(form_data.get('duration') as string, 10) || 0,
			instructions: (form_data.get('instructions') as string) || null
		};

		const result = exercise_api.update(params.label, input);

		if (is_invalid(result)) {
			return fail(400, {
				input,
				validation: result.validation
			});
		}

		redirect(303, `/exercises/${params.label}`);
	}
};
