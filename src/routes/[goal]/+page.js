import { browser } from '$app/environment';

export async function load({ params, fetch }) {
	let { goal } = params;

	// if goal doesn't exist, use location
	if (!goal && browser) {
		const pathParts = document?.location?.pathname?.split('/');
		if (pathParts.length > 0) {
			goal = pathParts[pathParts.length - 1];
		}
	}

	console.log('yolo:', params, goal);

	try {
		let parsedGoal = goal.replace('.html', '');
		//const response = await fetch(`/data/${parsedGoal}/${parsedGoal}.json`);
		//const doc = await response.json();

		return { goal: parsedGoal, doc: {} };
	} catch (e) {
		console.log(e);
		return { goal: 'goal00', doc: { content: [], config: {} } };
	}
}
