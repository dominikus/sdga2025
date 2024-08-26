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
		let parsedGoal = goal;
		const response = await import(`$lib/data/${parsedGoal}/${parsedGoal}.json`);

		return { goal: parsedGoal, doc: response };
	} catch (e) {
		console.log(e);
		return { goal: 'goal00', doc: { content: [], config: {} } };
	}
}
