export const getComicManager = (state) => state.comics.comicManager;
export const getChapters = (state) => state.comics.chapters;
export const getComicID = (state) => state.comics.comicID;

export const getNextChapterIndex = (chapters, chapterID) => {
	var index = chapters.findIndex(item => item.chapterID == chapterID);
	if (index != 0 && index-1 > -1) {
		return index - 1;
	} else {
		return -1;
	}
};

export const getPreviousChapterIndex = (chapters, chapterID) => {
	var index = chapters.findIndex(item => item.chapterID == chapterID);
	if (index != -1 && index+1 < chapters.length) {
		return index + 1;
	} else {
		return -1;
	}
};

export const getSearchState = (state) => state.searchState;
