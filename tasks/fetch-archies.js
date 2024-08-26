import fs from 'fs';
import { URL } from 'url';

import docs from '@googleapis/docs';
import drive from '@googleapis/drive';
import { autoType } from 'd3';
import { parse } from 'json2csv';

const DEFAULT_LOCALE = 'en';
const PRETTY_PRINT = true;

const SERVICE_ACCOUNT_EMAIL = 'sdga2025@sdga-2025.iam.gserviceaccount.com';

const IGNORED_FOR_TRANSLATIONS = [
	'id',
	'type',
	'password',
	'graphic',
	'url',
	'data',
	'path',
	'image',
	'target',
	'size',
	'goal',
	'publish_progress',
	'hidden',
	'code'
];
const TRANSLATION_PREFIX_KEY = 'translationPrefix';

const LIVE_PATH = './static/data';
const CSV_PATH = './static/data';
const TRANSLATIONS_PATH = './static/i18n';

const availableLocales = ['en'];
let locale = DEFAULT_LOCALE;

// parse command line arguments:
let FILTERS = process.argv.slice(2);

// see if we're skipping data processing
// (--skip-data) flag
const skipDataIndex = FILTERS.map((d) => d.toLowerCase()).indexOf('--skip-data');
let SKIP_DATA = false;
if (skipDataIndex > -1) {
	SKIP_DATA = true;
	FILTERS.splice(skipDataIndex, 1);
}

// locale selection:
// --locale flag
const localeFlagIndex = FILTERS.map((d) => d.toLowerCase()).indexOf('--locale');
if (localeFlagIndex > -1) {
	let selectedLocale =
		FILTERS.length >= localeFlagIndex + 1 ? FILTERS[localeFlagIndex + 1].toLowerCase() : '';

	if (availableLocales.includes(selectedLocale)) {
		locale = selectedLocale;
		console.log(`changing locale to ${selectedLocale}`);
	}

	// remove locale etc. from FILTERS:
	FILTERS.splice(localeFlagIndex, 2);
}

// from: https://stackoverflow.com/questions/35511331/how-to-make-a-valid-filename-from-an-arbitrary-string-in-javascript
function convertToSnakeCase(string) {
	return string.replace(/[\/|\\:*?"<>]/g, '_').toLowerCase();
}

const delay = (n) => new Promise((resolve) => setTimeout(resolve, n * 1000));

const parseDocBody = async (content, inlineObjects, goal) => {
	let result = '';
	for (const c of content) {
		if (c.paragraph) {
			for (const elem of c.paragraph.elements) {
				if (elem.textRun?.content) {
					const content = elem.textRun.content;

					// TODO: look for more styles:
					if (elem.textRun?.textStyle?.bold) {
						result += `[emphasis: ${content}]`;
					} else {
						result += content;
					}
				}

				if (elem?.inlineObjectElement?.inlineObjectId) {
					const inlineObjectId = elem.inlineObjectElement.inlineObjectId;
					const obj = inlineObjects[inlineObjectId];
					if (obj && obj?.inlineObjectProperties?.embeddedObject?.title) {
						const title = obj?.inlineObjectProperties?.embeddedObject?.title;
						result += `[embedded-object: ${inlineObjectId} ${title}]`;
					} else {
						result += `[embedded-object: ${inlineObjectId}]`;
					}
				}
			}
		}
	}

	return { result };
};

// GOOGLE AUTHENTICATIONS:
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
const gdocAuth = new docs.auth.GoogleAuth({
	credentials,
	scopes: ['https://www.googleapis.com/auth/documents.readonly']
});
const gdocAuthClient = await gdocAuth.getClient();

const docsClient = await docs.docs({
	version: 'v1',
	auth: gdocAuthClient
});

const gdriveAuth = new drive.auth.GoogleAuth({
	credentials,
	scopes: ['https://www.googleapis.com/auth/drive.readonly']
});
const gdriveAuthClient = await gdriveAuth.getClient();

const driveClient = await drive.drive({
	version: 'v3',
	auth: gdriveAuthClient
});

const fetchGoogleDoc = async ({ id }, goal) => {
	console.log(`fetching...${id}`);

	await delay(2);

	try {
		const res = await docsClient.documents.get({
			documentId: id,
			suggestionsViewMode: 'PREVIEW_WITHOUT_SUGGESTIONS'
		});
		if (res.status === 200) {
			const bod = await parseDocBody(res?.data?.body?.content, res?.data?.inlineObjects, goal);
			const filePath = new URL(`test.json`, import.meta.url).pathname;

			console.log(res.data);
			fs.writeFileSync(filePath, JSON.stringify(res.data, null, 2));

			const parsed = bod.result;
			return { parsed };
		}
	} catch (e) {
		console.log();
		if (e.internal) {
			console.log(`Couldn't parse Google Doc ${id}`);
			console.log(e);
		} else {
			console.log(`Couldn't load Google Doc ${id}`);
			console.log(`Make sure to share it with ${SERVICE_ACCOUNT_EMAIL}!`);
			console.log();
			console.log(`Actual error was:`);
			console.log(e);
			console.log(e.response.status);
			console.log(e.response.statusText);
		}

		return null;
	}
};

const fetchGoogleDriveMetadata = async (url) => {
	const googleURLtoID = (url) => url.match(/[-\w]{25,}(?!.*[-\w]{25,})/);

	await delay(2);

	const id = googleURLtoID(url);

	try {
		const metadata = await driveClient.files.get({ fileId: id });
		return metadata;
	} catch (e) {
		console.log(e);
		return null;
	}
};

const downloadFromGoogleDrive = async (url, path) => {
	const googleURLtoID = (url) => url.match(/[-\w]{25,}(?!.*[-\w]{25,})/);

	await delay(2);

	const id = googleURLtoID(url);

	const targetFile = fs.createWriteStream(path);
	await new Promise(async (resolve, reject) => {
		try {
			driveClient.files.get(
				{
					fileId: id,
					alt: 'media'
				},
				{ responseType: 'stream' },
				(err, { data }) => {
					if (err) throw err;

					data
						.on('end', () => resolve())
						.on('error', (err) => {
							throw err;
						})
						.pipe(targetFile);
				}
			);
		} catch (e) {
			console.log(e);
			reject();
		}
	});
};

const extractTranslations = (goal, archie) => {
	// translation keys are simply: goal + sequence of keys
	// recursively parse through all values of the archie object to generate them:
	const genKeys = (obj, keyPrefix) => {
		if (Array.isArray(obj)) {
			return obj
				.map((item, index) => {
					if (typeof item === 'object') {
						const indexKey = `#${index}`;

						// insert translationPrefix key into source object:
						item[TRANSLATION_PREFIX_KEY] = `${keyPrefix}.${indexKey}`;

						return genKeys(item, `${keyPrefix}.${indexKey}`);
					} else if (typeof item === 'string' || item instanceof String) {
						return { [`${keyPrefix}.${index}`]: item };
					} else {
						return null;
					}
				})
				.filter((d) => d);
		}

		if (typeof obj === 'string' || obj instanceof String) {
			return { [keyPrefix]: obj };
		}

		// regular object:
		obj[TRANSLATION_PREFIX_KEY] = keyPrefix;
		return Object.keys(obj)
			.filter((key) => IGNORED_FOR_TRANSLATIONS.indexOf(key) === -1)
			.map((key) => genKeys(obj[key], `${keyPrefix}.${key}`));
	};

	return genKeys(archie, `${goal}`);
};

function flatten(xs) {
	return xs.reduce((acc, val) => {
		if (Array.isArray(val)) {
			acc = acc.concat(flatten(val));
		} else {
			acc = acc.concat(val);
		}
		return acc;
	}, []);
}

// make sure translations path exists:
const translationsPath = new URL(`${TRANSLATIONS_PATH}`, import.meta.url).pathname;
if (!fs.existsSync(translationsPath)) {
	fs.mkdirSync(translationsPath, { recursive: true });
}

(async () => {
	const d = {
		filename: 'goal_test',
		googledoc: {
			en: '1anYAMgYlQtawR2Yu9a4UAZUpmhmklfEHiDEcSizy2Qc'
		}
	};
	try {
		// parse Google Docs file:
		const result = await fetchGoogleDoc({ id: d.googledoc[DEFAULT_LOCALE] }, d.filename);
		const parsed = { text: result.parsed };

		if (parsed) {
			// create /src/data/goalXX directory (for live data and .archie) if it doesn't exist:
			const archieDataPath = new URL(`${LIVE_PATH}/${d.filename}`, import.meta.url).pathname;
			if (!fs.existsSync(archieDataPath)) {
				fs.mkdirSync(archieDataPath, { recursive: true });
			}
			// ... same for the static csv files:
			const csvDataPath = new URL(`${CSV_PATH}/${d.filename}`, import.meta.url).pathname;
			if (!fs.existsSync(csvDataPath)) {
				fs.mkdirSync(csvDataPath, { recursive: true });
			}

			// save JSONified Google Doc file:
			const filePath = new URL(`${LIVE_PATH}/${d.filename}/${d.filename}.json`, import.meta.url)
				.pathname;
			const str = PRETTY_PRINT ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed);

			fs.writeFileSync(filePath, str);
			console.log('storing Google Doc in ' + filePath);
		}
	} catch (err) {
		console.log(err);
	}
})();
