<script>
	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
</script>

<h1>Exercises</h1>

<p><a href="/exercises/new">New Exercise</a></p>

{#if data.exercises.length === 0}
	<p>No exercises yet.</p>
{:else}
	<ul>
		{#each data.exercises as exercise}
			<li>
				<a href="/exercises/{exercise.label}">{exercise.name}</a>
			</li>
		{/each}
	</ul>
{/if}
