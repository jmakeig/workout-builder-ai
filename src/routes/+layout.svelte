<script>
	/** @type {{ children: import('svelte').Snippet }} */
	let { children } = $props();
</script>

<svelte:head>
	<title>Workout Builder AI</title>
</svelte:head>

<header>
	<nav>
		<a href="/">Home</a>
		<a href="/exercises">Exercises</a>
	</nav>
</header>

<main>
	{@render children()}
</main>

<style>
	header {
		border-bottom: 1px solid var(--color-border);
		padding: 1rem 0;
		margin-bottom: 1rem;
	}

	nav {
		display: flex;
		gap: 1.5rem;
	}
</style>
