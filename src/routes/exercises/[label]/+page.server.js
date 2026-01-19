import { error } from '@sveltejs/kit';
import { get_exercise, get_exercises_by_ids } from '$lib/server/api.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const exercise = await get_exercise(params.label);

	if (!exercise) {
		error(404, 'Exercise not found');
	}

	const alternatives = await get_exercises_by_ids(exercise.alternatives);

	return { exercise, alternatives };
}
