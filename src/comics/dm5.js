import 'whatwg-fetch';
import $ from 'jquery';

import Base from './base';

// TODO: initalize by comicID

export default class DM5 extends Base {
	static regex = /http\:\/\/(tel||www)\.dm5\.com(\/m\d+\/)/;
	static baseURL = 'http://www.dm5.com';

	static chapterCountData = {};
	static chapterCache     = {};

	static getChapters(comicID) {
		return new Promise((resolve, reject) => {
			this.getComicInfo(comicID, 'chapters').then(chapters => resolve(chapters))
		});
	}

	static getComicName(comicID) {
		return new Promise((resolve, reject) => {
			this.getComicInfo(comicID, 'comicName').then(comicName => resolve(comicName))
		});
	}

	static getComicInfo(comicID, type='chapters') {
		return new Promise((resolve, reject) => {
			if (typeof this.chapterCache[comicID] === 'undefined') {
				this.chapterCache[comicID] = {}
			} else if (this.chapterCache[comicID].hasOwnProperty(type)) {
				resolve(this.chapterCache[comicID][type]);
				return;
			}

			this.fetchComicsInfo(comicID).then(info => {
				this.chapterCache[comicID].chapters = info.chapters;
				this.chapterCache[comicID].comicName = info.comicName;

				resolve(this.chapterCache[comicID][type]);
			})
		});
	}

	static fetchComicIDbyChapterID(chapterID) {
		return new Promise((resolve, reject) => {
			fetch(`${this.baseURL}/${chapterID}`).then(r => r.text()).then(response => {
				var chapterIndex = $(response);
				var navigationItem = $(chapterIndex.find('.view_logo2.bai_lj').toArray()[0]);
				var urls = navigationItem.children('a').toArray().map((a) => $(a).attr('href'));

				var comicID = urls[urls.length-2].replace(/\//gi, '');
				resolve(comicID);
			});
		});
	}

	static getChapterURL(cid) {
		return(`${this.baseURL}/m${cid}`);
	}

	static quickSearch(keyword) {
		return new Promise((resolve, reject) => {
			fetch(`http://www.dm5.com/search.ashx?t=${encodeURI(keyword)}`).then(r => r.text()).then(response => {
				var array = $(response).toArray().filter(r => $(r).hasClass('searchliclass')).map(li => {
					return {
						comicID: eval(/[^,]+?,[^,]+?[^,]+?,[^,]+?,([^,]+?),/g.exec($(li).attr('onmouseover'))[1]).replace(/\//g, ''),
						title: $(li).attr('title')
					}
				})
				resolve(array);
			})
		});
	}

	static search(keyword, page=1) {
		return new Promise((resolve, reject) => {
			fetch(`http://www.dm5.com/search?title=${encodeURI(keyword)}&language=1&page=${page}`).then(r => r.text()).then(response => {

				var $html = $(response);
				var results = $html.find('.ssnrk').toArray().map(div => {
					$(div).find('.ssnr_bt a font').replaceWith('//////');

					var $chapter = $(div).find('.ssnr_yt .ff.mato10.sr_dlj.matoa a').first()
					var latest_chapter = null;
					if ($chapter !== 'undefined') { latest_chapter = $chapter.attr('href').replace(/\//g, '') }

					return({
						cover_img: $(div).find('.ssnr_yt img').first().attr('src'),
						comicName: $(div).find('.ssnr_bt a').text().split('//////')[0],
						comicID: $(div).find('.ssnr_bt a').attr('href').replace(/\//g, ''),
						latest_chapter: latest_chapter
					});
				});

				var total = parseInt($html.find('.flr strong').text())

				var res = {
					comics: results,
					current_page: page,
					total_page: Math.ceil(total/20)
				}
				resolve(res);
			})
		});
	}

	static fetchComicsInfo(comicID) {
		return new Promise((resolve, reject) => {
			fetch(`${this.baseURL}/${comicID}/`,
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
						link: this.joinBaseUrl(_rawID),
						cid: /^\/m(\d+)/.exec(_rawID)[1]
					})
				});

				resolve({
					chapters: chapterInfos,
					comicName: comicIndex.find('.inbt_title_h2')[0].innerHTML
				});
			});
		});
	}

	static getChapterImages(cid) {
		// images comes in pairs, we only concat them in odd
		// [12] 23 [34] 45 [56] 67 [78] 89 [9]
		// [12] 23 [34] 45 [56] 67 [78] 89 [910] 10

		// 8 => 1 3 5 7 => (8+1) / 2
		// 9 => 1 3 5 7 9 => (9+1) / 2
		return new Promise((resolve, reject) => {
			this.fetchImagesCount(cid).then(imagesCount => {
				Promise.all(
					[...Array(parseInt((imagesCount+1)/2)).keys()]
						.map(i => this.fetchImages(i*2 + 1, cid))
				).then(images => {
					images = images.reduce((prev, cur) => [...prev, ...cur], []);
					resolve(images);
				});
			});
		});
	}

	static fetchImagesCount(cid) {
		// cache exist
		return new Promise((resolve, reject) => {
			if (this.chapterCountData[cid]) {
				resolve(this.chapterCountData[cid]);
				return;
			}

			fetch(this.getChapterURL(cid)).then(r => r.text()).then(_html => {
				var chapterDoc = $(_html);

				var imagesCount = chapterDoc.find('select#pagelist > option').length;
				this.chapterCountData[cid] = imagesCount;

				resolve(imagesCount);
			});
		});
	}

	static fetchImages(page, cid) {
		return new Promise((resolve, reject) => {
			// imageFetchUrl: http://www.dm5.com/m251731/chapterfun.ashx?cid=251731&page=2
			fetch(`${this.imageFetchUrl(cid)}?${$.param({ cid: cid, page: page, key: null, language: 1 })}`).then(r => r.text()).then(imageJs => {
				var images = eval(imageJs);
				// console.log(`fetchImages: ${images}`);
				resolve(images);
			});
		});
	}

	static comicURL(comicID) {
		return `${this.baseURL}/${comicID}`;
	}

	static imageFetchUrl(cid) {
		return [this.baseURL, `m${cid}`, 'chapterfun.ashx'].join('/');
	}

	static joinBaseUrl(url) {
		// bad workaround :p
		return(`${this.baseURL}${url}`);
	}

	static getCID(chapterID) {
		return /^m(\d+)/.exec(chapterID)[1];
	}

}
