<script>
	export let data;

	const fetchContent = async () => {
		const response = await fetch(`/data/${data?.goal}/${data?.goal}.json`);
		const doc = await response.json();
		data.content = doc;
	};

	$: if (data && data?.goal && !data.content) {
		fetchContent();
	}

	$: content = data?.content?.text?.replace(/\n/g, '<br/>');
	$: console.log(content);
</script>

<h1>test:</h1>
{@html content}
