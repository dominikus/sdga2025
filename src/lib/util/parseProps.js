import translationKeyToId from '$lib/util/translationKeyToId.js';
import { locale } from '$lib/i18n';
import variables from '$lib/variables.js';

let idCounter = 0;

// parseProps replaces all props for a given archie object
// with their translations (in case TRANSLATION_PREFIX_KEY is set)
// and its DATA_PATH_KEY attribute with the loaded data file as DATA_OUTPUT_KEY.
function parseProps(content, ignoreTranslationKeys = false, translate, shareUrl) {
	const TRANSLATION_PREFIX_KEY = 'translationPrefix';
	const DATA_PATH_KEY = 'path';
	const DATA_OUTPUT_KEY = 'data';
	const DATA_DOWNLOAD_KEY = 'dataDownloadUrl';
	const SHARE_URL_KEY = 'shareUrl';
	const DOWNLOAD_IMG_KEY = 'shareImg';
	const ANCHOR_KEY = 'anchorKey';

	// short-cut for pure array entries:
	if (Array.isArray(content)) {
		return content.map((d) => parseProps(d, ignoreTranslationKeys, translate, shareUrl));
	}

	const keyPrefix = content[TRANSLATION_PREFIX_KEY];

	/*
	(hopefully?) obsolete data handling:
	const dataPath = content[DATA_PATH_KEY];

	if (dataPath) {
		content[DATA_OUTPUT_KEY] = _data[dataPath] ?? [];
		content[DATA_DOWNLOAD_KEY] = base + '/' + dataPath.replace('.json', '.csv');
	}
		*/

	// ignore if it doesn't have a translation prefix:
	if (!keyPrefix && !ignoreTranslationKeys) {
		return content;
	}

	// try to translate all props:
	return Object.keys(content).reduce((acc, key) => {
		// recursively translate objects:
		if (typeof content[key] === 'object') {
			if (Array.isArray(content[key])) {
				acc[key] = content[key].map((d) =>
					parseProps(d, ignoreTranslationKeys, translate, shareUrl)
				);
			} else {
				acc[key] = parseProps(content[key], ignoreTranslationKeys, translate, shareUrl);
			}
			return acc;
		}

		const translationKey = ignoreTranslationKeys ? key : `${keyPrefix}.${key}`;
		let translation = '' + translate(translationKey);

		if (
			translationKey.endsWith(TRANSLATION_PREFIX_KEY) &&
			(content?.type === 'vis' || content?.type?.startsWith('scene'))
		) {
			const { goalNumberPrefix, contentId } = translationKeyToId(translationKey, false);
			content[SHARE_URL_KEY] = `${shareUrl.origin + shareUrl.pathname}?lang=${locale}#${contentId}`;
			content[DOWNLOAD_IMG_KEY] =
				`https://${variables.shareHostname}/${locale}/${goalNumberPrefix}/${contentId}.png`;
			content[ANCHOR_KEY] = contentId;
		}

		if (!ignoreTranslationKeys && translation === translationKey) {
			// no translation available - put back whatever you found there:
			acc[key] = content[key];
		} else {
			// inserts can be '[footnote: ', '[reference: ', '[link: ', '[emphasis: ' ...

			//const insertRegEx = /\[\s*?(\w+):\s*?(.+?)\]/gim;
			//const bracketsRegEx = /(\[\w+:\s*?)|(\])/gim;
			const bracketsRegEx = /(\[)|(\])/gim;

			if (ignoreTranslationKeys) {
				if (content[key] && typeof content[key] === 'string') {
					translation = content[key];
				} else {
					// don't parse non-string/empty attributes like data, even when ignoring translation keys:
					acc[key] = content[key];
					return acc;
				}
			}

			const parts = translation.split(bracketsRegEx).filter((d) => d && d !== '""');

			let stack = [];
			const origObj = { type: 'text', value: [] };
			let obj = origObj;

			let goingDeeper = false;
			let foundType = true;

			stack.push(obj);
			for (let i = 0; i < parts.length; i++) {
				let p = parts[i];
				if (p.startsWith('[')) {
					// go deeper
					goingDeeper = true;
				} else if (p.startsWith(']') && stack.length > 1) {
					if (foundType) {
						// move outwards
						stack.pop();
						obj = stack[stack.length - 1];
					} else {
						foundType = true;
						obj.value.push(']');
					}
				} else {
					// we've gone deeper (previous character was a '[') and are looking for the type:
					if (goingDeeper) {
						const type = p.match(/(\w+): /)?.[1];
						if (type) {
							foundType = true;
							let newObj = { type, value: [] };
							obj.value.push(newObj);
							obj = newObj;
							stack.push(newObj);

							// cut off type: from input:
							p = p.replace(`${type}: `, '');
						} else {
							// couldn't find type - leave everything alone:
							p = '[' + p;
							foundType = false;
						}
						goingDeeper = false;
					}
					// append current obj
					if (p.length > 0) {
						obj.value.push(p);
					}
				}
			}
			obj = origObj;
			let highlights = [];

			const formatPart = (obj) => {
				if (typeof obj === 'string') {
					return obj;
				}

				let skipMiddle = false;
				let t = '';
				if (Array.isArray(obj.value)) {
					if (obj.type === 'link') {
						let [url, ...linkText] = obj.value[0].trim().split(' ');
						linkText = linkText.join(' ');
						// append the rest of the link:
						if (obj.value.length > 1) {
							linkText += obj.value.slice(1)?.join('');
						}

						return `<a href='${url}' title='${linkText}' target='blank'>${linkText}</a>`;
					}
					const uniqueId = `${obj.type}_` + new Date().getTime() + idCounter++;
					let reference;
					let hasNewReference = false;

					if (obj.type === 'emphasis') {
						t += `<span class="emphasis">`;
					} else if (obj.type === 'footnote') {
						t += `<div class="summary"> <div class="bg" aria-label="footnote"><label class="footnote" aria-hidden="true" for='${uniqueId}'>i</label></div><input type="checkbox" role="switch" aria-label="read footnote" id='${uniqueId}'/><div class="details">`;
					} else if (obj.type === 'chapterlink') {
						const [chapternum, ...text] = obj.value[0].trim().split(' ');
						t += `<a href="${generateChapterURL(chapternum)}">${text.join(' ')}</a>`;

						highlights.push(+chapternum);

						skipMiddle = true;
					} else if (obj.type === 'chapterurl') {
						const [chapternum, ...text] = obj.value[0].trim().split(' ');
						t += shareUrl.href;

						highlights.push(+chapternum);

						skipMiddle = true;
					} else if (obj.type === 'target' || obj.type === 'goal') {
						const [number, ...text] = obj.value[0].trim().split(' ');
						const [go, ...te] = number.split('.');

						let prefixLabel;
						if (obj.type === 'target') {
							prefixLabel = translate('base.sdg') + ' ' + translate('base.target') + ' ';
							if (prefixLabel === 'base.sdg base.target ') {
								prefixLabel = 'SDG Target ';
							}
						} else {
							prefixLabel = translate('base.sdg') + ' ';
							if (prefixLabel === 'base.sdg ') {
								prefixLabel = 'SDG ';
							}
						}

						// add highlighted goals to explicit highlights array
						highlights.push(go);

						t += `<div class="summary targ" style="--sdg-color: var(--color-un-sdg${go}); --sdg-text-color: var(--color-un-text-sdg${go})"
              onmouseenter="window.sdga2023_highlightGoal(${go})"
              onmouseleave="window.sdga2023_lowlightGoal(${go})"
              ><input type="checkbox" id='${uniqueId}' aria-hidden="true" /><label class="unstyled" for='${uniqueId}'><p class="goal-target">${prefixLabel}<span class="goal">${go}${
								te.length > 0 ? `.</span><span class="target">${te.join('.')}</span>` : '</span>'
							}</p></label><p class="details goal-details"><span class="target">${translate('target.' + number)}</span></p></div>`;

						skipMiddle = true;
					} else if (obj.type === 'reference') {
						const completeText = JSON.stringify(obj.value).replace(/[\s\,\"]/g, '');

						let refIndex = references.map((ref) => ref?.text).indexOf(completeText);
						if (refIndex === -1) {
							reference = { text: completeText, index: references.length, formatted: '' };
							hasNewReference = true;
						} else {
							reference = references[refIndex];
						}
						t += `<div class="summary reference ${reference.index + 1 > 9 ? 'wide' : ''}"><div class="bg" aria-label="reference ${
							reference.index + 1
						}"><label for='${uniqueId}' aria-hidden="true">${
							reference.index + 1
						}</label></div><input type="checkbox" role="switch" aria-label="read reference" id='${uniqueId}'/><div class="details">`;
					}

					if (!skipMiddle) {
						obj.value.forEach((o) => {
							const formatted = formatPart(o);
							t += formatted;
							if (hasNewReference) reference.formatted += formatted;
						});
					}

					if (obj.type === 'emphasis') {
						t += `</span>`;
					} else if (obj.type === 'footnote' || obj.type === 'reference') {
						t += `</div></div>`;
					}

					if (hasNewReference) {
						references = [...references, reference];
					}
				}

				return t;
			};

			translation = formatPart(obj);

			acc[key] = translation;
			if (highlights.length > 0) {
				if (acc.highlights) {
					acc.highlights = [...acc.highlights, ...highlights];
				} else {
					acc.highlights = highlights;
				}
			}
		}
		return acc;
	}, {});
}

export default parseProps;
