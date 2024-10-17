import { readable } from 'svelte/store';

export const _ = readable((t) => {
	console.log(t);
	return t;
});

export const locale = 'en';
