import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadGoogleCredentials() {
	// Check for credentials in environment variable
	if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
		try {
			// If it's a JSON string, parse it
			return JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
		} catch {
			// If it's a file path, read the file
			return JSON.parse(await fs.readFile(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8'));
		}
	}

	// Check for credentials file in project root
	const credentialsPath = path.join(__dirname, 'sdga-2025-c08a860b7dff.json');
	try {
		return JSON.parse(await fs.readFile(credentialsPath, 'utf8'));
	} catch (error) {
		if (error.code !== 'ENOENT') throw error;
	}

	throw new Error(
		'Google credentials not found. Please set GOOGLE_APPLICATION_CREDENTIALS or create google-credentials.json in the project root.'
	);
}

// Load and set the credentials in the environment
loadGoogleCredentials()
	.then((credentials) => {
		process.env.GOOGLE_CREDENTIALS = JSON.stringify(credentials);
		// Import and run the main script
		return import('./tasks/fetch-archies.js');
	})
	.catch((error) => {
		console.error('Error setting up environment:', error);
		process.exit(1);
	});
