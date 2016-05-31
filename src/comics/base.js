/*
 * 用來解析漫畫網站的函式庫，實作幾個部分：
 *    comics: 所有的漫畫，可能會有分頁(pagination)，串接各網站的 comics 資源，串接搜尋資源，restful。
 *    chapters(話數): 依照更新日期或是名字升冪或降冪排列
 *    images： 依照規則把整話的圖片連結回傳
 */
export class NotImplementError {}

export default class Base {
	getComics() { throw new NotImplementError(); }
	getComic() { throw new NotImplementError(); }
	getChapters() { throw new NotImplementError(); }
	getChapter() { throw new NotImplementError(); }
	getChapterImages() { throw new NotImplementError(); }
}
