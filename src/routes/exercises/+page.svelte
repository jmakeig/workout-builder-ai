<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Exercises</title>
</svelte:head>

<h1>Exercises</h1>

<p><a href="/exercises/new">Create new exercise</a></p>

<ul>
	{#each data.exercises as exercise}
		<li>
			<a href="/exercises/{exercise.label}">{exercise.name}</a>
			{#if exercise.description}
				— {exercise.description}
			{/if}
		</li>
	{/each}
</ul>
