import { list_exercises } from '$lib/server/api.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {
		exercises: await list_exercises()
	};
}
