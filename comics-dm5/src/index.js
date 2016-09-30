import 'fetch-everywhere';
import $ from 'isomorphic-parse';

const queryString = require('query-string');

// TODO: should support multiple regex
export const regex = /http\:\/\/(tel||www)\.dm5\.com(\/m\d+\/)/;
export const baseURL = 'http://www.dm5.com';

export const chapterCountData = {};
export const chapterCache     = {};

export const siteName = 'dm5';

const comicIDRegex = /^manhua\-\w+$/;
const chapterIDRegex = /^m\d+$/;
const cidRegex = /^\d+$/;

export function getComicInfo(comicID) {
	return new Promise((resolve, reject) => {
		if (typeof chapterCache[comicID] === 'undefined' || chapterCache[comicID] === null) {
			// initialize the cache item
			fetchComicsInfo(comicID).then(info => {
				chapterCache[comicID] = {...info, comicID: comicID};
				resolve(chapterCache[comicID]);
			}).catch(error => (reject({error})));
		} else {
			resolve(chapterCache[comicID]);
		}
	});
}

export function getComic(whateverID) {
	let chapterID = null;

	if (whateverID.match(comicIDRegex)) {
		return getComicInfo(whateverID);
	} else if (whateverID.match(chapterIDRegex)) {
		chapterID = whateverID;
	} else if (whateverID.match(cidRegex)) {
		chapterID = getChapterID(whateverID);
	} else {
		throw 'Invalid ID';
	}

	return new Promise((resolve) => {
		fetchComicIDbyChapterID(chapterID).then(comicID => resolve(getComicInfo(comicID)));
	});
}

export function fetchComicIDbyChapterID(chapterID) {
	return new Promise((resolve) => {
		fetch(`${baseURL}/${chapterID}`).then(r => r.text()).then(response => {
			var chapterIndex = $(response);
			var href = chapterIndex.find('.topToolBar a.left').first().attr('href');

			var comicID = href.replace(/\//gi, '');
			resolve(comicID);
		}).catch(error => ({error}));
	});
}

export function getChapterURL(cid) {
	return(`${baseURL}/m${cid}`);
}

export function quickSearch(keyword) {
	return new Promise((resolve) => {
		fetch(`http://www.dm5.com/search.ashx?t=${encodeURI(keyword)}`).then(r => r.text()).then(response => {
			var array = $(response).toArray().filter(r => $(r).hasClass('searchliclass')).map(li => {
				return {
					comicID: eval(/[^,]+?,[^,]+?[^,]+?,[^,]+?,([^,]+?),/g.exec($(li).attr('onmouseover'))[1]).replace(/\//g, ''),
					title: $(li).attr('title')
				};
			});
			resolve(array);
		}).catch(error => ({error}));
	});
}

export function search(keyword, page=1) {
	return new Promise((resolve) => {
		fetch(`http://www.dm5.com/search?title=${encodeURI(keyword)}&language=1&page=${page}`).then(r => r.text()).then(response => {

			var $html = $(response);
			var results = $html.find('.midBar .item').toArray().map(div => {

				var $chapter = $(div).find('a.value.red').first();

				var latestChapter = null;
				if (typeof $chapter !== 'undefined') {
					var href = $chapter.attr('href');
					if (typeof href !== 'undefined') {
						latestChapter = href.replace(/\//g, '');
					}
				}

				return({
					coverImage: $(div).find('img').first().attr('src'),
					comicName: $(div).find('a.title').text(),
					comicID: $(div).find('a').attr('href').replace(/\//g, ''),
					latestChapter: latestChapter // chapterID
				});
			});

			var pages = $html.find('.pager a').toArray().map(a => $(a).attr('href')).map(href => parseInt(href.match(/page=(\d+)/)[1]));

			var total = Math.max(...pages);

			var res = {
				comics: results,
				currentPage: page,
				totalPage: total
			};
			resolve(res);
		}).catch(error => ({error}));
	});
}

export function fetchComicsInfo(comicID) {
	return new Promise((resolve) => {
		fetch(`${baseURL}/${comicID}/`,
			{
				headers: {
					'accept-encoding': 'gzip, deflate, sdch',
					'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
					'Accept-Language': 'en-US,en;q=0.8,zh-TW;q=0.6,zh;q=0.4,ja;q=0.2',
					cookie: 'isAdult=1'
				}
			}
		).then(r => r.text()).then(response => {
			let comicIndex = $(response);
			let chapterInfos = comicIndex.find('.nr6.lan2 a.tg').toArray().map(a => {
				let _rawID = $(a).attr('href');
				let cid = /^\/m(\d+)/.exec(_rawID)[1];
				return({
					title: $(a).attr('title'),
					link: joinBaseUrl(_rawID),
					cid: cid,
					chapterID: `m${cid}`
				});
			});

			resolve({
				chapters: chapterInfos,
				comicName: comicIndex.find('.inbt h1').text(),
				coverImage: comicIndex.find('.innr91 img').attr('src'),
				latestChapter: getChapterID(chapterInfos[0].cid)
			});
		}).catch(error => ({error}));
	});
}

export function getChapterImages(cid) {
	if (cid[0] === 'm') { cid = cid.slice(1, cid.length); }
	// images comes in pairs, we only concat them in odd
	// [12] 23 [34] 45 [56] 67 [78] 89 [9]
	// [12] 23 [34] 45 [56] 67 [78] 89 [910] 10

	// 8 => 1 3 5 7 => (8+1) / 2
	// 9 => 1 3 5 7 9 => (9+1) / 2
	return new Promise((resolve) => {
		fetchImagesCount(cid).then(imagesCount => {
			Promise.all(
				[...Array(parseInt((imagesCount+1)/2)).keys()]
					.map(i => fetchImages(i*2 + 1, cid))
			).then(images => {
				images = images.reduce((prev, cur) => [...prev, ...cur], []);
				resolve(images);
			}).catch(error => ({error}));
		}).catch(error => ({error}));
	});
}

export function fetchImagesCount(cid) {
	// cache exist
	return new Promise((resolve) => {
		if (chapterCountData[cid]) {
			resolve(chapterCountData[cid]);
			return;
		}

		fetch(getChapterURL(cid)).then(r => r.text()).then(_html => {
			var chapterDoc = $(_html);

			var imagesCount = chapterDoc.find('.pageBar.bar.down.iList > a').length;
			chapterCountData[cid] = imagesCount;

			resolve(imagesCount);
		}).catch(error => ({error}));
	});
}

export function fetchImages(page, cid) {
	return new Promise((resolve) => {
		// imageFetchUrl: http://www.dm5.com/m251731/chapterfun.ashx?cid=251731&page=2
		fetch(`${imageFetchUrl(cid)}?${queryString.stringify({ cid: cid, page: page, key: null, language: 1 })}`, {
			headers: {
				Referer: 'http://www.dm5.com/'
			}
		}).then(r => r.text()).then(imageJs => {
			var images = eval(imageJs);
			// console.log(`fetchImages: ${images}`);
			resolve(images);
		}).catch(error => ({error}));
	});
}

export function comicURL(comicID) {
	return `${baseURL}/${comicID}`;
}

export function imageFetchUrl(cid) {
	return [baseURL, `m${cid}`, 'chapterfun.ashx'].join('/');
}

export function joinBaseUrl(url) {
	// bad workaround :p
	return(`${baseURL}${url}`);
}

export function getCID(chapterID) {
	return /^m(\d+)/.exec(chapterID)[1];
}

export function getChapterID(cid) {
	return(`m${cid}`);
}
