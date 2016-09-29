import * as dm5 from 'comics-dm5';

const selectComicManager = (site) => {
	switch(site) {
	case 'dm5':
		return dm5;
	default:
		return dm5;
	}
};

export default {
	dm5,
	selectComicManager
};
