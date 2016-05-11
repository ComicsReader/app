import 'whatwg-fetch';
import $ from 'jquery';

import Base from './base';

export default class DM5 extends Base {
  constructor(chapterID, options={}) {
    super();

    this.regex = /http\:\/\/(tel||www)\.dm5\.com(\/m\d+\/)/;
    this.baseURL = "http://www.dm5.com";

    this.chapterID = chapterID;
    this.cid = /^m(\d+)/.exec(chapterID)[1];

    this.comicName = null;
  }

  fullURL() {
    return(`${this.baseURL}/${this.chapterID}`);
  }

  getChapters() {
    return new Promise((resolve, reject) => {
      fetch(this.fullURL()).then(r => r.text()).then(response => {
        var chapterIndex = $(response);
        var navigationItem = $(chapterIndex.find('.view_logo2.bai_lj')[0]);
        var urls = navigationItem.children('a').map((_, a) => $(a).attr('href'));

        this.comicURL = `${this.baseURL}${urls[urls.length-2]}`;

        fetch(this.comicURL).then(r => r.text()).then(response => {
          var comicIndex = $(response);
          var chapterInfos = comicIndex.find('.nr6.lan2>li>.tg').map((_, a) => {
            var _rawID = $(a).attr('href')
            return({
              title: $(a).attr('title'),
              link: this.joinBaseUrl(_rawID),
              cid: /^\/m(\d+)/.exec(_rawID)[1]
            })
          })

          this.comicName = comicIndex.find('.inbt_title_h2')[0].innerHTML
          this.chapterInfos = chapterInfos;

          resolve(chapterInfos);
        })
      });
    });
  }

  async getChapterImages(cid) {
    var images = [];
    images = images.concat(await this.fetchImages(1, cid));
    images = images.concat(await this.fetchImages(2, cid));
    images = images.concat(await this.fetchImages(3, cid));
    images = images.concat(await this.fetchImages(4, cid));

    return new Promise((resolve, reject) => {
      resolve(images);
    });
  }

  async fetchImages(page, cid) {
    // imageFetchUrl: http://www.dm5.com/m251731/chapterfun.ashx?cid=251731&page=2
    var imageJs = await (await fetch(`${this.imageFetchUrl(cid)}?${$.param({ cid: cid, page: page, key: null, language: 1 })}`)).text();

    return new Promise((resolve, reject) => {
      var images = eval(imageJs);
      console.log(`fetchImages: ${images}`);
      resolve(images);
    });
  }

  imageFetchUrl(cid) {
    return [this.baseURL, `m${cid}`, 'chapterfun.ashx'].join('/');
  }

  joinBaseUrl(url) {
    // bad workaround :p
    return(`${this.baseURL}${url}`);
  }

}
