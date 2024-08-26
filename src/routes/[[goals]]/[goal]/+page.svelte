<script>
	export let data;

	$: content = data?.doc?.text?.replace(/\n/g, '<br/>');
	$: console.log(content);
</script>

<h1>test:</h1>
{@html content}
