<script>
	import { onMount } from 'svelte';
	import { inview } from 'svelte-inview';

	import mapper from '$lib/components/mapper.js';

	import parseProps from '$lib/util/parseProps.js';
	import translationKeyToId from '$lib/util/translationKeyToId.js';
	import { _ } from '$lib/i18n';

	let { data } = $props();
	let translation = $state(null);

	let isScreenshotting = false;

	onMount(() => {
		const fetchContent = async () => {
			const response = await fetch(
				`https://www.boredchess.club/sdga2025/data/${data?.goal}/${data?.goal}.json`
			);
			const doc = await response.json();
			console.log(doc);
			data = { ...data, ...doc };

			const translationResponse = await fetch(
				`https://www.boredchess.club/sdga2025/data/${data?.goal}/${data?.goal}.en.i18n.json`
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

	$inspect(content);

	$effect(() => {
		if (content) {
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
			{@const lolo = (() => {
				console.log('lfdshdsfhsd lolo hfsdudshuifiushuisdfsdfhiu', graphic);
			})()}

			{@const Component = mapper(
				'wide_scroller',
				/* TODO: fix inView */ true || onScreen.includes(index) || !browser || $isScreenshotting
			)}

			<Component {...c} {graphic} {shareTitle}>
				{@const yoyo = (() => {
					console.log('yoyof hiufsdsudifhhsudichuidsfhiudfshiu');
				})()}
				<svelte:fragment slot="graphic" let:activeScene let:parentWidth let:parentHeight>
					{@const gogo = (() => {
						console.log('gogo');
						console.log(c);
						console.log('gogo');
					})()}
					{#if graphic}
						{@const GraphicComponent = mapper(graphic)}
						<GraphicComponent {...c} type={graphic} {activeScene} {parentWidth} {parentHeight} />
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
			{@const arbo = (() => {
				console.log(content);
			})()}

			{@const Component = mapper(c.type, true)}
			<Component
				onScreen={/* TODO: fix inView */ true || onScreen.includes(index) || !browser}
				{...c}
			/>
		{/if}
	{/each}
{/if}
