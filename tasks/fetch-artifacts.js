import fetch from 'node-fetch';
import JSZip from 'jszip';
import fs from 'fs/promises';
import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

async function fetchFromGitHub(repo, workflow, artifact) {
	const token = process.env.GITHUB_TOKEN;
	const headers = { Authorization: `token ${token}` };

	const runsResponse = await fetch(
		`https://api.github.com/repos/${repo}/actions/workflows/${workflow}/runs`,
		{ headers }
	);
	const runs = await runsResponse.json();

	const latestRun = runs.workflow_runs[0];

	const artifactsResponse = await fetch(latestRun.artifacts_url, { headers });
	const artifacts = await artifactsResponse.json();

	const targetArtifact = artifacts.artifacts.find((a) => a.name === artifact);

	if (!targetArtifact) {
		throw new Error(`Artifact '${artifact}' not found`);
	}

	const downloadResponse = await fetch(targetArtifact.archive_download_url, { headers });
	const zipBuffer = await downloadResponse.buffer();

	const zip = await JSZip.loadAsync(zipBuffer);
	return zip;
}

async function ensureDirectoryExists(filePath) {
	const dirname = path.dirname(filePath);
	try {
		await fs.access(dirname);
	} catch (error) {
		if (error.code === 'ENOENT') {
			await fs.mkdir(dirname, { recursive: true });
		} else {
			throw error;
		}
	}
}

async function main() {
	try {
		const zip = await fetchFromGitHub('dominikus/sdga2025', 'cms-and-upload.yml', 'site-data');

		const outputDir = path.join(process.cwd(), 'static', 'data');
		await fs.mkdir(outputDir, { recursive: true });

		for (const [filename, file] of Object.entries(zip.files)) {
			if (filename.endsWith('.json')) {
				const content = await file.async('string');
				const outputPath = path.join(outputDir, filename);

				await ensureDirectoryExists(outputPath);
				await fs.writeFile(outputPath, content);

				console.log(`Wrote ${filename} to ${outputDir}`);
			}
		}

		console.log('Data fetch and write complete');
	} catch (error) {
		console.error('Error fetching build data:', error);
		process.exit(1);
	}
}

main();
