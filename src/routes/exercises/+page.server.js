import { list_exercises } from '$lib/server/api.js';

/** @type {import('./$types').PageServerLoad} */
export function load() {
	return {
		exercises: list_exercises()
	};
}
