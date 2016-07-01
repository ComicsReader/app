import 'whatwg-fetch';
import $ from 'jquery';

// TODO: initalize by comicID
export const regex = /http\:\/\/(tel||www)\.dm5\.com(\/m\d+\/)/;
export const baseURL = 'http://www.dm5.com';

export const chapterCountData = {};
export const chapterCache     = {};

export const siteName = 'dm5';

export function getChapters(comicID) {
	return new Promise((resolve) => {
		getComicInfo(comicID, 'chapters').then(chapters => resolve(chapters)).catch(error => ({error}));
	});
}

export function getComicName(comicID) {
	return new Promise((resolve) => {
		getComicInfo(comicID, 'comicName').then(comicName => resolve(comicName)).catch(error => ({error}));
	});
}

export function getComicInfo(comicID, type='chapters') {
	return new Promise((resolve) => {
		if (typeof chapterCache[comicID] === 'undefined') {
			chapterCache[comicID] = {};
		} else if (chapterCache[comicID].hasOwnProperty(type)) {
			resolve(chapterCache[comicID][type]);
			return;
		}

		fetchComicsInfo(comicID).then(info => {
			chapterCache[comicID].chapters = info.chapters;
			chapterCache[comicID].comicName = info.comicName;

			resolve(chapterCache[comicID][type]);
		}).catch(error => ({error}));
	});
}

export function fetchComicIDbyChapterID(chapterID) {
	return new Promise((resolve) => {
		fetch(`${baseURL}/${chapterID}`).then(r => r.text()).then(response => {
			var chapterIndex = $(response);
			var navigationItem = $(chapterIndex.find('.view_logo2.bai_lj').toArray()[0]);
			var urls = navigationItem.children('a').toArray().map((a) => $(a).attr('href'));

			var comicID = urls[urls.length-2].replace(/\//gi, '');
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
			var results = $html.find('.ssnrk').toArray().map(div => {
				$(div).find('.ssnr_bt a font').replaceWith('//////');

				var $chapter = $(div).find('.ssnr_yt .ff.mato10.sr_dlj.matoa a').first();
				var latestChapter = null;
				if (typeof $chapter !== 'undefined') {
					var href = $chapter.attr('href');
					if (typeof href !== 'undefined') {
						latestChapter = href.replace(/\//g, '');
					}
				}

				return({
					coverImage: $(div).find('.ssnr_yt img').first().attr('src'),
					comicName: $(div).find('.ssnr_bt a').text().split('//////')[0],
					comicID: $(div).find('.ssnr_bt a').attr('href').replace(/\//g, ''),
					latestChapter: latestChapter
				});
			});

			var total = parseInt($html.find('.flr strong').text());

			var res = {
				comics: results,
				currentPage: page,
				totalPage: Math.ceil(total/20)
			};
			resolve(res);
		}).catch(error => ({error}));
	});
}

export function fetchComicsInfo(comicID) {
	return new Promise((resolve) => {
		fetch(`${baseURL}/${comicID}/`,
			{
				credentials: 'include',
				headers: {'cookie': 'isAdult=1'}
			}
		).then(r => r.text()).then(response => {
			var comicIndex = $(response);
			var chapterInfos = comicIndex.find('.nr6.lan2>li>.tg').toArray().map((a) => {
				var _rawID = $(a).attr('href');
				return({
					title: $(a).attr('title'),
					link: joinBaseUrl(_rawID),
					cid: /^\/m(\d+)/.exec(_rawID)[1]
				});
			});

			resolve({
				chapters: chapterInfos,
				comicName: comicIndex.find('.inbt_title_h2')[0].innerHTML
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

			var imagesCount = chapterDoc.find('select#pagelist > option').length;
			chapterCountData[cid] = imagesCount;

			resolve(imagesCount);
		}).catch(error => ({error}));
	});
}

export function fetchImages(page, cid) {
	return new Promise((resolve) => {
		// imageFetchUrl: http://www.dm5.com/m251731/chapterfun.ashx?cid=251731&page=2
		fetch(`${imageFetchUrl(cid)}?${$.param({ cid: cid, page: page, key: null, language: 1 })}`).then(r => r.text()).then(imageJs => {
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
