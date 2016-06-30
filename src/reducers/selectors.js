export const getComicManager = (state) => state.comics.comicManager;
export const getChapters = (state) => state.comics.chapters;

export const getNextChapterIndex = (chapters, cid) => {
	var index = chapters.findIndex(item => cid == item.cid);
	if (index != 0 && index-1 > -1) {
		return index - 1;
	} else {
		return -1;
	}
};

export const getPreviousChapterIndex = (chapters, cid) => {
	var index = chapters.findIndex(item => cid == item.cid);
	if (index != -1 && index+1 < chapters.length) {
		return index + 1;
	} else {
		return -1;
	}
};

export const getSearchState = (state) => state.searchState;
