export default function (translationKey, ignoreScenes = false) {
	let [goalNumberPrefix, ...contentId] = translationKey.split('.');

	if (ignoreScenes && translationKey.includes('scenes')) {
		// remove last two parts of the translation to drop the scenes description:
		contentId = contentId
			.slice(0, contentId.length - 3)
			.join('')
			.replace(/\#/g, '')
			.replace('content', 'c')
			.replace('translationPrefix', '');
	} else {
		contentId = contentId
			.join('')
			.replace(/\#/g, '')
			.replace('content', 'c')
			.replace('scenes', 's')
			.replace('translationPrefix', '');
	}

	return { goalNumberPrefix, contentId };
}
