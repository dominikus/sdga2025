<script>
	import { onMount } from 'svelte';

	import DynamicComponent from '$lib/components/DynamicComponent.svelte';
	import mapper from '$lib/components/mapper.js';

	import parseProps from '$lib/util/parseProps.js';

	export let data;
	let translation;

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

		if (data && data?.goal && !data.content) {
			fetchContent();
		}
	});

	const translate = (key) => translation[key];

	$: content = data?.content && translation ? data /* parseProps(data, false, translate)*/ : null;
	$: console.log(content);

	let onScreen = [];
	let isFetchingTranslations = false;
	$: shareTitle = data?.goal;
</script>

<h1>test:</h1>
{#if content}
	{#each content.content as c, i}
		{#if Array.isArray(c)}
			<svelte:component
				this={mapper(
					c.type,
					/* TODO: fix inView */ true || onScreen.includes(index) || !browser || $isScreenshotting
				)}
				{...c}
				let:activeScene
				let:parentWidth
				let:parentHeight
				{shareTitle}
			>
				<svelte:fragment slot="graphic">
					{#if c.graphic}
						<DynamicComponent
							thiz={mapper(c.graphic)}
							{...c}
							type={content.graphic}
							{activeScene}
							{parentWidth}
							{parentHeight}
						/>
					{/if}
				</svelte:fragment>
				<svelte:fragment slot="scenes">
					{#if c.scenes}
						{#each c.scenes as scene, sceneIndex (archie?.config?.goal + index + '-' + sceneIndex)}
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
									highlightGoals(contentProps[index + '_' + sceneIndex]);
									indexEntering(index);
								}}
								on:leave={() => {
									unhighlightGoals(scene);
								}}
							/>

							<DynamicComponent
								thiz={mapper(scene.type)}
								{...contentProps[index + '_' + sceneIndex]}
								type={scene.type}
								{activeScene}
							/>
						{/each}
					{/if}
				</svelte:fragment>
			</svelte:component>
		{:else}
			{@const arbo = (() => {
				console.log(content);
			})()}
			<DynamicComponent
				thiz={mapper(c.type, true)}
				onScreen={/* TODO: fix inView */ true || onScreen.includes(index) || !browser}
				{...c}
			/>
		{/if}
	{/each}
{/if}
