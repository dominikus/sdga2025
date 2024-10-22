<script>
	import { onMount } from 'svelte';
	import { inview } from 'svelte-inview';

	import mapper from '$lib/components/mapper.js';

	import parseProps from '$lib/util/parseProps.js';
	import translationKeyToId from '$lib/util/translationKeyToId.js';
	import { _ } from '$lib/i18n';
	import { tsvParse } from 'd3';

	let { data } = $props();
	let translation = $state(null);

	let isScreenshotting = false;

	const BACKEND_URL = `https://www.boredchess.club/sdga2025/data`;

	onMount(() => {
		const fetchContent = async () => {
			const response = await fetch(`${BACKEND_URL}/${data?.goal}/${data?.goal}.json`);
			const doc = await response.json();
			console.log(doc);
			data = { ...data, ...doc };

			const translationResponse = await fetch(
				`${BACKEND_URL}/${data?.goal}/${data?.goal}.en.i18n.json`
			);
			const trdoc = await translationResponse.json();
			translation = trdoc;
		};

		console.log(data);

		if (data && data?.goal && !data.content) {
			fetchContent();
		}
	});

	const translate = (tKey) => {
		if (translation.hasOwnProperty(tKey)) {
			return translation[tKey];
		} else {
			return tKey;
		}
	};

	const shareUrl = {
		origin: '',
		pathname: '',
		href: ''
	};

	let content = $derived(
		data?.content && translation ? parseProps(data, false, translate, shareUrl) : null
	);

	let dataFetchers = $state({});

	const fetchFromDataCommand = async (dataId) => {
		_data[dataId] = [];
		dataFetchers[dataId] = new Promise(async (resolve, reject) => {
			try {
				const remoteData = await fetch(`${BACKEND_URL}/${data?.goal}/${dataId}.tsv`);
				const trdoc = await remoteData.text();
				const trtsv = tsvParse(trdoc);

				_data[dataId] = trtsv;
				resolve(trtsv);
			} catch (e) {
				reject(e);
			}
		});
	};

	const fetchData = (content) => {
		if (Array.isArray(content)) {
			for (let c of content) {
				fetchData(c);
			}
		} else if (typeof content === 'object') {
			if (content.type === 'data') {
				fetchFromDataCommand(content.data);
			}

			Object.values(content).forEach((val) => {
				fetchData(val);
			});
		}
	};

	let _data = $state({});

	$inspect(content);

	$effect(() => {
		if (content) {
			// find [data: ] attributes within content:
			console.log('fetching data');
			fetchData(content);
		}
	});

	let isFetchingTranslations = false;

	let shareTitle = $derived(data?.goal);

	let onScreen = $state([]);
	function indexEntering(index) {
		if (onScreen.indexOf(index) === -1) {
			onScreen = [...onScreen, index];
		}
	}

	function highlightGoals(content) {
		/*const matches = content?.highlights;

    if (matches && matches.length > 0 && !$highlightedGoals.some((d) => d.id === content?.translationPrefix)) {
      let newEntries = [];
      matches.forEach((m) => {
        const goal = +m;
        const goalObj = {
          goal,
          id: content.translationPrefix,
          open: false,
          hovered: false
        };

        newEntries.push(goalObj);
      });
      $highlightedGoals = [...$highlightedGoals, ...newEntries];
    }*/
	}
	function unhighlightGoals(content) {
		//$highlightedGoals = [...$highlightedGoals.filter((d) => d.id !== content?.translationPrefix)];
	}
</script>

{#if content}
	{#each content.content as c, index}
		{#if Array.isArray(c)}
			{@const graphic = c.find((d) => d.hasOwnProperty('vis')).vis}
			{@const dataEntry = c.find((d) => d?.type === 'data')}

			{@const Component = mapper(
				'wide_scroller',
				/* TODO: fix inView */ true || onScreen.includes(index) || !browser || $isScreenshotting
			)}

			<Component {...c} {graphic} {shareTitle}>
				<svelte:fragment slot="graphic" let:activeScene let:parentWidth let:parentHeight>
					{#if graphic}
						{@const GraphicComponent = mapper(graphic)}
						<GraphicComponent
							{...c}
							type={graphic}
							{activeScene}
							{parentWidth}
							{parentHeight}
							data={_data.hasOwnProperty(dataEntry?.data)
								? $state.snapshot(_data[dataEntry?.data])
								: []}
						/>
					{/if}
				</svelte:fragment>
				<svelte:fragment slot="scenes">
					{@const scenes = Object.values(c.filter((d) => d?.type === 'scene'))}
					{#if scenes}
						{#each scenes as scene, sceneIndex (data?.goal + index + '-' + sceneIndex)}
							{#if content?.translationPrefix}
								<a name={translationKeyToId(scene.translationPrefix).contentId} />
							{/if}
							<div
								class="observer navigation-highlights"
								use:inview={{
									rootMargin:
										'50% 0px 0% 0px' /* scenes are shifted downwards, so we have to adjust their observers' rootMargin accordingly */
								}}
								on:enter={() => {
									highlightGoals /* TODO: fix */();
									/*contentProps[index + '_' + sceneIndex]*/
									indexEntering(index);
								}}
								on:leave={() => {
									unhighlightGoals(scene);
								}}
							/>

							{@const SceneComponent = mapper(scene.type)}
							<SceneComponent {...scene} text={scene.text} type={scene.type} />
						{/each}
					{/if}
				</svelte:fragment>
			</Component>
		{:else}
			{@const Component = mapper(c.type, true)}
			<Component
				onScreen={/* TODO: fix inView */ true || onScreen.includes(index) || !browser}
				{...c}
			/>
		{/if}
	{/each}
{/if}
