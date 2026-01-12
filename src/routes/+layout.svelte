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
	</nav>
</header>

<main>
	{@render children()}
</main>

<style>
	header {
		background: var(--color-surface);
		border-bottom: 1px solid var(--color-border);
		padding: 1rem 2rem;
	}

	nav {
		display: flex;
		gap: 1.5rem;
	}

	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}
</style>
