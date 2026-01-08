import { fail, redirect } from '@sveltejs/kit';
import { exercise_api } from '$lib/api';
import { is_invalid } from '$lib/validation';

export const actions = {
	default: async ({ request }) => {
		const form_data = await request.formData();
		const input = {
			name: form_data.get('name') as string,
			label: (form_data.get('label') as string) || undefined,
			description: (form_data.get('description') as string) || null,
			duration: parseInt(form_data.get('duration') as string, 10) || 0
		};

		const result = exercise_api.create(input);

		if (is_invalid(result)) {
			return fail(400, {
				input,
				validation: result.validation
			});
		}

		redirect(303, `/exercises/${result.label}`);
	}
};
