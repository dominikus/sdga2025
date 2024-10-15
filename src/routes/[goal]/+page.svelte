<script>
	import { onMount } from 'svelte';
	import { tsvParse } from 'd3';

	export let data;

	onMount(() => {
		const fetchContent = async () => {
			const response = await fetch(
				`https://www.boredchess.club/sdga2025/data/${data?.goal}/${data?.goal}.csv`
			);
			const doc = await response.text();
			data.content = doc; //tsvParse(doc)?.[0];
		};

		if (data && data?.goal && !data.content) {
			fetchContent();
		}
	});

	$: content = data?.content?.replaceAll(/\\n/g, '<br/>');
	$: console.log(content);
</script>

<h1>test:</h1>
{@html content}
