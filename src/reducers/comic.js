import {
	LOAD_NEXT_CHAPTER,
	LOAD_PREVIOUS_CHAPTER
} from '../constants/ActionTypes';

const initialState = {
	/*
	 * comics = {
	 *   "manhua-yiquanchaoren": [
	 *     {
	 *       title: "rtyukjkl"
	 *       link: "sfdafg"
	 *       cid: "asdfasdf",
	 *     },
	 *     {
	 *       title: "rtyukjkl"
	 *       link: "sfdafg"
	 *       cid: "12333"
	 *     }
	 *   ]
	 * }
	 */
	comics: {},

	/*
	 * a chapter object containing fetched chapter images
	 *  chapters = {
	 *    "12345": [ // cid
	 *      "fghjmnm,..png",
	 *      "fghjmnm,..png",
	 *      "fghjmnm,..png"
	 *    ]
	 *  }
	 */
	chapters: {},

	/*
	 *
	 readingChapters = [
	   {
		   cid: "",
		   images: [

		   ]
	   }
	 ]
	 */
	readingChapters: [],
	readingImages: [],
	readingIndex: null,

	comicManager: null
};

export default function comics(state = initialState, action) {
	switch(action.type) {

	case LOAD_NEXT_CHAPTER:
		return state;

	case LOAD_PREVIOUS_CHAPTER:
		return state;

	default:
		return state;
	}
}
