import { error } from '@sveltejs/kit';
import { exercise_api } from '$lib/api';

export function load({ params }) {
	const exercise = exercise_api.get(params.label);

	if (!exercise) {
		error(404, 'Exercise not found');
	}

	return {
		exercise: exercise.toJSON()
	};
}
