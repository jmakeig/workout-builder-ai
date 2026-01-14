import { error } from '@sveltejs/kit';
import { get_exercise } from '$lib/server/api.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const exercise = await get_exercise(params.label);

	if (!exercise) {
		error(404, 'Exercise not found');
	}

	return { exercise };
}
