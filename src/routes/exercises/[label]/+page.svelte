<script>
	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
</script>

<h1>{data.exercise.name}</h1>

<dl>
	<dt>Label</dt>
	<dd><code>{data.exercise.label}</code></dd>

	<dt>Description</dt>
	<dd>{data.exercise.description || '(none)'}</dd>
</dl>

<p>
	<a href="/exercises/{data.exercise.label}/edit">Edit</a>
	<a href="/exercises">Back to list</a>
</p>
