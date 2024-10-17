import {
	WideSideBySide,
	Scene,
	TextBlock,
	UnknownComponent,
	VisContainer,
	Loading,
	SimpleVis
} from './index.js';

export const mapping = {
	wide_scroller: WideSideBySide,
	scroller: WideSideBySide,
	visContainer: VisContainer,
	vis: VisContainer,
	text: TextBlock,
	scene: Scene,

	simplevis: SimpleVis

	// goal 01
	// povertyscroller: ['goal01', 'PovertyLineScroller'],
};

export default (contentType, inView = true) => {
	if (inView) {
		if (mapping.hasOwnProperty(contentType)) {
			return mapping[contentType];
		}

		return UnknownComponent;
	}

	return Loading;
};
