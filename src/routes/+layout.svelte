<script>
	import '$lib/styles/_variables.css';

	import '../styles/app.css';
	import '../styles/global.scss';
	import '../styles/vis.scss';

	import { onMount } from 'svelte';

	import variables from '$lib/variables.js';

	onMount(() => {
		// load fonts (dynamic paths aren't supported in CSS):

		const sty = document.createElement('style');
		sty.appendChild(
			document.createTextNode(`
    @font-face {
      font-family: 'Andes';
      font-weight: bold;
      src: url('${variables.pathPrefix}/assets/fonts/304244_0_0.eot');
      src: url('${variables.pathPrefix}/assets/fonts/304244_0_0.eot?#iefix') format('embedded-opentype'),
        url('${variables.pathPrefix}/assets/fonts/304244_0_0.woff2') format('woff2'),
        url('${variables.pathPrefix}/assets/fonts/304244_0_0.woff') format('woff'),
        url('${variables.pathPrefix}/assets/fonts/304244_0_0.ttf') format('truetype');
    }

    @font-face {
      font-family: 'Andes';
      src: url('${variables.pathPrefix}/assets/fonts/304244_1_0.eot');
      src: url('${variables.pathPrefix}/assets/fonts/304244_1_0.eot?#iefix') format('embedded-opentype'),
        url('${variables.pathPrefix}/assets/fonts/304244_1_0.woff2') format('woff2'),
        url('${variables.pathPrefix}/assets/fonts/304244_1_0.woff') format('woff'),
        url('${variables.pathPrefix}/assets/fonts/304244_1_0.ttf') format('truetype');
    }

    @font-face {
      font-family: 'loopicon';
      font-weight: normal;
      src: url("${variables.pathPrefix}/assets/fonts/loop_icon.eot?bmywp5"),
        url("${variables.pathPrefix}/assets/fonts/loop_icon.eot?bmywp5#iefix") format("embedded-opentype"),
        url("${variables.pathPrefix}/assets/fonts/loop_icon.ttf?bmywp5") format("truetype"),
        url("${variables.pathPrefix}/assets/fonts/loop_icon.woff?bmywp5") format("woff"),
        url("${variables.pathPrefix}/assets/fonts/loop_icon.svg?bmywp5#loopicon") format("svg");
    }
    `)
		);

		document.body.appendChild(sty);
	});
</script>

<div class="app">
	<main>
		<slot />
	</main>
</div>
