import 'whatwg-fetch';

import Base from './base';

export default class DM5 extends Base {
  constructor(chapterID, options={}) {
    super();

    this.regex = /http\:\/\/(tel||www)\.dm5\.com(\/m\d+\/)/;
    this.baseURL = "http://www.dm5.com";
    this.chapterID = chapterID;
  }

  fullURL() {
    return(`${this.baseURL}/${this.chapterID}`);
  }

  getChapters() {
    fetch(this.fullURL()).then(response => {
      console.log(response)
    });
  }
}
