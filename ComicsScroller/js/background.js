/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Comics_sf = __webpack_require__(542);
	var Comics_8 = __webpack_require__(550);
	var Comics_dm5 = __webpack_require__(551);
	console.log('background');
	var chapterfunhandler = function chapterfunhandler(details) {
		// console.log("chapterfunhandler"+details.url);
		// let isRefererSet = false;
		// headers = details.requestHeaders;
		details.requestHeaders.push({
			name: "Referer",
			value: "http://www.dm5.com/"
		});
		return { requestHeaders: details.requestHeaders };
	};
	
	var mhandler = function mhandler(details) {
		// console.log('handler');
		// console.log("mhandler"+details.url);
		// let headers = details.requestHeaders;
		// setcookie = false;
		for (var i = 0; i < details.requestHeaders.length; ++i) {
			if (details.requestHeaders[i].name === "Cookie") {
				details.requestHeaders[i].value += ";isAdult=1";
				break;
			}
		}
		return { requestHeaders: details.requestHeaders };
	};
	
	chrome.webRequest.onBeforeSendHeaders.addListener(chapterfunhandler, { urls: ["http://www.dm5.com/m*/chapterfun*"] }, ['requestHeaders', 'blocking']);
	
	chrome.webRequest.onBeforeSendHeaders.addListener(mhandler, { urls: ["http://www.dm5.com/m*/"] }, ['requestHeaders', 'blocking']);
	
	chrome.notifications.onClicked.addListener(function (id) {
		chrome.tabs.create({ url: id });
	});
	
	var comicsQuery = function comicsQuery() {
		chrome.storage.local.get('collected', function (items) {
			for (var k = 0; k < items.collected.length; ++k) {
				var indexURL = items.collected[k].url;
				var chapters = items.collected[k].menuItems;
				// console.log('chapters',chapters.length,chapters[0].payload);
				var req = new XMLHttpRequest();
				if (items.collected[k].site === 'sf') {
					req.open('GET', indexURL);
					req.responseType = "document";
					req.onload = function (indexURL, chapters, req, items, k, Comics_sf) {
						return function () {
							Comics_sf.backgroundOnload(indexURL, chapters, req, items, k);
						};
					}(indexURL, chapters, req, items, k, Comics_sf);
				} else if (items.collected[k].site === 'comics8') {
					req.open('GET', indexURL);
					req.responseType = "document";
					req.onload = function (indexURL, chapters, req, items, k, Comics_8) {
						return function () {
							Comics_8.backgroundOnload(indexURL, chapters, req, items, k);
						};
					}(indexURL, chapters, req, items, k, Comics_8);
				} else if (items.collected[k].site === 'dm5') {
					req.open('GET', indexURL);
					req.responseType = "document";
					req.onload = function (indexURL, chapters, req, items, k, Comics_dm5) {
						return function () {
							Comics_dm5.backgroundOnload(indexURL, chapters, req, items, k);
						};
					}(indexURL, chapters, req, items, k, Comics_dm5);
				}
				req.send();
			}
		});
	};
	
	chrome.runtime.onInstalled.addListener(function () {
		var collected = {
			collected: []
		};
	
		var readed = {
			readed: []
		};
	
		var update = {
			update: []
		};
		chrome.storage.local.get('readed', function (items) {
			var readedItem = Object.assign(readed, items);
			chrome.storage.local.set(readedItem);
		});
	
		chrome.storage.local.get('update', function (items) {
			var updateItem = Object.assign(update, items);
			chrome.storage.local.set(updateItem);
		});
	
		chrome.storage.local.get('collected', function (items) {
			var collectedItem = Object.assign(collected, items);
			chrome.storage.local.set(collectedItem);
		});
	
		chrome.alarms.create("comicsQuery", {
			periodInMinutes: 1 });
	});
	
	// chrome.tabs.onUpdated.addListener(redirectLocal);
	// chrome.webNavigation.onCommitted.addListener
	chrome.webNavigation.onCommitted.addListener;
	chrome.webNavigation.onCommitted.addListener(function (details) {
		console.log(details.url, Comics_8.regex.test(details.url));
		if (Comics_8.regex.test(details.url)) {
			console.log("8 comics fired");
			var chapter = Comics_8.regex.exec(details.url)[1];
			chrome.tabs.update(details.tabId, { url: chrome.extension.getURL("reader.html") + "#/site/comics8/chapter" + chapter });
			ga('send', 'event', "8comics view");
		} else if (Comics_sf.regex.test(details.url)) {
			console.log("sf fired");
			var _chapter = Comics_sf.regex.exec(details.url)[1];
			chrome.tabs.update(details.tabId, { url: chrome.extension.getURL("reader.html") + "#/site/sf/chapter" + _chapter });
			ga('send', 'event', "sf view");
		} else if (Comics_dm5.regex.test(details.url) || Comics_dm5.dm5regex.test(details.url)) {
			console.log("dm5 fired");
			var _chapter2 = "";
			if (Comics_dm5.dm5regex.test(details.url)) {
				_chapter2 = Comics_dm5.dm5regex.exec(details.url)[2];
			} else {
				_chapter2 = Comics_dm5.regex.exec(details.url)[1];
			}
			chrome.tabs.update(details.tabId, { url: chrome.extension.getURL("reader.html") + "#/site/dm5/chapter" + _chapter2 });
			ga('send', 'event', "dm5 view");
		}
	}, { url: [{ urlMatches: "comicbus\.com/online/\w*" }, { urlMatches: "comic\.sfacg\.com\/HTML\/[^\/]+\/.+$" }, { urlMatches: "http://(tel||www)\.dm5\.com/m\d*" }]
	});
	
	chrome.alarms.onAlarm.addListener(function (alarm) {
		comicsQuery();
	});
	
	(function (i, s, o, g, r, a, m) {
		i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {
			(i[r].q = i[r].q || []).push(arguments);
		}, i[r].l = 1 * new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.alocal = 1;a.src = g;m.parentNode.insertBefore(a, m);
	})(window, document, 'script', 'https://ssl.google-analytics.com/analytics.js', 'ga');
	ga('create', 'UA-59728771-1', 'auto');
	ga('set', 'checkProtocolTask', null);
	ga('send', 'pageview');

/***/ },

/***/ 4:
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },

/***/ 542:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// let ObjectAssign=require('object-assign');
	var Echo = __webpack_require__(543);
	var Immutable = __webpack_require__(549);
	var parser = new DOMParser();
	var comics = {
	
		regex: /http\:\/\/comic\.sfacg\.com(\/HTML\/[^\/]+\/.+)$/,
	
		baseURL: "http://comic.sfacg.com",
	
		handleUrlHash: function handleUrlHash(menuItems) {
			var params_str = window.location.hash;
			this.site = /site\/(\w*)\//.exec(params_str)[1];
			this.pageURL = /chapter(\/HTML\/[^\/]+\/)/.exec(params_str)[1];
			this.chapterURL = this.baseURL + /chapter(\/.*)$/.exec(params_str)[1];
			this.indexURL = this.baseURL + this.pageURL;
			// console.log("chapterURL",this.chapterURL);
			if (!/#$/.test(params_str)) {
				// console.log('page back');
				document.getElementById("comics_panel").innerHTML = "";
				var index = -1;
				for (var i = 0; i < menuItems.size; ++i) {
					if (menuItems.get(i).get('payload') === this.chapterURL) {
						index = i;
						this.lastIndex = index;
						break;
					}
				}
				this.getImage(index, this.chapterURL);
			} else {
				this.chapterURL = this.baseURL + /chapter\/(.*\/)#$/.exec(params_str)[1];
				window.history.replaceState('', document.title, "#/site/sf/chapter/" + /chapter\/(.*\/)#$/.exec(params_str)[1]);
			}
		},
	
		getChapter: function getChapter(doc) {
			var nl = doc.querySelectorAll(".serialise_list>li>a");
			return nl;
		},
	
		getTitleName: function getTitleName(doc) {
			this.title = doc.querySelector("body > table:nth-child(8) > tbody > tr > td:nth-child(1) > table:nth-child(2) > tbody > tr > td > h1 > b").textContent;
			return this.title;
		},
	
		getCoverImg: function getCoverImg(doc) {
			this.iconUrl = doc.querySelector(".comic_cover>img").src;
			return this.iconUrl;
		},
	
		getIndexURL: function getIndexURL() {
			return regeneratorRuntime.async(function getIndexURL$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							return _context.abrupt('return', this.indexURL);
	
						case 1:
						case 'end':
							return _context.stop();
					}
				}
			}, null, this);
		},
	
		getImage: function getImage(index, url) {
			var response, rtxt, doc, scriptURL, response2, rtxt2;
			return regeneratorRuntime.async(function getImage$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							_context2.next = 2;
							return regeneratorRuntime.awrap(fetch(url));
	
						case 2:
							response = _context2.sent;
							_context2.next = 5;
							return regeneratorRuntime.awrap(response.text());
	
						case 5:
							rtxt = _context2.sent;
							doc = parser.parseFromString(rtxt, "text/html");
							scriptURL = /src=\"(\/Utility.*\.js)\">/.exec(doc.head.innerHTML)[1];
							_context2.next = 10;
							return regeneratorRuntime.awrap(fetch(this.baseURL + scriptURL));
	
						case 10:
							response2 = _context2.sent;
							_context2.next = 13;
							return regeneratorRuntime.awrap(response2.text());
	
						case 13:
							rtxt2 = _context2.sent;
	
							this.setImages(index, rtxt2);
	
						case 15:
						case 'end':
							return _context2.stop();
					}
				}
			}, null, this);
		},
	
		// markedItems: Immutable.Set(),
	
		getMenuItems: function getMenuItems(doc, markedItems) {
			var nl = this.getChapter(doc);
			var array = [];
			this.initIndex = -1;
			for (var i = 0; i < nl.length; ++i) {
				var item = {};
				item.payload = this.baseURL + nl[i].getAttribute('href');
				item.text = nl[i].textContent;
				if (item.payload === this.chapterURL && this.initIndex === -1) {
					this.initIndex = i;
					document.title = this.title + " " + item.text;
					this.setImageIndex(i);
					item.isMarked = true;
					if (!markedItems.has(item.payload)) {
						markedItems = markedItems.add(item.payload);
					}
				}
				if (markedItems.has(item.payload)) {
					item.isMarked = true;
				}
				item = Immutable.Map(item);
				array.push(item);
			}
			this.markedItems = markedItems;
			return Immutable.List(array);
		},
	
		chapterUpdateIndex: -1,
	
		setImageIndex: function setImageIndex(index) {
			if (this.chapterUpdateIndex === -1) {
				this.chapterUpdateIndex = index;
			} else if (this.chapterUpdateIndex === -2) {
				var imgs = document.querySelectorAll('img[data-chapter=\"-1\"]');
				for (var i = 0; i < imgs.length; ++i) {
					imgs[i].setAttribute("data-chapter", index);
				}
				this.chapterUpdateIndex = -1;
			}
		},
	
		setImages: function setImages(index, response) {
			console.log(response);
			eval(response);
			var name = "picHost=";
			var picHost = hosts[0];
			var img = [];
			this.pageMax = picCount;
			for (var i = 0; i < this.pageMax; i++) {
				img[i] = picHost + picAy[i];
			}
			this.images = img;
			this.appendImage(index);
		},
	
		appendImage: function appendImage(index) {
			var comics_panel = document.getElementById("comics_panel");
			if (index === -1) {
				index = this.chapterUpdateIndex;
				this.chapterUpdateIndex = -2;
			}
			for (var i = 0; i < this.pageMax; ++i) {
				var img = new Image();
				img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
				img.setAttribute("data-echo", this.images[i]);
				img.setAttribute("data-num", i + 1);
				img.setAttribute("data-chapter", index);
				img.style.width = "900px";
				img.style.height = "1300px";
				img.style.display = 'block';
				img.style.borderWidth = "1px";
				img.style.borderColor = "white";
				img.style.borderStyle = "solid";
				img.style.marginLeft = 'auto';
				img.style.marginRight = 'auto';
				img.style.marginTop = '10px';
				img.style.marginBottom = '50px';
				img.style.maxWidth = '100%';
				img.style.background = '#2a2a2a url(http://i.imgur.com/msdpdQm.gif) no-repeat center center';
				img.setAttribute("data-pageMax", this.pageMax);
				comics_panel.appendChild(img);
			}
			Echo.nodes = comics_panel.children;
			var chapterEnd = document.createElement("div");
			chapterEnd.className = "comics_img_end";
			chapterEnd.textContent = "本話結束";
			comics_panel.appendChild(chapterEnd);
			var chapterPromote = document.createElement("div");
			chapterPromote.className = "comics_img_promote";
			chapterPromote.textContent = "If you like Comics Scroller, give me a like on FB or Github.";
			comics_panel.appendChild(chapterPromote);
			if (!Echo.hadInited) {
				Echo.init();
			} else {
				Echo.render();
			}
		},
	
		backgroundOnload: function backgroundOnload(indexURL, chapters, req, items, k) {
			var doc = req.response;
			var nl = this.getChapter(doc);
			var title = this.getTitleName(doc);
			var imgUrl = this.getCoverImg(doc);
			var array = [];
			var obj = {};
			// chapters.pop();
			for (var i = 0; i < nl.length; ++i) {
				var item = {};
				item.payload = this.baseURL + nl[i].getAttribute('href');
				item.text = nl[i].textContent;
				array.push(item);
				var urlInChapter = false;
				for (var j = 0; j < chapters.length; ++j) {
					if (chapters[j].payload === item.payload) {
						urlInChapter = true;
						break;
					}
				}
				if (!urlInChapter && chapters.length > 0) {
					var _obj = {
						url: indexURL,
						title: title,
						site: 'sf',
						iconUrl: imgUrl,
						lastReaded: item
					};
					chrome.notifications.create(item.payload, {
						type: "image",
						iconUrl: 'img/comics-64.png',
						title: "Comics Update",
						message: title + "  " + _obj.lastReaded.text,
						imageUrl: imgUrl
					});
					chrome.storage.local.get('update', function (items) {
						items.update.push(this);
						var num = items.update.length.toString();
						chrome.browserAction.setBadgeText({ text: num });
						chrome.storage.local.set(items);
					}.bind(_obj));
				}
			}
			items.collected[k].menuItems = array;
			chrome.storage.local.set(items);
		}
	};
	
	module.exports = comics;

/***/ },

/***/ 543:
/***/ function(module, exports, __webpack_require__) {

	/*! modify from echo.js v1.6.0 | (c) 2015 @toddmotto | https://github.com/toddmotto/echo */
	'use strict';
	
	var chapterAction = __webpack_require__(544);
	
	var echo = {};
	
	var imgRender = function imgRender(elem) {
	  elem.src = elem.getAttribute('data-echo');
	  elem.removeAttribute('data-echo');
	};
	
	// var offset=5000;
	
	var delay = 200;
	
	var useDebounce = true;
	
	echo.hadInited = false;
	
	var checkView, setInViewInfor, scrollRender, panel, poll, update;
	
	// var view = {
	//   t: 0 - offset,
	//   b: window.innerHeight + offset,
	// };
	
	var windowView = {
	  t: 0,
	  b: window.innerHeight
	};
	
	var debounceOrThrottle = function debounceOrThrottle() {
	  if (!useDebounce && !!poll) {
	    return;
	  }
	  clearTimeout(poll);
	  poll = setTimeout(function () {
	    echo.render();
	    poll = null;
	  }, delay);
	};
	var bSeachElem = function bSeachElem(nodes, begin, end) {
	  var index = Math.floor((begin + end) / 2);
	  // console.log(begin,end,index);
	  if (begin === end) return index;
	  var box = nodes[index].getBoundingClientRect();
	  if (box.bottom < windowView.t) {
	    return bSeachElem(nodes, index, end);
	  } else if (box.top > windowView.b) {
	    return bSeachElem(nodes, begin, index);
	  } else if (box.bottom >= windowView.t && box.top <= windowView.b) {
	    return index;
	  }
	};
	echo.init = function (opts) {
	  // scrollRender=true;
	  // console.log("echo init");
	  opts = opts || {};
	  // panel=document.getElementById('comics_panel');
	  imgRender = opts.imgRender || imgRender;
	  echo.hadInited = true;
	  echo.render();
	  window.addEventListener('scroll', debounceOrThrottle, false);
	  // window.addEventListener('load', debounceOrThrottle, false);
	};
	echo.render = function () {
	  // panel=document.getElementById('comics_panel');
	  // var nodes = echo.nodes;
	  // var length = nodes.length;
	  // var renderstatus=false;
	  // var inforstatus=false;  
	  // for (var i = 0; i < nodes.length; ++i) {
	  //   var elem = nodes[i];
	  //   if(elem.getAttribute('data-echo')){
	  //     imgRender(elem);
	  //   }
	  //   var box=elem.getBoundingClientRect();
	
	  // }
	  if (echo.nodes.length === 0) return;
	  var index = bSeachElem(echo.nodes, 0, echo.nodes.length - 1);
	  var elem = echo.nodes[index];
	
	  if (elem.getAttribute('data-num')) {
	    chapterAction.scroll(elem.getAttribute("data-chapter"), elem.getAttribute("data-num") + '/' + elem.getAttribute("data-pageMax"));
	  }
	
	  if (!elem.style.maxHeight && elem.naturalWidth / elem.naturalHeight > 1) {
	    var h = window.innerHeight - 58;
	    elem.style.maxHeight = h.toString() + 'px';
	    elem.style.width = Math.round(h * elem.naturalWidth / elem.naturalHeight).toString() + 'px';
	  }
	
	  if (elem.getAttribute('data-echo')) imgRender(elem);
	
	  for (var i = 1; i <= 5; ++i) {
	    if (index - i >= 0) {
	      var elem = echo.nodes[index - i];
	      if (!elem.style.maxHeight && elem.naturalWidth / elem.naturalHeight > 1) {
	        var h = window.innerHeight - 58;
	        elem.style.maxHeight = h.toString() + 'px';
	        elem.style.width = Math.round(h * elem.naturalWidth / elem.naturalHeight).toString() + 'px';
	      }
	      if (elem.getAttribute('data-echo')) imgRender(elem);
	    }
	    if (index + i < echo.nodes.length) {
	      var elem = echo.nodes[index + i];
	      if (!elem.style.maxHeight && elem.naturalWidth / elem.naturalHeight > 1) {
	        var h = window.innerHeight - 58;
	        elem.style.maxHeight = h.toString() + 'px';
	        elem.style.width = Math.round(h * elem.naturalWidth / elem.naturalHeight).toString() + 'px';
	      }
	      if (elem.getAttribute('data-echo')) imgRender(elem);
	    }
	  }
	};
	
	echo.nodes = [];
	
	// echo.render = function () {
	//   var nodes = panel.children;
	//   // var length = nodes.length;
	//   var renderstatus=false;
	//   var inforstatus=false;  
	//   for (var i = 0; i < nodes.length; ++i) {
	//     var elem = nodes[i];
	//     var box=elem.getBoundingClientRect();
	//     if (box.bottom >= view.t && box.top <= view.b) {
	//       if(elem.naturalWidth/elem.naturalHeight>1){
	//         // elem.removeAttribute('style');
	//         var h=window.innerHeight-58;
	//         elem.style.maxHeight=h.toString()+'px';
	//         elem.style.width="80%";
	//       }
	//       if(elem.getAttribute('data-num')&&(box.bottom >= windowView.t && box.top <= windowView.b)){
	//         if(!inforstatus){
	//           chapterAction.scroll(elem.getAttribute("data-chapter"),elem.getAttribute("data-num")+'/'+elem.getAttribute("data-pageMax"));
	//           inforstatus=true;
	//         }
	//       } 
	//       if(elem.getAttribute('data-echo')){
	//         renderstatus=true;
	//         imgRender(elem);
	//       }else if(renderstatus){
	//         break;
	//       }
	//     }
	//   }
	// };
	
	echo.run = function () {
	  // scrollRender=true;
	  echo.render();
	};
	
	// echo.detach = function () {
	//   window.removeEventListener('scroll', debounceOrThrottle);
	//   clearTimeout(poll);
	// };
	
	module.exports = echo;

/***/ },

/***/ 544:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var AppDispatcher = __webpack_require__(545);
	var chapterActions = {
	  update: function update() {
	    // console.log("action update");
	    AppDispatcher.dispatch({
	      actionType: "update"
	    });
	  },
	  scroll: function scroll(text, pageratio) {
	    // console.log("action scroll");
	    AppDispatcher.dispatch({
	      actionType: "scroll",
	      text: text,
	      pageratio: pageratio
	    });
	  }
	};
	
	module.exports = chapterActions;

/***/ },

/***/ 545:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Dispatcher = __webpack_require__(546).Dispatcher;
	
	module.exports = new Dispatcher();

/***/ },

/***/ 546:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */
	
	module.exports.Dispatcher = __webpack_require__(547);


/***/ },

/***/ 547:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule Dispatcher
	 * 
	 * @preventMunge
	 */
	
	'use strict';
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var invariant = __webpack_require__(548);
	
	var _prefix = 'ID_';
	
	/**
	 * Dispatcher is used to broadcast payloads to registered callbacks. This is
	 * different from generic pub-sub systems in two ways:
	 *
	 *   1) Callbacks are not subscribed to particular events. Every payload is
	 *      dispatched to every registered callback.
	 *   2) Callbacks can be deferred in whole or part until other callbacks have
	 *      been executed.
	 *
	 * For example, consider this hypothetical flight destination form, which
	 * selects a default city when a country is selected:
	 *
	 *   var flightDispatcher = new Dispatcher();
	 *
	 *   // Keeps track of which country is selected
	 *   var CountryStore = {country: null};
	 *
	 *   // Keeps track of which city is selected
	 *   var CityStore = {city: null};
	 *
	 *   // Keeps track of the base flight price of the selected city
	 *   var FlightPriceStore = {price: null}
	 *
	 * When a user changes the selected city, we dispatch the payload:
	 *
	 *   flightDispatcher.dispatch({
	 *     actionType: 'city-update',
	 *     selectedCity: 'paris'
	 *   });
	 *
	 * This payload is digested by `CityStore`:
	 *
	 *   flightDispatcher.register(function(payload) {
	 *     if (payload.actionType === 'city-update') {
	 *       CityStore.city = payload.selectedCity;
	 *     }
	 *   });
	 *
	 * When the user selects a country, we dispatch the payload:
	 *
	 *   flightDispatcher.dispatch({
	 *     actionType: 'country-update',
	 *     selectedCountry: 'australia'
	 *   });
	 *
	 * This payload is digested by both stores:
	 *
	 *   CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
	 *     if (payload.actionType === 'country-update') {
	 *       CountryStore.country = payload.selectedCountry;
	 *     }
	 *   });
	 *
	 * When the callback to update `CountryStore` is registered, we save a reference
	 * to the returned token. Using this token with `waitFor()`, we can guarantee
	 * that `CountryStore` is updated before the callback that updates `CityStore`
	 * needs to query its data.
	 *
	 *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
	 *     if (payload.actionType === 'country-update') {
	 *       // `CountryStore.country` may not be updated.
	 *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
	 *       // `CountryStore.country` is now guaranteed to be updated.
	 *
	 *       // Select the default city for the new country
	 *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
	 *     }
	 *   });
	 *
	 * The usage of `waitFor()` can be chained, for example:
	 *
	 *   FlightPriceStore.dispatchToken =
	 *     flightDispatcher.register(function(payload) {
	 *       switch (payload.actionType) {
	 *         case 'country-update':
	 *         case 'city-update':
	 *           flightDispatcher.waitFor([CityStore.dispatchToken]);
	 *           FlightPriceStore.price =
	 *             getFlightPriceStore(CountryStore.country, CityStore.city);
	 *           break;
	 *     }
	 *   });
	 *
	 * The `country-update` payload will be guaranteed to invoke the stores'
	 * registered callbacks in order: `CountryStore`, `CityStore`, then
	 * `FlightPriceStore`.
	 */
	
	var Dispatcher = (function () {
	  function Dispatcher() {
	    _classCallCheck(this, Dispatcher);
	
	    this._callbacks = {};
	    this._isDispatching = false;
	    this._isHandled = {};
	    this._isPending = {};
	    this._lastID = 1;
	  }
	
	  /**
	   * Registers a callback to be invoked with every dispatched payload. Returns
	   * a token that can be used with `waitFor()`.
	   */
	
	  Dispatcher.prototype.register = function register(callback) {
	    var id = _prefix + this._lastID++;
	    this._callbacks[id] = callback;
	    return id;
	  };
	
	  /**
	   * Removes a callback based on its token.
	   */
	
	  Dispatcher.prototype.unregister = function unregister(id) {
	    !this._callbacks[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.unregister(...): `%s` does not map to a registered callback.', id) : invariant(false) : undefined;
	    delete this._callbacks[id];
	  };
	
	  /**
	   * Waits for the callbacks specified to be invoked before continuing execution
	   * of the current callback. This method should only be used by a callback in
	   * response to a dispatched payload.
	   */
	
	  Dispatcher.prototype.waitFor = function waitFor(ids) {
	    !this._isDispatching ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): Must be invoked while dispatching.') : invariant(false) : undefined;
	    for (var ii = 0; ii < ids.length; ii++) {
	      var id = ids[ii];
	      if (this._isPending[id]) {
	        !this._isHandled[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): Circular dependency detected while ' + 'waiting for `%s`.', id) : invariant(false) : undefined;
	        continue;
	      }
	      !this._callbacks[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): `%s` does not map to a registered callback.', id) : invariant(false) : undefined;
	      this._invokeCallback(id);
	    }
	  };
	
	  /**
	   * Dispatches a payload to all registered callbacks.
	   */
	
	  Dispatcher.prototype.dispatch = function dispatch(payload) {
	    !!this._isDispatching ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.') : invariant(false) : undefined;
	    this._startDispatching(payload);
	    try {
	      for (var id in this._callbacks) {
	        if (this._isPending[id]) {
	          continue;
	        }
	        this._invokeCallback(id);
	      }
	    } finally {
	      this._stopDispatching();
	    }
	  };
	
	  /**
	   * Is this Dispatcher currently dispatching.
	   */
	
	  Dispatcher.prototype.isDispatching = function isDispatching() {
	    return this._isDispatching;
	  };
	
	  /**
	   * Call the callback stored with the given id. Also do some internal
	   * bookkeeping.
	   *
	   * @internal
	   */
	
	  Dispatcher.prototype._invokeCallback = function _invokeCallback(id) {
	    this._isPending[id] = true;
	    this._callbacks[id](this._pendingPayload);
	    this._isHandled[id] = true;
	  };
	
	  /**
	   * Set up bookkeeping needed when dispatching.
	   *
	   * @internal
	   */
	
	  Dispatcher.prototype._startDispatching = function _startDispatching(payload) {
	    for (var id in this._callbacks) {
	      this._isPending[id] = false;
	      this._isHandled[id] = false;
	    }
	    this._pendingPayload = payload;
	    this._isDispatching = true;
	  };
	
	  /**
	   * Clear bookkeeping used for dispatching.
	   *
	   * @internal
	   */
	
	  Dispatcher.prototype._stopDispatching = function _stopDispatching() {
	    delete this._pendingPayload;
	    this._isDispatching = false;
	  };
	
	  return Dispatcher;
	})();
	
	module.exports = Dispatcher;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },

/***/ 548:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule invariant
	 */
	
	"use strict";
	
	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */
	
	var invariant = function (condition, format, a, b, c, d, e, f) {
	  if (process.env.NODE_ENV !== 'production') {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }
	
	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error('Invariant Violation: ' + format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	    }
	
	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};
	
	module.exports = invariant;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },

/***/ 549:
/***/ function(module, exports, __webpack_require__) {

	/**
	 *  Copyright (c) 2014-2015, Facebook, Inc.
	 *  All rights reserved.
	 *
	 *  This source code is licensed under the BSD-style license found in the
	 *  LICENSE file in the root directory of this source tree. An additional grant
	 *  of patent rights can be found in the PATENTS file in the same directory.
	 */
	
	(function (global, factory) {
	   true ? module.exports = factory() :
	  typeof define === 'function' && define.amd ? define(factory) :
	  (global.Immutable = factory());
	}(this, function () { 'use strict';var SLICE$0 = Array.prototype.slice;
	
	  function createClass(ctor, superClass) {
	    if (superClass) {
	      ctor.prototype = Object.create(superClass.prototype);
	    }
	    ctor.prototype.constructor = ctor;
	  }
	
	  function Iterable(value) {
	      return isIterable(value) ? value : Seq(value);
	    }
	
	
	  createClass(KeyedIterable, Iterable);
	    function KeyedIterable(value) {
	      return isKeyed(value) ? value : KeyedSeq(value);
	    }
	
	
	  createClass(IndexedIterable, Iterable);
	    function IndexedIterable(value) {
	      return isIndexed(value) ? value : IndexedSeq(value);
	    }
	
	
	  createClass(SetIterable, Iterable);
	    function SetIterable(value) {
	      return isIterable(value) && !isAssociative(value) ? value : SetSeq(value);
	    }
	
	
	
	  function isIterable(maybeIterable) {
	    return !!(maybeIterable && maybeIterable[IS_ITERABLE_SENTINEL]);
	  }
	
	  function isKeyed(maybeKeyed) {
	    return !!(maybeKeyed && maybeKeyed[IS_KEYED_SENTINEL]);
	  }
	
	  function isIndexed(maybeIndexed) {
	    return !!(maybeIndexed && maybeIndexed[IS_INDEXED_SENTINEL]);
	  }
	
	  function isAssociative(maybeAssociative) {
	    return isKeyed(maybeAssociative) || isIndexed(maybeAssociative);
	  }
	
	  function isOrdered(maybeOrdered) {
	    return !!(maybeOrdered && maybeOrdered[IS_ORDERED_SENTINEL]);
	  }
	
	  Iterable.isIterable = isIterable;
	  Iterable.isKeyed = isKeyed;
	  Iterable.isIndexed = isIndexed;
	  Iterable.isAssociative = isAssociative;
	  Iterable.isOrdered = isOrdered;
	
	  Iterable.Keyed = KeyedIterable;
	  Iterable.Indexed = IndexedIterable;
	  Iterable.Set = SetIterable;
	
	
	  var IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
	  var IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
	  var IS_INDEXED_SENTINEL = '@@__IMMUTABLE_INDEXED__@@';
	  var IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';
	
	  // Used for setting prototype methods that IE8 chokes on.
	  var DELETE = 'delete';
	
	  // Constants describing the size of trie nodes.
	  var SHIFT = 5; // Resulted in best performance after ______?
	  var SIZE = 1 << SHIFT;
	  var MASK = SIZE - 1;
	
	  // A consistent shared value representing "not set" which equals nothing other
	  // than itself, and nothing that could be provided externally.
	  var NOT_SET = {};
	
	  // Boolean references, Rough equivalent of `bool &`.
	  var CHANGE_LENGTH = { value: false };
	  var DID_ALTER = { value: false };
	
	  function MakeRef(ref) {
	    ref.value = false;
	    return ref;
	  }
	
	  function SetRef(ref) {
	    ref && (ref.value = true);
	  }
	
	  // A function which returns a value representing an "owner" for transient writes
	  // to tries. The return value will only ever equal itself, and will not equal
	  // the return of any subsequent call of this function.
	  function OwnerID() {}
	
	  // http://jsperf.com/copy-array-inline
	  function arrCopy(arr, offset) {
	    offset = offset || 0;
	    var len = Math.max(0, arr.length - offset);
	    var newArr = new Array(len);
	    for (var ii = 0; ii < len; ii++) {
	      newArr[ii] = arr[ii + offset];
	    }
	    return newArr;
	  }
	
	  function ensureSize(iter) {
	    if (iter.size === undefined) {
	      iter.size = iter.__iterate(returnTrue);
	    }
	    return iter.size;
	  }
	
	  function wrapIndex(iter, index) {
	    // This implements "is array index" which the ECMAString spec defines as:
	    //
	    //     A String property name P is an array index if and only if
	    //     ToString(ToUint32(P)) is equal to P and ToUint32(P) is not equal
	    //     to 2^32−1.
	    //
	    // http://www.ecma-international.org/ecma-262/6.0/#sec-array-exotic-objects
	    if (typeof index !== 'number') {
	      var uint32Index = index >>> 0; // N >>> 0 is shorthand for ToUint32
	      if ('' + uint32Index !== index || uint32Index === 4294967295) {
	        return NaN;
	      }
	      index = uint32Index;
	    }
	    return index < 0 ? ensureSize(iter) + index : index;
	  }
	
	  function returnTrue() {
	    return true;
	  }
	
	  function wholeSlice(begin, end, size) {
	    return (begin === 0 || (size !== undefined && begin <= -size)) &&
	      (end === undefined || (size !== undefined && end >= size));
	  }
	
	  function resolveBegin(begin, size) {
	    return resolveIndex(begin, size, 0);
	  }
	
	  function resolveEnd(end, size) {
	    return resolveIndex(end, size, size);
	  }
	
	  function resolveIndex(index, size, defaultIndex) {
	    return index === undefined ?
	      defaultIndex :
	      index < 0 ?
	        Math.max(0, size + index) :
	        size === undefined ?
	          index :
	          Math.min(size, index);
	  }
	
	  /* global Symbol */
	
	  var ITERATE_KEYS = 0;
	  var ITERATE_VALUES = 1;
	  var ITERATE_ENTRIES = 2;
	
	  var REAL_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
	  var FAUX_ITERATOR_SYMBOL = '@@iterator';
	
	  var ITERATOR_SYMBOL = REAL_ITERATOR_SYMBOL || FAUX_ITERATOR_SYMBOL;
	
	
	  function Iterator(next) {
	      this.next = next;
	    }
	
	    Iterator.prototype.toString = function() {
	      return '[Iterator]';
	    };
	
	
	  Iterator.KEYS = ITERATE_KEYS;
	  Iterator.VALUES = ITERATE_VALUES;
	  Iterator.ENTRIES = ITERATE_ENTRIES;
	
	  Iterator.prototype.inspect =
	  Iterator.prototype.toSource = function () { return this.toString(); }
	  Iterator.prototype[ITERATOR_SYMBOL] = function () {
	    return this;
	  };
	
	
	  function iteratorValue(type, k, v, iteratorResult) {
	    var value = type === 0 ? k : type === 1 ? v : [k, v];
	    iteratorResult ? (iteratorResult.value = value) : (iteratorResult = {
	      value: value, done: false
	    });
	    return iteratorResult;
	  }
	
	  function iteratorDone() {
	    return { value: undefined, done: true };
	  }
	
	  function hasIterator(maybeIterable) {
	    return !!getIteratorFn(maybeIterable);
	  }
	
	  function isIterator(maybeIterator) {
	    return maybeIterator && typeof maybeIterator.next === 'function';
	  }
	
	  function getIterator(iterable) {
	    var iteratorFn = getIteratorFn(iterable);
	    return iteratorFn && iteratorFn.call(iterable);
	  }
	
	  function getIteratorFn(iterable) {
	    var iteratorFn = iterable && (
	      (REAL_ITERATOR_SYMBOL && iterable[REAL_ITERATOR_SYMBOL]) ||
	      iterable[FAUX_ITERATOR_SYMBOL]
	    );
	    if (typeof iteratorFn === 'function') {
	      return iteratorFn;
	    }
	  }
	
	  function isArrayLike(value) {
	    return value && typeof value.length === 'number';
	  }
	
	  createClass(Seq, Iterable);
	    function Seq(value) {
	      return value === null || value === undefined ? emptySequence() :
	        isIterable(value) ? value.toSeq() : seqFromValue(value);
	    }
	
	    Seq.of = function(/*...values*/) {
	      return Seq(arguments);
	    };
	
	    Seq.prototype.toSeq = function() {
	      return this;
	    };
	
	    Seq.prototype.toString = function() {
	      return this.__toString('Seq {', '}');
	    };
	
	    Seq.prototype.cacheResult = function() {
	      if (!this._cache && this.__iterateUncached) {
	        this._cache = this.entrySeq().toArray();
	        this.size = this._cache.length;
	      }
	      return this;
	    };
	
	    // abstract __iterateUncached(fn, reverse)
	
	    Seq.prototype.__iterate = function(fn, reverse) {
	      return seqIterate(this, fn, reverse, true);
	    };
	
	    // abstract __iteratorUncached(type, reverse)
	
	    Seq.prototype.__iterator = function(type, reverse) {
	      return seqIterator(this, type, reverse, true);
	    };
	
	
	
	  createClass(KeyedSeq, Seq);
	    function KeyedSeq(value) {
	      return value === null || value === undefined ?
	        emptySequence().toKeyedSeq() :
	        isIterable(value) ?
	          (isKeyed(value) ? value.toSeq() : value.fromEntrySeq()) :
	          keyedSeqFromValue(value);
	    }
	
	    KeyedSeq.prototype.toKeyedSeq = function() {
	      return this;
	    };
	
	
	
	  createClass(IndexedSeq, Seq);
	    function IndexedSeq(value) {
	      return value === null || value === undefined ? emptySequence() :
	        !isIterable(value) ? indexedSeqFromValue(value) :
	        isKeyed(value) ? value.entrySeq() : value.toIndexedSeq();
	    }
	
	    IndexedSeq.of = function(/*...values*/) {
	      return IndexedSeq(arguments);
	    };
	
	    IndexedSeq.prototype.toIndexedSeq = function() {
	      return this;
	    };
	
	    IndexedSeq.prototype.toString = function() {
	      return this.__toString('Seq [', ']');
	    };
	
	    IndexedSeq.prototype.__iterate = function(fn, reverse) {
	      return seqIterate(this, fn, reverse, false);
	    };
	
	    IndexedSeq.prototype.__iterator = function(type, reverse) {
	      return seqIterator(this, type, reverse, false);
	    };
	
	
	
	  createClass(SetSeq, Seq);
	    function SetSeq(value) {
	      return (
	        value === null || value === undefined ? emptySequence() :
	        !isIterable(value) ? indexedSeqFromValue(value) :
	        isKeyed(value) ? value.entrySeq() : value
	      ).toSetSeq();
	    }
	
	    SetSeq.of = function(/*...values*/) {
	      return SetSeq(arguments);
	    };
	
	    SetSeq.prototype.toSetSeq = function() {
	      return this;
	    };
	
	
	
	  Seq.isSeq = isSeq;
	  Seq.Keyed = KeyedSeq;
	  Seq.Set = SetSeq;
	  Seq.Indexed = IndexedSeq;
	
	  var IS_SEQ_SENTINEL = '@@__IMMUTABLE_SEQ__@@';
	
	  Seq.prototype[IS_SEQ_SENTINEL] = true;
	
	
	
	  createClass(ArraySeq, IndexedSeq);
	    function ArraySeq(array) {
	      this._array = array;
	      this.size = array.length;
	    }
	
	    ArraySeq.prototype.get = function(index, notSetValue) {
	      return this.has(index) ? this._array[wrapIndex(this, index)] : notSetValue;
	    };
	
	    ArraySeq.prototype.__iterate = function(fn, reverse) {
	      var array = this._array;
	      var maxIndex = array.length - 1;
	      for (var ii = 0; ii <= maxIndex; ii++) {
	        if (fn(array[reverse ? maxIndex - ii : ii], ii, this) === false) {
	          return ii + 1;
	        }
	      }
	      return ii;
	    };
	
	    ArraySeq.prototype.__iterator = function(type, reverse) {
	      var array = this._array;
	      var maxIndex = array.length - 1;
	      var ii = 0;
	      return new Iterator(function() 
	        {return ii > maxIndex ?
	          iteratorDone() :
	          iteratorValue(type, ii, array[reverse ? maxIndex - ii++ : ii++])}
	      );
	    };
	
	
	
	  createClass(ObjectSeq, KeyedSeq);
	    function ObjectSeq(object) {
	      var keys = Object.keys(object);
	      this._object = object;
	      this._keys = keys;
	      this.size = keys.length;
	    }
	
	    ObjectSeq.prototype.get = function(key, notSetValue) {
	      if (notSetValue !== undefined && !this.has(key)) {
	        return notSetValue;
	      }
	      return this._object[key];
	    };
	
	    ObjectSeq.prototype.has = function(key) {
	      return this._object.hasOwnProperty(key);
	    };
	
	    ObjectSeq.prototype.__iterate = function(fn, reverse) {
	      var object = this._object;
	      var keys = this._keys;
	      var maxIndex = keys.length - 1;
	      for (var ii = 0; ii <= maxIndex; ii++) {
	        var key = keys[reverse ? maxIndex - ii : ii];
	        if (fn(object[key], key, this) === false) {
	          return ii + 1;
	        }
	      }
	      return ii;
	    };
	
	    ObjectSeq.prototype.__iterator = function(type, reverse) {
	      var object = this._object;
	      var keys = this._keys;
	      var maxIndex = keys.length - 1;
	      var ii = 0;
	      return new Iterator(function()  {
	        var key = keys[reverse ? maxIndex - ii : ii];
	        return ii++ > maxIndex ?
	          iteratorDone() :
	          iteratorValue(type, key, object[key]);
	      });
	    };
	
	  ObjectSeq.prototype[IS_ORDERED_SENTINEL] = true;
	
	
	  createClass(IterableSeq, IndexedSeq);
	    function IterableSeq(iterable) {
	      this._iterable = iterable;
	      this.size = iterable.length || iterable.size;
	    }
	
	    IterableSeq.prototype.__iterateUncached = function(fn, reverse) {
	      if (reverse) {
	        return this.cacheResult().__iterate(fn, reverse);
	      }
	      var iterable = this._iterable;
	      var iterator = getIterator(iterable);
	      var iterations = 0;
	      if (isIterator(iterator)) {
	        var step;
	        while (!(step = iterator.next()).done) {
	          if (fn(step.value, iterations++, this) === false) {
	            break;
	          }
	        }
	      }
	      return iterations;
	    };
	
	    IterableSeq.prototype.__iteratorUncached = function(type, reverse) {
	      if (reverse) {
	        return this.cacheResult().__iterator(type, reverse);
	      }
	      var iterable = this._iterable;
	      var iterator = getIterator(iterable);
	      if (!isIterator(iterator)) {
	        return new Iterator(iteratorDone);
	      }
	      var iterations = 0;
	      return new Iterator(function()  {
	        var step = iterator.next();
	        return step.done ? step : iteratorValue(type, iterations++, step.value);
	      });
	    };
	
	
	
	  createClass(IteratorSeq, IndexedSeq);
	    function IteratorSeq(iterator) {
	      this._iterator = iterator;
	      this._iteratorCache = [];
	    }
	
	    IteratorSeq.prototype.__iterateUncached = function(fn, reverse) {
	      if (reverse) {
	        return this.cacheResult().__iterate(fn, reverse);
	      }
	      var iterator = this._iterator;
	      var cache = this._iteratorCache;
	      var iterations = 0;
	      while (iterations < cache.length) {
	        if (fn(cache[iterations], iterations++, this) === false) {
	          return iterations;
	        }
	      }
	      var step;
	      while (!(step = iterator.next()).done) {
	        var val = step.value;
	        cache[iterations] = val;
	        if (fn(val, iterations++, this) === false) {
	          break;
	        }
	      }
	      return iterations;
	    };
	
	    IteratorSeq.prototype.__iteratorUncached = function(type, reverse) {
	      if (reverse) {
	        return this.cacheResult().__iterator(type, reverse);
	      }
	      var iterator = this._iterator;
	      var cache = this._iteratorCache;
	      var iterations = 0;
	      return new Iterator(function()  {
	        if (iterations >= cache.length) {
	          var step = iterator.next();
	          if (step.done) {
	            return step;
	          }
	          cache[iterations] = step.value;
	        }
	        return iteratorValue(type, iterations, cache[iterations++]);
	      });
	    };
	
	
	
	
	  // # pragma Helper functions
	
	  function isSeq(maybeSeq) {
	    return !!(maybeSeq && maybeSeq[IS_SEQ_SENTINEL]);
	  }
	
	  var EMPTY_SEQ;
	
	  function emptySequence() {
	    return EMPTY_SEQ || (EMPTY_SEQ = new ArraySeq([]));
	  }
	
	  function keyedSeqFromValue(value) {
	    var seq =
	      Array.isArray(value) ? new ArraySeq(value).fromEntrySeq() :
	      isIterator(value) ? new IteratorSeq(value).fromEntrySeq() :
	      hasIterator(value) ? new IterableSeq(value).fromEntrySeq() :
	      typeof value === 'object' ? new ObjectSeq(value) :
	      undefined;
	    if (!seq) {
	      throw new TypeError(
	        'Expected Array or iterable object of [k, v] entries, '+
	        'or keyed object: ' + value
	      );
	    }
	    return seq;
	  }
	
	  function indexedSeqFromValue(value) {
	    var seq = maybeIndexedSeqFromValue(value);
	    if (!seq) {
	      throw new TypeError(
	        'Expected Array or iterable object of values: ' + value
	      );
	    }
	    return seq;
	  }
	
	  function seqFromValue(value) {
	    var seq = maybeIndexedSeqFromValue(value) ||
	      (typeof value === 'object' && new ObjectSeq(value));
	    if (!seq) {
	      throw new TypeError(
	        'Expected Array or iterable object of values, or keyed object: ' + value
	      );
	    }
	    return seq;
	  }
	
	  function maybeIndexedSeqFromValue(value) {
	    return (
	      isArrayLike(value) ? new ArraySeq(value) :
	      isIterator(value) ? new IteratorSeq(value) :
	      hasIterator(value) ? new IterableSeq(value) :
	      undefined
	    );
	  }
	
	  function seqIterate(seq, fn, reverse, useKeys) {
	    var cache = seq._cache;
	    if (cache) {
	      var maxIndex = cache.length - 1;
	      for (var ii = 0; ii <= maxIndex; ii++) {
	        var entry = cache[reverse ? maxIndex - ii : ii];
	        if (fn(entry[1], useKeys ? entry[0] : ii, seq) === false) {
	          return ii + 1;
	        }
	      }
	      return ii;
	    }
	    return seq.__iterateUncached(fn, reverse);
	  }
	
	  function seqIterator(seq, type, reverse, useKeys) {
	    var cache = seq._cache;
	    if (cache) {
	      var maxIndex = cache.length - 1;
	      var ii = 0;
	      return new Iterator(function()  {
	        var entry = cache[reverse ? maxIndex - ii : ii];
	        return ii++ > maxIndex ?
	          iteratorDone() :
	          iteratorValue(type, useKeys ? entry[0] : ii - 1, entry[1]);
	      });
	    }
	    return seq.__iteratorUncached(type, reverse);
	  }
	
	  function fromJS(json, converter) {
	    return converter ?
	      fromJSWith(converter, json, '', {'': json}) :
	      fromJSDefault(json);
	  }
	
	  function fromJSWith(converter, json, key, parentJSON) {
	    if (Array.isArray(json)) {
	      return converter.call(parentJSON, key, IndexedSeq(json).map(function(v, k)  {return fromJSWith(converter, v, k, json)}));
	    }
	    if (isPlainObj(json)) {
	      return converter.call(parentJSON, key, KeyedSeq(json).map(function(v, k)  {return fromJSWith(converter, v, k, json)}));
	    }
	    return json;
	  }
	
	  function fromJSDefault(json) {
	    if (Array.isArray(json)) {
	      return IndexedSeq(json).map(fromJSDefault).toList();
	    }
	    if (isPlainObj(json)) {
	      return KeyedSeq(json).map(fromJSDefault).toMap();
	    }
	    return json;
	  }
	
	  function isPlainObj(value) {
	    return value && (value.constructor === Object || value.constructor === undefined);
	  }
	
	  /**
	   * An extension of the "same-value" algorithm as [described for use by ES6 Map
	   * and Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#Key_equality)
	   *
	   * NaN is considered the same as NaN, however -0 and 0 are considered the same
	   * value, which is different from the algorithm described by
	   * [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
	   *
	   * This is extended further to allow Objects to describe the values they
	   * represent, by way of `valueOf` or `equals` (and `hashCode`).
	   *
	   * Note: because of this extension, the key equality of Immutable.Map and the
	   * value equality of Immutable.Set will differ from ES6 Map and Set.
	   *
	   * ### Defining custom values
	   *
	   * The easiest way to describe the value an object represents is by implementing
	   * `valueOf`. For example, `Date` represents a value by returning a unix
	   * timestamp for `valueOf`:
	   *
	   *     var date1 = new Date(1234567890000); // Fri Feb 13 2009 ...
	   *     var date2 = new Date(1234567890000);
	   *     date1.valueOf(); // 1234567890000
	   *     assert( date1 !== date2 );
	   *     assert( Immutable.is( date1, date2 ) );
	   *
	   * Note: overriding `valueOf` may have other implications if you use this object
	   * where JavaScript expects a primitive, such as implicit string coercion.
	   *
	   * For more complex types, especially collections, implementing `valueOf` may
	   * not be performant. An alternative is to implement `equals` and `hashCode`.
	   *
	   * `equals` takes another object, presumably of similar type, and returns true
	   * if the it is equal. Equality is symmetrical, so the same result should be
	   * returned if this and the argument are flipped.
	   *
	   *     assert( a.equals(b) === b.equals(a) );
	   *
	   * `hashCode` returns a 32bit integer number representing the object which will
	   * be used to determine how to store the value object in a Map or Set. You must
	   * provide both or neither methods, one must not exist without the other.
	   *
	   * Also, an important relationship between these methods must be upheld: if two
	   * values are equal, they *must* return the same hashCode. If the values are not
	   * equal, they might have the same hashCode; this is called a hash collision,
	   * and while undesirable for performance reasons, it is acceptable.
	   *
	   *     if (a.equals(b)) {
	   *       assert( a.hashCode() === b.hashCode() );
	   *     }
	   *
	   * All Immutable collections implement `equals` and `hashCode`.
	   *
	   */
	  function is(valueA, valueB) {
	    if (valueA === valueB || (valueA !== valueA && valueB !== valueB)) {
	      return true;
	    }
	    if (!valueA || !valueB) {
	      return false;
	    }
	    if (typeof valueA.valueOf === 'function' &&
	        typeof valueB.valueOf === 'function') {
	      valueA = valueA.valueOf();
	      valueB = valueB.valueOf();
	      if (valueA === valueB || (valueA !== valueA && valueB !== valueB)) {
	        return true;
	      }
	      if (!valueA || !valueB) {
	        return false;
	      }
	    }
	    if (typeof valueA.equals === 'function' &&
	        typeof valueB.equals === 'function' &&
	        valueA.equals(valueB)) {
	      return true;
	    }
	    return false;
	  }
	
	  function deepEqual(a, b) {
	    if (a === b) {
	      return true;
	    }
	
	    if (
	      !isIterable(b) ||
	      a.size !== undefined && b.size !== undefined && a.size !== b.size ||
	      a.__hash !== undefined && b.__hash !== undefined && a.__hash !== b.__hash ||
	      isKeyed(a) !== isKeyed(b) ||
	      isIndexed(a) !== isIndexed(b) ||
	      isOrdered(a) !== isOrdered(b)
	    ) {
	      return false;
	    }
	
	    if (a.size === 0 && b.size === 0) {
	      return true;
	    }
	
	    var notAssociative = !isAssociative(a);
	
	    if (isOrdered(a)) {
	      var entries = a.entries();
	      return b.every(function(v, k)  {
	        var entry = entries.next().value;
	        return entry && is(entry[1], v) && (notAssociative || is(entry[0], k));
	      }) && entries.next().done;
	    }
	
	    var flipped = false;
	
	    if (a.size === undefined) {
	      if (b.size === undefined) {
	        if (typeof a.cacheResult === 'function') {
	          a.cacheResult();
	        }
	      } else {
	        flipped = true;
	        var _ = a;
	        a = b;
	        b = _;
	      }
	    }
	
	    var allEqual = true;
	    var bSize = b.__iterate(function(v, k)  {
	      if (notAssociative ? !a.has(v) :
	          flipped ? !is(v, a.get(k, NOT_SET)) : !is(a.get(k, NOT_SET), v)) {
	        allEqual = false;
	        return false;
	      }
	    });
	
	    return allEqual && a.size === bSize;
	  }
	
	  createClass(Repeat, IndexedSeq);
	
	    function Repeat(value, times) {
	      if (!(this instanceof Repeat)) {
	        return new Repeat(value, times);
	      }
	      this._value = value;
	      this.size = times === undefined ? Infinity : Math.max(0, times);
	      if (this.size === 0) {
	        if (EMPTY_REPEAT) {
	          return EMPTY_REPEAT;
	        }
	        EMPTY_REPEAT = this;
	      }
	    }
	
	    Repeat.prototype.toString = function() {
	      if (this.size === 0) {
	        return 'Repeat []';
	      }
	      return 'Repeat [ ' + this._value + ' ' + this.size + ' times ]';
	    };
	
	    Repeat.prototype.get = function(index, notSetValue) {
	      return this.has(index) ? this._value : notSetValue;
	    };
	
	    Repeat.prototype.includes = function(searchValue) {
	      return is(this._value, searchValue);
	    };
	
	    Repeat.prototype.slice = function(begin, end) {
	      var size = this.size;
	      return wholeSlice(begin, end, size) ? this :
	        new Repeat(this._value, resolveEnd(end, size) - resolveBegin(begin, size));
	    };
	
	    Repeat.prototype.reverse = function() {
	      return this;
	    };
	
	    Repeat.prototype.indexOf = function(searchValue) {
	      if (is(this._value, searchValue)) {
	        return 0;
	      }
	      return -1;
	    };
	
	    Repeat.prototype.lastIndexOf = function(searchValue) {
	      if (is(this._value, searchValue)) {
	        return this.size;
	      }
	      return -1;
	    };
	
	    Repeat.prototype.__iterate = function(fn, reverse) {
	      for (var ii = 0; ii < this.size; ii++) {
	        if (fn(this._value, ii, this) === false) {
	          return ii + 1;
	        }
	      }
	      return ii;
	    };
	
	    Repeat.prototype.__iterator = function(type, reverse) {var this$0 = this;
	      var ii = 0;
	      return new Iterator(function() 
	        {return ii < this$0.size ? iteratorValue(type, ii++, this$0._value) : iteratorDone()}
	      );
	    };
	
	    Repeat.prototype.equals = function(other) {
	      return other instanceof Repeat ?
	        is(this._value, other._value) :
	        deepEqual(other);
	    };
	
	
	  var EMPTY_REPEAT;
	
	  function invariant(condition, error) {
	    if (!condition) throw new Error(error);
	  }
	
	  createClass(Range, IndexedSeq);
	
	    function Range(start, end, step) {
	      if (!(this instanceof Range)) {
	        return new Range(start, end, step);
	      }
	      invariant(step !== 0, 'Cannot step a Range by 0');
	      start = start || 0;
	      if (end === undefined) {
	        end = Infinity;
	      }
	      step = step === undefined ? 1 : Math.abs(step);
	      if (end < start) {
	        step = -step;
	      }
	      this._start = start;
	      this._end = end;
	      this._step = step;
	      this.size = Math.max(0, Math.ceil((end - start) / step - 1) + 1);
	      if (this.size === 0) {
	        if (EMPTY_RANGE) {
	          return EMPTY_RANGE;
	        }
	        EMPTY_RANGE = this;
	      }
	    }
	
	    Range.prototype.toString = function() {
	      if (this.size === 0) {
	        return 'Range []';
	      }
	      return 'Range [ ' +
	        this._start + '...' + this._end +
	        (this._step !== 1 ? ' by ' + this._step : '') +
	      ' ]';
	    };
	
	    Range.prototype.get = function(index, notSetValue) {
	      return this.has(index) ?
	        this._start + wrapIndex(this, index) * this._step :
	        notSetValue;
	    };
	
	    Range.prototype.includes = function(searchValue) {
	      var possibleIndex = (searchValue - this._start) / this._step;
	      return possibleIndex >= 0 &&
	        possibleIndex < this.size &&
	        possibleIndex === Math.floor(possibleIndex);
	    };
	
	    Range.prototype.slice = function(begin, end) {
	      if (wholeSlice(begin, end, this.size)) {
	        return this;
	      }
	      begin = resolveBegin(begin, this.size);
	      end = resolveEnd(end, this.size);
	      if (end <= begin) {
	        return new Range(0, 0);
	      }
	      return new Range(this.get(begin, this._end), this.get(end, this._end), this._step);
	    };
	
	    Range.prototype.indexOf = function(searchValue) {
	      var offsetValue = searchValue - this._start;
	      if (offsetValue % this._step === 0) {
	        var index = offsetValue / this._step;
	        if (index >= 0 && index < this.size) {
	          return index
	        }
	      }
	      return -1;
	    };
	
	    Range.prototype.lastIndexOf = function(searchValue) {
	      return this.indexOf(searchValue);
	    };
	
	    Range.prototype.__iterate = function(fn, reverse) {
	      var maxIndex = this.size - 1;
	      var step = this._step;
	      var value = reverse ? this._start + maxIndex * step : this._start;
	      for (var ii = 0; ii <= maxIndex; ii++) {
	        if (fn(value, ii, this) === false) {
	          return ii + 1;
	        }
	        value += reverse ? -step : step;
	      }
	      return ii;
	    };
	
	    Range.prototype.__iterator = function(type, reverse) {
	      var maxIndex = this.size - 1;
	      var step = this._step;
	      var value = reverse ? this._start + maxIndex * step : this._start;
	      var ii = 0;
	      return new Iterator(function()  {
	        var v = value;
	        value += reverse ? -step : step;
	        return ii > maxIndex ? iteratorDone() : iteratorValue(type, ii++, v);
	      });
	    };
	
	    Range.prototype.equals = function(other) {
	      return other instanceof Range ?
	        this._start === other._start &&
	        this._end === other._end &&
	        this._step === other._step :
	        deepEqual(this, other);
	    };
	
	
	  var EMPTY_RANGE;
	
	  createClass(Collection, Iterable);
	    function Collection() {
	      throw TypeError('Abstract');
	    }
	
	
	  createClass(KeyedCollection, Collection);function KeyedCollection() {}
	
	  createClass(IndexedCollection, Collection);function IndexedCollection() {}
	
	  createClass(SetCollection, Collection);function SetCollection() {}
	
	
	  Collection.Keyed = KeyedCollection;
	  Collection.Indexed = IndexedCollection;
	  Collection.Set = SetCollection;
	
	  var imul =
	    typeof Math.imul === 'function' && Math.imul(0xffffffff, 2) === -2 ?
	    Math.imul :
	    function imul(a, b) {
	      a = a | 0; // int
	      b = b | 0; // int
	      var c = a & 0xffff;
	      var d = b & 0xffff;
	      // Shift by 0 fixes the sign on the high part.
	      return (c * d) + ((((a >>> 16) * d + c * (b >>> 16)) << 16) >>> 0) | 0; // int
	    };
	
	  // v8 has an optimization for storing 31-bit signed numbers.
	  // Values which have either 00 or 11 as the high order bits qualify.
	  // This function drops the highest order bit in a signed number, maintaining
	  // the sign bit.
	  function smi(i32) {
	    return ((i32 >>> 1) & 0x40000000) | (i32 & 0xBFFFFFFF);
	  }
	
	  function hash(o) {
	    if (o === false || o === null || o === undefined) {
	      return 0;
	    }
	    if (typeof o.valueOf === 'function') {
	      o = o.valueOf();
	      if (o === false || o === null || o === undefined) {
	        return 0;
	      }
	    }
	    if (o === true) {
	      return 1;
	    }
	    var type = typeof o;
	    if (type === 'number') {
	      if (o !== o || o === Infinity) {
	        return 0;
	      }
	      var h = o | 0;
	      if (h !== o) {
	        h ^= o * 0xFFFFFFFF;
	      }
	      while (o > 0xFFFFFFFF) {
	        o /= 0xFFFFFFFF;
	        h ^= o;
	      }
	      return smi(h);
	    }
	    if (type === 'string') {
	      return o.length > STRING_HASH_CACHE_MIN_STRLEN ? cachedHashString(o) : hashString(o);
	    }
	    if (typeof o.hashCode === 'function') {
	      return o.hashCode();
	    }
	    if (type === 'object') {
	      return hashJSObj(o);
	    }
	    if (typeof o.toString === 'function') {
	      return hashString(o.toString());
	    }
	    throw new Error('Value type ' + type + ' cannot be hashed.');
	  }
	
	  function cachedHashString(string) {
	    var hash = stringHashCache[string];
	    if (hash === undefined) {
	      hash = hashString(string);
	      if (STRING_HASH_CACHE_SIZE === STRING_HASH_CACHE_MAX_SIZE) {
	        STRING_HASH_CACHE_SIZE = 0;
	        stringHashCache = {};
	      }
	      STRING_HASH_CACHE_SIZE++;
	      stringHashCache[string] = hash;
	    }
	    return hash;
	  }
	
	  // http://jsperf.com/hashing-strings
	  function hashString(string) {
	    // This is the hash from JVM
	    // The hash code for a string is computed as
	    // s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1],
	    // where s[i] is the ith character of the string and n is the length of
	    // the string. We "mod" the result to make it between 0 (inclusive) and 2^31
	    // (exclusive) by dropping high bits.
	    var hash = 0;
	    for (var ii = 0; ii < string.length; ii++) {
	      hash = 31 * hash + string.charCodeAt(ii) | 0;
	    }
	    return smi(hash);
	  }
	
	  function hashJSObj(obj) {
	    var hash;
	    if (usingWeakMap) {
	      hash = weakMap.get(obj);
	      if (hash !== undefined) {
	        return hash;
	      }
	    }
	
	    hash = obj[UID_HASH_KEY];
	    if (hash !== undefined) {
	      return hash;
	    }
	
	    if (!canDefineProperty) {
	      hash = obj.propertyIsEnumerable && obj.propertyIsEnumerable[UID_HASH_KEY];
	      if (hash !== undefined) {
	        return hash;
	      }
	
	      hash = getIENodeHash(obj);
	      if (hash !== undefined) {
	        return hash;
	      }
	    }
	
	    hash = ++objHashUID;
	    if (objHashUID & 0x40000000) {
	      objHashUID = 0;
	    }
	
	    if (usingWeakMap) {
	      weakMap.set(obj, hash);
	    } else if (isExtensible !== undefined && isExtensible(obj) === false) {
	      throw new Error('Non-extensible objects are not allowed as keys.');
	    } else if (canDefineProperty) {
	      Object.defineProperty(obj, UID_HASH_KEY, {
	        'enumerable': false,
	        'configurable': false,
	        'writable': false,
	        'value': hash
	      });
	    } else if (obj.propertyIsEnumerable !== undefined &&
	               obj.propertyIsEnumerable === obj.constructor.prototype.propertyIsEnumerable) {
	      // Since we can't define a non-enumerable property on the object
	      // we'll hijack one of the less-used non-enumerable properties to
	      // save our hash on it. Since this is a function it will not show up in
	      // `JSON.stringify` which is what we want.
	      obj.propertyIsEnumerable = function() {
	        return this.constructor.prototype.propertyIsEnumerable.apply(this, arguments);
	      };
	      obj.propertyIsEnumerable[UID_HASH_KEY] = hash;
	    } else if (obj.nodeType !== undefined) {
	      // At this point we couldn't get the IE `uniqueID` to use as a hash
	      // and we couldn't use a non-enumerable property to exploit the
	      // dontEnum bug so we simply add the `UID_HASH_KEY` on the node
	      // itself.
	      obj[UID_HASH_KEY] = hash;
	    } else {
	      throw new Error('Unable to set a non-enumerable property on object.');
	    }
	
	    return hash;
	  }
	
	  // Get references to ES5 object methods.
	  var isExtensible = Object.isExtensible;
	
	  // True if Object.defineProperty works as expected. IE8 fails this test.
	  var canDefineProperty = (function() {
	    try {
	      Object.defineProperty({}, '@', {});
	      return true;
	    } catch (e) {
	      return false;
	    }
	  }());
	
	  // IE has a `uniqueID` property on DOM nodes. We can construct the hash from it
	  // and avoid memory leaks from the IE cloneNode bug.
	  function getIENodeHash(node) {
	    if (node && node.nodeType > 0) {
	      switch (node.nodeType) {
	        case 1: // Element
	          return node.uniqueID;
	        case 9: // Document
	          return node.documentElement && node.documentElement.uniqueID;
	      }
	    }
	  }
	
	  // If possible, use a WeakMap.
	  var usingWeakMap = typeof WeakMap === 'function';
	  var weakMap;
	  if (usingWeakMap) {
	    weakMap = new WeakMap();
	  }
	
	  var objHashUID = 0;
	
	  var UID_HASH_KEY = '__immutablehash__';
	  if (typeof Symbol === 'function') {
	    UID_HASH_KEY = Symbol(UID_HASH_KEY);
	  }
	
	  var STRING_HASH_CACHE_MIN_STRLEN = 16;
	  var STRING_HASH_CACHE_MAX_SIZE = 255;
	  var STRING_HASH_CACHE_SIZE = 0;
	  var stringHashCache = {};
	
	  function assertNotInfinite(size) {
	    invariant(
	      size !== Infinity,
	      'Cannot perform this action with an infinite size.'
	    );
	  }
	
	  createClass(Map, KeyedCollection);
	
	    // @pragma Construction
	
	    function Map(value) {
	      return value === null || value === undefined ? emptyMap() :
	        isMap(value) && !isOrdered(value) ? value :
	        emptyMap().withMutations(function(map ) {
	          var iter = KeyedIterable(value);
	          assertNotInfinite(iter.size);
	          iter.forEach(function(v, k)  {return map.set(k, v)});
	        });
	    }
	
	    Map.of = function() {var keyValues = SLICE$0.call(arguments, 0);
	      return emptyMap().withMutations(function(map ) {
	        for (var i = 0; i < keyValues.length; i += 2) {
	          if (i + 1 >= keyValues.length) {
	            throw new Error('Missing value for key: ' + keyValues[i]);
	          }
	          map.set(keyValues[i], keyValues[i + 1]);
	        }
	      });
	    };
	
	    Map.prototype.toString = function() {
	      return this.__toString('Map {', '}');
	    };
	
	    // @pragma Access
	
	    Map.prototype.get = function(k, notSetValue) {
	      return this._root ?
	        this._root.get(0, undefined, k, notSetValue) :
	        notSetValue;
	    };
	
	    // @pragma Modification
	
	    Map.prototype.set = function(k, v) {
	      return updateMap(this, k, v);
	    };
	
	    Map.prototype.setIn = function(keyPath, v) {
	      return this.updateIn(keyPath, NOT_SET, function()  {return v});
	    };
	
	    Map.prototype.remove = function(k) {
	      return updateMap(this, k, NOT_SET);
	    };
	
	    Map.prototype.deleteIn = function(keyPath) {
	      return this.updateIn(keyPath, function()  {return NOT_SET});
	    };
	
	    Map.prototype.update = function(k, notSetValue, updater) {
	      return arguments.length === 1 ?
	        k(this) :
	        this.updateIn([k], notSetValue, updater);
	    };
	
	    Map.prototype.updateIn = function(keyPath, notSetValue, updater) {
	      if (!updater) {
	        updater = notSetValue;
	        notSetValue = undefined;
	      }
	      var updatedValue = updateInDeepMap(
	        this,
	        forceIterator(keyPath),
	        notSetValue,
	        updater
	      );
	      return updatedValue === NOT_SET ? undefined : updatedValue;
	    };
	
	    Map.prototype.clear = function() {
	      if (this.size === 0) {
	        return this;
	      }
	      if (this.__ownerID) {
	        this.size = 0;
	        this._root = null;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return emptyMap();
	    };
	
	    // @pragma Composition
	
	    Map.prototype.merge = function(/*...iters*/) {
	      return mergeIntoMapWith(this, undefined, arguments);
	    };
	
	    Map.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
	      return mergeIntoMapWith(this, merger, iters);
	    };
	
	    Map.prototype.mergeIn = function(keyPath) {var iters = SLICE$0.call(arguments, 1);
	      return this.updateIn(
	        keyPath,
	        emptyMap(),
	        function(m ) {return typeof m.merge === 'function' ?
	          m.merge.apply(m, iters) :
	          iters[iters.length - 1]}
	      );
	    };
	
	    Map.prototype.mergeDeep = function(/*...iters*/) {
	      return mergeIntoMapWith(this, deepMerger, arguments);
	    };
	
	    Map.prototype.mergeDeepWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
	      return mergeIntoMapWith(this, deepMergerWith(merger), iters);
	    };
	
	    Map.prototype.mergeDeepIn = function(keyPath) {var iters = SLICE$0.call(arguments, 1);
	      return this.updateIn(
	        keyPath,
	        emptyMap(),
	        function(m ) {return typeof m.mergeDeep === 'function' ?
	          m.mergeDeep.apply(m, iters) :
	          iters[iters.length - 1]}
	      );
	    };
	
	    Map.prototype.sort = function(comparator) {
	      // Late binding
	      return OrderedMap(sortFactory(this, comparator));
	    };
	
	    Map.prototype.sortBy = function(mapper, comparator) {
	      // Late binding
	      return OrderedMap(sortFactory(this, comparator, mapper));
	    };
	
	    // @pragma Mutability
	
	    Map.prototype.withMutations = function(fn) {
	      var mutable = this.asMutable();
	      fn(mutable);
	      return mutable.wasAltered() ? mutable.__ensureOwner(this.__ownerID) : this;
	    };
	
	    Map.prototype.asMutable = function() {
	      return this.__ownerID ? this : this.__ensureOwner(new OwnerID());
	    };
	
	    Map.prototype.asImmutable = function() {
	      return this.__ensureOwner();
	    };
	
	    Map.prototype.wasAltered = function() {
	      return this.__altered;
	    };
	
	    Map.prototype.__iterator = function(type, reverse) {
	      return new MapIterator(this, type, reverse);
	    };
	
	    Map.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      var iterations = 0;
	      this._root && this._root.iterate(function(entry ) {
	        iterations++;
	        return fn(entry[1], entry[0], this$0);
	      }, reverse);
	      return iterations;
	    };
	
	    Map.prototype.__ensureOwner = function(ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      if (!ownerID) {
	        this.__ownerID = ownerID;
	        this.__altered = false;
	        return this;
	      }
	      return makeMap(this.size, this._root, ownerID, this.__hash);
	    };
	
	
	  function isMap(maybeMap) {
	    return !!(maybeMap && maybeMap[IS_MAP_SENTINEL]);
	  }
	
	  Map.isMap = isMap;
	
	  var IS_MAP_SENTINEL = '@@__IMMUTABLE_MAP__@@';
	
	  var MapPrototype = Map.prototype;
	  MapPrototype[IS_MAP_SENTINEL] = true;
	  MapPrototype[DELETE] = MapPrototype.remove;
	  MapPrototype.removeIn = MapPrototype.deleteIn;
	
	
	  // #pragma Trie Nodes
	
	
	
	    function ArrayMapNode(ownerID, entries) {
	      this.ownerID = ownerID;
	      this.entries = entries;
	    }
	
	    ArrayMapNode.prototype.get = function(shift, keyHash, key, notSetValue) {
	      var entries = this.entries;
	      for (var ii = 0, len = entries.length; ii < len; ii++) {
	        if (is(key, entries[ii][0])) {
	          return entries[ii][1];
	        }
	      }
	      return notSetValue;
	    };
	
	    ArrayMapNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	      var removed = value === NOT_SET;
	
	      var entries = this.entries;
	      var idx = 0;
	      for (var len = entries.length; idx < len; idx++) {
	        if (is(key, entries[idx][0])) {
	          break;
	        }
	      }
	      var exists = idx < len;
	
	      if (exists ? entries[idx][1] === value : removed) {
	        return this;
	      }
	
	      SetRef(didAlter);
	      (removed || !exists) && SetRef(didChangeSize);
	
	      if (removed && entries.length === 1) {
	        return; // undefined
	      }
	
	      if (!exists && !removed && entries.length >= MAX_ARRAY_MAP_SIZE) {
	        return createNodes(ownerID, entries, key, value);
	      }
	
	      var isEditable = ownerID && ownerID === this.ownerID;
	      var newEntries = isEditable ? entries : arrCopy(entries);
	
	      if (exists) {
	        if (removed) {
	          idx === len - 1 ? newEntries.pop() : (newEntries[idx] = newEntries.pop());
	        } else {
	          newEntries[idx] = [key, value];
	        }
	      } else {
	        newEntries.push([key, value]);
	      }
	
	      if (isEditable) {
	        this.entries = newEntries;
	        return this;
	      }
	
	      return new ArrayMapNode(ownerID, newEntries);
	    };
	
	
	
	
	    function BitmapIndexedNode(ownerID, bitmap, nodes) {
	      this.ownerID = ownerID;
	      this.bitmap = bitmap;
	      this.nodes = nodes;
	    }
	
	    BitmapIndexedNode.prototype.get = function(shift, keyHash, key, notSetValue) {
	      if (keyHash === undefined) {
	        keyHash = hash(key);
	      }
	      var bit = (1 << ((shift === 0 ? keyHash : keyHash >>> shift) & MASK));
	      var bitmap = this.bitmap;
	      return (bitmap & bit) === 0 ? notSetValue :
	        this.nodes[popCount(bitmap & (bit - 1))].get(shift + SHIFT, keyHash, key, notSetValue);
	    };
	
	    BitmapIndexedNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	      if (keyHash === undefined) {
	        keyHash = hash(key);
	      }
	      var keyHashFrag = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
	      var bit = 1 << keyHashFrag;
	      var bitmap = this.bitmap;
	      var exists = (bitmap & bit) !== 0;
	
	      if (!exists && value === NOT_SET) {
	        return this;
	      }
	
	      var idx = popCount(bitmap & (bit - 1));
	      var nodes = this.nodes;
	      var node = exists ? nodes[idx] : undefined;
	      var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);
	
	      if (newNode === node) {
	        return this;
	      }
	
	      if (!exists && newNode && nodes.length >= MAX_BITMAP_INDEXED_SIZE) {
	        return expandNodes(ownerID, nodes, bitmap, keyHashFrag, newNode);
	      }
	
	      if (exists && !newNode && nodes.length === 2 && isLeafNode(nodes[idx ^ 1])) {
	        return nodes[idx ^ 1];
	      }
	
	      if (exists && newNode && nodes.length === 1 && isLeafNode(newNode)) {
	        return newNode;
	      }
	
	      var isEditable = ownerID && ownerID === this.ownerID;
	      var newBitmap = exists ? newNode ? bitmap : bitmap ^ bit : bitmap | bit;
	      var newNodes = exists ? newNode ?
	        setIn(nodes, idx, newNode, isEditable) :
	        spliceOut(nodes, idx, isEditable) :
	        spliceIn(nodes, idx, newNode, isEditable);
	
	      if (isEditable) {
	        this.bitmap = newBitmap;
	        this.nodes = newNodes;
	        return this;
	      }
	
	      return new BitmapIndexedNode(ownerID, newBitmap, newNodes);
	    };
	
	
	
	
	    function HashArrayMapNode(ownerID, count, nodes) {
	      this.ownerID = ownerID;
	      this.count = count;
	      this.nodes = nodes;
	    }
	
	    HashArrayMapNode.prototype.get = function(shift, keyHash, key, notSetValue) {
	      if (keyHash === undefined) {
	        keyHash = hash(key);
	      }
	      var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
	      var node = this.nodes[idx];
	      return node ? node.get(shift + SHIFT, keyHash, key, notSetValue) : notSetValue;
	    };
	
	    HashArrayMapNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	      if (keyHash === undefined) {
	        keyHash = hash(key);
	      }
	      var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
	      var removed = value === NOT_SET;
	      var nodes = this.nodes;
	      var node = nodes[idx];
	
	      if (removed && !node) {
	        return this;
	      }
	
	      var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);
	      if (newNode === node) {
	        return this;
	      }
	
	      var newCount = this.count;
	      if (!node) {
	        newCount++;
	      } else if (!newNode) {
	        newCount--;
	        if (newCount < MIN_HASH_ARRAY_MAP_SIZE) {
	          return packNodes(ownerID, nodes, newCount, idx);
	        }
	      }
	
	      var isEditable = ownerID && ownerID === this.ownerID;
	      var newNodes = setIn(nodes, idx, newNode, isEditable);
	
	      if (isEditable) {
	        this.count = newCount;
	        this.nodes = newNodes;
	        return this;
	      }
	
	      return new HashArrayMapNode(ownerID, newCount, newNodes);
	    };
	
	
	
	
	    function HashCollisionNode(ownerID, keyHash, entries) {
	      this.ownerID = ownerID;
	      this.keyHash = keyHash;
	      this.entries = entries;
	    }
	
	    HashCollisionNode.prototype.get = function(shift, keyHash, key, notSetValue) {
	      var entries = this.entries;
	      for (var ii = 0, len = entries.length; ii < len; ii++) {
	        if (is(key, entries[ii][0])) {
	          return entries[ii][1];
	        }
	      }
	      return notSetValue;
	    };
	
	    HashCollisionNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	      if (keyHash === undefined) {
	        keyHash = hash(key);
	      }
	
	      var removed = value === NOT_SET;
	
	      if (keyHash !== this.keyHash) {
	        if (removed) {
	          return this;
	        }
	        SetRef(didAlter);
	        SetRef(didChangeSize);
	        return mergeIntoNode(this, ownerID, shift, keyHash, [key, value]);
	      }
	
	      var entries = this.entries;
	      var idx = 0;
	      for (var len = entries.length; idx < len; idx++) {
	        if (is(key, entries[idx][0])) {
	          break;
	        }
	      }
	      var exists = idx < len;
	
	      if (exists ? entries[idx][1] === value : removed) {
	        return this;
	      }
	
	      SetRef(didAlter);
	      (removed || !exists) && SetRef(didChangeSize);
	
	      if (removed && len === 2) {
	        return new ValueNode(ownerID, this.keyHash, entries[idx ^ 1]);
	      }
	
	      var isEditable = ownerID && ownerID === this.ownerID;
	      var newEntries = isEditable ? entries : arrCopy(entries);
	
	      if (exists) {
	        if (removed) {
	          idx === len - 1 ? newEntries.pop() : (newEntries[idx] = newEntries.pop());
	        } else {
	          newEntries[idx] = [key, value];
	        }
	      } else {
	        newEntries.push([key, value]);
	      }
	
	      if (isEditable) {
	        this.entries = newEntries;
	        return this;
	      }
	
	      return new HashCollisionNode(ownerID, this.keyHash, newEntries);
	    };
	
	
	
	
	    function ValueNode(ownerID, keyHash, entry) {
	      this.ownerID = ownerID;
	      this.keyHash = keyHash;
	      this.entry = entry;
	    }
	
	    ValueNode.prototype.get = function(shift, keyHash, key, notSetValue) {
	      return is(key, this.entry[0]) ? this.entry[1] : notSetValue;
	    };
	
	    ValueNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	      var removed = value === NOT_SET;
	      var keyMatch = is(key, this.entry[0]);
	      if (keyMatch ? value === this.entry[1] : removed) {
	        return this;
	      }
	
	      SetRef(didAlter);
	
	      if (removed) {
	        SetRef(didChangeSize);
	        return; // undefined
	      }
	
	      if (keyMatch) {
	        if (ownerID && ownerID === this.ownerID) {
	          this.entry[1] = value;
	          return this;
	        }
	        return new ValueNode(ownerID, this.keyHash, [key, value]);
	      }
	
	      SetRef(didChangeSize);
	      return mergeIntoNode(this, ownerID, shift, hash(key), [key, value]);
	    };
	
	
	
	  // #pragma Iterators
	
	  ArrayMapNode.prototype.iterate =
	  HashCollisionNode.prototype.iterate = function (fn, reverse) {
	    var entries = this.entries;
	    for (var ii = 0, maxIndex = entries.length - 1; ii <= maxIndex; ii++) {
	      if (fn(entries[reverse ? maxIndex - ii : ii]) === false) {
	        return false;
	      }
	    }
	  }
	
	  BitmapIndexedNode.prototype.iterate =
	  HashArrayMapNode.prototype.iterate = function (fn, reverse) {
	    var nodes = this.nodes;
	    for (var ii = 0, maxIndex = nodes.length - 1; ii <= maxIndex; ii++) {
	      var node = nodes[reverse ? maxIndex - ii : ii];
	      if (node && node.iterate(fn, reverse) === false) {
	        return false;
	      }
	    }
	  }
	
	  ValueNode.prototype.iterate = function (fn, reverse) {
	    return fn(this.entry);
	  }
	
	  createClass(MapIterator, Iterator);
	
	    function MapIterator(map, type, reverse) {
	      this._type = type;
	      this._reverse = reverse;
	      this._stack = map._root && mapIteratorFrame(map._root);
	    }
	
	    MapIterator.prototype.next = function() {
	      var type = this._type;
	      var stack = this._stack;
	      while (stack) {
	        var node = stack.node;
	        var index = stack.index++;
	        var maxIndex;
	        if (node.entry) {
	          if (index === 0) {
	            return mapIteratorValue(type, node.entry);
	          }
	        } else if (node.entries) {
	          maxIndex = node.entries.length - 1;
	          if (index <= maxIndex) {
	            return mapIteratorValue(type, node.entries[this._reverse ? maxIndex - index : index]);
	          }
	        } else {
	          maxIndex = node.nodes.length - 1;
	          if (index <= maxIndex) {
	            var subNode = node.nodes[this._reverse ? maxIndex - index : index];
	            if (subNode) {
	              if (subNode.entry) {
	                return mapIteratorValue(type, subNode.entry);
	              }
	              stack = this._stack = mapIteratorFrame(subNode, stack);
	            }
	            continue;
	          }
	        }
	        stack = this._stack = this._stack.__prev;
	      }
	      return iteratorDone();
	    };
	
	
	  function mapIteratorValue(type, entry) {
	    return iteratorValue(type, entry[0], entry[1]);
	  }
	
	  function mapIteratorFrame(node, prev) {
	    return {
	      node: node,
	      index: 0,
	      __prev: prev
	    };
	  }
	
	  function makeMap(size, root, ownerID, hash) {
	    var map = Object.create(MapPrototype);
	    map.size = size;
	    map._root = root;
	    map.__ownerID = ownerID;
	    map.__hash = hash;
	    map.__altered = false;
	    return map;
	  }
	
	  var EMPTY_MAP;
	  function emptyMap() {
	    return EMPTY_MAP || (EMPTY_MAP = makeMap(0));
	  }
	
	  function updateMap(map, k, v) {
	    var newRoot;
	    var newSize;
	    if (!map._root) {
	      if (v === NOT_SET) {
	        return map;
	      }
	      newSize = 1;
	      newRoot = new ArrayMapNode(map.__ownerID, [[k, v]]);
	    } else {
	      var didChangeSize = MakeRef(CHANGE_LENGTH);
	      var didAlter = MakeRef(DID_ALTER);
	      newRoot = updateNode(map._root, map.__ownerID, 0, undefined, k, v, didChangeSize, didAlter);
	      if (!didAlter.value) {
	        return map;
	      }
	      newSize = map.size + (didChangeSize.value ? v === NOT_SET ? -1 : 1 : 0);
	    }
	    if (map.__ownerID) {
	      map.size = newSize;
	      map._root = newRoot;
	      map.__hash = undefined;
	      map.__altered = true;
	      return map;
	    }
	    return newRoot ? makeMap(newSize, newRoot) : emptyMap();
	  }
	
	  function updateNode(node, ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	    if (!node) {
	      if (value === NOT_SET) {
	        return node;
	      }
	      SetRef(didAlter);
	      SetRef(didChangeSize);
	      return new ValueNode(ownerID, keyHash, [key, value]);
	    }
	    return node.update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter);
	  }
	
	  function isLeafNode(node) {
	    return node.constructor === ValueNode || node.constructor === HashCollisionNode;
	  }
	
	  function mergeIntoNode(node, ownerID, shift, keyHash, entry) {
	    if (node.keyHash === keyHash) {
	      return new HashCollisionNode(ownerID, keyHash, [node.entry, entry]);
	    }
	
	    var idx1 = (shift === 0 ? node.keyHash : node.keyHash >>> shift) & MASK;
	    var idx2 = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
	
	    var newNode;
	    var nodes = idx1 === idx2 ?
	      [mergeIntoNode(node, ownerID, shift + SHIFT, keyHash, entry)] :
	      ((newNode = new ValueNode(ownerID, keyHash, entry)), idx1 < idx2 ? [node, newNode] : [newNode, node]);
	
	    return new BitmapIndexedNode(ownerID, (1 << idx1) | (1 << idx2), nodes);
	  }
	
	  function createNodes(ownerID, entries, key, value) {
	    if (!ownerID) {
	      ownerID = new OwnerID();
	    }
	    var node = new ValueNode(ownerID, hash(key), [key, value]);
	    for (var ii = 0; ii < entries.length; ii++) {
	      var entry = entries[ii];
	      node = node.update(ownerID, 0, undefined, entry[0], entry[1]);
	    }
	    return node;
	  }
	
	  function packNodes(ownerID, nodes, count, excluding) {
	    var bitmap = 0;
	    var packedII = 0;
	    var packedNodes = new Array(count);
	    for (var ii = 0, bit = 1, len = nodes.length; ii < len; ii++, bit <<= 1) {
	      var node = nodes[ii];
	      if (node !== undefined && ii !== excluding) {
	        bitmap |= bit;
	        packedNodes[packedII++] = node;
	      }
	    }
	    return new BitmapIndexedNode(ownerID, bitmap, packedNodes);
	  }
	
	  function expandNodes(ownerID, nodes, bitmap, including, node) {
	    var count = 0;
	    var expandedNodes = new Array(SIZE);
	    for (var ii = 0; bitmap !== 0; ii++, bitmap >>>= 1) {
	      expandedNodes[ii] = bitmap & 1 ? nodes[count++] : undefined;
	    }
	    expandedNodes[including] = node;
	    return new HashArrayMapNode(ownerID, count + 1, expandedNodes);
	  }
	
	  function mergeIntoMapWith(map, merger, iterables) {
	    var iters = [];
	    for (var ii = 0; ii < iterables.length; ii++) {
	      var value = iterables[ii];
	      var iter = KeyedIterable(value);
	      if (!isIterable(value)) {
	        iter = iter.map(function(v ) {return fromJS(v)});
	      }
	      iters.push(iter);
	    }
	    return mergeIntoCollectionWith(map, merger, iters);
	  }
	
	  function deepMerger(existing, value, key) {
	    return existing && existing.mergeDeep && isIterable(value) ?
	      existing.mergeDeep(value) :
	      is(existing, value) ? existing : value;
	  }
	
	  function deepMergerWith(merger) {
	    return function(existing, value, key)  {
	      if (existing && existing.mergeDeepWith && isIterable(value)) {
	        return existing.mergeDeepWith(merger, value);
	      }
	      var nextValue = merger(existing, value, key);
	      return is(existing, nextValue) ? existing : nextValue;
	    };
	  }
	
	  function mergeIntoCollectionWith(collection, merger, iters) {
	    iters = iters.filter(function(x ) {return x.size !== 0});
	    if (iters.length === 0) {
	      return collection;
	    }
	    if (collection.size === 0 && !collection.__ownerID && iters.length === 1) {
	      return collection.constructor(iters[0]);
	    }
	    return collection.withMutations(function(collection ) {
	      var mergeIntoMap = merger ?
	        function(value, key)  {
	          collection.update(key, NOT_SET, function(existing )
	            {return existing === NOT_SET ? value : merger(existing, value, key)}
	          );
	        } :
	        function(value, key)  {
	          collection.set(key, value);
	        }
	      for (var ii = 0; ii < iters.length; ii++) {
	        iters[ii].forEach(mergeIntoMap);
	      }
	    });
	  }
	
	  function updateInDeepMap(existing, keyPathIter, notSetValue, updater) {
	    var isNotSet = existing === NOT_SET;
	    var step = keyPathIter.next();
	    if (step.done) {
	      var existingValue = isNotSet ? notSetValue : existing;
	      var newValue = updater(existingValue);
	      return newValue === existingValue ? existing : newValue;
	    }
	    invariant(
	      isNotSet || (existing && existing.set),
	      'invalid keyPath'
	    );
	    var key = step.value;
	    var nextExisting = isNotSet ? NOT_SET : existing.get(key, NOT_SET);
	    var nextUpdated = updateInDeepMap(
	      nextExisting,
	      keyPathIter,
	      notSetValue,
	      updater
	    );
	    return nextUpdated === nextExisting ? existing :
	      nextUpdated === NOT_SET ? existing.remove(key) :
	      (isNotSet ? emptyMap() : existing).set(key, nextUpdated);
	  }
	
	  function popCount(x) {
	    x = x - ((x >> 1) & 0x55555555);
	    x = (x & 0x33333333) + ((x >> 2) & 0x33333333);
	    x = (x + (x >> 4)) & 0x0f0f0f0f;
	    x = x + (x >> 8);
	    x = x + (x >> 16);
	    return x & 0x7f;
	  }
	
	  function setIn(array, idx, val, canEdit) {
	    var newArray = canEdit ? array : arrCopy(array);
	    newArray[idx] = val;
	    return newArray;
	  }
	
	  function spliceIn(array, idx, val, canEdit) {
	    var newLen = array.length + 1;
	    if (canEdit && idx + 1 === newLen) {
	      array[idx] = val;
	      return array;
	    }
	    var newArray = new Array(newLen);
	    var after = 0;
	    for (var ii = 0; ii < newLen; ii++) {
	      if (ii === idx) {
	        newArray[ii] = val;
	        after = -1;
	      } else {
	        newArray[ii] = array[ii + after];
	      }
	    }
	    return newArray;
	  }
	
	  function spliceOut(array, idx, canEdit) {
	    var newLen = array.length - 1;
	    if (canEdit && idx === newLen) {
	      array.pop();
	      return array;
	    }
	    var newArray = new Array(newLen);
	    var after = 0;
	    for (var ii = 0; ii < newLen; ii++) {
	      if (ii === idx) {
	        after = 1;
	      }
	      newArray[ii] = array[ii + after];
	    }
	    return newArray;
	  }
	
	  var MAX_ARRAY_MAP_SIZE = SIZE / 4;
	  var MAX_BITMAP_INDEXED_SIZE = SIZE / 2;
	  var MIN_HASH_ARRAY_MAP_SIZE = SIZE / 4;
	
	  createClass(List, IndexedCollection);
	
	    // @pragma Construction
	
	    function List(value) {
	      var empty = emptyList();
	      if (value === null || value === undefined) {
	        return empty;
	      }
	      if (isList(value)) {
	        return value;
	      }
	      var iter = IndexedIterable(value);
	      var size = iter.size;
	      if (size === 0) {
	        return empty;
	      }
	      assertNotInfinite(size);
	      if (size > 0 && size < SIZE) {
	        return makeList(0, size, SHIFT, null, new VNode(iter.toArray()));
	      }
	      return empty.withMutations(function(list ) {
	        list.setSize(size);
	        iter.forEach(function(v, i)  {return list.set(i, v)});
	      });
	    }
	
	    List.of = function(/*...values*/) {
	      return this(arguments);
	    };
	
	    List.prototype.toString = function() {
	      return this.__toString('List [', ']');
	    };
	
	    // @pragma Access
	
	    List.prototype.get = function(index, notSetValue) {
	      index = wrapIndex(this, index);
	      if (index >= 0 && index < this.size) {
	        index += this._origin;
	        var node = listNodeFor(this, index);
	        return node && node.array[index & MASK];
	      }
	      return notSetValue;
	    };
	
	    // @pragma Modification
	
	    List.prototype.set = function(index, value) {
	      return updateList(this, index, value);
	    };
	
	    List.prototype.remove = function(index) {
	      return !this.has(index) ? this :
	        index === 0 ? this.shift() :
	        index === this.size - 1 ? this.pop() :
	        this.splice(index, 1);
	    };
	
	    List.prototype.insert = function(index, value) {
	      return this.splice(index, 0, value);
	    };
	
	    List.prototype.clear = function() {
	      if (this.size === 0) {
	        return this;
	      }
	      if (this.__ownerID) {
	        this.size = this._origin = this._capacity = 0;
	        this._level = SHIFT;
	        this._root = this._tail = null;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return emptyList();
	    };
	
	    List.prototype.push = function(/*...values*/) {
	      var values = arguments;
	      var oldSize = this.size;
	      return this.withMutations(function(list ) {
	        setListBounds(list, 0, oldSize + values.length);
	        for (var ii = 0; ii < values.length; ii++) {
	          list.set(oldSize + ii, values[ii]);
	        }
	      });
	    };
	
	    List.prototype.pop = function() {
	      return setListBounds(this, 0, -1);
	    };
	
	    List.prototype.unshift = function(/*...values*/) {
	      var values = arguments;
	      return this.withMutations(function(list ) {
	        setListBounds(list, -values.length);
	        for (var ii = 0; ii < values.length; ii++) {
	          list.set(ii, values[ii]);
	        }
	      });
	    };
	
	    List.prototype.shift = function() {
	      return setListBounds(this, 1);
	    };
	
	    // @pragma Composition
	
	    List.prototype.merge = function(/*...iters*/) {
	      return mergeIntoListWith(this, undefined, arguments);
	    };
	
	    List.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
	      return mergeIntoListWith(this, merger, iters);
	    };
	
	    List.prototype.mergeDeep = function(/*...iters*/) {
	      return mergeIntoListWith(this, deepMerger, arguments);
	    };
	
	    List.prototype.mergeDeepWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
	      return mergeIntoListWith(this, deepMergerWith(merger), iters);
	    };
	
	    List.prototype.setSize = function(size) {
	      return setListBounds(this, 0, size);
	    };
	
	    // @pragma Iteration
	
	    List.prototype.slice = function(begin, end) {
	      var size = this.size;
	      if (wholeSlice(begin, end, size)) {
	        return this;
	      }
	      return setListBounds(
	        this,
	        resolveBegin(begin, size),
	        resolveEnd(end, size)
	      );
	    };
	
	    List.prototype.__iterator = function(type, reverse) {
	      var index = 0;
	      var values = iterateList(this, reverse);
	      return new Iterator(function()  {
	        var value = values();
	        return value === DONE ?
	          iteratorDone() :
	          iteratorValue(type, index++, value);
	      });
	    };
	
	    List.prototype.__iterate = function(fn, reverse) {
	      var index = 0;
	      var values = iterateList(this, reverse);
	      var value;
	      while ((value = values()) !== DONE) {
	        if (fn(value, index++, this) === false) {
	          break;
	        }
	      }
	      return index;
	    };
	
	    List.prototype.__ensureOwner = function(ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      if (!ownerID) {
	        this.__ownerID = ownerID;
	        return this;
	      }
	      return makeList(this._origin, this._capacity, this._level, this._root, this._tail, ownerID, this.__hash);
	    };
	
	
	  function isList(maybeList) {
	    return !!(maybeList && maybeList[IS_LIST_SENTINEL]);
	  }
	
	  List.isList = isList;
	
	  var IS_LIST_SENTINEL = '@@__IMMUTABLE_LIST__@@';
	
	  var ListPrototype = List.prototype;
	  ListPrototype[IS_LIST_SENTINEL] = true;
	  ListPrototype[DELETE] = ListPrototype.remove;
	  ListPrototype.setIn = MapPrototype.setIn;
	  ListPrototype.deleteIn =
	  ListPrototype.removeIn = MapPrototype.removeIn;
	  ListPrototype.update = MapPrototype.update;
	  ListPrototype.updateIn = MapPrototype.updateIn;
	  ListPrototype.mergeIn = MapPrototype.mergeIn;
	  ListPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
	  ListPrototype.withMutations = MapPrototype.withMutations;
	  ListPrototype.asMutable = MapPrototype.asMutable;
	  ListPrototype.asImmutable = MapPrototype.asImmutable;
	  ListPrototype.wasAltered = MapPrototype.wasAltered;
	
	
	
	    function VNode(array, ownerID) {
	      this.array = array;
	      this.ownerID = ownerID;
	    }
	
	    // TODO: seems like these methods are very similar
	
	    VNode.prototype.removeBefore = function(ownerID, level, index) {
	      if (index === level ? 1 << level : 0 || this.array.length === 0) {
	        return this;
	      }
	      var originIndex = (index >>> level) & MASK;
	      if (originIndex >= this.array.length) {
	        return new VNode([], ownerID);
	      }
	      var removingFirst = originIndex === 0;
	      var newChild;
	      if (level > 0) {
	        var oldChild = this.array[originIndex];
	        newChild = oldChild && oldChild.removeBefore(ownerID, level - SHIFT, index);
	        if (newChild === oldChild && removingFirst) {
	          return this;
	        }
	      }
	      if (removingFirst && !newChild) {
	        return this;
	      }
	      var editable = editableVNode(this, ownerID);
	      if (!removingFirst) {
	        for (var ii = 0; ii < originIndex; ii++) {
	          editable.array[ii] = undefined;
	        }
	      }
	      if (newChild) {
	        editable.array[originIndex] = newChild;
	      }
	      return editable;
	    };
	
	    VNode.prototype.removeAfter = function(ownerID, level, index) {
	      if (index === (level ? 1 << level : 0) || this.array.length === 0) {
	        return this;
	      }
	      var sizeIndex = ((index - 1) >>> level) & MASK;
	      if (sizeIndex >= this.array.length) {
	        return this;
	      }
	
	      var newChild;
	      if (level > 0) {
	        var oldChild = this.array[sizeIndex];
	        newChild = oldChild && oldChild.removeAfter(ownerID, level - SHIFT, index);
	        if (newChild === oldChild && sizeIndex === this.array.length - 1) {
	          return this;
	        }
	      }
	
	      var editable = editableVNode(this, ownerID);
	      editable.array.splice(sizeIndex + 1);
	      if (newChild) {
	        editable.array[sizeIndex] = newChild;
	      }
	      return editable;
	    };
	
	
	
	  var DONE = {};
	
	  function iterateList(list, reverse) {
	    var left = list._origin;
	    var right = list._capacity;
	    var tailPos = getTailOffset(right);
	    var tail = list._tail;
	
	    return iterateNodeOrLeaf(list._root, list._level, 0);
	
	    function iterateNodeOrLeaf(node, level, offset) {
	      return level === 0 ?
	        iterateLeaf(node, offset) :
	        iterateNode(node, level, offset);
	    }
	
	    function iterateLeaf(node, offset) {
	      var array = offset === tailPos ? tail && tail.array : node && node.array;
	      var from = offset > left ? 0 : left - offset;
	      var to = right - offset;
	      if (to > SIZE) {
	        to = SIZE;
	      }
	      return function()  {
	        if (from === to) {
	          return DONE;
	        }
	        var idx = reverse ? --to : from++;
	        return array && array[idx];
	      };
	    }
	
	    function iterateNode(node, level, offset) {
	      var values;
	      var array = node && node.array;
	      var from = offset > left ? 0 : (left - offset) >> level;
	      var to = ((right - offset) >> level) + 1;
	      if (to > SIZE) {
	        to = SIZE;
	      }
	      return function()  {
	        do {
	          if (values) {
	            var value = values();
	            if (value !== DONE) {
	              return value;
	            }
	            values = null;
	          }
	          if (from === to) {
	            return DONE;
	          }
	          var idx = reverse ? --to : from++;
	          values = iterateNodeOrLeaf(
	            array && array[idx], level - SHIFT, offset + (idx << level)
	          );
	        } while (true);
	      };
	    }
	  }
	
	  function makeList(origin, capacity, level, root, tail, ownerID, hash) {
	    var list = Object.create(ListPrototype);
	    list.size = capacity - origin;
	    list._origin = origin;
	    list._capacity = capacity;
	    list._level = level;
	    list._root = root;
	    list._tail = tail;
	    list.__ownerID = ownerID;
	    list.__hash = hash;
	    list.__altered = false;
	    return list;
	  }
	
	  var EMPTY_LIST;
	  function emptyList() {
	    return EMPTY_LIST || (EMPTY_LIST = makeList(0, 0, SHIFT));
	  }
	
	  function updateList(list, index, value) {
	    index = wrapIndex(list, index);
	
	    if (index !== index) {
	      return list;
	    }
	
	    if (index >= list.size || index < 0) {
	      return list.withMutations(function(list ) {
	        index < 0 ?
	          setListBounds(list, index).set(0, value) :
	          setListBounds(list, 0, index + 1).set(index, value)
	      });
	    }
	
	    index += list._origin;
	
	    var newTail = list._tail;
	    var newRoot = list._root;
	    var didAlter = MakeRef(DID_ALTER);
	    if (index >= getTailOffset(list._capacity)) {
	      newTail = updateVNode(newTail, list.__ownerID, 0, index, value, didAlter);
	    } else {
	      newRoot = updateVNode(newRoot, list.__ownerID, list._level, index, value, didAlter);
	    }
	
	    if (!didAlter.value) {
	      return list;
	    }
	
	    if (list.__ownerID) {
	      list._root = newRoot;
	      list._tail = newTail;
	      list.__hash = undefined;
	      list.__altered = true;
	      return list;
	    }
	    return makeList(list._origin, list._capacity, list._level, newRoot, newTail);
	  }
	
	  function updateVNode(node, ownerID, level, index, value, didAlter) {
	    var idx = (index >>> level) & MASK;
	    var nodeHas = node && idx < node.array.length;
	    if (!nodeHas && value === undefined) {
	      return node;
	    }
	
	    var newNode;
	
	    if (level > 0) {
	      var lowerNode = node && node.array[idx];
	      var newLowerNode = updateVNode(lowerNode, ownerID, level - SHIFT, index, value, didAlter);
	      if (newLowerNode === lowerNode) {
	        return node;
	      }
	      newNode = editableVNode(node, ownerID);
	      newNode.array[idx] = newLowerNode;
	      return newNode;
	    }
	
	    if (nodeHas && node.array[idx] === value) {
	      return node;
	    }
	
	    SetRef(didAlter);
	
	    newNode = editableVNode(node, ownerID);
	    if (value === undefined && idx === newNode.array.length - 1) {
	      newNode.array.pop();
	    } else {
	      newNode.array[idx] = value;
	    }
	    return newNode;
	  }
	
	  function editableVNode(node, ownerID) {
	    if (ownerID && node && ownerID === node.ownerID) {
	      return node;
	    }
	    return new VNode(node ? node.array.slice() : [], ownerID);
	  }
	
	  function listNodeFor(list, rawIndex) {
	    if (rawIndex >= getTailOffset(list._capacity)) {
	      return list._tail;
	    }
	    if (rawIndex < 1 << (list._level + SHIFT)) {
	      var node = list._root;
	      var level = list._level;
	      while (node && level > 0) {
	        node = node.array[(rawIndex >>> level) & MASK];
	        level -= SHIFT;
	      }
	      return node;
	    }
	  }
	
	  function setListBounds(list, begin, end) {
	    // Sanitize begin & end using this shorthand for ToInt32(argument)
	    // http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
	    if (begin !== undefined) {
	      begin = begin | 0;
	    }
	    if (end !== undefined) {
	      end = end | 0;
	    }
	    var owner = list.__ownerID || new OwnerID();
	    var oldOrigin = list._origin;
	    var oldCapacity = list._capacity;
	    var newOrigin = oldOrigin + begin;
	    var newCapacity = end === undefined ? oldCapacity : end < 0 ? oldCapacity + end : oldOrigin + end;
	    if (newOrigin === oldOrigin && newCapacity === oldCapacity) {
	      return list;
	    }
	
	    // If it's going to end after it starts, it's empty.
	    if (newOrigin >= newCapacity) {
	      return list.clear();
	    }
	
	    var newLevel = list._level;
	    var newRoot = list._root;
	
	    // New origin might need creating a higher root.
	    var offsetShift = 0;
	    while (newOrigin + offsetShift < 0) {
	      newRoot = new VNode(newRoot && newRoot.array.length ? [undefined, newRoot] : [], owner);
	      newLevel += SHIFT;
	      offsetShift += 1 << newLevel;
	    }
	    if (offsetShift) {
	      newOrigin += offsetShift;
	      oldOrigin += offsetShift;
	      newCapacity += offsetShift;
	      oldCapacity += offsetShift;
	    }
	
	    var oldTailOffset = getTailOffset(oldCapacity);
	    var newTailOffset = getTailOffset(newCapacity);
	
	    // New size might need creating a higher root.
	    while (newTailOffset >= 1 << (newLevel + SHIFT)) {
	      newRoot = new VNode(newRoot && newRoot.array.length ? [newRoot] : [], owner);
	      newLevel += SHIFT;
	    }
	
	    // Locate or create the new tail.
	    var oldTail = list._tail;
	    var newTail = newTailOffset < oldTailOffset ?
	      listNodeFor(list, newCapacity - 1) :
	      newTailOffset > oldTailOffset ? new VNode([], owner) : oldTail;
	
	    // Merge Tail into tree.
	    if (oldTail && newTailOffset > oldTailOffset && newOrigin < oldCapacity && oldTail.array.length) {
	      newRoot = editableVNode(newRoot, owner);
	      var node = newRoot;
	      for (var level = newLevel; level > SHIFT; level -= SHIFT) {
	        var idx = (oldTailOffset >>> level) & MASK;
	        node = node.array[idx] = editableVNode(node.array[idx], owner);
	      }
	      node.array[(oldTailOffset >>> SHIFT) & MASK] = oldTail;
	    }
	
	    // If the size has been reduced, there's a chance the tail needs to be trimmed.
	    if (newCapacity < oldCapacity) {
	      newTail = newTail && newTail.removeAfter(owner, 0, newCapacity);
	    }
	
	    // If the new origin is within the tail, then we do not need a root.
	    if (newOrigin >= newTailOffset) {
	      newOrigin -= newTailOffset;
	      newCapacity -= newTailOffset;
	      newLevel = SHIFT;
	      newRoot = null;
	      newTail = newTail && newTail.removeBefore(owner, 0, newOrigin);
	
	    // Otherwise, if the root has been trimmed, garbage collect.
	    } else if (newOrigin > oldOrigin || newTailOffset < oldTailOffset) {
	      offsetShift = 0;
	
	      // Identify the new top root node of the subtree of the old root.
	      while (newRoot) {
	        var beginIndex = (newOrigin >>> newLevel) & MASK;
	        if (beginIndex !== (newTailOffset >>> newLevel) & MASK) {
	          break;
	        }
	        if (beginIndex) {
	          offsetShift += (1 << newLevel) * beginIndex;
	        }
	        newLevel -= SHIFT;
	        newRoot = newRoot.array[beginIndex];
	      }
	
	      // Trim the new sides of the new root.
	      if (newRoot && newOrigin > oldOrigin) {
	        newRoot = newRoot.removeBefore(owner, newLevel, newOrigin - offsetShift);
	      }
	      if (newRoot && newTailOffset < oldTailOffset) {
	        newRoot = newRoot.removeAfter(owner, newLevel, newTailOffset - offsetShift);
	      }
	      if (offsetShift) {
	        newOrigin -= offsetShift;
	        newCapacity -= offsetShift;
	      }
	    }
	
	    if (list.__ownerID) {
	      list.size = newCapacity - newOrigin;
	      list._origin = newOrigin;
	      list._capacity = newCapacity;
	      list._level = newLevel;
	      list._root = newRoot;
	      list._tail = newTail;
	      list.__hash = undefined;
	      list.__altered = true;
	      return list;
	    }
	    return makeList(newOrigin, newCapacity, newLevel, newRoot, newTail);
	  }
	
	  function mergeIntoListWith(list, merger, iterables) {
	    var iters = [];
	    var maxSize = 0;
	    for (var ii = 0; ii < iterables.length; ii++) {
	      var value = iterables[ii];
	      var iter = IndexedIterable(value);
	      if (iter.size > maxSize) {
	        maxSize = iter.size;
	      }
	      if (!isIterable(value)) {
	        iter = iter.map(function(v ) {return fromJS(v)});
	      }
	      iters.push(iter);
	    }
	    if (maxSize > list.size) {
	      list = list.setSize(maxSize);
	    }
	    return mergeIntoCollectionWith(list, merger, iters);
	  }
	
	  function getTailOffset(size) {
	    return size < SIZE ? 0 : (((size - 1) >>> SHIFT) << SHIFT);
	  }
	
	  createClass(OrderedMap, Map);
	
	    // @pragma Construction
	
	    function OrderedMap(value) {
	      return value === null || value === undefined ? emptyOrderedMap() :
	        isOrderedMap(value) ? value :
	        emptyOrderedMap().withMutations(function(map ) {
	          var iter = KeyedIterable(value);
	          assertNotInfinite(iter.size);
	          iter.forEach(function(v, k)  {return map.set(k, v)});
	        });
	    }
	
	    OrderedMap.of = function(/*...values*/) {
	      return this(arguments);
	    };
	
	    OrderedMap.prototype.toString = function() {
	      return this.__toString('OrderedMap {', '}');
	    };
	
	    // @pragma Access
	
	    OrderedMap.prototype.get = function(k, notSetValue) {
	      var index = this._map.get(k);
	      return index !== undefined ? this._list.get(index)[1] : notSetValue;
	    };
	
	    // @pragma Modification
	
	    OrderedMap.prototype.clear = function() {
	      if (this.size === 0) {
	        return this;
	      }
	      if (this.__ownerID) {
	        this.size = 0;
	        this._map.clear();
	        this._list.clear();
	        return this;
	      }
	      return emptyOrderedMap();
	    };
	
	    OrderedMap.prototype.set = function(k, v) {
	      return updateOrderedMap(this, k, v);
	    };
	
	    OrderedMap.prototype.remove = function(k) {
	      return updateOrderedMap(this, k, NOT_SET);
	    };
	
	    OrderedMap.prototype.wasAltered = function() {
	      return this._map.wasAltered() || this._list.wasAltered();
	    };
	
	    OrderedMap.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      return this._list.__iterate(
	        function(entry ) {return entry && fn(entry[1], entry[0], this$0)},
	        reverse
	      );
	    };
	
	    OrderedMap.prototype.__iterator = function(type, reverse) {
	      return this._list.fromEntrySeq().__iterator(type, reverse);
	    };
	
	    OrderedMap.prototype.__ensureOwner = function(ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      var newMap = this._map.__ensureOwner(ownerID);
	      var newList = this._list.__ensureOwner(ownerID);
	      if (!ownerID) {
	        this.__ownerID = ownerID;
	        this._map = newMap;
	        this._list = newList;
	        return this;
	      }
	      return makeOrderedMap(newMap, newList, ownerID, this.__hash);
	    };
	
	
	  function isOrderedMap(maybeOrderedMap) {
	    return isMap(maybeOrderedMap) && isOrdered(maybeOrderedMap);
	  }
	
	  OrderedMap.isOrderedMap = isOrderedMap;
	
	  OrderedMap.prototype[IS_ORDERED_SENTINEL] = true;
	  OrderedMap.prototype[DELETE] = OrderedMap.prototype.remove;
	
	
	
	  function makeOrderedMap(map, list, ownerID, hash) {
	    var omap = Object.create(OrderedMap.prototype);
	    omap.size = map ? map.size : 0;
	    omap._map = map;
	    omap._list = list;
	    omap.__ownerID = ownerID;
	    omap.__hash = hash;
	    return omap;
	  }
	
	  var EMPTY_ORDERED_MAP;
	  function emptyOrderedMap() {
	    return EMPTY_ORDERED_MAP || (EMPTY_ORDERED_MAP = makeOrderedMap(emptyMap(), emptyList()));
	  }
	
	  function updateOrderedMap(omap, k, v) {
	    var map = omap._map;
	    var list = omap._list;
	    var i = map.get(k);
	    var has = i !== undefined;
	    var newMap;
	    var newList;
	    if (v === NOT_SET) { // removed
	      if (!has) {
	        return omap;
	      }
	      if (list.size >= SIZE && list.size >= map.size * 2) {
	        newList = list.filter(function(entry, idx)  {return entry !== undefined && i !== idx});
	        newMap = newList.toKeyedSeq().map(function(entry ) {return entry[0]}).flip().toMap();
	        if (omap.__ownerID) {
	          newMap.__ownerID = newList.__ownerID = omap.__ownerID;
	        }
	      } else {
	        newMap = map.remove(k);
	        newList = i === list.size - 1 ? list.pop() : list.set(i, undefined);
	      }
	    } else {
	      if (has) {
	        if (v === list.get(i)[1]) {
	          return omap;
	        }
	        newMap = map;
	        newList = list.set(i, [k, v]);
	      } else {
	        newMap = map.set(k, list.size);
	        newList = list.set(list.size, [k, v]);
	      }
	    }
	    if (omap.__ownerID) {
	      omap.size = newMap.size;
	      omap._map = newMap;
	      omap._list = newList;
	      omap.__hash = undefined;
	      return omap;
	    }
	    return makeOrderedMap(newMap, newList);
	  }
	
	  createClass(ToKeyedSequence, KeyedSeq);
	    function ToKeyedSequence(indexed, useKeys) {
	      this._iter = indexed;
	      this._useKeys = useKeys;
	      this.size = indexed.size;
	    }
	
	    ToKeyedSequence.prototype.get = function(key, notSetValue) {
	      return this._iter.get(key, notSetValue);
	    };
	
	    ToKeyedSequence.prototype.has = function(key) {
	      return this._iter.has(key);
	    };
	
	    ToKeyedSequence.prototype.valueSeq = function() {
	      return this._iter.valueSeq();
	    };
	
	    ToKeyedSequence.prototype.reverse = function() {var this$0 = this;
	      var reversedSequence = reverseFactory(this, true);
	      if (!this._useKeys) {
	        reversedSequence.valueSeq = function()  {return this$0._iter.toSeq().reverse()};
	      }
	      return reversedSequence;
	    };
	
	    ToKeyedSequence.prototype.map = function(mapper, context) {var this$0 = this;
	      var mappedSequence = mapFactory(this, mapper, context);
	      if (!this._useKeys) {
	        mappedSequence.valueSeq = function()  {return this$0._iter.toSeq().map(mapper, context)};
	      }
	      return mappedSequence;
	    };
	
	    ToKeyedSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      var ii;
	      return this._iter.__iterate(
	        this._useKeys ?
	          function(v, k)  {return fn(v, k, this$0)} :
	          ((ii = reverse ? resolveSize(this) : 0),
	            function(v ) {return fn(v, reverse ? --ii : ii++, this$0)}),
	        reverse
	      );
	    };
	
	    ToKeyedSequence.prototype.__iterator = function(type, reverse) {
	      if (this._useKeys) {
	        return this._iter.__iterator(type, reverse);
	      }
	      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
	      var ii = reverse ? resolveSize(this) : 0;
	      return new Iterator(function()  {
	        var step = iterator.next();
	        return step.done ? step :
	          iteratorValue(type, reverse ? --ii : ii++, step.value, step);
	      });
	    };
	
	  ToKeyedSequence.prototype[IS_ORDERED_SENTINEL] = true;
	
	
	  createClass(ToIndexedSequence, IndexedSeq);
	    function ToIndexedSequence(iter) {
	      this._iter = iter;
	      this.size = iter.size;
	    }
	
	    ToIndexedSequence.prototype.includes = function(value) {
	      return this._iter.includes(value);
	    };
	
	    ToIndexedSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      var iterations = 0;
	      return this._iter.__iterate(function(v ) {return fn(v, iterations++, this$0)}, reverse);
	    };
	
	    ToIndexedSequence.prototype.__iterator = function(type, reverse) {
	      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
	      var iterations = 0;
	      return new Iterator(function()  {
	        var step = iterator.next();
	        return step.done ? step :
	          iteratorValue(type, iterations++, step.value, step)
	      });
	    };
	
	
	
	  createClass(ToSetSequence, SetSeq);
	    function ToSetSequence(iter) {
	      this._iter = iter;
	      this.size = iter.size;
	    }
	
	    ToSetSequence.prototype.has = function(key) {
	      return this._iter.includes(key);
	    };
	
	    ToSetSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      return this._iter.__iterate(function(v ) {return fn(v, v, this$0)}, reverse);
	    };
	
	    ToSetSequence.prototype.__iterator = function(type, reverse) {
	      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
	      return new Iterator(function()  {
	        var step = iterator.next();
	        return step.done ? step :
	          iteratorValue(type, step.value, step.value, step);
	      });
	    };
	
	
	
	  createClass(FromEntriesSequence, KeyedSeq);
	    function FromEntriesSequence(entries) {
	      this._iter = entries;
	      this.size = entries.size;
	    }
	
	    FromEntriesSequence.prototype.entrySeq = function() {
	      return this._iter.toSeq();
	    };
	
	    FromEntriesSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      return this._iter.__iterate(function(entry ) {
	        // Check if entry exists first so array access doesn't throw for holes
	        // in the parent iteration.
	        if (entry) {
	          validateEntry(entry);
	          var indexedIterable = isIterable(entry);
	          return fn(
	            indexedIterable ? entry.get(1) : entry[1],
	            indexedIterable ? entry.get(0) : entry[0],
	            this$0
	          );
	        }
	      }, reverse);
	    };
	
	    FromEntriesSequence.prototype.__iterator = function(type, reverse) {
	      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
	      return new Iterator(function()  {
	        while (true) {
	          var step = iterator.next();
	          if (step.done) {
	            return step;
	          }
	          var entry = step.value;
	          // Check if entry exists first so array access doesn't throw for holes
	          // in the parent iteration.
	          if (entry) {
	            validateEntry(entry);
	            var indexedIterable = isIterable(entry);
	            return iteratorValue(
	              type,
	              indexedIterable ? entry.get(0) : entry[0],
	              indexedIterable ? entry.get(1) : entry[1],
	              step
	            );
	          }
	        }
	      });
	    };
	
	
	  ToIndexedSequence.prototype.cacheResult =
	  ToKeyedSequence.prototype.cacheResult =
	  ToSetSequence.prototype.cacheResult =
	  FromEntriesSequence.prototype.cacheResult =
	    cacheResultThrough;
	
	
	  function flipFactory(iterable) {
	    var flipSequence = makeSequence(iterable);
	    flipSequence._iter = iterable;
	    flipSequence.size = iterable.size;
	    flipSequence.flip = function()  {return iterable};
	    flipSequence.reverse = function () {
	      var reversedSequence = iterable.reverse.apply(this); // super.reverse()
	      reversedSequence.flip = function()  {return iterable.reverse()};
	      return reversedSequence;
	    };
	    flipSequence.has = function(key ) {return iterable.includes(key)};
	    flipSequence.includes = function(key ) {return iterable.has(key)};
	    flipSequence.cacheResult = cacheResultThrough;
	    flipSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
	      return iterable.__iterate(function(v, k)  {return fn(k, v, this$0) !== false}, reverse);
	    }
	    flipSequence.__iteratorUncached = function(type, reverse) {
	      if (type === ITERATE_ENTRIES) {
	        var iterator = iterable.__iterator(type, reverse);
	        return new Iterator(function()  {
	          var step = iterator.next();
	          if (!step.done) {
	            var k = step.value[0];
	            step.value[0] = step.value[1];
	            step.value[1] = k;
	          }
	          return step;
	        });
	      }
	      return iterable.__iterator(
	        type === ITERATE_VALUES ? ITERATE_KEYS : ITERATE_VALUES,
	        reverse
	      );
	    }
	    return flipSequence;
	  }
	
	
	  function mapFactory(iterable, mapper, context) {
	    var mappedSequence = makeSequence(iterable);
	    mappedSequence.size = iterable.size;
	    mappedSequence.has = function(key ) {return iterable.has(key)};
	    mappedSequence.get = function(key, notSetValue)  {
	      var v = iterable.get(key, NOT_SET);
	      return v === NOT_SET ?
	        notSetValue :
	        mapper.call(context, v, key, iterable);
	    };
	    mappedSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
	      return iterable.__iterate(
	        function(v, k, c)  {return fn(mapper.call(context, v, k, c), k, this$0) !== false},
	        reverse
	      );
	    }
	    mappedSequence.__iteratorUncached = function (type, reverse) {
	      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
	      return new Iterator(function()  {
	        var step = iterator.next();
	        if (step.done) {
	          return step;
	        }
	        var entry = step.value;
	        var key = entry[0];
	        return iteratorValue(
	          type,
	          key,
	          mapper.call(context, entry[1], key, iterable),
	          step
	        );
	      });
	    }
	    return mappedSequence;
	  }
	
	
	  function reverseFactory(iterable, useKeys) {
	    var reversedSequence = makeSequence(iterable);
	    reversedSequence._iter = iterable;
	    reversedSequence.size = iterable.size;
	    reversedSequence.reverse = function()  {return iterable};
	    if (iterable.flip) {
	      reversedSequence.flip = function () {
	        var flipSequence = flipFactory(iterable);
	        flipSequence.reverse = function()  {return iterable.flip()};
	        return flipSequence;
	      };
	    }
	    reversedSequence.get = function(key, notSetValue) 
	      {return iterable.get(useKeys ? key : -1 - key, notSetValue)};
	    reversedSequence.has = function(key )
	      {return iterable.has(useKeys ? key : -1 - key)};
	    reversedSequence.includes = function(value ) {return iterable.includes(value)};
	    reversedSequence.cacheResult = cacheResultThrough;
	    reversedSequence.__iterate = function (fn, reverse) {var this$0 = this;
	      return iterable.__iterate(function(v, k)  {return fn(v, k, this$0)}, !reverse);
	    };
	    reversedSequence.__iterator =
	      function(type, reverse)  {return iterable.__iterator(type, !reverse)};
	    return reversedSequence;
	  }
	
	
	  function filterFactory(iterable, predicate, context, useKeys) {
	    var filterSequence = makeSequence(iterable);
	    if (useKeys) {
	      filterSequence.has = function(key ) {
	        var v = iterable.get(key, NOT_SET);
	        return v !== NOT_SET && !!predicate.call(context, v, key, iterable);
	      };
	      filterSequence.get = function(key, notSetValue)  {
	        var v = iterable.get(key, NOT_SET);
	        return v !== NOT_SET && predicate.call(context, v, key, iterable) ?
	          v : notSetValue;
	      };
	    }
	    filterSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
	      var iterations = 0;
	      iterable.__iterate(function(v, k, c)  {
	        if (predicate.call(context, v, k, c)) {
	          iterations++;
	          return fn(v, useKeys ? k : iterations - 1, this$0);
	        }
	      }, reverse);
	      return iterations;
	    };
	    filterSequence.__iteratorUncached = function (type, reverse) {
	      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
	      var iterations = 0;
	      return new Iterator(function()  {
	        while (true) {
	          var step = iterator.next();
	          if (step.done) {
	            return step;
	          }
	          var entry = step.value;
	          var key = entry[0];
	          var value = entry[1];
	          if (predicate.call(context, value, key, iterable)) {
	            return iteratorValue(type, useKeys ? key : iterations++, value, step);
	          }
	        }
	      });
	    }
	    return filterSequence;
	  }
	
	
	  function countByFactory(iterable, grouper, context) {
	    var groups = Map().asMutable();
	    iterable.__iterate(function(v, k)  {
	      groups.update(
	        grouper.call(context, v, k, iterable),
	        0,
	        function(a ) {return a + 1}
	      );
	    });
	    return groups.asImmutable();
	  }
	
	
	  function groupByFactory(iterable, grouper, context) {
	    var isKeyedIter = isKeyed(iterable);
	    var groups = (isOrdered(iterable) ? OrderedMap() : Map()).asMutable();
	    iterable.__iterate(function(v, k)  {
	      groups.update(
	        grouper.call(context, v, k, iterable),
	        function(a ) {return (a = a || [], a.push(isKeyedIter ? [k, v] : v), a)}
	      );
	    });
	    var coerce = iterableClass(iterable);
	    return groups.map(function(arr ) {return reify(iterable, coerce(arr))});
	  }
	
	
	  function sliceFactory(iterable, begin, end, useKeys) {
	    var originalSize = iterable.size;
	
	    // Sanitize begin & end using this shorthand for ToInt32(argument)
	    // http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
	    if (begin !== undefined) {
	      begin = begin | 0;
	    }
	    if (end !== undefined) {
	      if (end === Infinity) {
	        end = originalSize;
	      } else {
	        end = end | 0;
	      }
	    }
	
	    if (wholeSlice(begin, end, originalSize)) {
	      return iterable;
	    }
	
	    var resolvedBegin = resolveBegin(begin, originalSize);
	    var resolvedEnd = resolveEnd(end, originalSize);
	
	    // begin or end will be NaN if they were provided as negative numbers and
	    // this iterable's size is unknown. In that case, cache first so there is
	    // a known size and these do not resolve to NaN.
	    if (resolvedBegin !== resolvedBegin || resolvedEnd !== resolvedEnd) {
	      return sliceFactory(iterable.toSeq().cacheResult(), begin, end, useKeys);
	    }
	
	    // Note: resolvedEnd is undefined when the original sequence's length is
	    // unknown and this slice did not supply an end and should contain all
	    // elements after resolvedBegin.
	    // In that case, resolvedSize will be NaN and sliceSize will remain undefined.
	    var resolvedSize = resolvedEnd - resolvedBegin;
	    var sliceSize;
	    if (resolvedSize === resolvedSize) {
	      sliceSize = resolvedSize < 0 ? 0 : resolvedSize;
	    }
	
	    var sliceSeq = makeSequence(iterable);
	
	    // If iterable.size is undefined, the size of the realized sliceSeq is
	    // unknown at this point unless the number of items to slice is 0
	    sliceSeq.size = sliceSize === 0 ? sliceSize : iterable.size && sliceSize || undefined;
	
	    if (!useKeys && isSeq(iterable) && sliceSize >= 0) {
	      sliceSeq.get = function (index, notSetValue) {
	        index = wrapIndex(this, index);
	        return index >= 0 && index < sliceSize ?
	          iterable.get(index + resolvedBegin, notSetValue) :
	          notSetValue;
	      }
	    }
	
	    sliceSeq.__iterateUncached = function(fn, reverse) {var this$0 = this;
	      if (sliceSize === 0) {
	        return 0;
	      }
	      if (reverse) {
	        return this.cacheResult().__iterate(fn, reverse);
	      }
	      var skipped = 0;
	      var isSkipping = true;
	      var iterations = 0;
	      iterable.__iterate(function(v, k)  {
	        if (!(isSkipping && (isSkipping = skipped++ < resolvedBegin))) {
	          iterations++;
	          return fn(v, useKeys ? k : iterations - 1, this$0) !== false &&
	                 iterations !== sliceSize;
	        }
	      });
	      return iterations;
	    };
	
	    sliceSeq.__iteratorUncached = function(type, reverse) {
	      if (sliceSize !== 0 && reverse) {
	        return this.cacheResult().__iterator(type, reverse);
	      }
	      // Don't bother instantiating parent iterator if taking 0.
	      var iterator = sliceSize !== 0 && iterable.__iterator(type, reverse);
	      var skipped = 0;
	      var iterations = 0;
	      return new Iterator(function()  {
	        while (skipped++ < resolvedBegin) {
	          iterator.next();
	        }
	        if (++iterations > sliceSize) {
	          return iteratorDone();
	        }
	        var step = iterator.next();
	        if (useKeys || type === ITERATE_VALUES) {
	          return step;
	        } else if (type === ITERATE_KEYS) {
	          return iteratorValue(type, iterations - 1, undefined, step);
	        } else {
	          return iteratorValue(type, iterations - 1, step.value[1], step);
	        }
	      });
	    }
	
	    return sliceSeq;
	  }
	
	
	  function takeWhileFactory(iterable, predicate, context) {
	    var takeSequence = makeSequence(iterable);
	    takeSequence.__iterateUncached = function(fn, reverse) {var this$0 = this;
	      if (reverse) {
	        return this.cacheResult().__iterate(fn, reverse);
	      }
	      var iterations = 0;
	      iterable.__iterate(function(v, k, c) 
	        {return predicate.call(context, v, k, c) && ++iterations && fn(v, k, this$0)}
	      );
	      return iterations;
	    };
	    takeSequence.__iteratorUncached = function(type, reverse) {var this$0 = this;
	      if (reverse) {
	        return this.cacheResult().__iterator(type, reverse);
	      }
	      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
	      var iterating = true;
	      return new Iterator(function()  {
	        if (!iterating) {
	          return iteratorDone();
	        }
	        var step = iterator.next();
	        if (step.done) {
	          return step;
	        }
	        var entry = step.value;
	        var k = entry[0];
	        var v = entry[1];
	        if (!predicate.call(context, v, k, this$0)) {
	          iterating = false;
	          return iteratorDone();
	        }
	        return type === ITERATE_ENTRIES ? step :
	          iteratorValue(type, k, v, step);
	      });
	    };
	    return takeSequence;
	  }
	
	
	  function skipWhileFactory(iterable, predicate, context, useKeys) {
	    var skipSequence = makeSequence(iterable);
	    skipSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
	      if (reverse) {
	        return this.cacheResult().__iterate(fn, reverse);
	      }
	      var isSkipping = true;
	      var iterations = 0;
	      iterable.__iterate(function(v, k, c)  {
	        if (!(isSkipping && (isSkipping = predicate.call(context, v, k, c)))) {
	          iterations++;
	          return fn(v, useKeys ? k : iterations - 1, this$0);
	        }
	      });
	      return iterations;
	    };
	    skipSequence.__iteratorUncached = function(type, reverse) {var this$0 = this;
	      if (reverse) {
	        return this.cacheResult().__iterator(type, reverse);
	      }
	      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
	      var skipping = true;
	      var iterations = 0;
	      return new Iterator(function()  {
	        var step, k, v;
	        do {
	          step = iterator.next();
	          if (step.done) {
	            if (useKeys || type === ITERATE_VALUES) {
	              return step;
	            } else if (type === ITERATE_KEYS) {
	              return iteratorValue(type, iterations++, undefined, step);
	            } else {
	              return iteratorValue(type, iterations++, step.value[1], step);
	            }
	          }
	          var entry = step.value;
	          k = entry[0];
	          v = entry[1];
	          skipping && (skipping = predicate.call(context, v, k, this$0));
	        } while (skipping);
	        return type === ITERATE_ENTRIES ? step :
	          iteratorValue(type, k, v, step);
	      });
	    };
	    return skipSequence;
	  }
	
	
	  function concatFactory(iterable, values) {
	    var isKeyedIterable = isKeyed(iterable);
	    var iters = [iterable].concat(values).map(function(v ) {
	      if (!isIterable(v)) {
	        v = isKeyedIterable ?
	          keyedSeqFromValue(v) :
	          indexedSeqFromValue(Array.isArray(v) ? v : [v]);
	      } else if (isKeyedIterable) {
	        v = KeyedIterable(v);
	      }
	      return v;
	    }).filter(function(v ) {return v.size !== 0});
	
	    if (iters.length === 0) {
	      return iterable;
	    }
	
	    if (iters.length === 1) {
	      var singleton = iters[0];
	      if (singleton === iterable ||
	          isKeyedIterable && isKeyed(singleton) ||
	          isIndexed(iterable) && isIndexed(singleton)) {
	        return singleton;
	      }
	    }
	
	    var concatSeq = new ArraySeq(iters);
	    if (isKeyedIterable) {
	      concatSeq = concatSeq.toKeyedSeq();
	    } else if (!isIndexed(iterable)) {
	      concatSeq = concatSeq.toSetSeq();
	    }
	    concatSeq = concatSeq.flatten(true);
	    concatSeq.size = iters.reduce(
	      function(sum, seq)  {
	        if (sum !== undefined) {
	          var size = seq.size;
	          if (size !== undefined) {
	            return sum + size;
	          }
	        }
	      },
	      0
	    );
	    return concatSeq;
	  }
	
	
	  function flattenFactory(iterable, depth, useKeys) {
	    var flatSequence = makeSequence(iterable);
	    flatSequence.__iterateUncached = function(fn, reverse) {
	      var iterations = 0;
	      var stopped = false;
	      function flatDeep(iter, currentDepth) {var this$0 = this;
	        iter.__iterate(function(v, k)  {
	          if ((!depth || currentDepth < depth) && isIterable(v)) {
	            flatDeep(v, currentDepth + 1);
	          } else if (fn(v, useKeys ? k : iterations++, this$0) === false) {
	            stopped = true;
	          }
	          return !stopped;
	        }, reverse);
	      }
	      flatDeep(iterable, 0);
	      return iterations;
	    }
	    flatSequence.__iteratorUncached = function(type, reverse) {
	      var iterator = iterable.__iterator(type, reverse);
	      var stack = [];
	      var iterations = 0;
	      return new Iterator(function()  {
	        while (iterator) {
	          var step = iterator.next();
	          if (step.done !== false) {
	            iterator = stack.pop();
	            continue;
	          }
	          var v = step.value;
	          if (type === ITERATE_ENTRIES) {
	            v = v[1];
	          }
	          if ((!depth || stack.length < depth) && isIterable(v)) {
	            stack.push(iterator);
	            iterator = v.__iterator(type, reverse);
	          } else {
	            return useKeys ? step : iteratorValue(type, iterations++, v, step);
	          }
	        }
	        return iteratorDone();
	      });
	    }
	    return flatSequence;
	  }
	
	
	  function flatMapFactory(iterable, mapper, context) {
	    var coerce = iterableClass(iterable);
	    return iterable.toSeq().map(
	      function(v, k)  {return coerce(mapper.call(context, v, k, iterable))}
	    ).flatten(true);
	  }
	
	
	  function interposeFactory(iterable, separator) {
	    var interposedSequence = makeSequence(iterable);
	    interposedSequence.size = iterable.size && iterable.size * 2 -1;
	    interposedSequence.__iterateUncached = function(fn, reverse) {var this$0 = this;
	      var iterations = 0;
	      iterable.__iterate(function(v, k) 
	        {return (!iterations || fn(separator, iterations++, this$0) !== false) &&
	        fn(v, iterations++, this$0) !== false},
	        reverse
	      );
	      return iterations;
	    };
	    interposedSequence.__iteratorUncached = function(type, reverse) {
	      var iterator = iterable.__iterator(ITERATE_VALUES, reverse);
	      var iterations = 0;
	      var step;
	      return new Iterator(function()  {
	        if (!step || iterations % 2) {
	          step = iterator.next();
	          if (step.done) {
	            return step;
	          }
	        }
	        return iterations % 2 ?
	          iteratorValue(type, iterations++, separator) :
	          iteratorValue(type, iterations++, step.value, step);
	      });
	    };
	    return interposedSequence;
	  }
	
	
	  function sortFactory(iterable, comparator, mapper) {
	    if (!comparator) {
	      comparator = defaultComparator;
	    }
	    var isKeyedIterable = isKeyed(iterable);
	    var index = 0;
	    var entries = iterable.toSeq().map(
	      function(v, k)  {return [k, v, index++, mapper ? mapper(v, k, iterable) : v]}
	    ).toArray();
	    entries.sort(function(a, b)  {return comparator(a[3], b[3]) || a[2] - b[2]}).forEach(
	      isKeyedIterable ?
	      function(v, i)  { entries[i].length = 2; } :
	      function(v, i)  { entries[i] = v[1]; }
	    );
	    return isKeyedIterable ? KeyedSeq(entries) :
	      isIndexed(iterable) ? IndexedSeq(entries) :
	      SetSeq(entries);
	  }
	
	
	  function maxFactory(iterable, comparator, mapper) {
	    if (!comparator) {
	      comparator = defaultComparator;
	    }
	    if (mapper) {
	      var entry = iterable.toSeq()
	        .map(function(v, k)  {return [v, mapper(v, k, iterable)]})
	        .reduce(function(a, b)  {return maxCompare(comparator, a[1], b[1]) ? b : a});
	      return entry && entry[0];
	    } else {
	      return iterable.reduce(function(a, b)  {return maxCompare(comparator, a, b) ? b : a});
	    }
	  }
	
	  function maxCompare(comparator, a, b) {
	    var comp = comparator(b, a);
	    // b is considered the new max if the comparator declares them equal, but
	    // they are not equal and b is in fact a nullish value.
	    return (comp === 0 && b !== a && (b === undefined || b === null || b !== b)) || comp > 0;
	  }
	
	
	  function zipWithFactory(keyIter, zipper, iters) {
	    var zipSequence = makeSequence(keyIter);
	    zipSequence.size = new ArraySeq(iters).map(function(i ) {return i.size}).min();
	    // Note: this a generic base implementation of __iterate in terms of
	    // __iterator which may be more generically useful in the future.
	    zipSequence.__iterate = function(fn, reverse) {
	      /* generic:
	      var iterator = this.__iterator(ITERATE_ENTRIES, reverse);
	      var step;
	      var iterations = 0;
	      while (!(step = iterator.next()).done) {
	        iterations++;
	        if (fn(step.value[1], step.value[0], this) === false) {
	          break;
	        }
	      }
	      return iterations;
	      */
	      // indexed:
	      var iterator = this.__iterator(ITERATE_VALUES, reverse);
	      var step;
	      var iterations = 0;
	      while (!(step = iterator.next()).done) {
	        if (fn(step.value, iterations++, this) === false) {
	          break;
	        }
	      }
	      return iterations;
	    };
	    zipSequence.__iteratorUncached = function(type, reverse) {
	      var iterators = iters.map(function(i )
	        {return (i = Iterable(i), getIterator(reverse ? i.reverse() : i))}
	      );
	      var iterations = 0;
	      var isDone = false;
	      return new Iterator(function()  {
	        var steps;
	        if (!isDone) {
	          steps = iterators.map(function(i ) {return i.next()});
	          isDone = steps.some(function(s ) {return s.done});
	        }
	        if (isDone) {
	          return iteratorDone();
	        }
	        return iteratorValue(
	          type,
	          iterations++,
	          zipper.apply(null, steps.map(function(s ) {return s.value}))
	        );
	      });
	    };
	    return zipSequence
	  }
	
	
	  // #pragma Helper Functions
	
	  function reify(iter, seq) {
	    return isSeq(iter) ? seq : iter.constructor(seq);
	  }
	
	  function validateEntry(entry) {
	    if (entry !== Object(entry)) {
	      throw new TypeError('Expected [K, V] tuple: ' + entry);
	    }
	  }
	
	  function resolveSize(iter) {
	    assertNotInfinite(iter.size);
	    return ensureSize(iter);
	  }
	
	  function iterableClass(iterable) {
	    return isKeyed(iterable) ? KeyedIterable :
	      isIndexed(iterable) ? IndexedIterable :
	      SetIterable;
	  }
	
	  function makeSequence(iterable) {
	    return Object.create(
	      (
	        isKeyed(iterable) ? KeyedSeq :
	        isIndexed(iterable) ? IndexedSeq :
	        SetSeq
	      ).prototype
	    );
	  }
	
	  function cacheResultThrough() {
	    if (this._iter.cacheResult) {
	      this._iter.cacheResult();
	      this.size = this._iter.size;
	      return this;
	    } else {
	      return Seq.prototype.cacheResult.call(this);
	    }
	  }
	
	  function defaultComparator(a, b) {
	    return a > b ? 1 : a < b ? -1 : 0;
	  }
	
	  function forceIterator(keyPath) {
	    var iter = getIterator(keyPath);
	    if (!iter) {
	      // Array might not be iterable in this environment, so we need a fallback
	      // to our wrapped type.
	      if (!isArrayLike(keyPath)) {
	        throw new TypeError('Expected iterable or array-like: ' + keyPath);
	      }
	      iter = getIterator(Iterable(keyPath));
	    }
	    return iter;
	  }
	
	  createClass(Record, KeyedCollection);
	
	    function Record(defaultValues, name) {
	      var hasInitialized;
	
	      var RecordType = function Record(values) {
	        if (values instanceof RecordType) {
	          return values;
	        }
	        if (!(this instanceof RecordType)) {
	          return new RecordType(values);
	        }
	        if (!hasInitialized) {
	          hasInitialized = true;
	          var keys = Object.keys(defaultValues);
	          setProps(RecordTypePrototype, keys);
	          RecordTypePrototype.size = keys.length;
	          RecordTypePrototype._name = name;
	          RecordTypePrototype._keys = keys;
	          RecordTypePrototype._defaultValues = defaultValues;
	        }
	        this._map = Map(values);
	      };
	
	      var RecordTypePrototype = RecordType.prototype = Object.create(RecordPrototype);
	      RecordTypePrototype.constructor = RecordType;
	
	      return RecordType;
	    }
	
	    Record.prototype.toString = function() {
	      return this.__toString(recordName(this) + ' {', '}');
	    };
	
	    // @pragma Access
	
	    Record.prototype.has = function(k) {
	      return this._defaultValues.hasOwnProperty(k);
	    };
	
	    Record.prototype.get = function(k, notSetValue) {
	      if (!this.has(k)) {
	        return notSetValue;
	      }
	      var defaultVal = this._defaultValues[k];
	      return this._map ? this._map.get(k, defaultVal) : defaultVal;
	    };
	
	    // @pragma Modification
	
	    Record.prototype.clear = function() {
	      if (this.__ownerID) {
	        this._map && this._map.clear();
	        return this;
	      }
	      var RecordType = this.constructor;
	      return RecordType._empty || (RecordType._empty = makeRecord(this, emptyMap()));
	    };
	
	    Record.prototype.set = function(k, v) {
	      if (!this.has(k)) {
	        throw new Error('Cannot set unknown key "' + k + '" on ' + recordName(this));
	      }
	      if (this._map && !this._map.has(k)) {
	        var defaultVal = this._defaultValues[k];
	        if (v === defaultVal) {
	          return this;
	        }
	      }
	      var newMap = this._map && this._map.set(k, v);
	      if (this.__ownerID || newMap === this._map) {
	        return this;
	      }
	      return makeRecord(this, newMap);
	    };
	
	    Record.prototype.remove = function(k) {
	      if (!this.has(k)) {
	        return this;
	      }
	      var newMap = this._map && this._map.remove(k);
	      if (this.__ownerID || newMap === this._map) {
	        return this;
	      }
	      return makeRecord(this, newMap);
	    };
	
	    Record.prototype.wasAltered = function() {
	      return this._map.wasAltered();
	    };
	
	    Record.prototype.__iterator = function(type, reverse) {var this$0 = this;
	      return KeyedIterable(this._defaultValues).map(function(_, k)  {return this$0.get(k)}).__iterator(type, reverse);
	    };
	
	    Record.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      return KeyedIterable(this._defaultValues).map(function(_, k)  {return this$0.get(k)}).__iterate(fn, reverse);
	    };
	
	    Record.prototype.__ensureOwner = function(ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      var newMap = this._map && this._map.__ensureOwner(ownerID);
	      if (!ownerID) {
	        this.__ownerID = ownerID;
	        this._map = newMap;
	        return this;
	      }
	      return makeRecord(this, newMap, ownerID);
	    };
	
	
	  var RecordPrototype = Record.prototype;
	  RecordPrototype[DELETE] = RecordPrototype.remove;
	  RecordPrototype.deleteIn =
	  RecordPrototype.removeIn = MapPrototype.removeIn;
	  RecordPrototype.merge = MapPrototype.merge;
	  RecordPrototype.mergeWith = MapPrototype.mergeWith;
	  RecordPrototype.mergeIn = MapPrototype.mergeIn;
	  RecordPrototype.mergeDeep = MapPrototype.mergeDeep;
	  RecordPrototype.mergeDeepWith = MapPrototype.mergeDeepWith;
	  RecordPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
	  RecordPrototype.setIn = MapPrototype.setIn;
	  RecordPrototype.update = MapPrototype.update;
	  RecordPrototype.updateIn = MapPrototype.updateIn;
	  RecordPrototype.withMutations = MapPrototype.withMutations;
	  RecordPrototype.asMutable = MapPrototype.asMutable;
	  RecordPrototype.asImmutable = MapPrototype.asImmutable;
	
	
	  function makeRecord(likeRecord, map, ownerID) {
	    var record = Object.create(Object.getPrototypeOf(likeRecord));
	    record._map = map;
	    record.__ownerID = ownerID;
	    return record;
	  }
	
	  function recordName(record) {
	    return record._name || record.constructor.name || 'Record';
	  }
	
	  function setProps(prototype, names) {
	    try {
	      names.forEach(setProp.bind(undefined, prototype));
	    } catch (error) {
	      // Object.defineProperty failed. Probably IE8.
	    }
	  }
	
	  function setProp(prototype, name) {
	    Object.defineProperty(prototype, name, {
	      get: function() {
	        return this.get(name);
	      },
	      set: function(value) {
	        invariant(this.__ownerID, 'Cannot set on an immutable record.');
	        this.set(name, value);
	      }
	    });
	  }
	
	  createClass(Set, SetCollection);
	
	    // @pragma Construction
	
	    function Set(value) {
	      return value === null || value === undefined ? emptySet() :
	        isSet(value) && !isOrdered(value) ? value :
	        emptySet().withMutations(function(set ) {
	          var iter = SetIterable(value);
	          assertNotInfinite(iter.size);
	          iter.forEach(function(v ) {return set.add(v)});
	        });
	    }
	
	    Set.of = function(/*...values*/) {
	      return this(arguments);
	    };
	
	    Set.fromKeys = function(value) {
	      return this(KeyedIterable(value).keySeq());
	    };
	
	    Set.prototype.toString = function() {
	      return this.__toString('Set {', '}');
	    };
	
	    // @pragma Access
	
	    Set.prototype.has = function(value) {
	      return this._map.has(value);
	    };
	
	    // @pragma Modification
	
	    Set.prototype.add = function(value) {
	      return updateSet(this, this._map.set(value, true));
	    };
	
	    Set.prototype.remove = function(value) {
	      return updateSet(this, this._map.remove(value));
	    };
	
	    Set.prototype.clear = function() {
	      return updateSet(this, this._map.clear());
	    };
	
	    // @pragma Composition
	
	    Set.prototype.union = function() {var iters = SLICE$0.call(arguments, 0);
	      iters = iters.filter(function(x ) {return x.size !== 0});
	      if (iters.length === 0) {
	        return this;
	      }
	      if (this.size === 0 && !this.__ownerID && iters.length === 1) {
	        return this.constructor(iters[0]);
	      }
	      return this.withMutations(function(set ) {
	        for (var ii = 0; ii < iters.length; ii++) {
	          SetIterable(iters[ii]).forEach(function(value ) {return set.add(value)});
	        }
	      });
	    };
	
	    Set.prototype.intersect = function() {var iters = SLICE$0.call(arguments, 0);
	      if (iters.length === 0) {
	        return this;
	      }
	      iters = iters.map(function(iter ) {return SetIterable(iter)});
	      var originalSet = this;
	      return this.withMutations(function(set ) {
	        originalSet.forEach(function(value ) {
	          if (!iters.every(function(iter ) {return iter.includes(value)})) {
	            set.remove(value);
	          }
	        });
	      });
	    };
	
	    Set.prototype.subtract = function() {var iters = SLICE$0.call(arguments, 0);
	      if (iters.length === 0) {
	        return this;
	      }
	      iters = iters.map(function(iter ) {return SetIterable(iter)});
	      var originalSet = this;
	      return this.withMutations(function(set ) {
	        originalSet.forEach(function(value ) {
	          if (iters.some(function(iter ) {return iter.includes(value)})) {
	            set.remove(value);
	          }
	        });
	      });
	    };
	
	    Set.prototype.merge = function() {
	      return this.union.apply(this, arguments);
	    };
	
	    Set.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
	      return this.union.apply(this, iters);
	    };
	
	    Set.prototype.sort = function(comparator) {
	      // Late binding
	      return OrderedSet(sortFactory(this, comparator));
	    };
	
	    Set.prototype.sortBy = function(mapper, comparator) {
	      // Late binding
	      return OrderedSet(sortFactory(this, comparator, mapper));
	    };
	
	    Set.prototype.wasAltered = function() {
	      return this._map.wasAltered();
	    };
	
	    Set.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      return this._map.__iterate(function(_, k)  {return fn(k, k, this$0)}, reverse);
	    };
	
	    Set.prototype.__iterator = function(type, reverse) {
	      return this._map.map(function(_, k)  {return k}).__iterator(type, reverse);
	    };
	
	    Set.prototype.__ensureOwner = function(ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      var newMap = this._map.__ensureOwner(ownerID);
	      if (!ownerID) {
	        this.__ownerID = ownerID;
	        this._map = newMap;
	        return this;
	      }
	      return this.__make(newMap, ownerID);
	    };
	
	
	  function isSet(maybeSet) {
	    return !!(maybeSet && maybeSet[IS_SET_SENTINEL]);
	  }
	
	  Set.isSet = isSet;
	
	  var IS_SET_SENTINEL = '@@__IMMUTABLE_SET__@@';
	
	  var SetPrototype = Set.prototype;
	  SetPrototype[IS_SET_SENTINEL] = true;
	  SetPrototype[DELETE] = SetPrototype.remove;
	  SetPrototype.mergeDeep = SetPrototype.merge;
	  SetPrototype.mergeDeepWith = SetPrototype.mergeWith;
	  SetPrototype.withMutations = MapPrototype.withMutations;
	  SetPrototype.asMutable = MapPrototype.asMutable;
	  SetPrototype.asImmutable = MapPrototype.asImmutable;
	
	  SetPrototype.__empty = emptySet;
	  SetPrototype.__make = makeSet;
	
	  function updateSet(set, newMap) {
	    if (set.__ownerID) {
	      set.size = newMap.size;
	      set._map = newMap;
	      return set;
	    }
	    return newMap === set._map ? set :
	      newMap.size === 0 ? set.__empty() :
	      set.__make(newMap);
	  }
	
	  function makeSet(map, ownerID) {
	    var set = Object.create(SetPrototype);
	    set.size = map ? map.size : 0;
	    set._map = map;
	    set.__ownerID = ownerID;
	    return set;
	  }
	
	  var EMPTY_SET;
	  function emptySet() {
	    return EMPTY_SET || (EMPTY_SET = makeSet(emptyMap()));
	  }
	
	  createClass(OrderedSet, Set);
	
	    // @pragma Construction
	
	    function OrderedSet(value) {
	      return value === null || value === undefined ? emptyOrderedSet() :
	        isOrderedSet(value) ? value :
	        emptyOrderedSet().withMutations(function(set ) {
	          var iter = SetIterable(value);
	          assertNotInfinite(iter.size);
	          iter.forEach(function(v ) {return set.add(v)});
	        });
	    }
	
	    OrderedSet.of = function(/*...values*/) {
	      return this(arguments);
	    };
	
	    OrderedSet.fromKeys = function(value) {
	      return this(KeyedIterable(value).keySeq());
	    };
	
	    OrderedSet.prototype.toString = function() {
	      return this.__toString('OrderedSet {', '}');
	    };
	
	
	  function isOrderedSet(maybeOrderedSet) {
	    return isSet(maybeOrderedSet) && isOrdered(maybeOrderedSet);
	  }
	
	  OrderedSet.isOrderedSet = isOrderedSet;
	
	  var OrderedSetPrototype = OrderedSet.prototype;
	  OrderedSetPrototype[IS_ORDERED_SENTINEL] = true;
	
	  OrderedSetPrototype.__empty = emptyOrderedSet;
	  OrderedSetPrototype.__make = makeOrderedSet;
	
	  function makeOrderedSet(map, ownerID) {
	    var set = Object.create(OrderedSetPrototype);
	    set.size = map ? map.size : 0;
	    set._map = map;
	    set.__ownerID = ownerID;
	    return set;
	  }
	
	  var EMPTY_ORDERED_SET;
	  function emptyOrderedSet() {
	    return EMPTY_ORDERED_SET || (EMPTY_ORDERED_SET = makeOrderedSet(emptyOrderedMap()));
	  }
	
	  createClass(Stack, IndexedCollection);
	
	    // @pragma Construction
	
	    function Stack(value) {
	      return value === null || value === undefined ? emptyStack() :
	        isStack(value) ? value :
	        emptyStack().unshiftAll(value);
	    }
	
	    Stack.of = function(/*...values*/) {
	      return this(arguments);
	    };
	
	    Stack.prototype.toString = function() {
	      return this.__toString('Stack [', ']');
	    };
	
	    // @pragma Access
	
	    Stack.prototype.get = function(index, notSetValue) {
	      var head = this._head;
	      index = wrapIndex(this, index);
	      while (head && index--) {
	        head = head.next;
	      }
	      return head ? head.value : notSetValue;
	    };
	
	    Stack.prototype.peek = function() {
	      return this._head && this._head.value;
	    };
	
	    // @pragma Modification
	
	    Stack.prototype.push = function(/*...values*/) {
	      if (arguments.length === 0) {
	        return this;
	      }
	      var newSize = this.size + arguments.length;
	      var head = this._head;
	      for (var ii = arguments.length - 1; ii >= 0; ii--) {
	        head = {
	          value: arguments[ii],
	          next: head
	        };
	      }
	      if (this.__ownerID) {
	        this.size = newSize;
	        this._head = head;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return makeStack(newSize, head);
	    };
	
	    Stack.prototype.pushAll = function(iter) {
	      iter = IndexedIterable(iter);
	      if (iter.size === 0) {
	        return this;
	      }
	      assertNotInfinite(iter.size);
	      var newSize = this.size;
	      var head = this._head;
	      iter.reverse().forEach(function(value ) {
	        newSize++;
	        head = {
	          value: value,
	          next: head
	        };
	      });
	      if (this.__ownerID) {
	        this.size = newSize;
	        this._head = head;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return makeStack(newSize, head);
	    };
	
	    Stack.prototype.pop = function() {
	      return this.slice(1);
	    };
	
	    Stack.prototype.unshift = function(/*...values*/) {
	      return this.push.apply(this, arguments);
	    };
	
	    Stack.prototype.unshiftAll = function(iter) {
	      return this.pushAll(iter);
	    };
	
	    Stack.prototype.shift = function() {
	      return this.pop.apply(this, arguments);
	    };
	
	    Stack.prototype.clear = function() {
	      if (this.size === 0) {
	        return this;
	      }
	      if (this.__ownerID) {
	        this.size = 0;
	        this._head = undefined;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return emptyStack();
	    };
	
	    Stack.prototype.slice = function(begin, end) {
	      if (wholeSlice(begin, end, this.size)) {
	        return this;
	      }
	      var resolvedBegin = resolveBegin(begin, this.size);
	      var resolvedEnd = resolveEnd(end, this.size);
	      if (resolvedEnd !== this.size) {
	        // super.slice(begin, end);
	        return IndexedCollection.prototype.slice.call(this, begin, end);
	      }
	      var newSize = this.size - resolvedBegin;
	      var head = this._head;
	      while (resolvedBegin--) {
	        head = head.next;
	      }
	      if (this.__ownerID) {
	        this.size = newSize;
	        this._head = head;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return makeStack(newSize, head);
	    };
	
	    // @pragma Mutability
	
	    Stack.prototype.__ensureOwner = function(ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      if (!ownerID) {
	        this.__ownerID = ownerID;
	        this.__altered = false;
	        return this;
	      }
	      return makeStack(this.size, this._head, ownerID, this.__hash);
	    };
	
	    // @pragma Iteration
	
	    Stack.prototype.__iterate = function(fn, reverse) {
	      if (reverse) {
	        return this.reverse().__iterate(fn);
	      }
	      var iterations = 0;
	      var node = this._head;
	      while (node) {
	        if (fn(node.value, iterations++, this) === false) {
	          break;
	        }
	        node = node.next;
	      }
	      return iterations;
	    };
	
	    Stack.prototype.__iterator = function(type, reverse) {
	      if (reverse) {
	        return this.reverse().__iterator(type);
	      }
	      var iterations = 0;
	      var node = this._head;
	      return new Iterator(function()  {
	        if (node) {
	          var value = node.value;
	          node = node.next;
	          return iteratorValue(type, iterations++, value);
	        }
	        return iteratorDone();
	      });
	    };
	
	
	  function isStack(maybeStack) {
	    return !!(maybeStack && maybeStack[IS_STACK_SENTINEL]);
	  }
	
	  Stack.isStack = isStack;
	
	  var IS_STACK_SENTINEL = '@@__IMMUTABLE_STACK__@@';
	
	  var StackPrototype = Stack.prototype;
	  StackPrototype[IS_STACK_SENTINEL] = true;
	  StackPrototype.withMutations = MapPrototype.withMutations;
	  StackPrototype.asMutable = MapPrototype.asMutable;
	  StackPrototype.asImmutable = MapPrototype.asImmutable;
	  StackPrototype.wasAltered = MapPrototype.wasAltered;
	
	
	  function makeStack(size, head, ownerID, hash) {
	    var map = Object.create(StackPrototype);
	    map.size = size;
	    map._head = head;
	    map.__ownerID = ownerID;
	    map.__hash = hash;
	    map.__altered = false;
	    return map;
	  }
	
	  var EMPTY_STACK;
	  function emptyStack() {
	    return EMPTY_STACK || (EMPTY_STACK = makeStack(0));
	  }
	
	  /**
	   * Contributes additional methods to a constructor
	   */
	  function mixin(ctor, methods) {
	    var keyCopier = function(key ) { ctor.prototype[key] = methods[key]; };
	    Object.keys(methods).forEach(keyCopier);
	    Object.getOwnPropertySymbols &&
	      Object.getOwnPropertySymbols(methods).forEach(keyCopier);
	    return ctor;
	  }
	
	  Iterable.Iterator = Iterator;
	
	  mixin(Iterable, {
	
	    // ### Conversion to other types
	
	    toArray: function() {
	      assertNotInfinite(this.size);
	      var array = new Array(this.size || 0);
	      this.valueSeq().__iterate(function(v, i)  { array[i] = v; });
	      return array;
	    },
	
	    toIndexedSeq: function() {
	      return new ToIndexedSequence(this);
	    },
	
	    toJS: function() {
	      return this.toSeq().map(
	        function(value ) {return value && typeof value.toJS === 'function' ? value.toJS() : value}
	      ).__toJS();
	    },
	
	    toJSON: function() {
	      return this.toSeq().map(
	        function(value ) {return value && typeof value.toJSON === 'function' ? value.toJSON() : value}
	      ).__toJS();
	    },
	
	    toKeyedSeq: function() {
	      return new ToKeyedSequence(this, true);
	    },
	
	    toMap: function() {
	      // Use Late Binding here to solve the circular dependency.
	      return Map(this.toKeyedSeq());
	    },
	
	    toObject: function() {
	      assertNotInfinite(this.size);
	      var object = {};
	      this.__iterate(function(v, k)  { object[k] = v; });
	      return object;
	    },
	
	    toOrderedMap: function() {
	      // Use Late Binding here to solve the circular dependency.
	      return OrderedMap(this.toKeyedSeq());
	    },
	
	    toOrderedSet: function() {
	      // Use Late Binding here to solve the circular dependency.
	      return OrderedSet(isKeyed(this) ? this.valueSeq() : this);
	    },
	
	    toSet: function() {
	      // Use Late Binding here to solve the circular dependency.
	      return Set(isKeyed(this) ? this.valueSeq() : this);
	    },
	
	    toSetSeq: function() {
	      return new ToSetSequence(this);
	    },
	
	    toSeq: function() {
	      return isIndexed(this) ? this.toIndexedSeq() :
	        isKeyed(this) ? this.toKeyedSeq() :
	        this.toSetSeq();
	    },
	
	    toStack: function() {
	      // Use Late Binding here to solve the circular dependency.
	      return Stack(isKeyed(this) ? this.valueSeq() : this);
	    },
	
	    toList: function() {
	      // Use Late Binding here to solve the circular dependency.
	      return List(isKeyed(this) ? this.valueSeq() : this);
	    },
	
	
	    // ### Common JavaScript methods and properties
	
	    toString: function() {
	      return '[Iterable]';
	    },
	
	    __toString: function(head, tail) {
	      if (this.size === 0) {
	        return head + tail;
	      }
	      return head + ' ' + this.toSeq().map(this.__toStringMapper).join(', ') + ' ' + tail;
	    },
	
	
	    // ### ES6 Collection methods (ES6 Array and Map)
	
	    concat: function() {var values = SLICE$0.call(arguments, 0);
	      return reify(this, concatFactory(this, values));
	    },
	
	    includes: function(searchValue) {
	      return this.some(function(value ) {return is(value, searchValue)});
	    },
	
	    entries: function() {
	      return this.__iterator(ITERATE_ENTRIES);
	    },
	
	    every: function(predicate, context) {
	      assertNotInfinite(this.size);
	      var returnValue = true;
	      this.__iterate(function(v, k, c)  {
	        if (!predicate.call(context, v, k, c)) {
	          returnValue = false;
	          return false;
	        }
	      });
	      return returnValue;
	    },
	
	    filter: function(predicate, context) {
	      return reify(this, filterFactory(this, predicate, context, true));
	    },
	
	    find: function(predicate, context, notSetValue) {
	      var entry = this.findEntry(predicate, context);
	      return entry ? entry[1] : notSetValue;
	    },
	
	    forEach: function(sideEffect, context) {
	      assertNotInfinite(this.size);
	      return this.__iterate(context ? sideEffect.bind(context) : sideEffect);
	    },
	
	    join: function(separator) {
	      assertNotInfinite(this.size);
	      separator = separator !== undefined ? '' + separator : ',';
	      var joined = '';
	      var isFirst = true;
	      this.__iterate(function(v ) {
	        isFirst ? (isFirst = false) : (joined += separator);
	        joined += v !== null && v !== undefined ? v.toString() : '';
	      });
	      return joined;
	    },
	
	    keys: function() {
	      return this.__iterator(ITERATE_KEYS);
	    },
	
	    map: function(mapper, context) {
	      return reify(this, mapFactory(this, mapper, context));
	    },
	
	    reduce: function(reducer, initialReduction, context) {
	      assertNotInfinite(this.size);
	      var reduction;
	      var useFirst;
	      if (arguments.length < 2) {
	        useFirst = true;
	      } else {
	        reduction = initialReduction;
	      }
	      this.__iterate(function(v, k, c)  {
	        if (useFirst) {
	          useFirst = false;
	          reduction = v;
	        } else {
	          reduction = reducer.call(context, reduction, v, k, c);
	        }
	      });
	      return reduction;
	    },
	
	    reduceRight: function(reducer, initialReduction, context) {
	      var reversed = this.toKeyedSeq().reverse();
	      return reversed.reduce.apply(reversed, arguments);
	    },
	
	    reverse: function() {
	      return reify(this, reverseFactory(this, true));
	    },
	
	    slice: function(begin, end) {
	      return reify(this, sliceFactory(this, begin, end, true));
	    },
	
	    some: function(predicate, context) {
	      return !this.every(not(predicate), context);
	    },
	
	    sort: function(comparator) {
	      return reify(this, sortFactory(this, comparator));
	    },
	
	    values: function() {
	      return this.__iterator(ITERATE_VALUES);
	    },
	
	
	    // ### More sequential methods
	
	    butLast: function() {
	      return this.slice(0, -1);
	    },
	
	    isEmpty: function() {
	      return this.size !== undefined ? this.size === 0 : !this.some(function()  {return true});
	    },
	
	    count: function(predicate, context) {
	      return ensureSize(
	        predicate ? this.toSeq().filter(predicate, context) : this
	      );
	    },
	
	    countBy: function(grouper, context) {
	      return countByFactory(this, grouper, context);
	    },
	
	    equals: function(other) {
	      return deepEqual(this, other);
	    },
	
	    entrySeq: function() {
	      var iterable = this;
	      if (iterable._cache) {
	        // We cache as an entries array, so we can just return the cache!
	        return new ArraySeq(iterable._cache);
	      }
	      var entriesSequence = iterable.toSeq().map(entryMapper).toIndexedSeq();
	      entriesSequence.fromEntrySeq = function()  {return iterable.toSeq()};
	      return entriesSequence;
	    },
	
	    filterNot: function(predicate, context) {
	      return this.filter(not(predicate), context);
	    },
	
	    findEntry: function(predicate, context, notSetValue) {
	      var found = notSetValue;
	      this.__iterate(function(v, k, c)  {
	        if (predicate.call(context, v, k, c)) {
	          found = [k, v];
	          return false;
	        }
	      });
	      return found;
	    },
	
	    findKey: function(predicate, context) {
	      var entry = this.findEntry(predicate, context);
	      return entry && entry[0];
	    },
	
	    findLast: function(predicate, context, notSetValue) {
	      return this.toKeyedSeq().reverse().find(predicate, context, notSetValue);
	    },
	
	    findLastEntry: function(predicate, context, notSetValue) {
	      return this.toKeyedSeq().reverse().findEntry(predicate, context, notSetValue);
	    },
	
	    findLastKey: function(predicate, context) {
	      return this.toKeyedSeq().reverse().findKey(predicate, context);
	    },
	
	    first: function() {
	      return this.find(returnTrue);
	    },
	
	    flatMap: function(mapper, context) {
	      return reify(this, flatMapFactory(this, mapper, context));
	    },
	
	    flatten: function(depth) {
	      return reify(this, flattenFactory(this, depth, true));
	    },
	
	    fromEntrySeq: function() {
	      return new FromEntriesSequence(this);
	    },
	
	    get: function(searchKey, notSetValue) {
	      return this.find(function(_, key)  {return is(key, searchKey)}, undefined, notSetValue);
	    },
	
	    getIn: function(searchKeyPath, notSetValue) {
	      var nested = this;
	      // Note: in an ES6 environment, we would prefer:
	      // for (var key of searchKeyPath) {
	      var iter = forceIterator(searchKeyPath);
	      var step;
	      while (!(step = iter.next()).done) {
	        var key = step.value;
	        nested = nested && nested.get ? nested.get(key, NOT_SET) : NOT_SET;
	        if (nested === NOT_SET) {
	          return notSetValue;
	        }
	      }
	      return nested;
	    },
	
	    groupBy: function(grouper, context) {
	      return groupByFactory(this, grouper, context);
	    },
	
	    has: function(searchKey) {
	      return this.get(searchKey, NOT_SET) !== NOT_SET;
	    },
	
	    hasIn: function(searchKeyPath) {
	      return this.getIn(searchKeyPath, NOT_SET) !== NOT_SET;
	    },
	
	    isSubset: function(iter) {
	      iter = typeof iter.includes === 'function' ? iter : Iterable(iter);
	      return this.every(function(value ) {return iter.includes(value)});
	    },
	
	    isSuperset: function(iter) {
	      iter = typeof iter.isSubset === 'function' ? iter : Iterable(iter);
	      return iter.isSubset(this);
	    },
	
	    keyOf: function(searchValue) {
	      return this.findKey(function(value ) {return is(value, searchValue)});
	    },
	
	    keySeq: function() {
	      return this.toSeq().map(keyMapper).toIndexedSeq();
	    },
	
	    last: function() {
	      return this.toSeq().reverse().first();
	    },
	
	    lastKeyOf: function(searchValue) {
	      return this.toKeyedSeq().reverse().keyOf(searchValue);
	    },
	
	    max: function(comparator) {
	      return maxFactory(this, comparator);
	    },
	
	    maxBy: function(mapper, comparator) {
	      return maxFactory(this, comparator, mapper);
	    },
	
	    min: function(comparator) {
	      return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator);
	    },
	
	    minBy: function(mapper, comparator) {
	      return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator, mapper);
	    },
	
	    rest: function() {
	      return this.slice(1);
	    },
	
	    skip: function(amount) {
	      return this.slice(Math.max(0, amount));
	    },
	
	    skipLast: function(amount) {
	      return reify(this, this.toSeq().reverse().skip(amount).reverse());
	    },
	
	    skipWhile: function(predicate, context) {
	      return reify(this, skipWhileFactory(this, predicate, context, true));
	    },
	
	    skipUntil: function(predicate, context) {
	      return this.skipWhile(not(predicate), context);
	    },
	
	    sortBy: function(mapper, comparator) {
	      return reify(this, sortFactory(this, comparator, mapper));
	    },
	
	    take: function(amount) {
	      return this.slice(0, Math.max(0, amount));
	    },
	
	    takeLast: function(amount) {
	      return reify(this, this.toSeq().reverse().take(amount).reverse());
	    },
	
	    takeWhile: function(predicate, context) {
	      return reify(this, takeWhileFactory(this, predicate, context));
	    },
	
	    takeUntil: function(predicate, context) {
	      return this.takeWhile(not(predicate), context);
	    },
	
	    valueSeq: function() {
	      return this.toIndexedSeq();
	    },
	
	
	    // ### Hashable Object
	
	    hashCode: function() {
	      return this.__hash || (this.__hash = hashIterable(this));
	    }
	
	
	    // ### Internal
	
	    // abstract __iterate(fn, reverse)
	
	    // abstract __iterator(type, reverse)
	  });
	
	  // var IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
	  // var IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
	  // var IS_INDEXED_SENTINEL = '@@__IMMUTABLE_INDEXED__@@';
	  // var IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';
	
	  var IterablePrototype = Iterable.prototype;
	  IterablePrototype[IS_ITERABLE_SENTINEL] = true;
	  IterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.values;
	  IterablePrototype.__toJS = IterablePrototype.toArray;
	  IterablePrototype.__toStringMapper = quoteString;
	  IterablePrototype.inspect =
	  IterablePrototype.toSource = function() { return this.toString(); };
	  IterablePrototype.chain = IterablePrototype.flatMap;
	  IterablePrototype.contains = IterablePrototype.includes;
	
	  mixin(KeyedIterable, {
	
	    // ### More sequential methods
	
	    flip: function() {
	      return reify(this, flipFactory(this));
	    },
	
	    mapEntries: function(mapper, context) {var this$0 = this;
	      var iterations = 0;
	      return reify(this,
	        this.toSeq().map(
	          function(v, k)  {return mapper.call(context, [k, v], iterations++, this$0)}
	        ).fromEntrySeq()
	      );
	    },
	
	    mapKeys: function(mapper, context) {var this$0 = this;
	      return reify(this,
	        this.toSeq().flip().map(
	          function(k, v)  {return mapper.call(context, k, v, this$0)}
	        ).flip()
	      );
	    }
	
	  });
	
	  var KeyedIterablePrototype = KeyedIterable.prototype;
	  KeyedIterablePrototype[IS_KEYED_SENTINEL] = true;
	  KeyedIterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.entries;
	  KeyedIterablePrototype.__toJS = IterablePrototype.toObject;
	  KeyedIterablePrototype.__toStringMapper = function(v, k)  {return JSON.stringify(k) + ': ' + quoteString(v)};
	
	
	
	  mixin(IndexedIterable, {
	
	    // ### Conversion to other types
	
	    toKeyedSeq: function() {
	      return new ToKeyedSequence(this, false);
	    },
	
	
	    // ### ES6 Collection methods (ES6 Array and Map)
	
	    filter: function(predicate, context) {
	      return reify(this, filterFactory(this, predicate, context, false));
	    },
	
	    findIndex: function(predicate, context) {
	      var entry = this.findEntry(predicate, context);
	      return entry ? entry[0] : -1;
	    },
	
	    indexOf: function(searchValue) {
	      var key = this.keyOf(searchValue);
	      return key === undefined ? -1 : key;
	    },
	
	    lastIndexOf: function(searchValue) {
	      var key = this.lastKeyOf(searchValue);
	      return key === undefined ? -1 : key;
	    },
	
	    reverse: function() {
	      return reify(this, reverseFactory(this, false));
	    },
	
	    slice: function(begin, end) {
	      return reify(this, sliceFactory(this, begin, end, false));
	    },
	
	    splice: function(index, removeNum /*, ...values*/) {
	      var numArgs = arguments.length;
	      removeNum = Math.max(removeNum | 0, 0);
	      if (numArgs === 0 || (numArgs === 2 && !removeNum)) {
	        return this;
	      }
	      // If index is negative, it should resolve relative to the size of the
	      // collection. However size may be expensive to compute if not cached, so
	      // only call count() if the number is in fact negative.
	      index = resolveBegin(index, index < 0 ? this.count() : this.size);
	      var spliced = this.slice(0, index);
	      return reify(
	        this,
	        numArgs === 1 ?
	          spliced :
	          spliced.concat(arrCopy(arguments, 2), this.slice(index + removeNum))
	      );
	    },
	
	
	    // ### More collection methods
	
	    findLastIndex: function(predicate, context) {
	      var entry = this.findLastEntry(predicate, context);
	      return entry ? entry[0] : -1;
	    },
	
	    first: function() {
	      return this.get(0);
	    },
	
	    flatten: function(depth) {
	      return reify(this, flattenFactory(this, depth, false));
	    },
	
	    get: function(index, notSetValue) {
	      index = wrapIndex(this, index);
	      return (index < 0 || (this.size === Infinity ||
	          (this.size !== undefined && index > this.size))) ?
	        notSetValue :
	        this.find(function(_, key)  {return key === index}, undefined, notSetValue);
	    },
	
	    has: function(index) {
	      index = wrapIndex(this, index);
	      return index >= 0 && (this.size !== undefined ?
	        this.size === Infinity || index < this.size :
	        this.indexOf(index) !== -1
	      );
	    },
	
	    interpose: function(separator) {
	      return reify(this, interposeFactory(this, separator));
	    },
	
	    interleave: function(/*...iterables*/) {
	      var iterables = [this].concat(arrCopy(arguments));
	      var zipped = zipWithFactory(this.toSeq(), IndexedSeq.of, iterables);
	      var interleaved = zipped.flatten(true);
	      if (zipped.size) {
	        interleaved.size = zipped.size * iterables.length;
	      }
	      return reify(this, interleaved);
	    },
	
	    keySeq: function() {
	      return Range(0, this.size);
	    },
	
	    last: function() {
	      return this.get(-1);
	    },
	
	    skipWhile: function(predicate, context) {
	      return reify(this, skipWhileFactory(this, predicate, context, false));
	    },
	
	    zip: function(/*, ...iterables */) {
	      var iterables = [this].concat(arrCopy(arguments));
	      return reify(this, zipWithFactory(this, defaultZipper, iterables));
	    },
	
	    zipWith: function(zipper/*, ...iterables */) {
	      var iterables = arrCopy(arguments);
	      iterables[0] = this;
	      return reify(this, zipWithFactory(this, zipper, iterables));
	    }
	
	  });
	
	  IndexedIterable.prototype[IS_INDEXED_SENTINEL] = true;
	  IndexedIterable.prototype[IS_ORDERED_SENTINEL] = true;
	
	
	
	  mixin(SetIterable, {
	
	    // ### ES6 Collection methods (ES6 Array and Map)
	
	    get: function(value, notSetValue) {
	      return this.has(value) ? value : notSetValue;
	    },
	
	    includes: function(value) {
	      return this.has(value);
	    },
	
	
	    // ### More sequential methods
	
	    keySeq: function() {
	      return this.valueSeq();
	    }
	
	  });
	
	  SetIterable.prototype.has = IterablePrototype.includes;
	  SetIterable.prototype.contains = SetIterable.prototype.includes;
	
	
	  // Mixin subclasses
	
	  mixin(KeyedSeq, KeyedIterable.prototype);
	  mixin(IndexedSeq, IndexedIterable.prototype);
	  mixin(SetSeq, SetIterable.prototype);
	
	  mixin(KeyedCollection, KeyedIterable.prototype);
	  mixin(IndexedCollection, IndexedIterable.prototype);
	  mixin(SetCollection, SetIterable.prototype);
	
	
	  // #pragma Helper functions
	
	  function keyMapper(v, k) {
	    return k;
	  }
	
	  function entryMapper(v, k) {
	    return [k, v];
	  }
	
	  function not(predicate) {
	    return function() {
	      return !predicate.apply(this, arguments);
	    }
	  }
	
	  function neg(predicate) {
	    return function() {
	      return -predicate.apply(this, arguments);
	    }
	  }
	
	  function quoteString(value) {
	    return typeof value === 'string' ? JSON.stringify(value) : String(value);
	  }
	
	  function defaultZipper() {
	    return arrCopy(arguments);
	  }
	
	  function defaultNegComparator(a, b) {
	    return a < b ? 1 : a > b ? -1 : 0;
	  }
	
	  function hashIterable(iterable) {
	    if (iterable.size === Infinity) {
	      return 0;
	    }
	    var ordered = isOrdered(iterable);
	    var keyed = isKeyed(iterable);
	    var h = ordered ? 1 : 0;
	    var size = iterable.__iterate(
	      keyed ?
	        ordered ?
	          function(v, k)  { h = 31 * h + hashMerge(hash(v), hash(k)) | 0; } :
	          function(v, k)  { h = h + hashMerge(hash(v), hash(k)) | 0; } :
	        ordered ?
	          function(v ) { h = 31 * h + hash(v) | 0; } :
	          function(v ) { h = h + hash(v) | 0; }
	    );
	    return murmurHashOfSize(size, h);
	  }
	
	  function murmurHashOfSize(size, h) {
	    h = imul(h, 0xCC9E2D51);
	    h = imul(h << 15 | h >>> -15, 0x1B873593);
	    h = imul(h << 13 | h >>> -13, 5);
	    h = (h + 0xE6546B64 | 0) ^ size;
	    h = imul(h ^ h >>> 16, 0x85EBCA6B);
	    h = imul(h ^ h >>> 13, 0xC2B2AE35);
	    h = smi(h ^ h >>> 16);
	    return h;
	  }
	
	  function hashMerge(a, b) {
	    return a ^ b + 0x9E3779B9 + (a << 6) + (a >> 2) | 0; // int
	  }
	
	  var Immutable = {
	
	    Iterable: Iterable,
	
	    Seq: Seq,
	    Collection: Collection,
	    Map: Map,
	    OrderedMap: OrderedMap,
	    List: List,
	    Stack: Stack,
	    Set: Set,
	    OrderedSet: OrderedSet,
	
	    Record: Record,
	    Range: Range,
	    Repeat: Repeat,
	
	    is: is,
	    fromJS: fromJS
	
	  };
	
	  return Immutable;
	
	}));

/***/ },

/***/ 550:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// let ObjectAssign=require('object-assign');
	var Echo = __webpack_require__(543);
	var Immutable = __webpack_require__(549);
	var parser = new DOMParser();
	var comics = {
		regex: /http\:\/\/www\.comicbus\.com\/online(\/.*-\d*.html\?ch=\d*)/,
	
		baseURL: "http://www.comicbus.com/online/",
	
		comicspageURL: "http://www.comicbus.com/html/",
	
		handleUrlHash: function handleUrlHash(menuItems) {
			var params_str = window.location.hash;
			this.site = /site\/(\w*)/.exec(params_str)[1];
			this.pageURL = /chapter\/.*-(\d*\.html)\?/.exec(params_str)[1];
			this.chapterNum = /chapter\/.*\?ch\=(\d*)/.exec(params_str)[1];
			this.prefixURL = /chapter\/(.*\?ch\=)\d*/.exec(params_str)[1];;
			this.indexURL = this.comicspageURL + this.pageURL;
			// console.log('params_str',params_str);
			if (!/#$/.test(params_str)) {
				// console.log('page back');
				document.getElementById("comics_panel").innerHTML = "";
				var index = -1;
				for (var i = 0; i < menuItems.size; ++i) {
					if (menuItems.get(i).get('payload') === this.baseURL + this.prefixURL + this.chapterNum) {
						index = i;
						this.lastIndex = index;
						break;
					}
				}
				this.getImage(index, this.chapterNum);
			} else {
				window.history.replaceState('', document.title, "#/site/comics8/chapter/" + /chapter\/(.*)#$/.exec(params_str)[1]);
			}
		},
	
		getChapter: function getChapter(doc) {
			var nl = doc.querySelectorAll(".Vol , .ch , #lch");
			return nl;
		},
	
		getChapterUrl: function getChapterUrl(str) {
			var p_array = /cview\(\'(.*-\d*\.html)\',(\d*)/.exec(str);
			var catid = p_array[2];
			var url = p_array[1];
			var baseurl = "";
			if (catid == 4 || catid == 6 || catid == 12 || catid == 22) baseurl = "/online/Domain-";
			if (catid == 1 || catid == 17 || catid == 19 || catid == 21) baseurl = "/online/finance-";
			if (catid == 2 || catid == 5 || catid == 7 || catid == 9) baseurl = "/online/insurance-";
			if (catid == 10 || catid == 11 || catid == 13 || catid == 14) baseurl = "/online/insurance-";
			if (catid == 3 || catid == 8 || catid == 15 || catid == 16 || catid == 18 || catid == 20) baseurl = "/online/finance-";
			url = url.replace(".html", "").replace("-", ".html?ch=");
			return "http://www.comicbus.com" + baseurl + url;
		},
	
		getTitleName: function getTitleName(doc) {
			this.title = doc.querySelector("body > table:nth-child(7) > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(1) > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(2) > font").textContent;
			// this.title=encodeURIComponent(this.title);
			return this.title;
		},
	
		getCoverImg: function getCoverImg(doc) {
			this.iconUrl = doc.querySelector("body > table:nth-child(7) > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(1) > img").src;
			return this.iconUrl;
		},
	
		getIndexURL: function getIndexURL() {
			return regeneratorRuntime.async(function getIndexURL$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							return _context.abrupt('return', this.indexURL);
	
						case 1:
						case 'end':
							return _context.stop();
					}
				}
			}, null, this);
		},
	
		getImage: function getImage(index, url) {
			var response, rtxt, doc;
			return regeneratorRuntime.async(function getImage$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							console.log(this.baseURL + this.prefixURL + url);
							_context2.next = 3;
							return regeneratorRuntime.awrap(fetch(this.baseURL + this.prefixURL + url));
	
						case 3:
							response = _context2.sent;
							_context2.next = 6;
							return regeneratorRuntime.awrap(response.text());
	
						case 6:
							rtxt = _context2.sent;
							doc = parser.parseFromString(rtxt, "text/html");
	
							this.setImages(this.baseURL + this.prefixURL + url, index, doc);
	
						case 9:
						case 'end':
							return _context2.stop();
					}
				}
			}, null, this);
		},
	
		getMenuItems: function getMenuItems(doc, markedItems) {
			var nl = this.getChapter(doc);
			var array = [];
			this.initIndex = -1;
			var item = {};
			item.payload = this.getChapterUrl(nl[nl.length - 2].getAttribute("onclick"));
			item.text = nl[nl.length - 1].textContent;
			if (item.payload === this.baseURL + this.prefixURL + this.chapterNum && this.initIndex === -1) {
				this.initIndex = 0;
				document.title = this.title + " " + item.text;
				this.setImageIndex(this.initIndex);
				item.isMarked = true;
				if (!markedItems.has(item.payload)) {
					markedItems = markedItems.add(item.payload);
				}
			}
			if (markedItems.has(item.payload)) {
				item.isMarked = true;
			}
			item = Immutable.Map(item);
			array.push(item);
			for (var i = nl.length - 3; i >= 0; --i) {
				var _item = {};
				_item.payload = this.getChapterUrl(nl[i].getAttribute("onclick"));
				_item.text = nl[i].textContent;
				console.log(_item.payload);
				if (_item.payload === this.baseURL + this.prefixURL + this.chapterNum && this.initIndex === -1) {
					this.initIndex = nl.length - i - 2;
					document.title = this.title + " " + _item.text;
					this.setImageIndex(this.initIndex);
					_item.isMarked = true;
					if (!markedItems.has(_item.payload)) {
						markedItems = markedItems.add(_item.payload);
					}
				}
				_item.text = nl[i].textContent.trim();
				if (markedItems.has(_item.payload)) {
					_item.isMarked = true;
				}
				_item = Immutable.Map(_item);
				array.push(_item);
			}
			this.markedItems = markedItems;
			return Immutable.List(array);
		},
	
		chapterUpdateIndex: -1,
	
		setImageIndex: function setImageIndex(index) {
			if (this.chapterUpdateIndex === -1) {
				this.chapterUpdateIndex = index;
			} else if (this.chapterUpdateIndex === -2) {
				var imgs = document.querySelectorAll('img[data-chapter=\"-1\"]');
				for (var i = 0; i < imgs.length; ++i) {
					imgs[i].setAttribute("data-chapter", index);
				}
				this.chapterUpdateIndex = -1;
			}
		},
	
		setImages: function setImages(url, index, doc) {
			var script = doc.evaluate("//*[@id=\"Form1\"]/script/text()", doc, null, XPathResult.ANY_TYPE, null).iterateNext().textContent.split('eval')[0];
			eval(script);
			var ch = /.*ch\=(.*)/.exec(url)[1];
			if (ch.indexOf('#') > 0) ch = ch.split('#')[0];
			var p = 1;
			var f = 50;
			if (ch.indexOf('-') > 0) {
				p = parseInt(ch.split('-')[1]);
				ch = ch.split('-')[0];
			}
			if (ch == '') ch = 1;else ch = parseInt(ch);
			var ss = function ss(a, b, c, d) {
				var e = a.substring(b, b + c);
				return d == null ? e.replace(/[a-z]*/gi, "") : e;
			};
			var nn = function nn(n) {
				return n < 10 ? '00' + n : n < 100 ? '0' + n : n;
			};
			var mm = function mm(p) {
				return parseInt((p - 1) / 10) % 10 + (p - 1) % 10 * 3;
			};
			var c = "";
			var cc = cs.length;
			for (var j = 0; j < cc / f; j++) {
				if (ss(cs, j * f, 4) == ch) {
					c = ss(cs, j * f, f, f);
					ci = j;
					break;
				}
			}
			if (c == '') {
				c = ss(cs, cc - f, f);
				ch = c;
			}
			ps = ss(c, 7, 3);
			this.pageMax = ps;
			var img = [];
			for (var i = 0; i < this.pageMax; ++i) {
				var _c = "";
				var _cc = cs.length;
				for (var _j = 0; _j < _cc / f; _j++) {
					if (ss(cs, _j * f, 4) == ch) {
						_c = ss(cs, _j * f, f, f);
						ci = _j;
						break;
					}
				}
				if (_c == '') {
					_c = ss(cs, _cc - f, f);
					ch = chs;
				}
				img[i] = 'http://img' + ss(_c, 4, 2) + '.6comic.com:99/' + ss(_c, 6, 1) + '/' + ti + '/' + ss(_c, 0, 4) + '/' + nn(i + 1) + '_' + ss(_c, mm(i + 1) + 10, 3, f) + '.jpg';
			}
			this.images = img;
			this.appendImage(index);
		},
	
		appendImage: function appendImage(index) {
			var comics_panel = document.getElementById("comics_panel");
			if (index === -1) {
				index = this.chapterUpdateIndex;
				this.chapterUpdateIndex = -2;
			}
			for (var i = 0; i < this.pageMax; ++i) {
				var img = new Image();
				img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
				img.setAttribute("data-echo", this.images[i]);
				img.setAttribute("data-num", i + 1);
				img.setAttribute("data-chapter", index);
				img.style.width = "900px";
				img.style.height = "1300px";
				img.style.display = 'block';
				img.style.borderWidth = "1px";
				img.style.borderColor = "white";
				img.style.borderStyle = "solid";
				img.style.marginLeft = 'auto';
				img.style.marginRight = 'auto';
				img.style.marginTop = '10px';
				img.style.marginBottom = '50px';
				img.style.maxWidth = '100%';
				img.style.background = '#2a2a2a url(http://i.imgur.com/msdpdQm.gif) no-repeat center center';
				img.setAttribute("data-pageMax", this.pageMax);
				comics_panel.appendChild(img);
			}
			Echo.nodes = comics_panel.children;
			var chapterEnd = document.createElement("div");
			chapterEnd.className = "comics_img_end";
			chapterEnd.textContent = "本話結束";
			comics_panel.appendChild(chapterEnd);
			var chapterPromote = document.createElement("div");
			chapterPromote.className = "comics_img_promote";
			chapterPromote.textContent = "If you like Comics Scroller, give me a like on FB or Github.";
			comics_panel.appendChild(chapterPromote);
			if (!Echo.hadInited) {
				Echo.init();
			} else {
				Echo.render();
			}
		},
	
		backgroundOnload: function backgroundOnload(indexURL, chapters, req, items, k) {
			var doc = req.response;
			var nl = this.getChapter(doc);
			var title = this.getTitleName(doc);
			var imgUrl = this.getCoverImg(doc);
			var array = [];
			var obj = {};
			var item = {};
			item.payload = this.getChapterUrl(nl[nl.length - 2].getAttribute("onclick"));
			item.text = nl[nl.length - 1].textContent;
			array.push(item);
			var urlInChapter = false;
			for (var j = 0; j < chapters.length; ++j) {
				if (chapters[j].payload === item.payload) {
					urlInChapter = true;
					break;
				}
			}
			if (urlInChapter === false && chapters.length > 0) {
				var _obj = {
					url: indexURL,
					title: title,
					site: 'comics8',
					iconUrl: imgUrl,
					lastReaded: item
				};
				chrome.notifications.create(item.payload, {
					type: "image",
					iconUrl: 'img/comics-64.png',
					title: "Comics Update",
					message: title + "  " + _obj.lastReaded.text,
					imageUrl: imgUrl
				});
				chrome.storage.local.get('update', function (items) {
					items.update.push(this);
					var num = items.update.length.toString();
					chrome.browserAction.setBadgeText({ text: num });
					chrome.storage.local.set(items);
				}.bind(_obj));
			}
			for (var i = nl.length - 3; i >= 0; --i) {
				var _item2 = {};
				_item2.payload = this.getChapterUrl(nl[i].getAttribute("onclick"));
				_item2.text = nl[i].textContent.trim();
				array.push(_item2);
				var _obj2 = {};
				var _urlInChapter = false;
				for (var _j2 = 0; _j2 < chapters.length; ++_j2) {
					if (chapters[_j2].payload === _item2.payload) {
						_urlInChapter = true;
						break;
					}
				}
				if (_urlInChapter === false && chapters.length > 0) {
					_obj2 = {
						url: indexURL,
						title: title,
						site: 'comics8',
						iconUrl: imgUrl,
						lastReaded: _item2
					};
					chrome.notifications.create(_item2.payload, {
						type: "image",
						iconUrl: 'img/comics-64.png',
						title: "Comics Update",
						message: title + "  " + _obj2.lastReaded.text,
						imageUrl: imgUrl
					});
					chrome.storage.local.get('update', function (items) {
						items.update.push(this);
						var num = items.update.length.toString();
						chrome.browserAction.setBadgeText({ text: num });
						chrome.storage.local.set(items);
					}.bind(_obj2));
				}
			}
			items['collected'][k].menuItems = array;
			chrome.storage.local.set(items);
		}
	};
	
	module.exports = comics;

/***/ },

/***/ 551:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Echo = __webpack_require__(543);
	var Immutable = __webpack_require__(549);
	var parser = new DOMParser();
	var comics = {
		regex: /http\:\/\/www\.dm5\.com(\/m\d+\/)/,
	
		dm5regex: /http\:\/\/(tel||www)\.dm5\.com(\/m\d+\/)/,
	
		baseURL: "http://www.dm5.com",
	
		handleUrlHash: function handleUrlHash(menuItems) {
			var params_str = window.location.hash;
			this.site = /site\/(.*)\/chapter/.exec(params_str)[1];
			this.chapterURL = this.baseURL + /chapter(\/.*\/)/.exec(params_str)[1];
	
			if (!/#$/.test(params_str)) {
				document.getElementById("comics_panel").innerHTML = "";
				var index = -1;
				for (var i = 0; i < menuItems.size; ++i) {
					if (menuItems.get(i).get('payload') === this.chapterURL) {
						index = i;
						this.lastIndex = index;
						break;
					}
				}
				this.getImage(index, this.chapterURL);
			} else {
				window.history.replaceState('', document.title, "#/site/dm5/chapter/" + /chapter\/(.*\/)/.exec(params_str)[1]);
			}
		},
	
		getChapter: function getChapter(doc) {
			var nl = doc.querySelectorAll(".nr6.lan2>li>.tg");
			return nl;
		},
	
		getTitleName: function getTitleName(doc) {
			this.title = doc.querySelector(".inbt_title_h2").textContent;
			return this.title;
		},
	
		getCoverImg: function getCoverImg(doc) {
			this.iconUrl = doc.querySelector(".innr91>img").src;
			return this.iconUrl;
		},
	
		getIndexURL: function getIndexURL() {
			var response, rtxt, doc;
			return regeneratorRuntime.async(function getIndexURL$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							_context.next = 2;
							return regeneratorRuntime.awrap(fetch(this.chapterURL));
	
						case 2:
							response = _context.sent;
							_context.next = 5;
							return regeneratorRuntime.awrap(response.text());
	
						case 5:
							rtxt = _context.sent;
							doc = parser.parseFromString(rtxt, "text/html");
	
							this.indexURL = this.baseURL + doc.querySelector("#index_right > div.lan_kk2 > div:nth-child(1) > dl > dt.red_lj > a").getAttribute('href');
							return _context.abrupt('return', this.indexURL);
	
						case 9:
						case 'end':
							return _context.stop();
					}
				}
			}, null, this);
		},
	
		// markedItems: Immutable.Set(),
	
		getMenuItems: function getMenuItems(doc, markedItems) {
			var nl = this.getChapter(doc);
			var array = [];
			this.initIndex = -1;
			for (var i = 0; i < nl.length; ++i) {
				var item = {};
				item.payload = this.baseURL + nl[i].getAttribute('href');
				// console.log(item.payload);
				item.text = nl[i].textContent;
				if (item.payload === this.chapterURL && this.initIndex === -1) {
					this.initIndex = i;
					document.title = this.title + " " + item.text;
					this.setImageIndex(i);
					item.isMarked = true;
					if (!markedItems.has(item.payload)) {
						markedItems = markedItems.add(item.payload);
					}
				}
				if (markedItems.has(item.payload)) {
					item.isMarked = true;
				}
				item = Immutable.Map(item);
				array.push(item);
			}
			this.markedItems = markedItems;
			return Immutable.List(array);
		},
	
		getImage: function getImage(index, url) {
			var response, rtxt, doc;
			return regeneratorRuntime.async(function getImage$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							_context2.next = 2;
							return regeneratorRuntime.awrap(fetch(url));
	
						case 2:
							response = _context2.sent;
							_context2.next = 5;
							return regeneratorRuntime.awrap(response.text());
	
						case 5:
							rtxt = _context2.sent;
							doc = parser.parseFromString(rtxt, "text/html");
	
							this.setImages(url, index, doc);
	
						case 8:
						case 'end':
							return _context2.stop();
					}
				}
			}, null, this);
		},
	
		chapterUpdateIndex: -1,
	
		setImageIndex: function setImageIndex(index) {
			if (this.chapterUpdateIndex === -1) {
				this.chapterUpdateIndex = index;
			} else if (this.chapterUpdateIndex === -2) {
				var imgs = document.querySelectorAll('img[data-chapter=\"-1\"]');
				for (var i = 0; i < imgs.length; ++i) {
					imgs[i].setAttribute("data-chapter", index);
				}
				this.chapterUpdateIndex = -1;
			}
		},
	
		setImages: function setImages(url, index, doc) {
			var script1 = /<script type\=\"text\/javascript\">(.*)reseturl/.exec(doc.head.innerHTML)[1];
			eval(script1);
			this.pageMax = DM5_IMAGE_COUNT;
			var img = [];
			for (var i = 0; i < this.pageMax; ++i) {
				img[i] = url + "chapterfun.ashx?cid=" + DM5_CID.toString() + "&page=" + (i + 1) + "&key=&language=1";
			}
			this.images = img;
			this.appendImage(index);
		},
	
		appendImage: function appendImage(index) {
			var comics_panel = document.getElementById("comics_panel");
			if (index === -1) {
				index = this.chapterUpdateIndex;
				this.chapterUpdateIndex = -2;
			}
			for (var i = 0; i < this.pageMax; ++i) {
				var img = new Image();
				img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
				img.setAttribute("data-echo", this.images[i]);
				img.setAttribute("data-num", i + 1);
				img.setAttribute("data-chapter", index);
				img.style.width = "900px";
				img.style.height = "1300px";
				img.style.display = 'block';
				img.style.borderWidth = "1px";
				img.style.borderColor = "white";
				img.style.borderStyle = "solid";
				img.style.marginLeft = 'auto';
				img.style.marginRight = 'auto';
				img.style.marginTop = '10px';
				img.style.marginBottom = '50px';
				img.style.maxWidth = '100%';
				img.style.background = '#2a2a2a url(http://i.imgur.com/msdpdQm.gif) no-repeat center center';
				img.setAttribute("data-pageMax", this.pageMax);
				comics_panel.appendChild(img);
			}
			Echo.nodes = comics_panel.children;
			var chapterEnd = document.createElement("div");
			chapterEnd.className = "comics_img_end";
			chapterEnd.textContent = "本話結束";
			comics_panel.appendChild(chapterEnd);
			var chapterPromote = document.createElement("div");
			chapterPromote.className = "comics_img_promote";
			chapterPromote.textContent = "If you like Comics Scroller, give me a like on FB or Github.";
			comics_panel.appendChild(chapterPromote);
			if (!Echo.hadInited) {
				Echo.init({
					imgRender: function imgRender(elem) {
						var response, rtxt, req;
						return regeneratorRuntime.async(function imgRender$(_context3) {
							while (1) {
								switch (_context3.prev = _context3.next) {
									case 0:
										_context3.next = 2;
										return regeneratorRuntime.awrap(fetch(elem.getAttribute("data-echo")));
	
									case 2:
										response = _context3.sent;
										_context3.next = 5;
										return regeneratorRuntime.awrap(response.text());
	
									case 5:
										rtxt = _context3.sent;
	
										eval(rtxt);
										req = new XMLHttpRequest();
	
										if (typeof hd_c != "undefined" && hd_c.length > 0 && typeof isrevtt != "undefined") {
											elem.src = hd_c[0];
										} else {
											elem.src = d[0];
										}
										elem.removeAttribute('data-echo');
	
									case 10:
									case 'end':
										return _context3.stop();
								}
							}
						}, null, this);
					}
				});
			} else {
				Echo.render();
			}
		},
	
		backgroundOnload: function backgroundOnload(indexURL, chapters, req, items, k) {
			var doc = req.response;
			var nl = this.getChapter(doc);
			var title = this.getTitleName(doc);
			var imgUrl = this.getCoverImg(doc);
			var array = [];
			if (nl.length !== chapters.length) {
				console.log('update', nl.length, chapters.length);
			}
	
			for (var i = 0; i < nl.length; ++i) {
				var item = {};
				item.payload = this.baseURL + nl[i].getAttribute('href');
				item.text = nl[i].textContent;
				array.push(item);
				var urlInChapter = false;
				for (var j = 0; j < chapters.length; ++j) {
					if (chapters[j].payload === item.payload) {
						urlInChapter = true;
						break;
					}
				}
				if (!urlInChapter && chapters.length > 0) {
					var obj = {
						url: indexURL,
						title: title,
						site: 'dm5',
						iconUrl: imgUrl,
						lastReaded: item
					};
					chrome.notifications.create(item.payload, {
						type: "image",
						iconUrl: 'img/comics-64.png',
						title: "Comics Update",
						message: title + "  " + obj.lastReaded.text,
						imageUrl: imgUrl
					});
					chrome.storage.local.get('update', function (items) {
						items.update.push(this);
						var num = items.update.length.toString();
						chrome.browserAction.setBadgeText({ text: num });
						chrome.storage.local.set(items);
					}.bind(obj));
				}
			}
			items['collected'][k].menuItems = array;
			chrome.storage.local.set(items);
		}
	};
	
	module.exports = comics;

/***/ }

/******/ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjEzNGE5MDJhYzY0MzIxNzUwNjg/Zjc1ZSIsIndlYnBhY2s6Ly8vLi9zcmMvYmFja2dyb3VuZC5qcyIsIndlYnBhY2s6Ly8vLi9+L3Byb2Nlc3MvYnJvd3Nlci5qcz84MmU0Iiwid2VicGFjazovLy8uL3NyYy9hcHAvY29taWNzX3NmLmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvZWNoby5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYWN0aW9ucy9jaGFwdGVyQWN0aW9uLmpzIiwid2VicGFjazovLy8uL3NyYy9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mbHV4L2luZGV4LmpzIiwid2VicGFjazovLy8uL34vZmx1eC9saWIvRGlzcGF0Y2hlci5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZianMvbGliL2ludmFyaWFudC5qcyIsIndlYnBhY2s6Ly8vLi9+L2ltbXV0YWJsZS9kaXN0L2ltbXV0YWJsZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2NvbWljc184LmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvY29taWNzX2RtNS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7OztBQ3RDQSxLQUFJLFlBQVUsb0JBQVEsR0FBUixDQUFkO0FBQ0EsS0FBSSxXQUFTLG9CQUFRLEdBQVIsQ0FBYjtBQUNBLEtBQUksYUFBVyxvQkFBUSxHQUFSLENBQWY7QUFDQSxTQUFRLEdBQVIsQ0FBWSxZQUFaO0FBQ0EsS0FBSSxvQkFBb0IsU0FBcEIsaUJBQW9CLENBQVMsT0FBVCxFQUFrQjs7OztBQUl4QyxVQUFRLGNBQVIsQ0FBdUIsSUFBdkIsQ0FBNEI7QUFDMUIsU0FBTSxTQURvQjtBQUUxQixVQUFPO0FBRm1CLEdBQTVCO0FBSUEsU0FBTyxFQUFDLGdCQUFlLFFBQVEsY0FBeEIsRUFBUDtBQUNELEVBVEQ7O0FBV0EsS0FBSSxXQUFXLFNBQVgsUUFBVyxDQUFTLE9BQVQsRUFBa0I7Ozs7O0FBSy9CLE9BQUksSUFBSSxJQUFFLENBQVYsRUFBYyxJQUFJLFFBQVEsY0FBUixDQUF1QixNQUF6QyxFQUFrRCxFQUFFLENBQXBELEVBQXNEO0FBQ3JELE9BQUcsUUFBUSxjQUFSLENBQXVCLENBQXZCLEVBQTBCLElBQTFCLEtBQW1DLFFBQXRDLEVBQStDO0FBQzlDLFlBQVEsY0FBUixDQUF1QixDQUF2QixFQUEwQixLQUExQixJQUFtQyxZQUFuQztBQUNBO0FBQ0E7QUFDRDtBQUNELFNBQU8sRUFBQyxnQkFBZSxRQUFRLGNBQXhCLEVBQVA7QUFDRCxFQVpEOztBQWNBLFFBQU8sVUFBUCxDQUFrQixtQkFBbEIsQ0FBc0MsV0FBdEMsQ0FBa0QsaUJBQWxELEVBQ0MsRUFBQyxNQUFNLENBQUMsbUNBQUQsQ0FBUCxFQURELEVBRUMsQ0FBQyxnQkFBRCxFQUFtQixVQUFuQixDQUZEOztBQUlBLFFBQU8sVUFBUCxDQUFrQixtQkFBbEIsQ0FBc0MsV0FBdEMsQ0FBa0QsUUFBbEQsRUFDQyxFQUFDLE1BQU0sQ0FBQyx3QkFBRCxDQUFQLEVBREQsRUFFQyxDQUFDLGdCQUFELEVBQW1CLFVBQW5CLENBRkQ7O0FBSUEsUUFBTyxhQUFQLENBQXFCLFNBQXJCLENBQStCLFdBQS9CLENBQTJDLFVBQVMsRUFBVCxFQUFZO0FBQ3RELFNBQU8sSUFBUCxDQUFZLE1BQVosQ0FBbUIsRUFBQyxLQUFJLEVBQUwsRUFBbkI7QUFDQSxFQUZEOztBQUlBLEtBQUksY0FBYyxTQUFkLFdBQWMsR0FBVTtBQUMzQixTQUFPLE9BQVAsQ0FBZSxLQUFmLENBQXFCLEdBQXJCLENBQXlCLFdBQXpCLEVBQXFDLFVBQVMsS0FBVCxFQUFlO0FBQy9DLFFBQUksSUFBSSxJQUFFLENBQVYsRUFBWSxJQUFFLE1BQU0sU0FBTixDQUFnQixNQUE5QixFQUFxQyxFQUFFLENBQXZDLEVBQXlDO0FBQ3hDLFFBQUksV0FBUyxNQUFNLFNBQU4sQ0FBZ0IsQ0FBaEIsRUFBbUIsR0FBaEM7QUFDQSxRQUFJLFdBQVMsTUFBTSxTQUFOLENBQWdCLENBQWhCLEVBQW1CLFNBQWhDOztBQUVBLFFBQUksTUFBSSxJQUFJLGNBQUosRUFBUjtBQUNGLFFBQUcsTUFBTSxTQUFOLENBQWdCLENBQWhCLEVBQW1CLElBQW5CLEtBQTBCLElBQTdCLEVBQWtDO0FBQ2pDLFNBQUksSUFBSixDQUFTLEtBQVQsRUFBZSxRQUFmO0FBQ0EsU0FBSSxZQUFKLEdBQWlCLFVBQWpCO0FBQ0EsU0FBSSxNQUFKLEdBQVksVUFBUyxRQUFULEVBQWtCLFFBQWxCLEVBQTJCLEdBQTNCLEVBQStCLEtBQS9CLEVBQXFDLENBQXJDLEVBQXVDLFNBQXZDLEVBQWlEO0FBQzFELGFBQU8sWUFBVTtBQUNoQixpQkFBVSxnQkFBVixDQUEyQixRQUEzQixFQUFxQyxRQUFyQyxFQUErQyxHQUEvQyxFQUFvRCxLQUFwRCxFQUEyRCxDQUEzRDtBQUNBLE9BRkQ7QUFHTCxNQUphLENBSVgsUUFKVyxFQUlGLFFBSkUsRUFJTyxHQUpQLEVBSVcsS0FKWCxFQUlpQixDQUpqQixFQUltQixTQUpuQixDQUFYO0FBS0EsS0FSRCxNQVFNLElBQUcsTUFBTSxTQUFOLENBQWdCLENBQWhCLEVBQW1CLElBQW5CLEtBQTBCLFNBQTdCLEVBQXVDO0FBQzVDLFNBQUksSUFBSixDQUFTLEtBQVQsRUFBZSxRQUFmO0FBQ0EsU0FBSSxZQUFKLEdBQWlCLFVBQWpCO0FBQ0EsU0FBSSxNQUFKLEdBQVksVUFBUyxRQUFULEVBQWtCLFFBQWxCLEVBQTJCLEdBQTNCLEVBQStCLEtBQS9CLEVBQXFDLENBQXJDLEVBQXVDLFFBQXZDLEVBQWdEO0FBQ3pELGFBQU8sWUFBVTtBQUNoQixnQkFBUyxnQkFBVCxDQUEwQixRQUExQixFQUFvQyxRQUFwQyxFQUE4QyxHQUE5QyxFQUFtRCxLQUFuRCxFQUEwRCxDQUExRDtBQUNBLE9BRkQ7QUFHTCxNQUphLENBSVgsUUFKVyxFQUlGLFFBSkUsRUFJTyxHQUpQLEVBSVcsS0FKWCxFQUlpQixDQUpqQixFQUltQixRQUpuQixDQUFYO0FBS0EsS0FSSyxNQVFBLElBQUcsTUFBTSxTQUFOLENBQWdCLENBQWhCLEVBQW1CLElBQW5CLEtBQTBCLEtBQTdCLEVBQW1DO0FBQ3hDLFNBQUksSUFBSixDQUFTLEtBQVQsRUFBZSxRQUFmO0FBQ0EsU0FBSSxZQUFKLEdBQWlCLFVBQWpCO0FBQ0EsU0FBSSxNQUFKLEdBQVksVUFBUyxRQUFULEVBQWtCLFFBQWxCLEVBQTJCLEdBQTNCLEVBQStCLEtBQS9CLEVBQXFDLENBQXJDLEVBQXVDLFVBQXZDLEVBQWtEO0FBQzNELGFBQU8sWUFBVTtBQUNoQixrQkFBVyxnQkFBWCxDQUE0QixRQUE1QixFQUFzQyxRQUF0QyxFQUFnRCxHQUFoRCxFQUFxRCxLQUFyRCxFQUE0RCxDQUE1RDtBQUNBLE9BRkQ7QUFHTCxNQUphLENBSVgsUUFKVyxFQUlGLFFBSkUsRUFJTyxHQUpQLEVBSVcsS0FKWCxFQUlpQixDQUpqQixFQUltQixVQUpuQixDQUFYO0FBS0E7QUFDRCxRQUFJLElBQUo7QUFDRDtBQUNGLEdBakNEO0FBa0NBLEVBbkNEOztBQXNDQSxRQUFPLE9BQVAsQ0FBZSxXQUFmLENBQTJCLFdBQTNCLENBQXVDLFlBQVU7QUFDaEQsTUFBSSxZQUFVO0FBQ2IsY0FBVTtBQURHLEdBQWQ7O0FBSUEsTUFBSSxTQUFPO0FBQ1YsV0FBTztBQURHLEdBQVg7O0FBSUEsTUFBSSxTQUFPO0FBQ1YsV0FBTztBQURHLEdBQVg7QUFHQSxTQUFPLE9BQVAsQ0FBZSxLQUFmLENBQXFCLEdBQXJCLENBQXlCLFFBQXpCLEVBQWtDLFVBQVMsS0FBVCxFQUFlO0FBQy9DLE9BQUksYUFBYSxPQUFPLE1BQVAsQ0FBYyxNQUFkLEVBQXFCLEtBQXJCLENBQWpCO0FBQ0EsVUFBTyxPQUFQLENBQWUsS0FBZixDQUFxQixHQUFyQixDQUF5QixVQUF6QjtBQUNELEdBSEQ7O0FBS0EsU0FBTyxPQUFQLENBQWUsS0FBZixDQUFxQixHQUFyQixDQUF5QixRQUF6QixFQUFrQyxVQUFTLEtBQVQsRUFBZTtBQUMvQyxPQUFJLGFBQWEsT0FBTyxNQUFQLENBQWMsTUFBZCxFQUFxQixLQUFyQixDQUFqQjtBQUNBLFVBQU8sT0FBUCxDQUFlLEtBQWYsQ0FBcUIsR0FBckIsQ0FBeUIsVUFBekI7QUFDRCxHQUhEOztBQUtBLFNBQU8sT0FBUCxDQUFlLEtBQWYsQ0FBcUIsR0FBckIsQ0FBeUIsV0FBekIsRUFBcUMsVUFBUyxLQUFULEVBQWU7QUFDbEQsT0FBSSxnQkFBZ0IsT0FBTyxNQUFQLENBQWMsU0FBZCxFQUF3QixLQUF4QixDQUFwQjtBQUNBLFVBQU8sT0FBUCxDQUFlLEtBQWYsQ0FBcUIsR0FBckIsQ0FBeUIsYUFBekI7QUFDRCxHQUhEOztBQUtBLFNBQU8sTUFBUCxDQUFjLE1BQWQsQ0FBcUIsYUFBckIsRUFBb0M7QUFDOUIsb0JBQWlCLENBRGEsRUFBcEM7QUFFQSxFQTdCRDs7OztBQWlDQSxRQUFPLGFBQVAsQ0FBcUIsV0FBckIsQ0FBaUMsV0FBakM7QUFDQSxRQUFPLGFBQVAsQ0FBcUIsV0FBckIsQ0FBaUMsV0FBakMsQ0FBNkMsVUFBUyxPQUFULEVBQWtCO0FBQzlELFVBQVEsR0FBUixDQUFZLFFBQVEsR0FBcEIsRUFBd0IsU0FBUyxLQUFULENBQWUsSUFBZixDQUFvQixRQUFRLEdBQTVCLENBQXhCO0FBQ0EsTUFBRyxTQUFTLEtBQVQsQ0FBZSxJQUFmLENBQW9CLFFBQVEsR0FBNUIsQ0FBSCxFQUFvQztBQUNuQyxXQUFRLEdBQVIsQ0FBWSxnQkFBWjtBQUNBLE9BQUksVUFBUSxTQUFTLEtBQVQsQ0FBZSxJQUFmLENBQW9CLFFBQVEsR0FBNUIsRUFBaUMsQ0FBakMsQ0FBWjtBQUNBLFVBQU8sSUFBUCxDQUFZLE1BQVosQ0FBbUIsUUFBUSxLQUEzQixFQUFpQyxFQUFDLEtBQUssT0FBTyxTQUFQLENBQWlCLE1BQWpCLENBQXdCLGFBQXhCLElBQXVDLHdCQUF2QyxHQUFnRSxPQUF0RSxFQUFqQztBQUNBLE1BQUcsTUFBSCxFQUFXLE9BQVgsRUFBb0IsY0FBcEI7QUFDQSxHQUxELE1BS00sSUFBRyxVQUFVLEtBQVYsQ0FBZ0IsSUFBaEIsQ0FBcUIsUUFBUSxHQUE3QixDQUFILEVBQXFDO0FBQzFDLFdBQVEsR0FBUixDQUFZLFVBQVo7QUFDQSxPQUFJLFdBQVEsVUFBVSxLQUFWLENBQWdCLElBQWhCLENBQXFCLFFBQVEsR0FBN0IsRUFBa0MsQ0FBbEMsQ0FBWjtBQUNBLFVBQU8sSUFBUCxDQUFZLE1BQVosQ0FBbUIsUUFBUSxLQUEzQixFQUFpQyxFQUFDLEtBQUssT0FBTyxTQUFQLENBQWlCLE1BQWpCLENBQXdCLGFBQXhCLElBQXVDLG1CQUF2QyxHQUEyRCxRQUFqRSxFQUFqQztBQUNBLE1BQUcsTUFBSCxFQUFXLE9BQVgsRUFBb0IsU0FBcEI7QUFDQSxHQUxLLE1BS0EsSUFBSSxXQUFXLEtBQVgsQ0FBaUIsSUFBakIsQ0FBc0IsUUFBUSxHQUE5QixLQUFvQyxXQUFXLFFBQVgsQ0FBb0IsSUFBcEIsQ0FBeUIsUUFBUSxHQUFqQyxDQUF4QyxFQUErRTtBQUNwRixXQUFRLEdBQVIsQ0FBWSxXQUFaO0FBQ0EsT0FBSSxZQUFRLEVBQVo7QUFDQSxPQUFHLFdBQVcsUUFBWCxDQUFvQixJQUFwQixDQUF5QixRQUFRLEdBQWpDLENBQUgsRUFBeUM7QUFDeEMsZ0JBQVEsV0FBVyxRQUFYLENBQW9CLElBQXBCLENBQXlCLFFBQVEsR0FBakMsRUFBc0MsQ0FBdEMsQ0FBUjtBQUNBLElBRkQsTUFFSztBQUNKLGdCQUFRLFdBQVcsS0FBWCxDQUFpQixJQUFqQixDQUFzQixRQUFRLEdBQTlCLEVBQW1DLENBQW5DLENBQVI7QUFDQTtBQUNELFVBQU8sSUFBUCxDQUFZLE1BQVosQ0FBbUIsUUFBUSxLQUEzQixFQUFpQyxFQUFDLEtBQUssT0FBTyxTQUFQLENBQWlCLE1BQWpCLENBQXdCLGFBQXhCLElBQXVDLG9CQUF2QyxHQUE0RCxTQUFsRSxFQUFqQztBQUNBLE1BQUcsTUFBSCxFQUFXLE9BQVgsRUFBb0IsVUFBcEI7QUFDQTtBQUNELEVBdkJELEVBdUJFLEVBQUMsS0FBSSxDQUNOLEVBQUMsWUFBWSwwQkFBYixFQURNLEVBRUwsRUFBQyxZQUFZLHNDQUFiLEVBRkssRUFHTCxFQUFDLFlBQVksa0NBQWIsRUFISztBQUFMLEVBdkJGOztBQThCQSxRQUFPLE1BQVAsQ0FBYyxPQUFkLENBQXNCLFdBQXRCLENBQWtDLFVBQVMsS0FBVCxFQUFlO0FBQ2hEO0FBQ0EsRUFGRDs7QUFNQSxFQUFDLFVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYSxDQUFiLEVBQWUsQ0FBZixFQUFpQixDQUFqQixFQUFtQixDQUFuQixFQUFxQixDQUFyQixFQUF1QjtBQUFDLElBQUUsdUJBQUYsSUFBMkIsQ0FBM0IsQ0FBNkIsRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLEtBQU0sWUFBVTtBQUMzRSxJQUFDLEVBQUUsQ0FBRixFQUFLLENBQUwsR0FBTyxFQUFFLENBQUYsRUFBSyxDQUFMLElBQVEsRUFBaEIsRUFBb0IsSUFBcEIsQ0FBeUIsU0FBekI7QUFBb0MsR0FEa0IsRUFDakIsRUFBRSxDQUFGLEVBQUssQ0FBTCxHQUFPLElBQUUsSUFBSSxJQUFKLEVBRFEsQ0FDRyxJQUFFLEVBQUUsYUFBRixDQUFnQixDQUFoQixDQUFGLEVBQ3pELElBQUUsRUFBRSxvQkFBRixDQUF1QixDQUF2QixFQUEwQixDQUExQixDQUR1RCxDQUMxQixFQUFFLE1BQUYsR0FBUyxDQUFULENBQVcsRUFBRSxHQUFGLEdBQU0sQ0FBTixDQUFRLEVBQUUsVUFBRixDQUFhLFlBQWIsQ0FBMEIsQ0FBMUIsRUFBNEIsQ0FBNUI7QUFDakQsRUFIRCxFQUdHLE1BSEgsRUFHVSxRQUhWLEVBR21CLFFBSG5CLEVBRzRCLCtDQUg1QixFQUc0RSxJQUg1RTtBQUlBLElBQUcsUUFBSCxFQUFhLGVBQWIsRUFBOEIsTUFBOUI7QUFDQSxJQUFHLEtBQUgsRUFBUyxtQkFBVCxFQUE4QixJQUE5QjtBQUNBLElBQUcsTUFBSCxFQUFXLFVBQVgsRTs7Ozs7OztBQzNKQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esd0JBQXVCLHNCQUFzQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsNEJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBLDZCQUE0QixVQUFVOzs7Ozs7Ozs7OztBQzVGdEMsS0FBSSxPQUFLLG9CQUFRLEdBQVIsQ0FBVDtBQUNBLEtBQUksWUFBWSxvQkFBUSxHQUFSLENBQWhCO0FBQ0EsS0FBSSxTQUFRLElBQUksU0FBSixFQUFaO0FBQ0EsS0FBSSxTQUFPOztBQUVWLFNBQU8sa0RBRkc7O0FBSVYsV0FBUSx3QkFKRTs7QUFNVixpQkFBYyx1QkFBUyxTQUFULEVBQW1CO0FBQ2hDLE9BQUksYUFBVyxPQUFPLFFBQVAsQ0FBZ0IsSUFBL0I7QUFDRyxRQUFLLElBQUwsR0FBVyxnQkFBZ0IsSUFBaEIsQ0FBcUIsVUFBckIsRUFBaUMsQ0FBakMsQ0FBWDtBQUNBLFFBQUssT0FBTCxHQUFhLDRCQUE0QixJQUE1QixDQUFpQyxVQUFqQyxFQUE2QyxDQUE3QyxDQUFiO0FBQ0EsUUFBSyxVQUFMLEdBQWdCLEtBQUssT0FBTCxHQUFjLGlCQUFpQixJQUFqQixDQUFzQixVQUF0QixFQUFrQyxDQUFsQyxDQUE5QjtBQUNBLFFBQUssUUFBTCxHQUFjLEtBQUssT0FBTCxHQUFhLEtBQUssT0FBaEM7O0FBRUEsT0FBRyxDQUFFLEtBQUssSUFBTCxDQUFVLFVBQVYsQ0FBTCxFQUE0Qjs7QUFFMUIsYUFBUyxjQUFULENBQXdCLGNBQXhCLEVBQXdDLFNBQXhDLEdBQWtELEVBQWxEO0FBQ0EsUUFBSSxRQUFNLENBQUMsQ0FBWDtBQUNBLFNBQUksSUFBSSxJQUFFLENBQVYsRUFBWSxJQUFFLFVBQVUsSUFBeEIsRUFBNkIsRUFBRSxDQUEvQixFQUFpQztBQUMvQixTQUFHLFVBQVUsR0FBVixDQUFjLENBQWQsRUFBaUIsR0FBakIsQ0FBcUIsU0FBckIsTUFBa0MsS0FBSyxVQUExQyxFQUFxRDtBQUNuRCxjQUFNLENBQU47QUFDQSxXQUFLLFNBQUwsR0FBZSxLQUFmO0FBQ0E7QUFDRDtBQUNGO0FBQ0QsU0FBSyxRQUFMLENBQWMsS0FBZCxFQUFvQixLQUFLLFVBQXpCO0FBQ0QsSUFaRCxNQVlLO0FBQ0gsU0FBSyxVQUFMLEdBQWdCLEtBQUssT0FBTCxHQUFjLG9CQUFvQixJQUFwQixDQUF5QixVQUF6QixFQUFxQyxDQUFyQyxDQUE5QjtBQUNBLFdBQU8sT0FBUCxDQUFlLFlBQWYsQ0FBNEIsRUFBNUIsRUFBK0IsU0FBUyxLQUF4QyxFQUE4Qyx1QkFBc0Isb0JBQW9CLElBQXBCLENBQXlCLFVBQXpCLEVBQXFDLENBQXJDLENBQXBFO0FBQ0Q7QUFDSixHQTdCUzs7QUErQlYsY0FBVyxvQkFBUyxHQUFULEVBQWE7QUFDdkIsT0FBSSxLQUFHLElBQUksZ0JBQUosQ0FBcUIsc0JBQXJCLENBQVA7QUFDQSxVQUFPLEVBQVA7QUFDQSxHQWxDUzs7QUFvQ1YsZ0JBQWEsc0JBQVMsR0FBVCxFQUFhO0FBQ3pCLFFBQUssS0FBTCxHQUFXLElBQUksYUFBSixDQUFrQiwwR0FBbEIsRUFBOEgsV0FBekk7QUFDQSxVQUFPLEtBQUssS0FBWjtBQUNBLEdBdkNTOztBQXlDVixlQUFZLHFCQUFTLEdBQVQsRUFBYTtBQUN4QixRQUFLLE9BQUwsR0FBYSxJQUFJLGFBQUosQ0FBa0Isa0JBQWxCLEVBQXNDLEdBQW5EO0FBQ0EsVUFBTyxLQUFLLE9BQVo7QUFDQSxHQTVDUzs7QUE4Q1YsZUFBWTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsd0NBQ0osS0FBSyxRQUREOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBOUNGOztBQWtEUixZQUFVLGtCQUFlLEtBQWYsRUFBcUIsR0FBckI7QUFBQSxPQUNKLFFBREksRUFFUCxJQUZPLEVBR1AsR0FITyxFQUlQLFNBSk8sRUFLSixTQUxJLEVBTVAsS0FOTztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSx1Q0FDYSxNQUFNLEdBQU4sQ0FEYjs7QUFBQTtBQUNKLGVBREk7QUFBQTtBQUFBLHVDQUVNLFNBQVMsSUFBVCxFQUZOOztBQUFBO0FBRVAsV0FGTztBQUdQLFVBSE8sR0FHRCxPQUFPLGVBQVAsQ0FBdUIsSUFBdkIsRUFBNEIsV0FBNUIsQ0FIQztBQUlQLGdCQUpPLEdBSUcsNkJBQTZCLElBQTdCLENBQWtDLElBQUksSUFBSixDQUFTLFNBQTNDLEVBQXNELENBQXRELENBSkg7QUFBQTtBQUFBLHVDQUtjLE1BQU0sS0FBSyxPQUFMLEdBQWEsU0FBbkIsQ0FMZDs7QUFBQTtBQUtKLGdCQUxJO0FBQUE7QUFBQSx1Q0FNTyxVQUFVLElBQVYsRUFOUDs7QUFBQTtBQU1QLFlBTk87O0FBT1gsWUFBSyxTQUFMLENBQWUsS0FBZixFQUFxQixLQUFyQjs7QUFQVztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQWxERjs7OztBQThEUixnQkFBYSxzQkFBUyxHQUFULEVBQWEsV0FBYixFQUF5QjtBQUN2QyxPQUFJLEtBQUssS0FBSyxVQUFMLENBQWdCLEdBQWhCLENBQVQ7QUFDRyxPQUFJLFFBQU0sRUFBVjtBQUNBLFFBQUssU0FBTCxHQUFlLENBQUMsQ0FBaEI7QUFDQSxRQUFJLElBQUksSUFBRSxDQUFWLEVBQVksSUFBRSxHQUFHLE1BQWpCLEVBQXdCLEVBQUUsQ0FBMUIsRUFBNEI7QUFDMUIsUUFBSSxPQUFLLEVBQVQ7QUFDQSxTQUFLLE9BQUwsR0FBYSxLQUFLLE9BQUwsR0FBYSxHQUFHLENBQUgsRUFBTSxZQUFOLENBQW1CLE1BQW5CLENBQTFCO0FBQ0EsU0FBSyxJQUFMLEdBQVUsR0FBRyxDQUFILEVBQU0sV0FBaEI7QUFDQSxRQUFHLEtBQUssT0FBTCxLQUFlLEtBQUssVUFBcEIsSUFBZ0MsS0FBSyxTQUFMLEtBQWlCLENBQUMsQ0FBckQsRUFBdUQ7QUFDckQsVUFBSyxTQUFMLEdBQWUsQ0FBZjtBQUNBLGNBQVMsS0FBVCxHQUFlLEtBQUssS0FBTCxHQUFXLEdBQVgsR0FBZSxLQUFLLElBQW5DO0FBQ0EsVUFBSyxhQUFMLENBQW1CLENBQW5CO0FBQ0EsVUFBSyxRQUFMLEdBQWMsSUFBZDtBQUNBLFNBQUcsQ0FBQyxZQUFZLEdBQVosQ0FBZ0IsS0FBSyxPQUFyQixDQUFKLEVBQWtDO0FBQ2hDLG9CQUFZLFlBQVksR0FBWixDQUFnQixLQUFLLE9BQXJCLENBQVo7QUFDRDtBQUNGO0FBQ0QsUUFBRyxZQUFZLEdBQVosQ0FBZ0IsS0FBSyxPQUFyQixDQUFILEVBQWlDO0FBQy9CLFVBQUssUUFBTCxHQUFjLElBQWQ7QUFDRDtBQUNELFdBQUssVUFBVSxHQUFWLENBQWMsSUFBZCxDQUFMO0FBQ0EsVUFBTSxJQUFOLENBQVcsSUFBWDtBQUNEO0FBQ0QsUUFBSyxXQUFMLEdBQWlCLFdBQWpCO0FBQ0EsVUFBTyxVQUFVLElBQVYsQ0FBZSxLQUFmLENBQVA7QUFDSCxHQXZGUzs7QUF5RlYsc0JBQW9CLENBQUMsQ0F6Rlg7O0FBMkZSLGlCQUFjLHVCQUFTLEtBQVQsRUFBZTtBQUMzQixPQUFHLEtBQUssa0JBQUwsS0FBMEIsQ0FBQyxDQUE5QixFQUFnQztBQUM3QixTQUFLLGtCQUFMLEdBQXdCLEtBQXhCO0FBQ0YsSUFGRCxNQUVNLElBQUcsS0FBSyxrQkFBTCxLQUEwQixDQUFDLENBQTlCLEVBQWdDO0FBQ25DLFFBQUksT0FBSyxTQUFTLGdCQUFULENBQTBCLDBCQUExQixDQUFUO0FBQ0EsU0FBSSxJQUFJLElBQUUsQ0FBVixFQUFZLElBQUUsS0FBSyxNQUFuQixFQUEwQixFQUFFLENBQTVCLEVBQThCO0FBQzVCLFVBQUssQ0FBTCxFQUFRLFlBQVIsQ0FBcUIsY0FBckIsRUFBb0MsS0FBcEM7QUFDRDtBQUNELFNBQUssa0JBQUwsR0FBd0IsQ0FBQyxDQUF6QjtBQUNGO0FBQ0osR0FyR1M7O0FBdUdWLGFBQVUsbUJBQVMsS0FBVCxFQUFlLFFBQWYsRUFBd0I7QUFDakMsV0FBUSxHQUFSLENBQVksUUFBWjtBQUNBLFFBQUssUUFBTDtBQUNBLE9BQUksT0FBTyxVQUFYO0FBQ0EsT0FBSSxVQUFTLE1BQU0sQ0FBTixDQUFiO0FBQ0csT0FBSSxNQUFLLEVBQVQ7QUFDSCxRQUFLLE9BQUwsR0FBYSxRQUFiO0FBQ0EsUUFBSSxJQUFJLElBQUUsQ0FBVixFQUFZLElBQUUsS0FBSyxPQUFuQixFQUEyQixHQUEzQixFQUErQjtBQUM5QixRQUFJLENBQUosSUFBTyxVQUFRLE1BQU0sQ0FBTixDQUFmO0FBQ0E7QUFDRCxRQUFLLE1BQUwsR0FBWSxHQUFaO0FBQ0EsUUFBSyxXQUFMLENBQWlCLEtBQWpCO0FBQ0EsR0FuSFM7O0FBcUhWLGVBQVkscUJBQVMsS0FBVCxFQUFlO0FBQ3ZCLE9BQUksZUFBYSxTQUFTLGNBQVQsQ0FBd0IsY0FBeEIsQ0FBakI7QUFDQSxPQUFHLFVBQVEsQ0FBQyxDQUFaLEVBQWM7QUFDWixZQUFNLEtBQUssa0JBQVg7QUFDQSxTQUFLLGtCQUFMLEdBQXdCLENBQUMsQ0FBekI7QUFDRDtBQUNELFFBQUksSUFBSSxJQUFFLENBQVYsRUFBWSxJQUFFLEtBQUssT0FBbkIsRUFBMkIsRUFBRSxDQUE3QixFQUErQjtBQUM3QixRQUFJLE1BQUksSUFBSSxLQUFKLEVBQVI7QUFDQSxRQUFJLEdBQUosR0FBUSxnRkFBUjtBQUNBLFFBQUksWUFBSixDQUFpQixXQUFqQixFQUE2QixLQUFLLE1BQUwsQ0FBWSxDQUFaLENBQTdCO0FBQ0EsUUFBSSxZQUFKLENBQWlCLFVBQWpCLEVBQTRCLElBQUUsQ0FBOUI7QUFDQSxRQUFJLFlBQUosQ0FBaUIsY0FBakIsRUFBZ0MsS0FBaEM7QUFDQSxRQUFJLEtBQUosQ0FBVSxLQUFWLEdBQWdCLE9BQWhCO0FBQ0EsUUFBSSxLQUFKLENBQVUsTUFBVixHQUFpQixRQUFqQjtBQUNBLFFBQUksS0FBSixDQUFVLE9BQVYsR0FBa0IsT0FBbEI7QUFDQSxRQUFJLEtBQUosQ0FBVSxXQUFWLEdBQXNCLEtBQXRCO0FBQ0EsUUFBSSxLQUFKLENBQVUsV0FBVixHQUFzQixPQUF0QjtBQUNBLFFBQUksS0FBSixDQUFVLFdBQVYsR0FBc0IsT0FBdEI7QUFDQSxRQUFJLEtBQUosQ0FBVSxVQUFWLEdBQXFCLE1BQXJCO0FBQ0EsUUFBSSxLQUFKLENBQVUsV0FBVixHQUFzQixNQUF0QjtBQUNBLFFBQUksS0FBSixDQUFVLFNBQVYsR0FBb0IsTUFBcEI7QUFDQSxRQUFJLEtBQUosQ0FBVSxZQUFWLEdBQXVCLE1BQXZCO0FBQ0EsUUFBSSxLQUFKLENBQVUsUUFBVixHQUFtQixNQUFuQjtBQUNBLFFBQUksS0FBSixDQUFVLFVBQVYsR0FBcUIscUVBQXJCO0FBQ0EsUUFBSSxZQUFKLENBQWlCLGNBQWpCLEVBQWdDLEtBQUssT0FBckM7QUFDQSxpQkFBYSxXQUFiLENBQXlCLEdBQXpCO0FBQ0Q7QUFDRCxRQUFLLEtBQUwsR0FBVyxhQUFhLFFBQXhCO0FBQ0EsT0FBSSxhQUFXLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFmO0FBQ0EsY0FBVyxTQUFYLEdBQXFCLGdCQUFyQjtBQUNBLGNBQVcsV0FBWCxHQUF1QixNQUF2QjtBQUNILGdCQUFhLFdBQWIsQ0FBeUIsVUFBekI7QUFDRyxPQUFJLGlCQUFlLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFuQjtBQUNBLGtCQUFlLFNBQWYsR0FBeUIsb0JBQXpCO0FBQ0Esa0JBQWUsV0FBZixHQUEyQiw4REFBM0I7QUFDQSxnQkFBYSxXQUFiLENBQXlCLGNBQXpCO0FBQ0EsT0FBRyxDQUFDLEtBQUssU0FBVCxFQUFtQjtBQUNqQixTQUFLLElBQUw7QUFDRCxJQUZELE1BRUs7QUFDSCxTQUFLLE1BQUw7QUFDRDtBQUNKLEdBOUpTOztBQWdLVixvQkFBaUIsMEJBQVMsUUFBVCxFQUFrQixRQUFsQixFQUEyQixHQUEzQixFQUErQixLQUEvQixFQUFxQyxDQUFyQyxFQUF1QztBQUN2RCxPQUFJLE1BQUksSUFBSSxRQUFaO0FBQ0EsT0FBSSxLQUFLLEtBQUssVUFBTCxDQUFnQixHQUFoQixDQUFUO0FBQ0EsT0FBSSxRQUFNLEtBQUssWUFBTCxDQUFrQixHQUFsQixDQUFWO0FBQ0EsT0FBSSxTQUFPLEtBQUssV0FBTCxDQUFpQixHQUFqQixDQUFYO0FBQ0EsT0FBSSxRQUFNLEVBQVY7QUFDQSxPQUFJLE1BQUksRUFBUjs7QUFFQSxRQUFJLElBQUksSUFBRSxDQUFWLEVBQVksSUFBRSxHQUFHLE1BQWpCLEVBQXdCLEVBQUUsQ0FBMUIsRUFBNEI7QUFDeEIsUUFBSSxPQUFLLEVBQVQ7QUFDQSxTQUFLLE9BQUwsR0FBYSxLQUFLLE9BQUwsR0FBYSxHQUFHLENBQUgsRUFBTSxZQUFOLENBQW1CLE1BQW5CLENBQTFCO0FBQ0EsU0FBSyxJQUFMLEdBQVUsR0FBRyxDQUFILEVBQU0sV0FBaEI7QUFDQSxVQUFNLElBQU4sQ0FBVyxJQUFYO0FBQ0EsUUFBSSxlQUFhLEtBQWpCO0FBQ0EsU0FBSSxJQUFJLElBQUUsQ0FBVixFQUFZLElBQUUsU0FBUyxNQUF2QixFQUE4QixFQUFFLENBQWhDLEVBQWtDO0FBQ2pDLFNBQUcsU0FBUyxDQUFULEVBQVksT0FBWixLQUFzQixLQUFLLE9BQTlCLEVBQXNDO0FBQ3JDLHFCQUFhLElBQWI7QUFDQTtBQUNBO0FBQ0Q7QUFDRCxRQUFHLENBQUMsWUFBRCxJQUFpQixTQUFTLE1BQVQsR0FBZ0IsQ0FBcEMsRUFBc0M7QUFDeEMsU0FBSSxPQUFJO0FBQ1AsV0FBSSxRQURHO0FBRVAsYUFBTSxLQUZDO0FBR1AsWUFBSyxJQUhFO0FBSVAsZUFBUSxNQUpEO0FBS1Asa0JBQVc7QUFMSixNQUFSO0FBT0EsWUFBTyxhQUFQLENBQXFCLE1BQXJCLENBQTRCLEtBQUssT0FBakMsRUFBeUM7QUFDeEMsWUFBSyxPQURtQztBQUV4QyxlQUFRLG1CQUZnQztBQUd4QyxhQUFNLGVBSGtDO0FBSXhDLGVBQVEsUUFBTSxJQUFOLEdBQVcsS0FBSSxVQUFKLENBQWUsSUFKTTtBQUt4QyxnQkFBUztBQUwrQixNQUF6QztBQU9BLFlBQU8sT0FBUCxDQUFlLEtBQWYsQ0FBcUIsR0FBckIsQ0FBeUIsUUFBekIsRUFBa0MsVUFBUyxLQUFULEVBQWU7QUFDaEQsWUFBTSxNQUFOLENBQWEsSUFBYixDQUFrQixJQUFsQjtBQUNBLFVBQUksTUFBSSxNQUFNLE1BQU4sQ0FBYSxNQUFiLENBQW9CLFFBQXBCLEVBQVI7QUFDQSxhQUFPLGFBQVAsQ0FBcUIsWUFBckIsQ0FBa0MsRUFBQyxNQUFLLEdBQU4sRUFBbEM7QUFDQSxhQUFPLE9BQVAsQ0FBZSxLQUFmLENBQXFCLEdBQXJCLENBQXlCLEtBQXpCO0FBQ0EsTUFMaUMsQ0FLaEMsSUFMZ0MsQ0FLM0IsSUFMMkIsQ0FBbEM7QUFNRztBQUNKO0FBQ0QsU0FBTSxTQUFOLENBQWdCLENBQWhCLEVBQW1CLFNBQW5CLEdBQTZCLEtBQTdCO0FBQ0EsVUFBTyxPQUFQLENBQWUsS0FBZixDQUFxQixHQUFyQixDQUF5QixLQUF6QjtBQUNBO0FBN01TLEVBQVg7O0FBa05BLFFBQU8sT0FBUCxHQUFpQixNQUFqQixDOzs7Ozs7OztBQ3JORTs7QUFFQSxLQUFJLGdCQUFjLG9CQUFRLEdBQVIsQ0FBbEI7O0FBRUEsS0FBSSxPQUFPLEVBQVg7O0FBRUEsS0FBSSxZQUFVLG1CQUFTLElBQVQsRUFBZTtBQUN6QixRQUFLLEdBQUwsR0FBVyxLQUFLLFlBQUwsQ0FBa0IsV0FBbEIsQ0FBWDtBQUNBLFFBQUssZUFBTCxDQUFxQixXQUFyQjtBQUNILEVBSEQ7Ozs7QUFPQSxLQUFJLFFBQU0sR0FBVjs7QUFFQSxLQUFJLGNBQVksSUFBaEI7O0FBRUEsTUFBSyxTQUFMLEdBQWUsS0FBZjs7QUFFQSxLQUFJLFNBQUosRUFBZSxjQUFmLEVBQStCLFlBQS9CLEVBQTZDLEtBQTdDLEVBQW9ELElBQXBELEVBQXlELE1BQXpEOzs7Ozs7O0FBT0EsS0FBSSxhQUFXO0FBQ2IsTUFBRSxDQURXO0FBRWIsTUFBRSxPQUFPO0FBRkksRUFBZjs7QUFLQSxLQUFJLHFCQUFxQixTQUFyQixrQkFBcUIsR0FBWTtBQUNuQyxPQUFHLENBQUMsV0FBRCxJQUFnQixDQUFDLENBQUMsSUFBckIsRUFBMkI7QUFDekI7QUFDRDtBQUNELGdCQUFhLElBQWI7QUFDQSxVQUFPLFdBQVcsWUFBVTtBQUMxQixVQUFLLE1BQUw7QUFDQSxZQUFPLElBQVA7QUFDRCxJQUhNLEVBR0osS0FISSxDQUFQO0FBSUQsRUFURDtBQVVBLEtBQUksYUFBVyxTQUFYLFVBQVcsQ0FBUyxLQUFULEVBQWUsS0FBZixFQUFxQixHQUFyQixFQUF5QjtBQUN0QyxPQUFJLFFBQU0sS0FBSyxLQUFMLENBQVcsQ0FBQyxRQUFNLEdBQVAsSUFBWSxDQUF2QixDQUFWOztBQUVBLE9BQUcsVUFBUSxHQUFYLEVBQWdCLE9BQU8sS0FBUDtBQUNoQixPQUFJLE1BQUksTUFBTSxLQUFOLEVBQWEscUJBQWIsRUFBUjtBQUNBLE9BQUcsSUFBSSxNQUFKLEdBQVcsV0FBVyxDQUF6QixFQUEyQjtBQUN6QixZQUFPLFdBQVcsS0FBWCxFQUFpQixLQUFqQixFQUF1QixHQUF2QixDQUFQO0FBQ0QsSUFGRCxNQUVNLElBQUcsSUFBSSxHQUFKLEdBQVEsV0FBVyxDQUF0QixFQUF3QjtBQUM1QixZQUFPLFdBQVcsS0FBWCxFQUFpQixLQUFqQixFQUF1QixLQUF2QixDQUFQO0FBQ0QsSUFGSyxNQUVBLElBQUcsSUFBSSxNQUFKLElBQWMsV0FBVyxDQUF6QixJQUE4QixJQUFJLEdBQUosSUFBVyxXQUFXLENBQXZELEVBQXlEO0FBQzdELFlBQU8sS0FBUDtBQUNEO0FBQ0YsRUFaRDtBQWFBLE1BQUssSUFBTCxHQUFZLFVBQVUsSUFBVixFQUFnQjs7O0FBRzFCLFVBQU8sUUFBUSxFQUFmOztBQUVBLGVBQVUsS0FBSyxTQUFMLElBQWtCLFNBQTVCO0FBQ0EsUUFBSyxTQUFMLEdBQWUsSUFBZjtBQUNBLFFBQUssTUFBTDtBQUNBLFVBQU8sZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0Msa0JBQWxDLEVBQXNELEtBQXREOztBQUVELEVBVkQ7QUFXQSxNQUFLLE1BQUwsR0FBYyxZQUFZOzs7Ozs7Ozs7Ozs7OztBQWN4QixPQUFHLEtBQUssS0FBTCxDQUFXLE1BQVgsS0FBb0IsQ0FBdkIsRUFBMEI7QUFDMUIsT0FBSSxRQUFNLFdBQVcsS0FBSyxLQUFoQixFQUF1QixDQUF2QixFQUEwQixLQUFLLEtBQUwsQ0FBVyxNQUFYLEdBQWtCLENBQTVDLENBQVY7QUFDQSxPQUFJLE9BQUssS0FBSyxLQUFMLENBQVcsS0FBWCxDQUFUOztBQUVBLE9BQUcsS0FBSyxZQUFMLENBQWtCLFVBQWxCLENBQUgsRUFBaUM7QUFDL0IsbUJBQWMsTUFBZCxDQUFxQixLQUFLLFlBQUwsQ0FBa0IsY0FBbEIsQ0FBckIsRUFBdUQsS0FBSyxZQUFMLENBQWtCLFVBQWxCLElBQThCLEdBQTlCLEdBQWtDLEtBQUssWUFBTCxDQUFrQixjQUFsQixDQUF6RjtBQUNEOztBQUVELE9BQUcsQ0FBQyxLQUFLLEtBQUwsQ0FBVyxTQUFaLElBQXlCLEtBQUssWUFBTCxHQUFrQixLQUFLLGFBQXZCLEdBQXFDLENBQWpFLEVBQW1FO0FBQ2pFLFNBQUksSUFBRSxPQUFPLFdBQVAsR0FBbUIsRUFBekI7QUFDQSxVQUFLLEtBQUwsQ0FBVyxTQUFYLEdBQXFCLEVBQUUsUUFBRixLQUFhLElBQWxDO0FBQ0EsVUFBSyxLQUFMLENBQVcsS0FBWCxHQUFpQixLQUFLLEtBQUwsQ0FBVyxJQUFHLEtBQUssWUFBUixHQUF1QixLQUFLLGFBQXZDLEVBQXVELFFBQXZELEtBQWtFLElBQW5GO0FBQ0Q7O0FBRUQsT0FBRyxLQUFLLFlBQUwsQ0FBa0IsV0FBbEIsQ0FBSCxFQUFtQyxVQUFVLElBQVY7O0FBRW5DLFFBQUksSUFBSSxJQUFFLENBQVYsRUFBWSxLQUFHLENBQWYsRUFBaUIsRUFBRSxDQUFuQixFQUFxQjtBQUNuQixTQUFHLFFBQU0sQ0FBTixJQUFTLENBQVosRUFBYztBQUNaLFdBQUksT0FBSyxLQUFLLEtBQUwsQ0FBVyxRQUFNLENBQWpCLENBQVQ7QUFDQSxXQUFHLENBQUMsS0FBSyxLQUFMLENBQVcsU0FBWixJQUF1QixLQUFLLFlBQUwsR0FBa0IsS0FBSyxhQUF2QixHQUFxQyxDQUEvRCxFQUFpRTtBQUMvRCxhQUFJLElBQUUsT0FBTyxXQUFQLEdBQW1CLEVBQXpCO0FBQ0EsY0FBSyxLQUFMLENBQVcsU0FBWCxHQUFxQixFQUFFLFFBQUYsS0FBYSxJQUFsQztBQUNBLGNBQUssS0FBTCxDQUFXLEtBQVgsR0FBaUIsS0FBSyxLQUFMLENBQVcsSUFBRyxLQUFLLFlBQVIsR0FBdUIsS0FBSyxhQUF2QyxFQUF1RCxRQUF2RCxLQUFrRSxJQUFuRjtBQUNEO0FBQ0QsV0FBRyxLQUFLLFlBQUwsQ0FBa0IsV0FBbEIsQ0FBSCxFQUFtQyxVQUFVLElBQVY7QUFDcEM7QUFDRCxTQUFHLFFBQU0sQ0FBTixHQUFRLEtBQUssS0FBTCxDQUFXLE1BQXRCLEVBQTZCO0FBQzNCLFdBQUksT0FBSyxLQUFLLEtBQUwsQ0FBVyxRQUFNLENBQWpCLENBQVQ7QUFDQSxXQUFHLENBQUMsS0FBSyxLQUFMLENBQVcsU0FBWixJQUF5QixLQUFLLFlBQUwsR0FBa0IsS0FBSyxhQUF2QixHQUFxQyxDQUFqRSxFQUFtRTtBQUNqRSxhQUFJLElBQUUsT0FBTyxXQUFQLEdBQW1CLEVBQXpCO0FBQ0EsY0FBSyxLQUFMLENBQVcsU0FBWCxHQUFxQixFQUFFLFFBQUYsS0FBYSxJQUFsQztBQUNBLGNBQUssS0FBTCxDQUFXLEtBQVgsR0FBaUIsS0FBSyxLQUFMLENBQVcsSUFBRyxLQUFLLFlBQVIsR0FBdUIsS0FBSyxhQUF2QyxFQUF1RCxRQUF2RCxLQUFrRSxJQUFuRjtBQUNEO0FBQ0QsV0FBRyxLQUFLLFlBQUwsQ0FBa0IsV0FBbEIsQ0FBSCxFQUFtQyxVQUFVLElBQVY7QUFDcEM7QUFDRjtBQUVGLEVBbkREOztBQXFEQSxNQUFLLEtBQUwsR0FBVyxFQUFYOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQ0EsTUFBSyxHQUFMLEdBQVMsWUFBVTs7QUFFakIsUUFBSyxNQUFMO0FBQ0QsRUFIRDs7Ozs7OztBQVVBLFFBQU8sT0FBUCxHQUFlLElBQWYsQzs7Ozs7Ozs7O0FDbEtGLEtBQUksZ0JBQWdCLG9CQUFRLEdBQVIsQ0FBcEI7QUFDQSxLQUFJLGlCQUFpQjtBQUNuQixXQUFRLGtCQUFXOztBQUVqQixtQkFBYyxRQUFkLENBQXVCO0FBQ3JCLG1CQUFZO0FBRFMsTUFBdkI7QUFHRCxJQU5rQjtBQU9uQixXQUFRLGdCQUFTLElBQVQsRUFBYyxTQUFkLEVBQXdCOztBQUU5QixtQkFBYyxRQUFkLENBQXVCO0FBQ3JCLG1CQUFZLFFBRFM7QUFFckIsYUFBTSxJQUZlO0FBR3JCLGtCQUFVO0FBSFcsTUFBdkI7QUFLRDtBQWRrQixFQUFyQjs7QUFpQkEsUUFBTyxPQUFQLEdBQWlCLGNBQWpCLEM7Ozs7Ozs7OztBQ2xCQSxLQUFJLGFBQWEsb0JBQVEsR0FBUixFQUFnQixVQUFqQzs7QUFFQSxRQUFPLE9BQVAsR0FBaUIsSUFBSSxVQUFKLEVBQWpCLEM7Ozs7Ozs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7OztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSxrREFBaUQsMENBQTBDLDBEQUEwRCxFQUFFOztBQUV2Sjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBeUI7QUFDekI7QUFDQTtBQUNBLHVCQUFzQjtBQUN0QjtBQUNBO0FBQ0EsOEJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBb0IsaUJBQWlCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxFQUFDOztBQUVELDZCOzs7Ozs7OztBQ3RPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esc0RBQXFEO0FBQ3JELE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDs7QUFFQSwyQkFBMEI7QUFDMUI7QUFDQTtBQUNBOztBQUVBLDRCOzs7Ozs7OztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQyxvQkFBb0IsY0FBYzs7QUFFbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBZ0I7QUFDaEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3QkFBdUI7QUFDdkIsb0JBQW1COztBQUVuQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFvQixVQUFVO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4Q0FBNkMsd0JBQXdCO0FBQ3JFO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBLGFBQVk7QUFDWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0NBQW1DLEtBQUs7QUFDeEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHVCQUFzQixnQkFBZ0I7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXNCLGdCQUFnQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDs7Ozs7QUFLQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUFzQixnQkFBZ0I7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0NBQXVDLFNBQVM7QUFDaEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0ZBQW1GLHlDQUF5QztBQUM1SDtBQUNBO0FBQ0Esa0ZBQWlGLHlDQUF5QztBQUMxSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQTZDO0FBQzdDO0FBQ0EsMEJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUE4QztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUJBQXNCLGdCQUFnQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNERBQTJEO0FBQzNEO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxpREFBZ0Q7QUFDaEQ7QUFDQTs7QUFFQSxnREFBK0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0EsdUJBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxxREFBb0Q7QUFDcEQ7QUFDQTs7QUFFQSxvREFBbUQ7QUFDbkQ7QUFDQTtBQUNBO0FBQ0EsdUJBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHNEQUFxRDtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNkNBQTRDLFVBQVU7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFDQUFvQyxXQUFXO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZTtBQUNmOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNkNBQTRDLFVBQVU7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFDQUFvQyxXQUFXO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWU7QUFDZjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7QUFJQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvREFBbUQsZ0JBQWdCO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQWlELGdCQUFnQjtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBd0Isa0JBQWtCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWdDLGVBQWU7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNB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QUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG9EQUFtRCxLQUFLO0FBQ3hEOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSw0REFBMkQ7QUFDM0Qsc0VBQXFFLHFCQUFxQjtBQUMxRjs7QUFFQSx5REFBd0Q7QUFDeEQsc0VBQXFFLHFCQUFxQjtBQUMxRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXFDLGtCQUFrQjtBQUN2RCxVQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9DQUFtQyxLQUFLO0FBQ3hDOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSx1Q0FBc0M7QUFDdEMsMENBQXlDLG9CQUFvQjtBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF3QixtQkFBbUI7QUFDM0MsNERBQTJELHNCQUFzQjtBQUNqRjtBQUNBLFFBQU87QUFDUDs7QUFFQSwyQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0EsMENBQXlDLHlCQUF5QjtBQUNsRTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNEMsNEJBQTRCO0FBQ3hFO0FBQ0E7QUFDQSxVQUFTO0FBQ1QsUUFBTztBQUNQOztBQUVBLDBDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQSwwQ0FBeUMseUJBQXlCO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBLDJDQUEwQyw0QkFBNEI7QUFDdEU7QUFDQTtBQUNBLFVBQVM7QUFDVCxRQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGlEQUFnRDtBQUNoRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxzREFBcUQ7QUFDckQsbURBQWtELHdCQUF3QjtBQUMxRTs7QUFFQTtBQUNBLDZDQUE0QyxTQUFTO0FBQ3JEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBcUMsa0JBQWtCO0FBQ3ZELFVBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMkNBQTBDLEtBQUs7QUFDL0M7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUF5QyxTQUFTO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFvQyxvQ0FBb0M7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBaUQsY0FBYyxFQUFFO0FBQ2pFO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsMkJBQTBCO0FBQzFCO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsMkJBQTBCO0FBQzFCO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLHVDQUFzQyxlQUFlLEVBQUU7QUFDdkQ7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLE1BQUs7OztBQUdMOztBQUVBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOzs7QUFHTDs7QUFFQSx5QkFBd0I7QUFDeEI7QUFDQSxNQUFLOztBQUVMO0FBQ0EsMENBQXlDLDhCQUE4QjtBQUN2RSxNQUFLOztBQUVMO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBLE1BQUs7OztBQUdMOztBQUVBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0Esa0ZBQWlGLFlBQVk7QUFDN0YsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtREFBa0Q7QUFDbEQ7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0EsMkNBQTBDLDBCQUEwQjtBQUNwRSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQSwyQ0FBMEMsNEJBQTRCO0FBQ3RFLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBLDZDQUE0Qyw4QkFBOEI7QUFDMUUsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7O0FBR0w7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTs7QUFFQTs7QUFFQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTJDLHdCQUF3QjtBQUNuRTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxNQUFLOztBQUVMLDRDQUEyQztBQUMzQztBQUNBO0FBQ0E7QUFDQSw0QkFBMkI7QUFDM0I7QUFDQTtBQUNBLE1BQUs7O0FBRUwseUNBQXdDO0FBQ3hDO0FBQ0E7QUFDQSw0QkFBMkI7QUFDM0I7QUFDQTtBQUNBOztBQUVBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4REFBNkQ7Ozs7QUFJN0Q7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLE1BQUs7OztBQUdMOztBQUVBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOzs7QUFHTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBcUMscUJBQXFCO0FBQzFELE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtB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QUNyQyxxQkFBYSxJQUFiO0FBQ0E7QUFDQTtBQUNEO0FBQ0QsUUFBRyxDQUFDLFlBQUQsSUFBZSxTQUFTLE1BQVQsR0FBZ0IsQ0FBbEMsRUFBb0M7QUFDdEMsU0FBSSxNQUFJO0FBQ1AsV0FBSSxRQURHO0FBRVAsYUFBTSxLQUZDO0FBR1AsWUFBSyxLQUhFO0FBSVAsZUFBUSxNQUpEO0FBS1Asa0JBQVc7QUFMSixNQUFSO0FBT0csWUFBTyxhQUFQLENBQXFCLE1BQXJCLENBQTRCLEtBQUssT0FBakMsRUFBeUM7QUFDM0MsWUFBSyxPQURzQztBQUUzQyxlQUFRLG1CQUZtQztBQUczQyxhQUFNLGVBSHFDO0FBSTNDLGVBQVEsUUFBTSxJQUFOLEdBQVcsSUFBSSxVQUFKLENBQWUsSUFKUztBQUszQyxnQkFBUztBQUxrQyxNQUF6QztBQU9ILFlBQU8sT0FBUCxDQUFlLEtBQWYsQ0FBcUIsR0FBckIsQ0FBeUIsUUFBekIsRUFBa0MsVUFBUyxLQUFULEVBQWU7QUFDaEQsWUFBTSxNQUFOLENBQWEsSUFBYixDQUFrQixJQUFsQjtBQUNBLFVBQUksTUFBSSxNQUFNLE1BQU4sQ0FBYSxNQUFiLENBQW9CLFFBQXBCLEVBQVI7QUFDQSxhQUFPLGFBQVAsQ0FBcUIsWUFBckIsQ0FBa0MsRUFBQyxNQUFLLEdBQU4sRUFBbEM7QUFDQSxhQUFPLE9BQVAsQ0FBZSxLQUFmLENBQXFCLEdBQXJCLENBQXlCLEtBQXpCO0FBQ0EsTUFMaUMsQ0FLaEMsSUFMZ0MsQ0FLM0IsR0FMMkIsQ0FBbEM7QUFNQTtBQUNEO0FBQ0UsU0FBTSxXQUFOLEVBQW1CLENBQW5CLEVBQXNCLFNBQXRCLEdBQWdDLEtBQWhDO0FBQ0EsVUFBTyxPQUFQLENBQWUsS0FBZixDQUFxQixHQUFyQixDQUF5QixLQUF6QjtBQUNIO0FBMU5TLEVBQVg7O0FBOE5BLFFBQU8sT0FBUCxHQUFlLE1BQWYsQyIsImZpbGUiOiJqcy9iYWNrZ3JvdW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCBmMTM0YTkwMmFjNjQzMjE3NTA2OFxuICoqLyIsImxldCBDb21pY3Nfc2Y9cmVxdWlyZSgnLi9hcHAvY29taWNzX3NmLmpzJyk7XG5sZXQgQ29taWNzXzg9cmVxdWlyZSgnLi9hcHAvY29taWNzXzguanMnKTtcbmxldCBDb21pY3NfZG01PXJlcXVpcmUoJy4vYXBwL2NvbWljc19kbTUuanMnKTtcbmNvbnNvbGUubG9nKCdiYWNrZ3JvdW5kJyk7XG5sZXQgY2hhcHRlcmZ1bmhhbmRsZXIgPSBmdW5jdGlvbihkZXRhaWxzKSB7XG4gIC8vIGNvbnNvbGUubG9nKFwiY2hhcHRlcmZ1bmhhbmRsZXJcIitkZXRhaWxzLnVybCk7XG4gIC8vIGxldCBpc1JlZmVyZXJTZXQgPSBmYWxzZTtcbiAgICAvLyBoZWFkZXJzID0gZGV0YWlscy5yZXF1ZXN0SGVhZGVycztcbiAgZGV0YWlscy5yZXF1ZXN0SGVhZGVycy5wdXNoKHtcdCAgICBcbiAgICBuYW1lOiBcIlJlZmVyZXJcIixcbiAgICB2YWx1ZTogXCJodHRwOi8vd3d3LmRtNS5jb20vXCJcbiAgfSk7XG4gIHJldHVybiB7cmVxdWVzdEhlYWRlcnM6ZGV0YWlscy5yZXF1ZXN0SGVhZGVyc307XG59O1xuXG5sZXQgbWhhbmRsZXIgPSBmdW5jdGlvbihkZXRhaWxzKSB7XG4gIC8vIGNvbnNvbGUubG9nKCdoYW5kbGVyJyk7XG4gIC8vIGNvbnNvbGUubG9nKFwibWhhbmRsZXJcIitkZXRhaWxzLnVybCk7XG4gIC8vIGxldCBoZWFkZXJzID0gZGV0YWlscy5yZXF1ZXN0SGVhZGVycztcbiAgICAvLyBzZXRjb29raWUgPSBmYWxzZTtcbiAgZm9yKGxldCBpPTAgOyBpIDwgZGV0YWlscy5yZXF1ZXN0SGVhZGVycy5sZW5ndGggOyArK2kpe1xuICBcdGlmKGRldGFpbHMucmVxdWVzdEhlYWRlcnNbaV0ubmFtZSA9PT0gXCJDb29raWVcIil7XG4gIFx0XHRkZXRhaWxzLnJlcXVlc3RIZWFkZXJzW2ldLnZhbHVlICs9IFwiO2lzQWR1bHQ9MVwiO1xuICBcdFx0YnJlYWs7XG4gIFx0fVxuICB9XG4gIHJldHVybiB7cmVxdWVzdEhlYWRlcnM6ZGV0YWlscy5yZXF1ZXN0SGVhZGVyc307XG59O1xuXG5jaHJvbWUud2ViUmVxdWVzdC5vbkJlZm9yZVNlbmRIZWFkZXJzLmFkZExpc3RlbmVyKGNoYXB0ZXJmdW5oYW5kbGVyLCBcblx0e3VybHM6IFtcImh0dHA6Ly93d3cuZG01LmNvbS9tKi9jaGFwdGVyZnVuKlwiXX0sXG5cdFsncmVxdWVzdEhlYWRlcnMnLCAnYmxvY2tpbmcnXSk7XG5cbmNocm9tZS53ZWJSZXF1ZXN0Lm9uQmVmb3JlU2VuZEhlYWRlcnMuYWRkTGlzdGVuZXIobWhhbmRsZXIsIFxuXHR7dXJsczogW1wiaHR0cDovL3d3dy5kbTUuY29tL20qL1wiXX0sXG5cdFsncmVxdWVzdEhlYWRlcnMnLCAnYmxvY2tpbmcnXSk7XG5cbmNocm9tZS5ub3RpZmljYXRpb25zLm9uQ2xpY2tlZC5hZGRMaXN0ZW5lcihmdW5jdGlvbihpZCl7XG5cdGNocm9tZS50YWJzLmNyZWF0ZSh7dXJsOmlkfSk7XG59KTtcblxubGV0IGNvbWljc1F1ZXJ5ID0gZnVuY3Rpb24oKXtcblx0Y2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdjb2xsZWN0ZWQnLGZ1bmN0aW9uKGl0ZW1zKXtcbiAgICAgIGZvcihsZXQgaz0wO2s8aXRlbXMuY29sbGVjdGVkLmxlbmd0aDsrK2spe1xuICAgICAgXHRsZXQgaW5kZXhVUkw9aXRlbXMuY29sbGVjdGVkW2tdLnVybDtcbiAgICAgIFx0bGV0IGNoYXB0ZXJzPWl0ZW1zLmNvbGxlY3RlZFtrXS5tZW51SXRlbXM7XG4gICAgICBcdC8vIGNvbnNvbGUubG9nKCdjaGFwdGVycycsY2hhcHRlcnMubGVuZ3RoLGNoYXB0ZXJzWzBdLnBheWxvYWQpO1xuICAgICAgXHRsZXQgcmVxPW5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHQgICAgaWYoaXRlbXMuY29sbGVjdGVkW2tdLnNpdGU9PT0nc2YnKXtcblx0XHQgICAgcmVxLm9wZW4oJ0dFVCcsaW5kZXhVUkwpO1xuXHRcdCAgICByZXEucmVzcG9uc2VUeXBlPVwiZG9jdW1lbnRcIjtcblx0ICAgIFx0cmVxLm9ubG9hZD0oZnVuY3Rpb24oaW5kZXhVUkwsY2hhcHRlcnMscmVxLGl0ZW1zLGssQ29taWNzX3NmKXtcblx0ICAgICAgXHRcdHJldHVybiBmdW5jdGlvbigpe1xuXHQgICAgICBcdFx0XHRDb21pY3Nfc2YuYmFja2dyb3VuZE9ubG9hZChpbmRleFVSTCwgY2hhcHRlcnMsIHJlcSwgaXRlbXMsIGspO1xuXHQgICAgICBcdFx0fSAgICAgIFx0XHRcblx0XHRcdH0pKGluZGV4VVJMLGNoYXB0ZXJzLHJlcSxpdGVtcyxrLENvbWljc19zZik7XG5cdCAgICB9ZWxzZSBpZihpdGVtcy5jb2xsZWN0ZWRba10uc2l0ZT09PSdjb21pY3M4Jyl7XG5cdFx0ICAgIHJlcS5vcGVuKCdHRVQnLGluZGV4VVJMKTtcblx0ICAgIFx0cmVxLnJlc3BvbnNlVHlwZT1cImRvY3VtZW50XCI7XG5cdCAgICBcdHJlcS5vbmxvYWQ9KGZ1bmN0aW9uKGluZGV4VVJMLGNoYXB0ZXJzLHJlcSxpdGVtcyxrLENvbWljc184KXtcblx0ICAgICAgXHRcdHJldHVybiBmdW5jdGlvbigpe1xuXHQgICAgICBcdFx0XHRDb21pY3NfOC5iYWNrZ3JvdW5kT25sb2FkKGluZGV4VVJMLCBjaGFwdGVycywgcmVxLCBpdGVtcywgayk7XG5cdCAgICAgIFx0XHR9ICAgICAgXHRcdFxuXHRcdFx0fSkoaW5kZXhVUkwsY2hhcHRlcnMscmVxLGl0ZW1zLGssQ29taWNzXzgpO1xuXHQgICAgfWVsc2UgaWYoaXRlbXMuY29sbGVjdGVkW2tdLnNpdGU9PT0nZG01Jyl7XG5cdFx0ICAgIHJlcS5vcGVuKCdHRVQnLGluZGV4VVJMKTtcblx0XHQgICAgcmVxLnJlc3BvbnNlVHlwZT1cImRvY3VtZW50XCI7XG5cdCAgICBcdHJlcS5vbmxvYWQ9KGZ1bmN0aW9uKGluZGV4VVJMLGNoYXB0ZXJzLHJlcSxpdGVtcyxrLENvbWljc19kbTUpe1xuXHQgICAgICBcdFx0cmV0dXJuIGZ1bmN0aW9uKCl7XG5cdCAgICAgIFx0XHRcdENvbWljc19kbTUuYmFja2dyb3VuZE9ubG9hZChpbmRleFVSTCwgY2hhcHRlcnMsIHJlcSwgaXRlbXMsIGspO1xuXHQgICAgICBcdFx0fSAgICAgIFx0XHRcblx0XHRcdH0pKGluZGV4VVJMLGNoYXB0ZXJzLHJlcSxpdGVtcyxrLENvbWljc19kbTUpO1xuXHQgICAgfVxuXHQgICAgcmVxLnNlbmQoKTtcblx0ICB9XG5cdH0pO1xufVxuXG5cbmNocm9tZS5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKGZ1bmN0aW9uKCl7XG5cdGxldCBjb2xsZWN0ZWQ9e1xuXHRcdGNvbGxlY3RlZDpbXVx0XHRcblx0fTtcblxuXHRsZXQgcmVhZGVkPXtcblx0XHRyZWFkZWQ6W11cblx0fTtcblxuXHRsZXQgdXBkYXRlPXtcblx0XHR1cGRhdGU6W11cblx0fTtcblx0Y2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdyZWFkZWQnLGZ1bmN0aW9uKGl0ZW1zKXtcblx0ICBsZXQgcmVhZGVkSXRlbSA9IE9iamVjdC5hc3NpZ24ocmVhZGVkLGl0ZW1zKTtcblx0ICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQocmVhZGVkSXRlbSk7XG5cdH0pO1xuXG5cdGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgndXBkYXRlJyxmdW5jdGlvbihpdGVtcyl7XG5cdCAgbGV0IHVwZGF0ZUl0ZW0gPSBPYmplY3QuYXNzaWduKHVwZGF0ZSxpdGVtcyk7XG5cdCAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHVwZGF0ZUl0ZW0pO1xuXHR9KTtcblxuXHRjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ2NvbGxlY3RlZCcsZnVuY3Rpb24oaXRlbXMpe1xuXHQgIGxldCBjb2xsZWN0ZWRJdGVtID0gT2JqZWN0LmFzc2lnbihjb2xsZWN0ZWQsaXRlbXMpO1xuXHQgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldChjb2xsZWN0ZWRJdGVtKTtcblx0fSk7XG5cblx0Y2hyb21lLmFsYXJtcy5jcmVhdGUoXCJjb21pY3NRdWVyeVwiLCB7XG4gICAgICAgcGVyaW9kSW5NaW51dGVzOiAxfSk7XG59KTtcblxuLy8gY2hyb21lLnRhYnMub25VcGRhdGVkLmFkZExpc3RlbmVyKHJlZGlyZWN0TG9jYWwpO1xuLy8gY2hyb21lLndlYk5hdmlnYXRpb24ub25Db21taXR0ZWQuYWRkTGlzdGVuZXJcbmNocm9tZS53ZWJOYXZpZ2F0aW9uLm9uQ29tbWl0dGVkLmFkZExpc3RlbmVyXG5jaHJvbWUud2ViTmF2aWdhdGlvbi5vbkNvbW1pdHRlZC5hZGRMaXN0ZW5lcihmdW5jdGlvbihkZXRhaWxzKSB7XG5cdGNvbnNvbGUubG9nKGRldGFpbHMudXJsLENvbWljc184LnJlZ2V4LnRlc3QoZGV0YWlscy51cmwpKTtcblx0aWYoQ29taWNzXzgucmVnZXgudGVzdChkZXRhaWxzLnVybCkpe1xuXHRcdGNvbnNvbGUubG9nKFwiOCBjb21pY3MgZmlyZWRcIik7XG5cdFx0bGV0IGNoYXB0ZXI9Q29taWNzXzgucmVnZXguZXhlYyhkZXRhaWxzLnVybClbMV07XG5cdFx0Y2hyb21lLnRhYnMudXBkYXRlKGRldGFpbHMudGFiSWQse3VybDogY2hyb21lLmV4dGVuc2lvbi5nZXRVUkwoXCJyZWFkZXIuaHRtbFwiKStcIiMvc2l0ZS9jb21pY3M4L2NoYXB0ZXJcIitjaGFwdGVyfSk7XG5cdFx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCBcIjhjb21pY3Mgdmlld1wiKTtcblx0fWVsc2UgaWYoQ29taWNzX3NmLnJlZ2V4LnRlc3QoZGV0YWlscy51cmwpKXtcblx0XHRjb25zb2xlLmxvZyhcInNmIGZpcmVkXCIpO1xuXHRcdGxldCBjaGFwdGVyPUNvbWljc19zZi5yZWdleC5leGVjKGRldGFpbHMudXJsKVsxXTtcblx0XHRjaHJvbWUudGFicy51cGRhdGUoZGV0YWlscy50YWJJZCx7dXJsOiBjaHJvbWUuZXh0ZW5zaW9uLmdldFVSTChcInJlYWRlci5odG1sXCIpK1wiIy9zaXRlL3NmL2NoYXB0ZXJcIitjaGFwdGVyfSk7XG5cdFx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCBcInNmIHZpZXdcIik7XG5cdH1lbHNlIGlmKChDb21pY3NfZG01LnJlZ2V4LnRlc3QoZGV0YWlscy51cmwpfHxDb21pY3NfZG01LmRtNXJlZ2V4LnRlc3QoZGV0YWlscy51cmwpKSl7XG5cdFx0Y29uc29sZS5sb2coXCJkbTUgZmlyZWRcIik7XG5cdFx0bGV0IGNoYXB0ZXI9XCJcIlxuXHRcdGlmKENvbWljc19kbTUuZG01cmVnZXgudGVzdChkZXRhaWxzLnVybCkpe1xuXHRcdFx0Y2hhcHRlcj1Db21pY3NfZG01LmRtNXJlZ2V4LmV4ZWMoZGV0YWlscy51cmwpWzJdO1xuXHRcdH1lbHNle1xuXHRcdFx0Y2hhcHRlcj1Db21pY3NfZG01LnJlZ2V4LmV4ZWMoZGV0YWlscy51cmwpWzFdO1xuXHRcdH1cblx0XHRjaHJvbWUudGFicy51cGRhdGUoZGV0YWlscy50YWJJZCx7dXJsOiBjaHJvbWUuZXh0ZW5zaW9uLmdldFVSTChcInJlYWRlci5odG1sXCIpK1wiIy9zaXRlL2RtNS9jaGFwdGVyXCIrY2hhcHRlcn0pO1xuXHRcdGdhKCdzZW5kJywgJ2V2ZW50JywgXCJkbTUgdmlld1wiKTtcblx0fVxufSx7dXJsOltcblx0e3VybE1hdGNoZXM6IFwiY29taWNidXNcXC5jb20vb25saW5lL1xcdypcIn0sXG5cdFx0e3VybE1hdGNoZXM6IFwiY29taWNcXC5zZmFjZ1xcLmNvbVxcL0hUTUxcXC9bXlxcL10rXFwvLiskXCJ9LFxuXHRcdHt1cmxNYXRjaGVzOiBcImh0dHA6Ly8odGVsfHx3d3cpXFwuZG01XFwuY29tL21cXGQqXCJ9XG5cdFx0XVxuXHR9KTtcblxuY2hyb21lLmFsYXJtcy5vbkFsYXJtLmFkZExpc3RlbmVyKGZ1bmN0aW9uKGFsYXJtKXtcblx0Y29taWNzUXVlcnkoKTtcbn0pO1xuXG5cblxuKGZ1bmN0aW9uKGkscyxvLGcscixhLG0pe2lbJ0dvb2dsZUFuYWx5dGljc09iamVjdCddPXI7aVtyXT1pW3JdfHxmdW5jdGlvbigpe1xuKGlbcl0ucT1pW3JdLnF8fFtdKS5wdXNoKGFyZ3VtZW50cyl9LGlbcl0ubD0xKm5ldyBEYXRlKCk7YT1zLmNyZWF0ZUVsZW1lbnQobyksXG5tPXMuZ2V0RWxlbWVudHNCeVRhZ05hbWUobylbMF07YS5hbG9jYWw9MTthLnNyYz1nO20ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYSxtKVxufSkod2luZG93LGRvY3VtZW50LCdzY3JpcHQnLCdodHRwczovL3NzbC5nb29nbGUtYW5hbHl0aWNzLmNvbS9hbmFseXRpY3MuanMnLCdnYScpO1xuZ2EoJ2NyZWF0ZScsICdVQS01OTcyODc3MS0xJywgJ2F1dG8nKTtcbmdhKCdzZXQnLCdjaGVja1Byb3RvY29sVGFzaycsIG51bGwpO1xuZ2EoJ3NlbmQnLCAncGFnZXZpZXcnKTtcbiAgXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvYmFja2dyb3VuZC5qc1xuICoqLyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcHJvY2Vzcy9icm93c2VyLmpzXG4gKiogbW9kdWxlIGlkID0gNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsIi8vIGxldCBPYmplY3RBc3NpZ249cmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xubGV0IEVjaG89cmVxdWlyZSgnLi9lY2hvJyk7XG5sZXQgSW1tdXRhYmxlID0gcmVxdWlyZSgnaW1tdXRhYmxlJyk7XG5sZXQgcGFyc2VyPSBuZXcgRE9NUGFyc2VyKCk7XG5sZXQgY29taWNzPXtcblxuXHRyZWdleDogL2h0dHBcXDpcXC9cXC9jb21pY1xcLnNmYWNnXFwuY29tKFxcL0hUTUxcXC9bXlxcL10rXFwvLispJC8sXG5cblx0YmFzZVVSTDpcImh0dHA6Ly9jb21pYy5zZmFjZy5jb21cIixcblxuXHRoYW5kbGVVcmxIYXNoOmZ1bmN0aW9uKG1lbnVJdGVtcyl7XG5cdFx0bGV0IHBhcmFtc19zdHI9d2luZG93LmxvY2F0aW9uLmhhc2g7XG5cdCAgICB0aGlzLnNpdGU9IC9zaXRlXFwvKFxcdyopXFwvLy5leGVjKHBhcmFtc19zdHIpWzFdO1xuXHQgICAgdGhpcy5wYWdlVVJMPS9jaGFwdGVyKFxcL0hUTUxcXC9bXlxcL10rXFwvKS8uZXhlYyhwYXJhbXNfc3RyKVsxXTsgICBcblx0ICAgIHRoaXMuY2hhcHRlclVSTD10aGlzLmJhc2VVUkwrKC9jaGFwdGVyKFxcLy4qKSQvLmV4ZWMocGFyYW1zX3N0cilbMV0pO1xuXHQgICAgdGhpcy5pbmRleFVSTD10aGlzLmJhc2VVUkwrdGhpcy5wYWdlVVJMO1xuXHQgICAgLy8gY29uc29sZS5sb2coXCJjaGFwdGVyVVJMXCIsdGhpcy5jaGFwdGVyVVJMKTtcbiAgICBcdGlmKCEoLyMkLy50ZXN0KHBhcmFtc19zdHIpKSl7XG5cdCAgICAgIC8vIGNvbnNvbGUubG9nKCdwYWdlIGJhY2snKTtcblx0ICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb21pY3NfcGFuZWxcIikuaW5uZXJIVE1MPVwiXCI7XG5cdCAgICAgIGxldCBpbmRleD0tMTtcblx0ICAgICAgZm9yKGxldCBpPTA7aTxtZW51SXRlbXMuc2l6ZTsrK2kpe1xuXHQgICAgICAgIGlmKG1lbnVJdGVtcy5nZXQoaSkuZ2V0KCdwYXlsb2FkJyk9PT10aGlzLmNoYXB0ZXJVUkwpe1xuXHQgICAgICAgICAgaW5kZXg9aTtcblx0ICAgICAgICAgIHRoaXMubGFzdEluZGV4PWluZGV4O1xuXHQgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICAgIHRoaXMuZ2V0SW1hZ2UoaW5kZXgsdGhpcy5jaGFwdGVyVVJMKTtcblx0ICAgIH1lbHNle1xuXHQgICAgICB0aGlzLmNoYXB0ZXJVUkw9dGhpcy5iYXNlVVJMKygvY2hhcHRlclxcLyguKlxcLykjJC8uZXhlYyhwYXJhbXNfc3RyKVsxXSk7XG5cdCAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSgnJyxkb2N1bWVudC50aXRsZSxcIiMvc2l0ZS9zZi9jaGFwdGVyL1wiKygvY2hhcHRlclxcLyguKlxcLykjJC8uZXhlYyhwYXJhbXNfc3RyKVsxXSkpO1xuXHQgICAgfSAgXG5cdH0sXG5cblx0Z2V0Q2hhcHRlcjpmdW5jdGlvbihkb2Mpe1xuXHRcdGxldCBubD1kb2MucXVlcnlTZWxlY3RvckFsbChcIi5zZXJpYWxpc2VfbGlzdD5saT5hXCIpO1xuXHRcdHJldHVybiBubDtcblx0fSxcblxuXHRnZXRUaXRsZU5hbWU6ZnVuY3Rpb24oZG9jKXtcblx0XHR0aGlzLnRpdGxlPWRvYy5xdWVyeVNlbGVjdG9yKFwiYm9keSA+IHRhYmxlOm50aC1jaGlsZCg4KSA+IHRib2R5ID4gdHIgPiB0ZDpudGgtY2hpbGQoMSkgPiB0YWJsZTpudGgtY2hpbGQoMikgPiB0Ym9keSA+IHRyID4gdGQgPiBoMSA+IGJcIikudGV4dENvbnRlbnQ7XG5cdFx0cmV0dXJuIHRoaXMudGl0bGU7XG5cdH0sXG5cblx0Z2V0Q292ZXJJbWc6ZnVuY3Rpb24oZG9jKXtcblx0XHR0aGlzLmljb25Vcmw9ZG9jLnF1ZXJ5U2VsZWN0b3IoXCIuY29taWNfY292ZXI+aW1nXCIpLnNyYztcblx0XHRyZXR1cm4gdGhpcy5pY29uVXJsO1xuXHR9LFxuXG5cdGdldEluZGV4VVJMOmFzeW5jIGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHRoaXMuaW5kZXhVUkw7XG5cdH0sXG5cbiAgXHRnZXRJbWFnZTogYXN5bmMgZnVuY3Rpb24oaW5kZXgsdXJsKXtcbiAgICBcdGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCk7XG5cdFx0bGV0IHJ0eHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG5cdFx0bGV0IGRvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcocnR4dCxcInRleHQvaHRtbFwiKTtcblx0XHRsZXQgc2NyaXB0VVJMPS9zcmM9XFxcIihcXC9VdGlsaXR5LipcXC5qcylcXFwiPi8uZXhlYyhkb2MuaGVhZC5pbm5lckhUTUwpWzFdOyBcbiAgICBcdGxldCByZXNwb25zZTIgPSBhd2FpdCBmZXRjaCh0aGlzLmJhc2VVUkwrc2NyaXB0VVJMKTtcblx0XHRsZXQgcnR4dDIgPSBhd2FpdCByZXNwb25zZTIudGV4dCgpO1xuXHRcdHRoaXMuc2V0SW1hZ2VzKGluZGV4LHJ0eHQyKTtcbiAgXHR9LFxuXG4gIFx0Ly8gbWFya2VkSXRlbXM6IEltbXV0YWJsZS5TZXQoKSxcblxuICBcdGdldE1lbnVJdGVtczpmdW5jdGlvbihkb2MsbWFya2VkSXRlbXMpe1xuXHRcdGxldCBubCA9IHRoaXMuZ2V0Q2hhcHRlcihkb2MpOyAgICAgIFxuXHQgICAgbGV0IGFycmF5PVtdO1xuXHQgICAgdGhpcy5pbml0SW5kZXg9LTE7XG5cdCAgICBmb3IobGV0IGk9MDtpPG5sLmxlbmd0aDsrK2kpe1xuXHQgICAgICBsZXQgaXRlbT17fTtcblx0ICAgICAgaXRlbS5wYXlsb2FkPXRoaXMuYmFzZVVSTCtubFtpXS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcblx0ICAgICAgaXRlbS50ZXh0PW5sW2ldLnRleHRDb250ZW50O1xuXHQgICAgICBpZihpdGVtLnBheWxvYWQ9PT10aGlzLmNoYXB0ZXJVUkwmJnRoaXMuaW5pdEluZGV4PT09LTEpe1xuXHQgICAgICAgIHRoaXMuaW5pdEluZGV4PWk7XG5cdCAgICAgICAgZG9jdW1lbnQudGl0bGU9dGhpcy50aXRsZStcIiBcIitpdGVtLnRleHQ7XG5cdCAgICAgICAgdGhpcy5zZXRJbWFnZUluZGV4KGkpO1xuXHQgICAgICAgIGl0ZW0uaXNNYXJrZWQ9dHJ1ZTtcblx0ICAgICAgICBpZighbWFya2VkSXRlbXMuaGFzKGl0ZW0ucGF5bG9hZCkpe1xuXHQgICAgICAgICAgbWFya2VkSXRlbXM9bWFya2VkSXRlbXMuYWRkKGl0ZW0ucGF5bG9hZCk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICAgIGlmKG1hcmtlZEl0ZW1zLmhhcyhpdGVtLnBheWxvYWQpKXtcblx0ICAgICAgICBpdGVtLmlzTWFya2VkPXRydWU7ICBcblx0ICAgICAgfVxuXHQgICAgICBpdGVtPUltbXV0YWJsZS5NYXAoaXRlbSk7XG5cdCAgICAgIGFycmF5LnB1c2goaXRlbSk7XG5cdCAgICB9XG5cdCAgICB0aGlzLm1hcmtlZEl0ZW1zPW1hcmtlZEl0ZW1zO1xuXHQgICAgcmV0dXJuIEltbXV0YWJsZS5MaXN0KGFycmF5KTtcblx0fSxcblxuXHRjaGFwdGVyVXBkYXRlSW5kZXg6IC0xLFxuICBcbiAgXHRzZXRJbWFnZUluZGV4OmZ1bmN0aW9uKGluZGV4KXtcbiAgICBcdGlmKHRoaXMuY2hhcHRlclVwZGF0ZUluZGV4PT09LTEpe1xuICAgICAgXHRcdHRoaXMuY2hhcHRlclVwZGF0ZUluZGV4PWluZGV4O1xuICAgIFx0fWVsc2UgaWYodGhpcy5jaGFwdGVyVXBkYXRlSW5kZXg9PT0tMil7XG4gICAgICBcdFx0bGV0IGltZ3M9ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW1nW2RhdGEtY2hhcHRlcj1cXFwiLTFcXFwiXScpO1xuICAgICAgXHRcdGZvcihsZXQgaT0wO2k8aW1ncy5sZW5ndGg7KytpKXtcbiAgICAgICAgXHRcdGltZ3NbaV0uc2V0QXR0cmlidXRlKFwiZGF0YS1jaGFwdGVyXCIsaW5kZXgpO1xuICAgICAgXHRcdH1cbiAgICAgIFx0XHR0aGlzLmNoYXB0ZXJVcGRhdGVJbmRleD0tMTsgIFxuICAgIFx0fVxuXHR9LFxuXG5cdHNldEltYWdlczpmdW5jdGlvbihpbmRleCxyZXNwb25zZSl7XG5cdFx0Y29uc29sZS5sb2cocmVzcG9uc2UpO1xuXHRcdGV2YWwocmVzcG9uc2UpO1xuXHRcdGxldCBuYW1lID0gXCJwaWNIb3N0PVwiO1xuXHRcdGxldCBwaWNIb3N0PSBob3N0c1swXTtcbiAgICBcdGxldCBpbWcgPVtdOyBcblx0XHR0aGlzLnBhZ2VNYXg9cGljQ291bnQ7XG5cdFx0Zm9yKGxldCBpPTA7aTx0aGlzLnBhZ2VNYXg7aSsrKXtcblx0XHRcdGltZ1tpXT1waWNIb3N0K3BpY0F5W2ldO1xuXHRcdH1cblx0XHR0aGlzLmltYWdlcz1pbWc7XG5cdFx0dGhpcy5hcHBlbmRJbWFnZShpbmRleCk7XHRcdCBcblx0fSxcblx0XG5cdGFwcGVuZEltYWdlOmZ1bmN0aW9uKGluZGV4KXtcblx0ICAgIGxldCBjb21pY3NfcGFuZWw9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb21pY3NfcGFuZWxcIik7XG5cdCAgICBpZihpbmRleD09PS0xKXtcblx0ICAgICAgaW5kZXg9dGhpcy5jaGFwdGVyVXBkYXRlSW5kZXg7XG5cdCAgICAgIHRoaXMuY2hhcHRlclVwZGF0ZUluZGV4PS0yO1xuXHQgICAgfVxuXHQgICAgZm9yKGxldCBpPTA7aTx0aGlzLnBhZ2VNYXg7KytpKXtcblx0ICAgICAgbGV0IGltZz1uZXcgSW1hZ2UoKTtcblx0ICAgICAgaW1nLnNyYz1cImRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEFRQUJBSUFBQUFBQUFQLy8veUg1QkFFQUFBQUFMQUFBQUFBQkFBRUFBQUlCUkFBN1wiXG5cdCAgICAgIGltZy5zZXRBdHRyaWJ1dGUoXCJkYXRhLWVjaG9cIix0aGlzLmltYWdlc1tpXSk7XG5cdCAgICAgIGltZy5zZXRBdHRyaWJ1dGUoXCJkYXRhLW51bVwiLGkrMSk7XG5cdCAgICAgIGltZy5zZXRBdHRyaWJ1dGUoXCJkYXRhLWNoYXB0ZXJcIixpbmRleCk7XG5cdCAgICAgIGltZy5zdHlsZS53aWR0aD1cIjkwMHB4XCI7XG5cdCAgICAgIGltZy5zdHlsZS5oZWlnaHQ9XCIxMzAwcHhcIjtcblx0ICAgICAgaW1nLnN0eWxlLmRpc3BsYXk9J2Jsb2NrJztcblx0ICAgICAgaW1nLnN0eWxlLmJvcmRlcldpZHRoPVwiMXB4XCI7XG5cdCAgICAgIGltZy5zdHlsZS5ib3JkZXJDb2xvcj1cIndoaXRlXCI7XG5cdCAgICAgIGltZy5zdHlsZS5ib3JkZXJTdHlsZT1cInNvbGlkXCI7XG5cdCAgICAgIGltZy5zdHlsZS5tYXJnaW5MZWZ0PSdhdXRvJztcblx0ICAgICAgaW1nLnN0eWxlLm1hcmdpblJpZ2h0PSdhdXRvJztcblx0ICAgICAgaW1nLnN0eWxlLm1hcmdpblRvcD0nMTBweCc7XG5cdCAgICAgIGltZy5zdHlsZS5tYXJnaW5Cb3R0b209JzUwcHgnO1xuXHQgICAgICBpbWcuc3R5bGUubWF4V2lkdGg9JzEwMCUnO1xuXHQgICAgICBpbWcuc3R5bGUuYmFja2dyb3VuZD0nIzJhMmEyYSB1cmwoaHR0cDovL2kuaW1ndXIuY29tL21zZHBkUW0uZ2lmKSBuby1yZXBlYXQgY2VudGVyIGNlbnRlcic7XG5cdCAgICAgIGltZy5zZXRBdHRyaWJ1dGUoXCJkYXRhLXBhZ2VNYXhcIix0aGlzLnBhZ2VNYXgpO1xuXHQgICAgICBjb21pY3NfcGFuZWwuYXBwZW5kQ2hpbGQoaW1nKTtcblx0ICAgIH1cblx0ICAgIEVjaG8ubm9kZXM9Y29taWNzX3BhbmVsLmNoaWxkcmVuO1xuXHQgICAgbGV0IGNoYXB0ZXJFbmQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0ICAgIGNoYXB0ZXJFbmQuY2xhc3NOYW1lPVwiY29taWNzX2ltZ19lbmRcIjtcblx0ICAgIGNoYXB0ZXJFbmQudGV4dENvbnRlbnQ9XCLmnKzoqbHntZDmnZ9cIjtcblx0XHRjb21pY3NfcGFuZWwuYXBwZW5kQ2hpbGQoY2hhcHRlckVuZCk7XG5cdCAgICBsZXQgY2hhcHRlclByb21vdGU9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0ICAgIGNoYXB0ZXJQcm9tb3RlLmNsYXNzTmFtZT1cImNvbWljc19pbWdfcHJvbW90ZVwiO1xuXHQgICAgY2hhcHRlclByb21vdGUudGV4dENvbnRlbnQ9XCJJZiB5b3UgbGlrZSBDb21pY3MgU2Nyb2xsZXIsIGdpdmUgbWUgYSBsaWtlIG9uIEZCIG9yIEdpdGh1Yi5cIjtcblx0ICAgIGNvbWljc19wYW5lbC5hcHBlbmRDaGlsZChjaGFwdGVyUHJvbW90ZSk7XG5cdCAgICBpZighRWNoby5oYWRJbml0ZWQpe1xuXHQgICAgICBFY2hvLmluaXQoKTsgXG5cdCAgICB9ZWxzZXtcblx0ICAgICAgRWNoby5yZW5kZXIoKTtcblx0ICAgIH1cblx0fSxcblxuXHRiYWNrZ3JvdW5kT25sb2FkOmZ1bmN0aW9uKGluZGV4VVJMLGNoYXB0ZXJzLHJlcSxpdGVtcyxrKXtcblx0XHRsZXQgZG9jPXJlcS5yZXNwb25zZTtcblx0XHRsZXQgbmwgPSB0aGlzLmdldENoYXB0ZXIoZG9jKTtcblx0XHRsZXQgdGl0bGU9dGhpcy5nZXRUaXRsZU5hbWUoZG9jKTtcblx0XHRsZXQgaW1nVXJsPXRoaXMuZ2V0Q292ZXJJbWcoZG9jKTtcblx0XHRsZXQgYXJyYXk9W107XG5cdFx0bGV0IG9iaj17fTtcblx0XHQvLyBjaGFwdGVycy5wb3AoKTtcblx0XHRmb3IobGV0IGk9MDtpPG5sLmxlbmd0aDsrK2kpe1xuXHRcdCAgICBsZXQgaXRlbT17fTtcblx0XHQgICAgaXRlbS5wYXlsb2FkPXRoaXMuYmFzZVVSTCtubFtpXS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcblx0XHQgICAgaXRlbS50ZXh0PW5sW2ldLnRleHRDb250ZW50O1xuXHRcdCAgICBhcnJheS5wdXNoKGl0ZW0pO1xuXHRcdCAgICBsZXQgdXJsSW5DaGFwdGVyPWZhbHNlOyAgXHRcdFx0XHQgICAgXHRcdFxuXHRcdCAgICBmb3IobGV0IGo9MDtqPGNoYXB0ZXJzLmxlbmd0aDsrK2ope1xuXHRcdCAgICBcdGlmKGNoYXB0ZXJzW2pdLnBheWxvYWQ9PT1pdGVtLnBheWxvYWQpe1xuXHRcdCAgICBcdFx0dXJsSW5DaGFwdGVyPXRydWU7XG5cdFx0ICAgIFx0XHRicmVhaztcblx0XHQgICAgXHR9XG5cdFx0ICAgIH1cblx0XHQgICAgaWYoIXVybEluQ2hhcHRlciAmJiBjaGFwdGVycy5sZW5ndGg+MCl7XG5cdFx0XHRcdGxldCBvYmo9e1xuXHRcdFx0XHRcdHVybDppbmRleFVSTCxcblx0XHRcdFx0XHR0aXRsZTp0aXRsZSxcblx0XHRcdFx0XHRzaXRlOidzZicsXG5cdFx0XHRcdFx0aWNvblVybDppbWdVcmwsXG5cdFx0XHRcdFx0bGFzdFJlYWRlZDppdGVtXG5cdFx0XHRcdH07XG5cdFx0XHRcdGNocm9tZS5ub3RpZmljYXRpb25zLmNyZWF0ZShpdGVtLnBheWxvYWQse1xuXHRcdFx0XHRcdHR5cGU6XCJpbWFnZVwiLFxuXHRcdFx0XHRcdGljb25Vcmw6J2ltZy9jb21pY3MtNjQucG5nJyxcblx0XHRcdFx0XHR0aXRsZTpcIkNvbWljcyBVcGRhdGVcIixcblx0XHRcdFx0XHRtZXNzYWdlOnRpdGxlK1wiICBcIitvYmoubGFzdFJlYWRlZC50ZXh0LFxuXHRcdFx0XHRcdGltYWdlVXJsOmltZ1VybFxuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCd1cGRhdGUnLGZ1bmN0aW9uKGl0ZW1zKXtcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdGl0ZW1zLnVwZGF0ZS5wdXNoKHRoaXMpO1xuXHRcdFx0XHRcdGxldCBudW09aXRlbXMudXBkYXRlLmxlbmd0aC50b1N0cmluZygpO1xuXHRcdFx0XHRcdGNocm9tZS5icm93c2VyQWN0aW9uLnNldEJhZGdlVGV4dCh7dGV4dDpudW19KTtcblx0XHRcdFx0XHRjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoaXRlbXMpO1xuXHRcdFx0XHR9LmJpbmQob2JqKSk7XHRcdFx0XHRcdFx0XHRcblx0XHQgICAgfVxuXHRcdH1cblx0XHRpdGVtcy5jb2xsZWN0ZWRba10ubWVudUl0ZW1zPWFycmF5O1xuXHRcdGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldChpdGVtcyk7XG5cdH1cbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbWljcztcblxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvYXBwL2NvbWljc19zZi5qc1xuICoqLyIsIi8qISBtb2RpZnkgZnJvbSBlY2hvLmpzIHYxLjYuMCB8IChjKSAyMDE1IEB0b2RkbW90dG8gfCBodHRwczovL2dpdGh1Yi5jb20vdG9kZG1vdHRvL2VjaG8gKi9cbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBjaGFwdGVyQWN0aW9uPXJlcXVpcmUoXCIuLi9hY3Rpb25zL2NoYXB0ZXJBY3Rpb24uanNcIik7XG5cbiAgdmFyIGVjaG8gPSB7fTtcblxuICB2YXIgaW1nUmVuZGVyPWZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgIGVsZW0uc3JjID0gZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZWNobycpO1xuICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtZWNobycpO1xuICB9O1xuXG4gIC8vIHZhciBvZmZzZXQ9NTAwMDtcblxuICB2YXIgZGVsYXk9MjAwO1xuXG4gIHZhciB1c2VEZWJvdW5jZT10cnVlO1xuXG4gIGVjaG8uaGFkSW5pdGVkPWZhbHNlO1xuXG4gIHZhciBjaGVja1ZpZXcsIHNldEluVmlld0luZm9yLCBzY3JvbGxSZW5kZXIsIHBhbmVsLCBwb2xsLHVwZGF0ZSA7XG5cbiAgLy8gdmFyIHZpZXcgPSB7XG4gIC8vICAgdDogMCAtIG9mZnNldCxcbiAgLy8gICBiOiB3aW5kb3cuaW5uZXJIZWlnaHQgKyBvZmZzZXQsXG4gIC8vIH07XG4gIFxuICB2YXIgd2luZG93Vmlldz17XG4gICAgdDowLFxuICAgIGI6d2luZG93LmlubmVySGVpZ2h0XG4gIH07XG5cbiAgdmFyIGRlYm91bmNlT3JUaHJvdHRsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZighdXNlRGVib3VuY2UgJiYgISFwb2xsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNsZWFyVGltZW91dChwb2xsKTtcbiAgICBwb2xsID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgZWNoby5yZW5kZXIoKTsgIFxuICAgICAgcG9sbCA9IG51bGw7XG4gICAgfSwgZGVsYXkpO1xuICB9O1xuICB2YXIgYlNlYWNoRWxlbT1mdW5jdGlvbihub2RlcyxiZWdpbixlbmQpe1xuICAgIHZhciBpbmRleD1NYXRoLmZsb29yKChiZWdpbitlbmQpLzIpO1xuICAgIC8vIGNvbnNvbGUubG9nKGJlZ2luLGVuZCxpbmRleCk7XG4gICAgaWYoYmVnaW49PT1lbmQpIHJldHVybiBpbmRleDtcbiAgICB2YXIgYm94PW5vZGVzW2luZGV4XS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTsgXG4gICAgaWYoYm94LmJvdHRvbTx3aW5kb3dWaWV3LnQpe1xuICAgICAgcmV0dXJuIGJTZWFjaEVsZW0obm9kZXMsaW5kZXgsZW5kKTtcbiAgICB9ZWxzZSBpZihib3gudG9wPndpbmRvd1ZpZXcuYil7XG4gICAgICByZXR1cm4gYlNlYWNoRWxlbShub2RlcyxiZWdpbixpbmRleCk7XG4gICAgfWVsc2UgaWYoYm94LmJvdHRvbSA+PSB3aW5kb3dWaWV3LnQgJiYgYm94LnRvcCA8PSB3aW5kb3dWaWV3LmIpe1xuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cbiAgfTtcbiAgZWNoby5pbml0ID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICAvLyBzY3JvbGxSZW5kZXI9dHJ1ZTtcbiAgICAvLyBjb25zb2xlLmxvZyhcImVjaG8gaW5pdFwiKTtcbiAgICBvcHRzID0gb3B0cyB8fCB7fTtcbiAgICAvLyBwYW5lbD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29taWNzX3BhbmVsJyk7XG4gICAgaW1nUmVuZGVyPW9wdHMuaW1nUmVuZGVyIHx8IGltZ1JlbmRlcjtcbiAgICBlY2hvLmhhZEluaXRlZD10cnVlO1xuICAgIGVjaG8ucmVuZGVyKCk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGRlYm91bmNlT3JUaHJvdHRsZSwgZmFsc2UpO1xuICAgIC8vIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZGVib3VuY2VPclRocm90dGxlLCBmYWxzZSk7XG4gIH07XG4gIGVjaG8ucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIHBhbmVsPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb21pY3NfcGFuZWwnKTtcbiAgICAvLyB2YXIgbm9kZXMgPSBlY2hvLm5vZGVzO1xuICAgIC8vIHZhciBsZW5ndGggPSBub2Rlcy5sZW5ndGg7XG4gICAgLy8gdmFyIHJlbmRlcnN0YXR1cz1mYWxzZTtcbiAgICAvLyB2YXIgaW5mb3JzdGF0dXM9ZmFsc2U7ICAgXG4gICAgLy8gZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7ICsraSkge1xuICAgIC8vICAgdmFyIGVsZW0gPSBub2Rlc1tpXTtcbiAgICAvLyAgIGlmKGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWVjaG8nKSl7XG4gICAgLy8gICAgIGltZ1JlbmRlcihlbGVtKTtcbiAgICAvLyAgIH1cbiAgICAvLyAgIHZhciBib3g9ZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTsgXG4gICAgICAgICAgICBcbiAgICAvLyB9XG4gICAgaWYoZWNoby5ub2Rlcy5sZW5ndGg9PT0wKSByZXR1cm47XG4gICAgdmFyIGluZGV4PWJTZWFjaEVsZW0oZWNoby5ub2RlcywgMCwgZWNoby5ub2Rlcy5sZW5ndGgtMSk7XG4gICAgdmFyIGVsZW09ZWNoby5ub2Rlc1tpbmRleF07XG4gICAgXG4gICAgaWYoZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbnVtJykpe1xuICAgICAgY2hhcHRlckFjdGlvbi5zY3JvbGwoZWxlbS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNoYXB0ZXJcIiksZWxlbS5nZXRBdHRyaWJ1dGUoXCJkYXRhLW51bVwiKSsnLycrZWxlbS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBhZ2VNYXhcIikpOyAgXG4gICAgfVxuXG4gICAgaWYoIWVsZW0uc3R5bGUubWF4SGVpZ2h0ICYmIGVsZW0ubmF0dXJhbFdpZHRoL2VsZW0ubmF0dXJhbEhlaWdodD4xKXtcbiAgICAgIHZhciBoPXdpbmRvdy5pbm5lckhlaWdodC01ODtcbiAgICAgIGVsZW0uc3R5bGUubWF4SGVpZ2h0PWgudG9TdHJpbmcoKSsncHgnO1xuICAgICAgZWxlbS5zdHlsZS53aWR0aD1NYXRoLnJvdW5kKGgqKGVsZW0ubmF0dXJhbFdpZHRoKS8oZWxlbS5uYXR1cmFsSGVpZ2h0KSkudG9TdHJpbmcoKSsncHgnO1xuICAgIH0gICBcbiAgICBcbiAgICBpZihlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1lY2hvJykpIGltZ1JlbmRlcihlbGVtKTtcblxuICAgIGZvcih2YXIgaT0xO2k8PTU7KytpKXtcbiAgICAgIGlmKGluZGV4LWk+PTApe1xuICAgICAgICB2YXIgZWxlbT1lY2hvLm5vZGVzW2luZGV4LWldO1xuICAgICAgICBpZighZWxlbS5zdHlsZS5tYXhIZWlnaHQmJmVsZW0ubmF0dXJhbFdpZHRoL2VsZW0ubmF0dXJhbEhlaWdodD4xKXtcbiAgICAgICAgICB2YXIgaD13aW5kb3cuaW5uZXJIZWlnaHQtNTg7XG4gICAgICAgICAgZWxlbS5zdHlsZS5tYXhIZWlnaHQ9aC50b1N0cmluZygpKydweCc7XG4gICAgICAgICAgZWxlbS5zdHlsZS53aWR0aD1NYXRoLnJvdW5kKGgqKGVsZW0ubmF0dXJhbFdpZHRoKS8oZWxlbS5uYXR1cmFsSGVpZ2h0KSkudG9TdHJpbmcoKSsncHgnO1xuICAgICAgICB9XG4gICAgICAgIGlmKGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWVjaG8nKSkgaW1nUmVuZGVyKGVsZW0pO1xuICAgICAgfVxuICAgICAgaWYoaW5kZXgraTxlY2hvLm5vZGVzLmxlbmd0aCl7XG4gICAgICAgIHZhciBlbGVtPWVjaG8ubm9kZXNbaW5kZXgraV07XG4gICAgICAgIGlmKCFlbGVtLnN0eWxlLm1heEhlaWdodCAmJiBlbGVtLm5hdHVyYWxXaWR0aC9lbGVtLm5hdHVyYWxIZWlnaHQ+MSl7XG4gICAgICAgICAgdmFyIGg9d2luZG93LmlubmVySGVpZ2h0LTU4O1xuICAgICAgICAgIGVsZW0uc3R5bGUubWF4SGVpZ2h0PWgudG9TdHJpbmcoKSsncHgnO1xuICAgICAgICAgIGVsZW0uc3R5bGUud2lkdGg9TWF0aC5yb3VuZChoKihlbGVtLm5hdHVyYWxXaWR0aCkvKGVsZW0ubmF0dXJhbEhlaWdodCkpLnRvU3RyaW5nKCkrJ3B4JztcbiAgICAgICAgfVxuICAgICAgICBpZihlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1lY2hvJykpIGltZ1JlbmRlcihlbGVtKTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gIH07XG5cbiAgZWNoby5ub2Rlcz1bXTtcblxuICAvLyBlY2hvLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gICB2YXIgbm9kZXMgPSBwYW5lbC5jaGlsZHJlbjtcbiAgLy8gICAvLyB2YXIgbGVuZ3RoID0gbm9kZXMubGVuZ3RoO1xuICAvLyAgIHZhciByZW5kZXJzdGF0dXM9ZmFsc2U7XG4gIC8vICAgdmFyIGluZm9yc3RhdHVzPWZhbHNlOyAgIFxuICAvLyAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyArK2kpIHtcbiAgLy8gICAgIHZhciBlbGVtID0gbm9kZXNbaV07XG4gIC8vICAgICB2YXIgYm94PWVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIC8vICAgICBpZiAoYm94LmJvdHRvbSA+PSB2aWV3LnQgJiYgYm94LnRvcCA8PSB2aWV3LmIpIHtcbiAgLy8gICAgICAgaWYoZWxlbS5uYXR1cmFsV2lkdGgvZWxlbS5uYXR1cmFsSGVpZ2h0PjEpe1xuICAvLyAgICAgICAgIC8vIGVsZW0ucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xuICAvLyAgICAgICAgIHZhciBoPXdpbmRvdy5pbm5lckhlaWdodC01ODtcbiAgLy8gICAgICAgICBlbGVtLnN0eWxlLm1heEhlaWdodD1oLnRvU3RyaW5nKCkrJ3B4JztcbiAgLy8gICAgICAgICBlbGVtLnN0eWxlLndpZHRoPVwiODAlXCI7XG4gIC8vICAgICAgIH1cbiAgLy8gICAgICAgaWYoZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbnVtJykmJihib3guYm90dG9tID49IHdpbmRvd1ZpZXcudCAmJiBib3gudG9wIDw9IHdpbmRvd1ZpZXcuYikpe1xuICAvLyAgICAgICAgIGlmKCFpbmZvcnN0YXR1cyl7XG4gIC8vICAgICAgICAgICBjaGFwdGVyQWN0aW9uLnNjcm9sbChlbGVtLmdldEF0dHJpYnV0ZShcImRhdGEtY2hhcHRlclwiKSxlbGVtLmdldEF0dHJpYnV0ZShcImRhdGEtbnVtXCIpKycvJytlbGVtLmdldEF0dHJpYnV0ZShcImRhdGEtcGFnZU1heFwiKSk7XG4gIC8vICAgICAgICAgICBpbmZvcnN0YXR1cz10cnVlO1xuICAvLyAgICAgICAgIH1cbiAgLy8gICAgICAgfSAgXG4gIC8vICAgICAgIGlmKGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWVjaG8nKSl7XG4gIC8vICAgICAgICAgcmVuZGVyc3RhdHVzPXRydWU7XG4gIC8vICAgICAgICAgaW1nUmVuZGVyKGVsZW0pO1xuICAvLyAgICAgICB9ZWxzZSBpZihyZW5kZXJzdGF0dXMpe1xuICAvLyAgICAgICAgIGJyZWFrO1xuICAvLyAgICAgICB9XG4gIC8vICAgICB9XG4gIC8vICAgfVxuICAvLyB9O1xuXG4gIGVjaG8ucnVuPWZ1bmN0aW9uKCl7XG4gICAgLy8gc2Nyb2xsUmVuZGVyPXRydWU7XG4gICAgZWNoby5yZW5kZXIoKTtcbiAgfTtcblxuICAvLyBlY2hvLmRldGFjaCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZGVib3VuY2VPclRocm90dGxlKTtcbiAgLy8gICBjbGVhclRpbWVvdXQocG9sbCk7XG4gIC8vIH07XG5cbiAgbW9kdWxlLmV4cG9ydHM9ZWNobztcblxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvYXBwL2VjaG8uanNcbiAqKi8iLCJ2YXIgQXBwRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcicpO1xudmFyIGNoYXB0ZXJBY3Rpb25zID0ge1xuICB1cGRhdGU6IGZ1bmN0aW9uKCkge1xuICAgIC8vIGNvbnNvbGUubG9nKFwiYWN0aW9uIHVwZGF0ZVwiKTtcbiAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgIGFjdGlvblR5cGU6IFwidXBkYXRlXCJcbiAgICB9KTtcbiAgfSxcbiAgc2Nyb2xsOiBmdW5jdGlvbih0ZXh0LHBhZ2VyYXRpbyl7XG4gICAgLy8gY29uc29sZS5sb2coXCJhY3Rpb24gc2Nyb2xsXCIpO1xuICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgYWN0aW9uVHlwZTogXCJzY3JvbGxcIixcbiAgICAgIHRleHQ6IHRleHQsXG4gICAgICBwYWdlcmF0aW86cGFnZXJhdGlvXG4gICAgfSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY2hhcHRlckFjdGlvbnM7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9hY3Rpb25zL2NoYXB0ZXJBY3Rpb24uanNcbiAqKi8iLCJ2YXIgRGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2ZsdXgnKS5EaXNwYXRjaGVyO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBEaXNwYXRjaGVyKCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXIuanNcbiAqKi8iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMuRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4vbGliL0Rpc3BhdGNoZXInKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2ZsdXgvaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSA1NDZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMVxuICoqLyIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgRGlzcGF0Y2hlclxuICogXG4gKiBAcHJldmVudE11bmdlXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpOyB9IH1cblxudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xuXG52YXIgX3ByZWZpeCA9ICdJRF8nO1xuXG4vKipcbiAqIERpc3BhdGNoZXIgaXMgdXNlZCB0byBicm9hZGNhc3QgcGF5bG9hZHMgdG8gcmVnaXN0ZXJlZCBjYWxsYmFja3MuIFRoaXMgaXNcbiAqIGRpZmZlcmVudCBmcm9tIGdlbmVyaWMgcHViLXN1YiBzeXN0ZW1zIGluIHR3byB3YXlzOlxuICpcbiAqICAgMSkgQ2FsbGJhY2tzIGFyZSBub3Qgc3Vic2NyaWJlZCB0byBwYXJ0aWN1bGFyIGV2ZW50cy4gRXZlcnkgcGF5bG9hZCBpc1xuICogICAgICBkaXNwYXRjaGVkIHRvIGV2ZXJ5IHJlZ2lzdGVyZWQgY2FsbGJhY2suXG4gKiAgIDIpIENhbGxiYWNrcyBjYW4gYmUgZGVmZXJyZWQgaW4gd2hvbGUgb3IgcGFydCB1bnRpbCBvdGhlciBjYWxsYmFja3MgaGF2ZVxuICogICAgICBiZWVuIGV4ZWN1dGVkLlxuICpcbiAqIEZvciBleGFtcGxlLCBjb25zaWRlciB0aGlzIGh5cG90aGV0aWNhbCBmbGlnaHQgZGVzdGluYXRpb24gZm9ybSwgd2hpY2hcbiAqIHNlbGVjdHMgYSBkZWZhdWx0IGNpdHkgd2hlbiBhIGNvdW50cnkgaXMgc2VsZWN0ZWQ6XG4gKlxuICogICB2YXIgZmxpZ2h0RGlzcGF0Y2hlciA9IG5ldyBEaXNwYXRjaGVyKCk7XG4gKlxuICogICAvLyBLZWVwcyB0cmFjayBvZiB3aGljaCBjb3VudHJ5IGlzIHNlbGVjdGVkXG4gKiAgIHZhciBDb3VudHJ5U3RvcmUgPSB7Y291bnRyeTogbnVsbH07XG4gKlxuICogICAvLyBLZWVwcyB0cmFjayBvZiB3aGljaCBjaXR5IGlzIHNlbGVjdGVkXG4gKiAgIHZhciBDaXR5U3RvcmUgPSB7Y2l0eTogbnVsbH07XG4gKlxuICogICAvLyBLZWVwcyB0cmFjayBvZiB0aGUgYmFzZSBmbGlnaHQgcHJpY2Ugb2YgdGhlIHNlbGVjdGVkIGNpdHlcbiAqICAgdmFyIEZsaWdodFByaWNlU3RvcmUgPSB7cHJpY2U6IG51bGx9XG4gKlxuICogV2hlbiBhIHVzZXIgY2hhbmdlcyB0aGUgc2VsZWN0ZWQgY2l0eSwgd2UgZGlzcGF0Y2ggdGhlIHBheWxvYWQ6XG4gKlxuICogICBmbGlnaHREaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAqICAgICBhY3Rpb25UeXBlOiAnY2l0eS11cGRhdGUnLFxuICogICAgIHNlbGVjdGVkQ2l0eTogJ3BhcmlzJ1xuICogICB9KTtcbiAqXG4gKiBUaGlzIHBheWxvYWQgaXMgZGlnZXN0ZWQgYnkgYENpdHlTdG9yZWA6XG4gKlxuICogICBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICBpZiAocGF5bG9hZC5hY3Rpb25UeXBlID09PSAnY2l0eS11cGRhdGUnKSB7XG4gKiAgICAgICBDaXR5U3RvcmUuY2l0eSA9IHBheWxvYWQuc2VsZWN0ZWRDaXR5O1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogV2hlbiB0aGUgdXNlciBzZWxlY3RzIGEgY291bnRyeSwgd2UgZGlzcGF0Y2ggdGhlIHBheWxvYWQ6XG4gKlxuICogICBmbGlnaHREaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAqICAgICBhY3Rpb25UeXBlOiAnY291bnRyeS11cGRhdGUnLFxuICogICAgIHNlbGVjdGVkQ291bnRyeTogJ2F1c3RyYWxpYSdcbiAqICAgfSk7XG4gKlxuICogVGhpcyBwYXlsb2FkIGlzIGRpZ2VzdGVkIGJ5IGJvdGggc3RvcmVzOlxuICpcbiAqICAgQ291bnRyeVN0b3JlLmRpc3BhdGNoVG9rZW4gPSBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICBpZiAocGF5bG9hZC5hY3Rpb25UeXBlID09PSAnY291bnRyeS11cGRhdGUnKSB7XG4gKiAgICAgICBDb3VudHJ5U3RvcmUuY291bnRyeSA9IHBheWxvYWQuc2VsZWN0ZWRDb3VudHJ5O1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogV2hlbiB0aGUgY2FsbGJhY2sgdG8gdXBkYXRlIGBDb3VudHJ5U3RvcmVgIGlzIHJlZ2lzdGVyZWQsIHdlIHNhdmUgYSByZWZlcmVuY2VcbiAqIHRvIHRoZSByZXR1cm5lZCB0b2tlbi4gVXNpbmcgdGhpcyB0b2tlbiB3aXRoIGB3YWl0Rm9yKClgLCB3ZSBjYW4gZ3VhcmFudGVlXG4gKiB0aGF0IGBDb3VudHJ5U3RvcmVgIGlzIHVwZGF0ZWQgYmVmb3JlIHRoZSBjYWxsYmFjayB0aGF0IHVwZGF0ZXMgYENpdHlTdG9yZWBcbiAqIG5lZWRzIHRvIHF1ZXJ5IGl0cyBkYXRhLlxuICpcbiAqICAgQ2l0eVN0b3JlLmRpc3BhdGNoVG9rZW4gPSBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICBpZiAocGF5bG9hZC5hY3Rpb25UeXBlID09PSAnY291bnRyeS11cGRhdGUnKSB7XG4gKiAgICAgICAvLyBgQ291bnRyeVN0b3JlLmNvdW50cnlgIG1heSBub3QgYmUgdXBkYXRlZC5cbiAqICAgICAgIGZsaWdodERpc3BhdGNoZXIud2FpdEZvcihbQ291bnRyeVN0b3JlLmRpc3BhdGNoVG9rZW5dKTtcbiAqICAgICAgIC8vIGBDb3VudHJ5U3RvcmUuY291bnRyeWAgaXMgbm93IGd1YXJhbnRlZWQgdG8gYmUgdXBkYXRlZC5cbiAqXG4gKiAgICAgICAvLyBTZWxlY3QgdGhlIGRlZmF1bHQgY2l0eSBmb3IgdGhlIG5ldyBjb3VudHJ5XG4gKiAgICAgICBDaXR5U3RvcmUuY2l0eSA9IGdldERlZmF1bHRDaXR5Rm9yQ291bnRyeShDb3VudHJ5U3RvcmUuY291bnRyeSk7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBUaGUgdXNhZ2Ugb2YgYHdhaXRGb3IoKWAgY2FuIGJlIGNoYWluZWQsIGZvciBleGFtcGxlOlxuICpcbiAqICAgRmxpZ2h0UHJpY2VTdG9yZS5kaXNwYXRjaFRva2VuID1cbiAqICAgICBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICAgIHN3aXRjaCAocGF5bG9hZC5hY3Rpb25UeXBlKSB7XG4gKiAgICAgICAgIGNhc2UgJ2NvdW50cnktdXBkYXRlJzpcbiAqICAgICAgICAgY2FzZSAnY2l0eS11cGRhdGUnOlxuICogICAgICAgICAgIGZsaWdodERpc3BhdGNoZXIud2FpdEZvcihbQ2l0eVN0b3JlLmRpc3BhdGNoVG9rZW5dKTtcbiAqICAgICAgICAgICBGbGlnaHRQcmljZVN0b3JlLnByaWNlID1cbiAqICAgICAgICAgICAgIGdldEZsaWdodFByaWNlU3RvcmUoQ291bnRyeVN0b3JlLmNvdW50cnksIENpdHlTdG9yZS5jaXR5KTtcbiAqICAgICAgICAgICBicmVhaztcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFRoZSBgY291bnRyeS11cGRhdGVgIHBheWxvYWQgd2lsbCBiZSBndWFyYW50ZWVkIHRvIGludm9rZSB0aGUgc3RvcmVzJ1xuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MgaW4gb3JkZXI6IGBDb3VudHJ5U3RvcmVgLCBgQ2l0eVN0b3JlYCwgdGhlblxuICogYEZsaWdodFByaWNlU3RvcmVgLlxuICovXG5cbnZhciBEaXNwYXRjaGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gRGlzcGF0Y2hlcigpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRGlzcGF0Y2hlcik7XG5cbiAgICB0aGlzLl9jYWxsYmFja3MgPSB7fTtcbiAgICB0aGlzLl9pc0Rpc3BhdGNoaW5nID0gZmFsc2U7XG4gICAgdGhpcy5faXNIYW5kbGVkID0ge307XG4gICAgdGhpcy5faXNQZW5kaW5nID0ge307XG4gICAgdGhpcy5fbGFzdElEID0gMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBiZSBpbnZva2VkIHdpdGggZXZlcnkgZGlzcGF0Y2hlZCBwYXlsb2FkLiBSZXR1cm5zXG4gICAqIGEgdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB3aXRoIGB3YWl0Rm9yKClgLlxuICAgKi9cblxuICBEaXNwYXRjaGVyLnByb3RvdHlwZS5yZWdpc3RlciA9IGZ1bmN0aW9uIHJlZ2lzdGVyKGNhbGxiYWNrKSB7XG4gICAgdmFyIGlkID0gX3ByZWZpeCArIHRoaXMuX2xhc3RJRCsrO1xuICAgIHRoaXMuX2NhbGxiYWNrc1tpZF0gPSBjYWxsYmFjaztcbiAgICByZXR1cm4gaWQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBjYWxsYmFjayBiYXNlZCBvbiBpdHMgdG9rZW4uXG4gICAqL1xuXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLnVucmVnaXN0ZXIgPSBmdW5jdGlvbiB1bnJlZ2lzdGVyKGlkKSB7XG4gICAgIXRoaXMuX2NhbGxiYWNrc1tpZF0gPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnRGlzcGF0Y2hlci51bnJlZ2lzdGVyKC4uLik6IGAlc2AgZG9lcyBub3QgbWFwIHRvIGEgcmVnaXN0ZXJlZCBjYWxsYmFjay4nLCBpZCkgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbaWRdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBXYWl0cyBmb3IgdGhlIGNhbGxiYWNrcyBzcGVjaWZpZWQgdG8gYmUgaW52b2tlZCBiZWZvcmUgY29udGludWluZyBleGVjdXRpb25cbiAgICogb2YgdGhlIGN1cnJlbnQgY2FsbGJhY2suIFRoaXMgbWV0aG9kIHNob3VsZCBvbmx5IGJlIHVzZWQgYnkgYSBjYWxsYmFjayBpblxuICAgKiByZXNwb25zZSB0byBhIGRpc3BhdGNoZWQgcGF5bG9hZC5cbiAgICovXG5cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUud2FpdEZvciA9IGZ1bmN0aW9uIHdhaXRGb3IoaWRzKSB7XG4gICAgIXRoaXMuX2lzRGlzcGF0Y2hpbmcgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnRGlzcGF0Y2hlci53YWl0Rm9yKC4uLik6IE11c3QgYmUgaW52b2tlZCB3aGlsZSBkaXNwYXRjaGluZy4nKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IGlkcy5sZW5ndGg7IGlpKyspIHtcbiAgICAgIHZhciBpZCA9IGlkc1tpaV07XG4gICAgICBpZiAodGhpcy5faXNQZW5kaW5nW2lkXSkge1xuICAgICAgICAhdGhpcy5faXNIYW5kbGVkW2lkXSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdEaXNwYXRjaGVyLndhaXRGb3IoLi4uKTogQ2lyY3VsYXIgZGVwZW5kZW5jeSBkZXRlY3RlZCB3aGlsZSAnICsgJ3dhaXRpbmcgZm9yIGAlc2AuJywgaWQpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAhdGhpcy5fY2FsbGJhY2tzW2lkXSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdEaXNwYXRjaGVyLndhaXRGb3IoLi4uKTogYCVzYCBkb2VzIG5vdCBtYXAgdG8gYSByZWdpc3RlcmVkIGNhbGxiYWNrLicsIGlkKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9pbnZva2VDYWxsYmFjayhpZCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaGVzIGEgcGF5bG9hZCB0byBhbGwgcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gICAqL1xuXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLmRpc3BhdGNoID0gZnVuY3Rpb24gZGlzcGF0Y2gocGF5bG9hZCkge1xuICAgICEhdGhpcy5faXNEaXNwYXRjaGluZyA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdEaXNwYXRjaC5kaXNwYXRjaCguLi4pOiBDYW5ub3QgZGlzcGF0Y2ggaW4gdGhlIG1pZGRsZSBvZiBhIGRpc3BhdGNoLicpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9zdGFydERpc3BhdGNoaW5nKHBheWxvYWQpO1xuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBpZCBpbiB0aGlzLl9jYWxsYmFja3MpIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzUGVuZGluZ1tpZF0pIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9pbnZva2VDYWxsYmFjayhpZCk7XG4gICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuX3N0b3BEaXNwYXRjaGluZygpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogSXMgdGhpcyBEaXNwYXRjaGVyIGN1cnJlbnRseSBkaXNwYXRjaGluZy5cbiAgICovXG5cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuaXNEaXNwYXRjaGluZyA9IGZ1bmN0aW9uIGlzRGlzcGF0Y2hpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lzRGlzcGF0Y2hpbmc7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGwgdGhlIGNhbGxiYWNrIHN0b3JlZCB3aXRoIHRoZSBnaXZlbiBpZC4gQWxzbyBkbyBzb21lIGludGVybmFsXG4gICAqIGJvb2trZWVwaW5nLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG5cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuX2ludm9rZUNhbGxiYWNrID0gZnVuY3Rpb24gX2ludm9rZUNhbGxiYWNrKGlkKSB7XG4gICAgdGhpcy5faXNQZW5kaW5nW2lkXSA9IHRydWU7XG4gICAgdGhpcy5fY2FsbGJhY2tzW2lkXSh0aGlzLl9wZW5kaW5nUGF5bG9hZCk7XG4gICAgdGhpcy5faXNIYW5kbGVkW2lkXSA9IHRydWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldCB1cCBib29ra2VlcGluZyBuZWVkZWQgd2hlbiBkaXNwYXRjaGluZy5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLl9zdGFydERpc3BhdGNoaW5nID0gZnVuY3Rpb24gX3N0YXJ0RGlzcGF0Y2hpbmcocGF5bG9hZCkge1xuICAgIGZvciAodmFyIGlkIGluIHRoaXMuX2NhbGxiYWNrcykge1xuICAgICAgdGhpcy5faXNQZW5kaW5nW2lkXSA9IGZhbHNlO1xuICAgICAgdGhpcy5faXNIYW5kbGVkW2lkXSA9IGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLl9wZW5kaW5nUGF5bG9hZCA9IHBheWxvYWQ7XG4gICAgdGhpcy5faXNEaXNwYXRjaGluZyA9IHRydWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIENsZWFyIGJvb2trZWVwaW5nIHVzZWQgZm9yIGRpc3BhdGNoaW5nLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG5cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuX3N0b3BEaXNwYXRjaGluZyA9IGZ1bmN0aW9uIF9zdG9wRGlzcGF0Y2hpbmcoKSB7XG4gICAgZGVsZXRlIHRoaXMuX3BlbmRpbmdQYXlsb2FkO1xuICAgIHRoaXMuX2lzRGlzcGF0Y2hpbmcgPSBmYWxzZTtcbiAgfTtcblxuICByZXR1cm4gRGlzcGF0Y2hlcjtcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGlzcGF0Y2hlcjtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9mbHV4L2xpYi9EaXNwYXRjaGVyLmpzXG4gKiogbW9kdWxlIGlkID0gNTQ3XG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgaW52YXJpYW50XG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogVXNlIGludmFyaWFudCgpIHRvIGFzc2VydCBzdGF0ZSB3aGljaCB5b3VyIHByb2dyYW0gYXNzdW1lcyB0byBiZSB0cnVlLlxuICpcbiAqIFByb3ZpZGUgc3ByaW50Zi1zdHlsZSBmb3JtYXQgKG9ubHkgJXMgaXMgc3VwcG9ydGVkKSBhbmQgYXJndW1lbnRzXG4gKiB0byBwcm92aWRlIGluZm9ybWF0aW9uIGFib3V0IHdoYXQgYnJva2UgYW5kIHdoYXQgeW91IHdlcmVcbiAqIGV4cGVjdGluZy5cbiAqXG4gKiBUaGUgaW52YXJpYW50IG1lc3NhZ2Ugd2lsbCBiZSBzdHJpcHBlZCBpbiBwcm9kdWN0aW9uLCBidXQgdGhlIGludmFyaWFudFxuICogd2lsbCByZW1haW4gdG8gZW5zdXJlIGxvZ2ljIGRvZXMgbm90IGRpZmZlciBpbiBwcm9kdWN0aW9uLlxuICovXG5cbnZhciBpbnZhcmlhbnQgPSBmdW5jdGlvbiAoY29uZGl0aW9uLCBmb3JtYXQsIGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBlcnJvcjtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKCdNaW5pZmllZCBleGNlcHRpb24gb2NjdXJyZWQ7IHVzZSB0aGUgbm9uLW1pbmlmaWVkIGRldiBlbnZpcm9ubWVudCAnICsgJ2ZvciB0aGUgZnVsbCBlcnJvciBtZXNzYWdlIGFuZCBhZGRpdGlvbmFsIGhlbHBmdWwgd2FybmluZ3MuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmdzID0gW2EsIGIsIGMsIGQsIGUsIGZdO1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKCdJbnZhcmlhbnQgVmlvbGF0aW9uOiAnICsgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgICB9KSk7XG4gICAgfVxuXG4gICAgZXJyb3IuZnJhbWVzVG9Qb3AgPSAxOyAvLyB3ZSBkb24ndCBjYXJlIGFib3V0IGludmFyaWFudCdzIG93biBmcmFtZVxuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGludmFyaWFudDtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9mYmpzL2xpYi9pbnZhcmlhbnQuanNcbiAqKiBtb2R1bGUgaWQgPSA1NDhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMVxuICoqLyIsIi8qKlxuICogIENvcHlyaWdodCAoYykgMjAxNC0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgKGdsb2JhbC5JbW11dGFibGUgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCBmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0Jzt2YXIgU0xJQ0UkMCA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuICBmdW5jdGlvbiBjcmVhdGVDbGFzcyhjdG9yLCBzdXBlckNsYXNzKSB7XG4gICAgaWYgKHN1cGVyQ2xhc3MpIHtcbiAgICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzLnByb3RvdHlwZSk7XG4gICAgfVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIEl0ZXJhYmxlKHZhbHVlKSB7XG4gICAgICByZXR1cm4gaXNJdGVyYWJsZSh2YWx1ZSkgPyB2YWx1ZSA6IFNlcSh2YWx1ZSk7XG4gICAgfVxuXG5cbiAgY3JlYXRlQ2xhc3MoS2V5ZWRJdGVyYWJsZSwgSXRlcmFibGUpO1xuICAgIGZ1bmN0aW9uIEtleWVkSXRlcmFibGUodmFsdWUpIHtcbiAgICAgIHJldHVybiBpc0tleWVkKHZhbHVlKSA/IHZhbHVlIDogS2V5ZWRTZXEodmFsdWUpO1xuICAgIH1cblxuXG4gIGNyZWF0ZUNsYXNzKEluZGV4ZWRJdGVyYWJsZSwgSXRlcmFibGUpO1xuICAgIGZ1bmN0aW9uIEluZGV4ZWRJdGVyYWJsZSh2YWx1ZSkge1xuICAgICAgcmV0dXJuIGlzSW5kZXhlZCh2YWx1ZSkgPyB2YWx1ZSA6IEluZGV4ZWRTZXEodmFsdWUpO1xuICAgIH1cblxuXG4gIGNyZWF0ZUNsYXNzKFNldEl0ZXJhYmxlLCBJdGVyYWJsZSk7XG4gICAgZnVuY3Rpb24gU2V0SXRlcmFibGUodmFsdWUpIHtcbiAgICAgIHJldHVybiBpc0l0ZXJhYmxlKHZhbHVlKSAmJiAhaXNBc3NvY2lhdGl2ZSh2YWx1ZSkgPyB2YWx1ZSA6IFNldFNlcSh2YWx1ZSk7XG4gICAgfVxuXG5cblxuICBmdW5jdGlvbiBpc0l0ZXJhYmxlKG1heWJlSXRlcmFibGUpIHtcbiAgICByZXR1cm4gISEobWF5YmVJdGVyYWJsZSAmJiBtYXliZUl0ZXJhYmxlW0lTX0lURVJBQkxFX1NFTlRJTkVMXSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0tleWVkKG1heWJlS2V5ZWQpIHtcbiAgICByZXR1cm4gISEobWF5YmVLZXllZCAmJiBtYXliZUtleWVkW0lTX0tFWUVEX1NFTlRJTkVMXSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0luZGV4ZWQobWF5YmVJbmRleGVkKSB7XG4gICAgcmV0dXJuICEhKG1heWJlSW5kZXhlZCAmJiBtYXliZUluZGV4ZWRbSVNfSU5ERVhFRF9TRU5USU5FTF0pO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNBc3NvY2lhdGl2ZShtYXliZUFzc29jaWF0aXZlKSB7XG4gICAgcmV0dXJuIGlzS2V5ZWQobWF5YmVBc3NvY2lhdGl2ZSkgfHwgaXNJbmRleGVkKG1heWJlQXNzb2NpYXRpdmUpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNPcmRlcmVkKG1heWJlT3JkZXJlZCkge1xuICAgIHJldHVybiAhIShtYXliZU9yZGVyZWQgJiYgbWF5YmVPcmRlcmVkW0lTX09SREVSRURfU0VOVElORUxdKTtcbiAgfVxuXG4gIEl0ZXJhYmxlLmlzSXRlcmFibGUgPSBpc0l0ZXJhYmxlO1xuICBJdGVyYWJsZS5pc0tleWVkID0gaXNLZXllZDtcbiAgSXRlcmFibGUuaXNJbmRleGVkID0gaXNJbmRleGVkO1xuICBJdGVyYWJsZS5pc0Fzc29jaWF0aXZlID0gaXNBc3NvY2lhdGl2ZTtcbiAgSXRlcmFibGUuaXNPcmRlcmVkID0gaXNPcmRlcmVkO1xuXG4gIEl0ZXJhYmxlLktleWVkID0gS2V5ZWRJdGVyYWJsZTtcbiAgSXRlcmFibGUuSW5kZXhlZCA9IEluZGV4ZWRJdGVyYWJsZTtcbiAgSXRlcmFibGUuU2V0ID0gU2V0SXRlcmFibGU7XG5cblxuICB2YXIgSVNfSVRFUkFCTEVfU0VOVElORUwgPSAnQEBfX0lNTVVUQUJMRV9JVEVSQUJMRV9fQEAnO1xuICB2YXIgSVNfS0VZRURfU0VOVElORUwgPSAnQEBfX0lNTVVUQUJMRV9LRVlFRF9fQEAnO1xuICB2YXIgSVNfSU5ERVhFRF9TRU5USU5FTCA9ICdAQF9fSU1NVVRBQkxFX0lOREVYRURfX0BAJztcbiAgdmFyIElTX09SREVSRURfU0VOVElORUwgPSAnQEBfX0lNTVVUQUJMRV9PUkRFUkVEX19AQCc7XG5cbiAgLy8gVXNlZCBmb3Igc2V0dGluZyBwcm90b3R5cGUgbWV0aG9kcyB0aGF0IElFOCBjaG9rZXMgb24uXG4gIHZhciBERUxFVEUgPSAnZGVsZXRlJztcblxuICAvLyBDb25zdGFudHMgZGVzY3JpYmluZyB0aGUgc2l6ZSBvZiB0cmllIG5vZGVzLlxuICB2YXIgU0hJRlQgPSA1OyAvLyBSZXN1bHRlZCBpbiBiZXN0IHBlcmZvcm1hbmNlIGFmdGVyIF9fX19fXz9cbiAgdmFyIFNJWkUgPSAxIDw8IFNISUZUO1xuICB2YXIgTUFTSyA9IFNJWkUgLSAxO1xuXG4gIC8vIEEgY29uc2lzdGVudCBzaGFyZWQgdmFsdWUgcmVwcmVzZW50aW5nIFwibm90IHNldFwiIHdoaWNoIGVxdWFscyBub3RoaW5nIG90aGVyXG4gIC8vIHRoYW4gaXRzZWxmLCBhbmQgbm90aGluZyB0aGF0IGNvdWxkIGJlIHByb3ZpZGVkIGV4dGVybmFsbHkuXG4gIHZhciBOT1RfU0VUID0ge307XG5cbiAgLy8gQm9vbGVhbiByZWZlcmVuY2VzLCBSb3VnaCBlcXVpdmFsZW50IG9mIGBib29sICZgLlxuICB2YXIgQ0hBTkdFX0xFTkdUSCA9IHsgdmFsdWU6IGZhbHNlIH07XG4gIHZhciBESURfQUxURVIgPSB7IHZhbHVlOiBmYWxzZSB9O1xuXG4gIGZ1bmN0aW9uIE1ha2VSZWYocmVmKSB7XG4gICAgcmVmLnZhbHVlID0gZmFsc2U7XG4gICAgcmV0dXJuIHJlZjtcbiAgfVxuXG4gIGZ1bmN0aW9uIFNldFJlZihyZWYpIHtcbiAgICByZWYgJiYgKHJlZi52YWx1ZSA9IHRydWUpO1xuICB9XG5cbiAgLy8gQSBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGEgdmFsdWUgcmVwcmVzZW50aW5nIGFuIFwib3duZXJcIiBmb3IgdHJhbnNpZW50IHdyaXRlc1xuICAvLyB0byB0cmllcy4gVGhlIHJldHVybiB2YWx1ZSB3aWxsIG9ubHkgZXZlciBlcXVhbCBpdHNlbGYsIGFuZCB3aWxsIG5vdCBlcXVhbFxuICAvLyB0aGUgcmV0dXJuIG9mIGFueSBzdWJzZXF1ZW50IGNhbGwgb2YgdGhpcyBmdW5jdGlvbi5cbiAgZnVuY3Rpb24gT3duZXJJRCgpIHt9XG5cbiAgLy8gaHR0cDovL2pzcGVyZi5jb20vY29weS1hcnJheS1pbmxpbmVcbiAgZnVuY3Rpb24gYXJyQ29weShhcnIsIG9mZnNldCkge1xuICAgIG9mZnNldCA9IG9mZnNldCB8fCAwO1xuICAgIHZhciBsZW4gPSBNYXRoLm1heCgwLCBhcnIubGVuZ3RoIC0gb2Zmc2V0KTtcbiAgICB2YXIgbmV3QXJyID0gbmV3IEFycmF5KGxlbik7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IGxlbjsgaWkrKykge1xuICAgICAgbmV3QXJyW2lpXSA9IGFycltpaSArIG9mZnNldF07XG4gICAgfVxuICAgIHJldHVybiBuZXdBcnI7XG4gIH1cblxuICBmdW5jdGlvbiBlbnN1cmVTaXplKGl0ZXIpIHtcbiAgICBpZiAoaXRlci5zaXplID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGl0ZXIuc2l6ZSA9IGl0ZXIuX19pdGVyYXRlKHJldHVyblRydWUpO1xuICAgIH1cbiAgICByZXR1cm4gaXRlci5zaXplO1xuICB9XG5cbiAgZnVuY3Rpb24gd3JhcEluZGV4KGl0ZXIsIGluZGV4KSB7XG4gICAgLy8gVGhpcyBpbXBsZW1lbnRzIFwiaXMgYXJyYXkgaW5kZXhcIiB3aGljaCB0aGUgRUNNQVN0cmluZyBzcGVjIGRlZmluZXMgYXM6XG4gICAgLy9cbiAgICAvLyAgICAgQSBTdHJpbmcgcHJvcGVydHkgbmFtZSBQIGlzIGFuIGFycmF5IGluZGV4IGlmIGFuZCBvbmx5IGlmXG4gICAgLy8gICAgIFRvU3RyaW5nKFRvVWludDMyKFApKSBpcyBlcXVhbCB0byBQIGFuZCBUb1VpbnQzMihQKSBpcyBub3QgZXF1YWxcbiAgICAvLyAgICAgdG8gMl4zMuKIkjEuXG4gICAgLy9cbiAgICAvLyBodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtYXJyYXktZXhvdGljLW9iamVjdHNcbiAgICBpZiAodHlwZW9mIGluZGV4ICE9PSAnbnVtYmVyJykge1xuICAgICAgdmFyIHVpbnQzMkluZGV4ID0gaW5kZXggPj4+IDA7IC8vIE4gPj4+IDAgaXMgc2hvcnRoYW5kIGZvciBUb1VpbnQzMlxuICAgICAgaWYgKCcnICsgdWludDMySW5kZXggIT09IGluZGV4IHx8IHVpbnQzMkluZGV4ID09PSA0Mjk0OTY3Mjk1KSB7XG4gICAgICAgIHJldHVybiBOYU47XG4gICAgICB9XG4gICAgICBpbmRleCA9IHVpbnQzMkluZGV4O1xuICAgIH1cbiAgICByZXR1cm4gaW5kZXggPCAwID8gZW5zdXJlU2l6ZShpdGVyKSArIGluZGV4IDogaW5kZXg7XG4gIH1cblxuICBmdW5jdGlvbiByZXR1cm5UcnVlKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gd2hvbGVTbGljZShiZWdpbiwgZW5kLCBzaXplKSB7XG4gICAgcmV0dXJuIChiZWdpbiA9PT0gMCB8fCAoc2l6ZSAhPT0gdW5kZWZpbmVkICYmIGJlZ2luIDw9IC1zaXplKSkgJiZcbiAgICAgIChlbmQgPT09IHVuZGVmaW5lZCB8fCAoc2l6ZSAhPT0gdW5kZWZpbmVkICYmIGVuZCA+PSBzaXplKSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNvbHZlQmVnaW4oYmVnaW4sIHNpemUpIHtcbiAgICByZXR1cm4gcmVzb2x2ZUluZGV4KGJlZ2luLCBzaXplLCAwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc29sdmVFbmQoZW5kLCBzaXplKSB7XG4gICAgcmV0dXJuIHJlc29sdmVJbmRleChlbmQsIHNpemUsIHNpemUpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzb2x2ZUluZGV4KGluZGV4LCBzaXplLCBkZWZhdWx0SW5kZXgpIHtcbiAgICByZXR1cm4gaW5kZXggPT09IHVuZGVmaW5lZCA/XG4gICAgICBkZWZhdWx0SW5kZXggOlxuICAgICAgaW5kZXggPCAwID9cbiAgICAgICAgTWF0aC5tYXgoMCwgc2l6ZSArIGluZGV4KSA6XG4gICAgICAgIHNpemUgPT09IHVuZGVmaW5lZCA/XG4gICAgICAgICAgaW5kZXggOlxuICAgICAgICAgIE1hdGgubWluKHNpemUsIGluZGV4KTtcbiAgfVxuXG4gIC8qIGdsb2JhbCBTeW1ib2wgKi9cblxuICB2YXIgSVRFUkFURV9LRVlTID0gMDtcbiAgdmFyIElURVJBVEVfVkFMVUVTID0gMTtcbiAgdmFyIElURVJBVEVfRU5UUklFUyA9IDI7XG5cbiAgdmFyIFJFQUxfSVRFUkFUT1JfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuaXRlcmF0b3I7XG4gIHZhciBGQVVYX0lURVJBVE9SX1NZTUJPTCA9ICdAQGl0ZXJhdG9yJztcblxuICB2YXIgSVRFUkFUT1JfU1lNQk9MID0gUkVBTF9JVEVSQVRPUl9TWU1CT0wgfHwgRkFVWF9JVEVSQVRPUl9TWU1CT0w7XG5cblxuICBmdW5jdGlvbiBJdGVyYXRvcihuZXh0KSB7XG4gICAgICB0aGlzLm5leHQgPSBuZXh0O1xuICAgIH1cblxuICAgIEl0ZXJhdG9yLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICdbSXRlcmF0b3JdJztcbiAgICB9O1xuXG5cbiAgSXRlcmF0b3IuS0VZUyA9IElURVJBVEVfS0VZUztcbiAgSXRlcmF0b3IuVkFMVUVTID0gSVRFUkFURV9WQUxVRVM7XG4gIEl0ZXJhdG9yLkVOVFJJRVMgPSBJVEVSQVRFX0VOVFJJRVM7XG5cbiAgSXRlcmF0b3IucHJvdG90eXBlLmluc3BlY3QgPVxuICBJdGVyYXRvci5wcm90b3R5cGUudG9Tb3VyY2UgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLnRvU3RyaW5nKCk7IH1cbiAgSXRlcmF0b3IucHJvdG90eXBlW0lURVJBVE9SX1NZTUJPTF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cblxuICBmdW5jdGlvbiBpdGVyYXRvclZhbHVlKHR5cGUsIGssIHYsIGl0ZXJhdG9yUmVzdWx0KSB7XG4gICAgdmFyIHZhbHVlID0gdHlwZSA9PT0gMCA/IGsgOiB0eXBlID09PSAxID8gdiA6IFtrLCB2XTtcbiAgICBpdGVyYXRvclJlc3VsdCA/IChpdGVyYXRvclJlc3VsdC52YWx1ZSA9IHZhbHVlKSA6IChpdGVyYXRvclJlc3VsdCA9IHtcbiAgICAgIHZhbHVlOiB2YWx1ZSwgZG9uZTogZmFsc2VcbiAgICB9KTtcbiAgICByZXR1cm4gaXRlcmF0b3JSZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBpdGVyYXRvckRvbmUoKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgZnVuY3Rpb24gaGFzSXRlcmF0b3IobWF5YmVJdGVyYWJsZSkge1xuICAgIHJldHVybiAhIWdldEl0ZXJhdG9yRm4obWF5YmVJdGVyYWJsZSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0l0ZXJhdG9yKG1heWJlSXRlcmF0b3IpIHtcbiAgICByZXR1cm4gbWF5YmVJdGVyYXRvciAmJiB0eXBlb2YgbWF5YmVJdGVyYXRvci5uZXh0ID09PSAnZnVuY3Rpb24nO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SXRlcmF0b3IoaXRlcmFibGUpIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4oaXRlcmFibGUpO1xuICAgIHJldHVybiBpdGVyYXRvckZuICYmIGl0ZXJhdG9yRm4uY2FsbChpdGVyYWJsZSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRJdGVyYXRvckZuKGl0ZXJhYmxlKSB7XG4gICAgdmFyIGl0ZXJhdG9yRm4gPSBpdGVyYWJsZSAmJiAoXG4gICAgICAoUkVBTF9JVEVSQVRPUl9TWU1CT0wgJiYgaXRlcmFibGVbUkVBTF9JVEVSQVRPUl9TWU1CT0xdKSB8fFxuICAgICAgaXRlcmFibGVbRkFVWF9JVEVSQVRPUl9TWU1CT0xdXG4gICAgKTtcbiAgICBpZiAodHlwZW9mIGl0ZXJhdG9yRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvckZuO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS5sZW5ndGggPT09ICdudW1iZXInO1xuICB9XG5cbiAgY3JlYXRlQ2xhc3MoU2VxLCBJdGVyYWJsZSk7XG4gICAgZnVuY3Rpb24gU2VxKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCA/IGVtcHR5U2VxdWVuY2UoKSA6XG4gICAgICAgIGlzSXRlcmFibGUodmFsdWUpID8gdmFsdWUudG9TZXEoKSA6IHNlcUZyb21WYWx1ZSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgU2VxLm9mID0gZnVuY3Rpb24oLyouLi52YWx1ZXMqLykge1xuICAgICAgcmV0dXJuIFNlcShhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBTZXEucHJvdG90eXBlLnRvU2VxID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgU2VxLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX190b1N0cmluZygnU2VxIHsnLCAnfScpO1xuICAgIH07XG5cbiAgICBTZXEucHJvdG90eXBlLmNhY2hlUmVzdWx0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIXRoaXMuX2NhY2hlICYmIHRoaXMuX19pdGVyYXRlVW5jYWNoZWQpIHtcbiAgICAgICAgdGhpcy5fY2FjaGUgPSB0aGlzLmVudHJ5U2VxKCkudG9BcnJheSgpO1xuICAgICAgICB0aGlzLnNpemUgPSB0aGlzLl9jYWNoZS5sZW5ndGg7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gYWJzdHJhY3QgX19pdGVyYXRlVW5jYWNoZWQoZm4sIHJldmVyc2UpXG5cbiAgICBTZXEucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7XG4gICAgICByZXR1cm4gc2VxSXRlcmF0ZSh0aGlzLCBmbiwgcmV2ZXJzZSwgdHJ1ZSk7XG4gICAgfTtcblxuICAgIC8vIGFic3RyYWN0IF9faXRlcmF0b3JVbmNhY2hlZCh0eXBlLCByZXZlcnNlKVxuXG4gICAgU2VxLnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge1xuICAgICAgcmV0dXJuIHNlcUl0ZXJhdG9yKHRoaXMsIHR5cGUsIHJldmVyc2UsIHRydWUpO1xuICAgIH07XG5cblxuXG4gIGNyZWF0ZUNsYXNzKEtleWVkU2VxLCBTZXEpO1xuICAgIGZ1bmN0aW9uIEtleWVkU2VxKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCA/XG4gICAgICAgIGVtcHR5U2VxdWVuY2UoKS50b0tleWVkU2VxKCkgOlxuICAgICAgICBpc0l0ZXJhYmxlKHZhbHVlKSA/XG4gICAgICAgICAgKGlzS2V5ZWQodmFsdWUpID8gdmFsdWUudG9TZXEoKSA6IHZhbHVlLmZyb21FbnRyeVNlcSgpKSA6XG4gICAgICAgICAga2V5ZWRTZXFGcm9tVmFsdWUodmFsdWUpO1xuICAgIH1cblxuICAgIEtleWVkU2VxLnByb3RvdHlwZS50b0tleWVkU2VxID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5cblxuICBjcmVhdGVDbGFzcyhJbmRleGVkU2VxLCBTZXEpO1xuICAgIGZ1bmN0aW9uIEluZGV4ZWRTZXEodmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gZW1wdHlTZXF1ZW5jZSgpIDpcbiAgICAgICAgIWlzSXRlcmFibGUodmFsdWUpID8gaW5kZXhlZFNlcUZyb21WYWx1ZSh2YWx1ZSkgOlxuICAgICAgICBpc0tleWVkKHZhbHVlKSA/IHZhbHVlLmVudHJ5U2VxKCkgOiB2YWx1ZS50b0luZGV4ZWRTZXEoKTtcbiAgICB9XG5cbiAgICBJbmRleGVkU2VxLm9mID0gZnVuY3Rpb24oLyouLi52YWx1ZXMqLykge1xuICAgICAgcmV0dXJuIEluZGV4ZWRTZXEoYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgSW5kZXhlZFNlcS5wcm90b3R5cGUudG9JbmRleGVkU2VxID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgSW5kZXhlZFNlcS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcoJ1NlcSBbJywgJ10nKTtcbiAgICB9O1xuXG4gICAgSW5kZXhlZFNlcS5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHtcbiAgICAgIHJldHVybiBzZXFJdGVyYXRlKHRoaXMsIGZuLCByZXZlcnNlLCBmYWxzZSk7XG4gICAgfTtcblxuICAgIEluZGV4ZWRTZXEucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICByZXR1cm4gc2VxSXRlcmF0b3IodGhpcywgdHlwZSwgcmV2ZXJzZSwgZmFsc2UpO1xuICAgIH07XG5cblxuXG4gIGNyZWF0ZUNsYXNzKFNldFNlcSwgU2VxKTtcbiAgICBmdW5jdGlvbiBTZXRTZXEodmFsdWUpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgPyBlbXB0eVNlcXVlbmNlKCkgOlxuICAgICAgICAhaXNJdGVyYWJsZSh2YWx1ZSkgPyBpbmRleGVkU2VxRnJvbVZhbHVlKHZhbHVlKSA6XG4gICAgICAgIGlzS2V5ZWQodmFsdWUpID8gdmFsdWUuZW50cnlTZXEoKSA6IHZhbHVlXG4gICAgICApLnRvU2V0U2VxKCk7XG4gICAgfVxuXG4gICAgU2V0U2VxLm9mID0gZnVuY3Rpb24oLyouLi52YWx1ZXMqLykge1xuICAgICAgcmV0dXJuIFNldFNlcShhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBTZXRTZXEucHJvdG90eXBlLnRvU2V0U2VxID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5cblxuICBTZXEuaXNTZXEgPSBpc1NlcTtcbiAgU2VxLktleWVkID0gS2V5ZWRTZXE7XG4gIFNlcS5TZXQgPSBTZXRTZXE7XG4gIFNlcS5JbmRleGVkID0gSW5kZXhlZFNlcTtcblxuICB2YXIgSVNfU0VRX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfU0VRX19AQCc7XG5cbiAgU2VxLnByb3RvdHlwZVtJU19TRVFfU0VOVElORUxdID0gdHJ1ZTtcblxuXG5cbiAgY3JlYXRlQ2xhc3MoQXJyYXlTZXEsIEluZGV4ZWRTZXEpO1xuICAgIGZ1bmN0aW9uIEFycmF5U2VxKGFycmF5KSB7XG4gICAgICB0aGlzLl9hcnJheSA9IGFycmF5O1xuICAgICAgdGhpcy5zaXplID0gYXJyYXkubGVuZ3RoO1xuICAgIH1cblxuICAgIEFycmF5U2VxLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihpbmRleCwgbm90U2V0VmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhcyhpbmRleCkgPyB0aGlzLl9hcnJheVt3cmFwSW5kZXgodGhpcywgaW5kZXgpXSA6IG5vdFNldFZhbHVlO1xuICAgIH07XG5cbiAgICBBcnJheVNlcS5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHtcbiAgICAgIHZhciBhcnJheSA9IHRoaXMuX2FycmF5O1xuICAgICAgdmFyIG1heEluZGV4ID0gYXJyYXkubGVuZ3RoIC0gMTtcbiAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPD0gbWF4SW5kZXg7IGlpKyspIHtcbiAgICAgICAgaWYgKGZuKGFycmF5W3JldmVyc2UgPyBtYXhJbmRleCAtIGlpIDogaWldLCBpaSwgdGhpcykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuIGlpICsgMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGlpO1xuICAgIH07XG5cbiAgICBBcnJheVNlcS5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIHZhciBhcnJheSA9IHRoaXMuX2FycmF5O1xuICAgICAgdmFyIG1heEluZGV4ID0gYXJyYXkubGVuZ3RoIC0gMTtcbiAgICAgIHZhciBpaSA9IDA7XG4gICAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uKCkgXG4gICAgICAgIHtyZXR1cm4gaWkgPiBtYXhJbmRleCA/XG4gICAgICAgICAgaXRlcmF0b3JEb25lKCkgOlxuICAgICAgICAgIGl0ZXJhdG9yVmFsdWUodHlwZSwgaWksIGFycmF5W3JldmVyc2UgPyBtYXhJbmRleCAtIGlpKysgOiBpaSsrXSl9XG4gICAgICApO1xuICAgIH07XG5cblxuXG4gIGNyZWF0ZUNsYXNzKE9iamVjdFNlcSwgS2V5ZWRTZXEpO1xuICAgIGZ1bmN0aW9uIE9iamVjdFNlcShvYmplY3QpIHtcbiAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KTtcbiAgICAgIHRoaXMuX29iamVjdCA9IG9iamVjdDtcbiAgICAgIHRoaXMuX2tleXMgPSBrZXlzO1xuICAgICAgdGhpcy5zaXplID0ga2V5cy5sZW5ndGg7XG4gICAgfVxuXG4gICAgT2JqZWN0U2VxLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihrZXksIG5vdFNldFZhbHVlKSB7XG4gICAgICBpZiAobm90U2V0VmFsdWUgIT09IHVuZGVmaW5lZCAmJiAhdGhpcy5oYXMoa2V5KSkge1xuICAgICAgICByZXR1cm4gbm90U2V0VmFsdWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5fb2JqZWN0W2tleV07XG4gICAgfTtcblxuICAgIE9iamVjdFNlcS5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gdGhpcy5fb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSk7XG4gICAgfTtcblxuICAgIE9iamVjdFNlcS5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHtcbiAgICAgIHZhciBvYmplY3QgPSB0aGlzLl9vYmplY3Q7XG4gICAgICB2YXIga2V5cyA9IHRoaXMuX2tleXM7XG4gICAgICB2YXIgbWF4SW5kZXggPSBrZXlzLmxlbmd0aCAtIDE7XG4gICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDw9IG1heEluZGV4OyBpaSsrKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzW3JldmVyc2UgPyBtYXhJbmRleCAtIGlpIDogaWldO1xuICAgICAgICBpZiAoZm4ob2JqZWN0W2tleV0sIGtleSwgdGhpcykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuIGlpICsgMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGlpO1xuICAgIH07XG5cbiAgICBPYmplY3RTZXEucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICB2YXIgb2JqZWN0ID0gdGhpcy5fb2JqZWN0O1xuICAgICAgdmFyIGtleXMgPSB0aGlzLl9rZXlzO1xuICAgICAgdmFyIG1heEluZGV4ID0ga2V5cy5sZW5ndGggLSAxO1xuICAgICAgdmFyIGlpID0gMDtcbiAgICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuICAgICAgICB2YXIga2V5ID0ga2V5c1tyZXZlcnNlID8gbWF4SW5kZXggLSBpaSA6IGlpXTtcbiAgICAgICAgcmV0dXJuIGlpKysgPiBtYXhJbmRleCA/XG4gICAgICAgICAgaXRlcmF0b3JEb25lKCkgOlxuICAgICAgICAgIGl0ZXJhdG9yVmFsdWUodHlwZSwga2V5LCBvYmplY3Rba2V5XSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gIE9iamVjdFNlcS5wcm90b3R5cGVbSVNfT1JERVJFRF9TRU5USU5FTF0gPSB0cnVlO1xuXG5cbiAgY3JlYXRlQ2xhc3MoSXRlcmFibGVTZXEsIEluZGV4ZWRTZXEpO1xuICAgIGZ1bmN0aW9uIEl0ZXJhYmxlU2VxKGl0ZXJhYmxlKSB7XG4gICAgICB0aGlzLl9pdGVyYWJsZSA9IGl0ZXJhYmxlO1xuICAgICAgdGhpcy5zaXplID0gaXRlcmFibGUubGVuZ3RoIHx8IGl0ZXJhYmxlLnNpemU7XG4gICAgfVxuXG4gICAgSXRlcmFibGVTZXEucHJvdG90eXBlLl9faXRlcmF0ZVVuY2FjaGVkID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHtcbiAgICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlUmVzdWx0KCkuX19pdGVyYXRlKGZuLCByZXZlcnNlKTtcbiAgICAgIH1cbiAgICAgIHZhciBpdGVyYWJsZSA9IHRoaXMuX2l0ZXJhYmxlO1xuICAgICAgdmFyIGl0ZXJhdG9yID0gZ2V0SXRlcmF0b3IoaXRlcmFibGUpO1xuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgaWYgKGlzSXRlcmF0b3IoaXRlcmF0b3IpKSB7XG4gICAgICAgIHZhciBzdGVwO1xuICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgaWYgKGZuKHN0ZXAudmFsdWUsIGl0ZXJhdGlvbnMrKywgdGhpcykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBpdGVyYXRpb25zO1xuICAgIH07XG5cbiAgICBJdGVyYWJsZVNlcS5wcm90b3R5cGUuX19pdGVyYXRvclVuY2FjaGVkID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge1xuICAgICAgaWYgKHJldmVyc2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVSZXN1bHQoKS5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICAgICAgfVxuICAgICAgdmFyIGl0ZXJhYmxlID0gdGhpcy5faXRlcmFibGU7XG4gICAgICB2YXIgaXRlcmF0b3IgPSBnZXRJdGVyYXRvcihpdGVyYWJsZSk7XG4gICAgICBpZiAoIWlzSXRlcmF0b3IoaXRlcmF0b3IpKSB7XG4gICAgICAgIHJldHVybiBuZXcgSXRlcmF0b3IoaXRlcmF0b3JEb25lKTtcbiAgICAgIH1cbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuICAgICAgICB2YXIgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgcmV0dXJuIHN0ZXAuZG9uZSA/IHN0ZXAgOiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgc3RlcC52YWx1ZSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG5cblxuICBjcmVhdGVDbGFzcyhJdGVyYXRvclNlcSwgSW5kZXhlZFNlcSk7XG4gICAgZnVuY3Rpb24gSXRlcmF0b3JTZXEoaXRlcmF0b3IpIHtcbiAgICAgIHRoaXMuX2l0ZXJhdG9yID0gaXRlcmF0b3I7XG4gICAgICB0aGlzLl9pdGVyYXRvckNhY2hlID0gW107XG4gICAgfVxuXG4gICAgSXRlcmF0b3JTZXEucHJvdG90eXBlLl9faXRlcmF0ZVVuY2FjaGVkID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHtcbiAgICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlUmVzdWx0KCkuX19pdGVyYXRlKGZuLCByZXZlcnNlKTtcbiAgICAgIH1cbiAgICAgIHZhciBpdGVyYXRvciA9IHRoaXMuX2l0ZXJhdG9yO1xuICAgICAgdmFyIGNhY2hlID0gdGhpcy5faXRlcmF0b3JDYWNoZTtcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHdoaWxlIChpdGVyYXRpb25zIDwgY2FjaGUubGVuZ3RoKSB7XG4gICAgICAgIGlmIChmbihjYWNoZVtpdGVyYXRpb25zXSwgaXRlcmF0aW9ucysrLCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFyIHN0ZXA7XG4gICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgIHZhciB2YWwgPSBzdGVwLnZhbHVlO1xuICAgICAgICBjYWNoZVtpdGVyYXRpb25zXSA9IHZhbDtcbiAgICAgICAgaWYgKGZuKHZhbCwgaXRlcmF0aW9ucysrLCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gICAgfTtcblxuICAgIEl0ZXJhdG9yU2VxLnByb3RvdHlwZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgICB9XG4gICAgICB2YXIgaXRlcmF0b3IgPSB0aGlzLl9pdGVyYXRvcjtcbiAgICAgIHZhciBjYWNoZSA9IHRoaXMuX2l0ZXJhdG9yQ2FjaGU7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgaWYgKGl0ZXJhdGlvbnMgPj0gY2FjaGUubGVuZ3RoKSB7XG4gICAgICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgaWYgKHN0ZXAuZG9uZSkge1xuICAgICAgICAgICAgcmV0dXJuIHN0ZXA7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhY2hlW2l0ZXJhdGlvbnNdID0gc3RlcC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZSh0eXBlLCBpdGVyYXRpb25zLCBjYWNoZVtpdGVyYXRpb25zKytdKTtcbiAgICAgIH0pO1xuICAgIH07XG5cblxuXG5cbiAgLy8gIyBwcmFnbWEgSGVscGVyIGZ1bmN0aW9uc1xuXG4gIGZ1bmN0aW9uIGlzU2VxKG1heWJlU2VxKSB7XG4gICAgcmV0dXJuICEhKG1heWJlU2VxICYmIG1heWJlU2VxW0lTX1NFUV9TRU5USU5FTF0pO1xuICB9XG5cbiAgdmFyIEVNUFRZX1NFUTtcblxuICBmdW5jdGlvbiBlbXB0eVNlcXVlbmNlKCkge1xuICAgIHJldHVybiBFTVBUWV9TRVEgfHwgKEVNUFRZX1NFUSA9IG5ldyBBcnJheVNlcShbXSkpO1xuICB9XG5cbiAgZnVuY3Rpb24ga2V5ZWRTZXFGcm9tVmFsdWUodmFsdWUpIHtcbiAgICB2YXIgc2VxID1cbiAgICAgIEFycmF5LmlzQXJyYXkodmFsdWUpID8gbmV3IEFycmF5U2VxKHZhbHVlKS5mcm9tRW50cnlTZXEoKSA6XG4gICAgICBpc0l0ZXJhdG9yKHZhbHVlKSA/IG5ldyBJdGVyYXRvclNlcSh2YWx1ZSkuZnJvbUVudHJ5U2VxKCkgOlxuICAgICAgaGFzSXRlcmF0b3IodmFsdWUpID8gbmV3IEl0ZXJhYmxlU2VxKHZhbHVlKS5mcm9tRW50cnlTZXEoKSA6XG4gICAgICB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnID8gbmV3IE9iamVjdFNlcSh2YWx1ZSkgOlxuICAgICAgdW5kZWZpbmVkO1xuICAgIGlmICghc2VxKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAnRXhwZWN0ZWQgQXJyYXkgb3IgaXRlcmFibGUgb2JqZWN0IG9mIFtrLCB2XSBlbnRyaWVzLCAnK1xuICAgICAgICAnb3Iga2V5ZWQgb2JqZWN0OiAnICsgdmFsdWVcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBzZXE7XG4gIH1cblxuICBmdW5jdGlvbiBpbmRleGVkU2VxRnJvbVZhbHVlKHZhbHVlKSB7XG4gICAgdmFyIHNlcSA9IG1heWJlSW5kZXhlZFNlcUZyb21WYWx1ZSh2YWx1ZSk7XG4gICAgaWYgKCFzZXEpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICdFeHBlY3RlZCBBcnJheSBvciBpdGVyYWJsZSBvYmplY3Qgb2YgdmFsdWVzOiAnICsgdmFsdWVcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBzZXE7XG4gIH1cblxuICBmdW5jdGlvbiBzZXFGcm9tVmFsdWUodmFsdWUpIHtcbiAgICB2YXIgc2VxID0gbWF5YmVJbmRleGVkU2VxRnJvbVZhbHVlKHZhbHVlKSB8fFxuICAgICAgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgbmV3IE9iamVjdFNlcSh2YWx1ZSkpO1xuICAgIGlmICghc2VxKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAnRXhwZWN0ZWQgQXJyYXkgb3IgaXRlcmFibGUgb2JqZWN0IG9mIHZhbHVlcywgb3Iga2V5ZWQgb2JqZWN0OiAnICsgdmFsdWVcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBzZXE7XG4gIH1cblxuICBmdW5jdGlvbiBtYXliZUluZGV4ZWRTZXFGcm9tVmFsdWUodmFsdWUpIHtcbiAgICByZXR1cm4gKFxuICAgICAgaXNBcnJheUxpa2UodmFsdWUpID8gbmV3IEFycmF5U2VxKHZhbHVlKSA6XG4gICAgICBpc0l0ZXJhdG9yKHZhbHVlKSA/IG5ldyBJdGVyYXRvclNlcSh2YWx1ZSkgOlxuICAgICAgaGFzSXRlcmF0b3IodmFsdWUpID8gbmV3IEl0ZXJhYmxlU2VxKHZhbHVlKSA6XG4gICAgICB1bmRlZmluZWRcbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gc2VxSXRlcmF0ZShzZXEsIGZuLCByZXZlcnNlLCB1c2VLZXlzKSB7XG4gICAgdmFyIGNhY2hlID0gc2VxLl9jYWNoZTtcbiAgICBpZiAoY2FjaGUpIHtcbiAgICAgIHZhciBtYXhJbmRleCA9IGNhY2hlLmxlbmd0aCAtIDE7XG4gICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDw9IG1heEluZGV4OyBpaSsrKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IGNhY2hlW3JldmVyc2UgPyBtYXhJbmRleCAtIGlpIDogaWldO1xuICAgICAgICBpZiAoZm4oZW50cnlbMV0sIHVzZUtleXMgPyBlbnRyeVswXSA6IGlpLCBzZXEpID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybiBpaSArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBpaTtcbiAgICB9XG4gICAgcmV0dXJuIHNlcS5fX2l0ZXJhdGVVbmNhY2hlZChmbiwgcmV2ZXJzZSk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXFJdGVyYXRvcihzZXEsIHR5cGUsIHJldmVyc2UsIHVzZUtleXMpIHtcbiAgICB2YXIgY2FjaGUgPSBzZXEuX2NhY2hlO1xuICAgIGlmIChjYWNoZSkge1xuICAgICAgdmFyIG1heEluZGV4ID0gY2FjaGUubGVuZ3RoIC0gMTtcbiAgICAgIHZhciBpaSA9IDA7XG4gICAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gY2FjaGVbcmV2ZXJzZSA/IG1heEluZGV4IC0gaWkgOiBpaV07XG4gICAgICAgIHJldHVybiBpaSsrID4gbWF4SW5kZXggP1xuICAgICAgICAgIGl0ZXJhdG9yRG9uZSgpIDpcbiAgICAgICAgICBpdGVyYXRvclZhbHVlKHR5cGUsIHVzZUtleXMgPyBlbnRyeVswXSA6IGlpIC0gMSwgZW50cnlbMV0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBzZXEuX19pdGVyYXRvclVuY2FjaGVkKHR5cGUsIHJldmVyc2UpO1xuICB9XG5cbiAgZnVuY3Rpb24gZnJvbUpTKGpzb24sIGNvbnZlcnRlcikge1xuICAgIHJldHVybiBjb252ZXJ0ZXIgP1xuICAgICAgZnJvbUpTV2l0aChjb252ZXJ0ZXIsIGpzb24sICcnLCB7Jyc6IGpzb259KSA6XG4gICAgICBmcm9tSlNEZWZhdWx0KGpzb24pO1xuICB9XG5cbiAgZnVuY3Rpb24gZnJvbUpTV2l0aChjb252ZXJ0ZXIsIGpzb24sIGtleSwgcGFyZW50SlNPTikge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGpzb24pKSB7XG4gICAgICByZXR1cm4gY29udmVydGVyLmNhbGwocGFyZW50SlNPTiwga2V5LCBJbmRleGVkU2VxKGpzb24pLm1hcChmdW5jdGlvbih2LCBrKSAge3JldHVybiBmcm9tSlNXaXRoKGNvbnZlcnRlciwgdiwgaywganNvbil9KSk7XG4gICAgfVxuICAgIGlmIChpc1BsYWluT2JqKGpzb24pKSB7XG4gICAgICByZXR1cm4gY29udmVydGVyLmNhbGwocGFyZW50SlNPTiwga2V5LCBLZXllZFNlcShqc29uKS5tYXAoZnVuY3Rpb24odiwgaykgIHtyZXR1cm4gZnJvbUpTV2l0aChjb252ZXJ0ZXIsIHYsIGssIGpzb24pfSkpO1xuICAgIH1cbiAgICByZXR1cm4ganNvbjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZyb21KU0RlZmF1bHQoanNvbikge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGpzb24pKSB7XG4gICAgICByZXR1cm4gSW5kZXhlZFNlcShqc29uKS5tYXAoZnJvbUpTRGVmYXVsdCkudG9MaXN0KCk7XG4gICAgfVxuICAgIGlmIChpc1BsYWluT2JqKGpzb24pKSB7XG4gICAgICByZXR1cm4gS2V5ZWRTZXEoanNvbikubWFwKGZyb21KU0RlZmF1bHQpLnRvTWFwKCk7XG4gICAgfVxuICAgIHJldHVybiBqc29uO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNQbGFpbk9iaih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAmJiAodmFsdWUuY29uc3RydWN0b3IgPT09IE9iamVjdCB8fCB2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gdW5kZWZpbmVkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBleHRlbnNpb24gb2YgdGhlIFwic2FtZS12YWx1ZVwiIGFsZ29yaXRobSBhcyBbZGVzY3JpYmVkIGZvciB1c2UgYnkgRVM2IE1hcFxuICAgKiBhbmQgU2V0XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9NYXAjS2V5X2VxdWFsaXR5KVxuICAgKlxuICAgKiBOYU4gaXMgY29uc2lkZXJlZCB0aGUgc2FtZSBhcyBOYU4sIGhvd2V2ZXIgLTAgYW5kIDAgYXJlIGNvbnNpZGVyZWQgdGhlIHNhbWVcbiAgICogdmFsdWUsIHdoaWNoIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBhbGdvcml0aG0gZGVzY3JpYmVkIGJ5XG4gICAqIFtgT2JqZWN0LmlzYF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2lzKS5cbiAgICpcbiAgICogVGhpcyBpcyBleHRlbmRlZCBmdXJ0aGVyIHRvIGFsbG93IE9iamVjdHMgdG8gZGVzY3JpYmUgdGhlIHZhbHVlcyB0aGV5XG4gICAqIHJlcHJlc2VudCwgYnkgd2F5IG9mIGB2YWx1ZU9mYCBvciBgZXF1YWxzYCAoYW5kIGBoYXNoQ29kZWApLlxuICAgKlxuICAgKiBOb3RlOiBiZWNhdXNlIG9mIHRoaXMgZXh0ZW5zaW9uLCB0aGUga2V5IGVxdWFsaXR5IG9mIEltbXV0YWJsZS5NYXAgYW5kIHRoZVxuICAgKiB2YWx1ZSBlcXVhbGl0eSBvZiBJbW11dGFibGUuU2V0IHdpbGwgZGlmZmVyIGZyb20gRVM2IE1hcCBhbmQgU2V0LlxuICAgKlxuICAgKiAjIyMgRGVmaW5pbmcgY3VzdG9tIHZhbHVlc1xuICAgKlxuICAgKiBUaGUgZWFzaWVzdCB3YXkgdG8gZGVzY3JpYmUgdGhlIHZhbHVlIGFuIG9iamVjdCByZXByZXNlbnRzIGlzIGJ5IGltcGxlbWVudGluZ1xuICAgKiBgdmFsdWVPZmAuIEZvciBleGFtcGxlLCBgRGF0ZWAgcmVwcmVzZW50cyBhIHZhbHVlIGJ5IHJldHVybmluZyBhIHVuaXhcbiAgICogdGltZXN0YW1wIGZvciBgdmFsdWVPZmA6XG4gICAqXG4gICAqICAgICB2YXIgZGF0ZTEgPSBuZXcgRGF0ZSgxMjM0NTY3ODkwMDAwKTsgLy8gRnJpIEZlYiAxMyAyMDA5IC4uLlxuICAgKiAgICAgdmFyIGRhdGUyID0gbmV3IERhdGUoMTIzNDU2Nzg5MDAwMCk7XG4gICAqICAgICBkYXRlMS52YWx1ZU9mKCk7IC8vIDEyMzQ1Njc4OTAwMDBcbiAgICogICAgIGFzc2VydCggZGF0ZTEgIT09IGRhdGUyICk7XG4gICAqICAgICBhc3NlcnQoIEltbXV0YWJsZS5pcyggZGF0ZTEsIGRhdGUyICkgKTtcbiAgICpcbiAgICogTm90ZTogb3ZlcnJpZGluZyBgdmFsdWVPZmAgbWF5IGhhdmUgb3RoZXIgaW1wbGljYXRpb25zIGlmIHlvdSB1c2UgdGhpcyBvYmplY3RcbiAgICogd2hlcmUgSmF2YVNjcmlwdCBleHBlY3RzIGEgcHJpbWl0aXZlLCBzdWNoIGFzIGltcGxpY2l0IHN0cmluZyBjb2VyY2lvbi5cbiAgICpcbiAgICogRm9yIG1vcmUgY29tcGxleCB0eXBlcywgZXNwZWNpYWxseSBjb2xsZWN0aW9ucywgaW1wbGVtZW50aW5nIGB2YWx1ZU9mYCBtYXlcbiAgICogbm90IGJlIHBlcmZvcm1hbnQuIEFuIGFsdGVybmF0aXZlIGlzIHRvIGltcGxlbWVudCBgZXF1YWxzYCBhbmQgYGhhc2hDb2RlYC5cbiAgICpcbiAgICogYGVxdWFsc2AgdGFrZXMgYW5vdGhlciBvYmplY3QsIHByZXN1bWFibHkgb2Ygc2ltaWxhciB0eXBlLCBhbmQgcmV0dXJucyB0cnVlXG4gICAqIGlmIHRoZSBpdCBpcyBlcXVhbC4gRXF1YWxpdHkgaXMgc3ltbWV0cmljYWwsIHNvIHRoZSBzYW1lIHJlc3VsdCBzaG91bGQgYmVcbiAgICogcmV0dXJuZWQgaWYgdGhpcyBhbmQgdGhlIGFyZ3VtZW50IGFyZSBmbGlwcGVkLlxuICAgKlxuICAgKiAgICAgYXNzZXJ0KCBhLmVxdWFscyhiKSA9PT0gYi5lcXVhbHMoYSkgKTtcbiAgICpcbiAgICogYGhhc2hDb2RlYCByZXR1cm5zIGEgMzJiaXQgaW50ZWdlciBudW1iZXIgcmVwcmVzZW50aW5nIHRoZSBvYmplY3Qgd2hpY2ggd2lsbFxuICAgKiBiZSB1c2VkIHRvIGRldGVybWluZSBob3cgdG8gc3RvcmUgdGhlIHZhbHVlIG9iamVjdCBpbiBhIE1hcCBvciBTZXQuIFlvdSBtdXN0XG4gICAqIHByb3ZpZGUgYm90aCBvciBuZWl0aGVyIG1ldGhvZHMsIG9uZSBtdXN0IG5vdCBleGlzdCB3aXRob3V0IHRoZSBvdGhlci5cbiAgICpcbiAgICogQWxzbywgYW4gaW1wb3J0YW50IHJlbGF0aW9uc2hpcCBiZXR3ZWVuIHRoZXNlIG1ldGhvZHMgbXVzdCBiZSB1cGhlbGQ6IGlmIHR3b1xuICAgKiB2YWx1ZXMgYXJlIGVxdWFsLCB0aGV5ICptdXN0KiByZXR1cm4gdGhlIHNhbWUgaGFzaENvZGUuIElmIHRoZSB2YWx1ZXMgYXJlIG5vdFxuICAgKiBlcXVhbCwgdGhleSBtaWdodCBoYXZlIHRoZSBzYW1lIGhhc2hDb2RlOyB0aGlzIGlzIGNhbGxlZCBhIGhhc2ggY29sbGlzaW9uLFxuICAgKiBhbmQgd2hpbGUgdW5kZXNpcmFibGUgZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMsIGl0IGlzIGFjY2VwdGFibGUuXG4gICAqXG4gICAqICAgICBpZiAoYS5lcXVhbHMoYikpIHtcbiAgICogICAgICAgYXNzZXJ0KCBhLmhhc2hDb2RlKCkgPT09IGIuaGFzaENvZGUoKSApO1xuICAgKiAgICAgfVxuICAgKlxuICAgKiBBbGwgSW1tdXRhYmxlIGNvbGxlY3Rpb25zIGltcGxlbWVudCBgZXF1YWxzYCBhbmQgYGhhc2hDb2RlYC5cbiAgICpcbiAgICovXG4gIGZ1bmN0aW9uIGlzKHZhbHVlQSwgdmFsdWVCKSB7XG4gICAgaWYgKHZhbHVlQSA9PT0gdmFsdWVCIHx8ICh2YWx1ZUEgIT09IHZhbHVlQSAmJiB2YWx1ZUIgIT09IHZhbHVlQikpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoIXZhbHVlQSB8fCAhdmFsdWVCKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdmFsdWVBLnZhbHVlT2YgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgdHlwZW9mIHZhbHVlQi52YWx1ZU9mID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YWx1ZUEgPSB2YWx1ZUEudmFsdWVPZigpO1xuICAgICAgdmFsdWVCID0gdmFsdWVCLnZhbHVlT2YoKTtcbiAgICAgIGlmICh2YWx1ZUEgPT09IHZhbHVlQiB8fCAodmFsdWVBICE9PSB2YWx1ZUEgJiYgdmFsdWVCICE9PSB2YWx1ZUIpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKCF2YWx1ZUEgfHwgIXZhbHVlQikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdmFsdWVBLmVxdWFscyA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgICB0eXBlb2YgdmFsdWVCLmVxdWFscyA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgICB2YWx1ZUEuZXF1YWxzKHZhbHVlQikpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBkZWVwRXF1YWwoYSwgYikge1xuICAgIGlmIChhID09PSBiKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICAhaXNJdGVyYWJsZShiKSB8fFxuICAgICAgYS5zaXplICE9PSB1bmRlZmluZWQgJiYgYi5zaXplICE9PSB1bmRlZmluZWQgJiYgYS5zaXplICE9PSBiLnNpemUgfHxcbiAgICAgIGEuX19oYXNoICE9PSB1bmRlZmluZWQgJiYgYi5fX2hhc2ggIT09IHVuZGVmaW5lZCAmJiBhLl9faGFzaCAhPT0gYi5fX2hhc2ggfHxcbiAgICAgIGlzS2V5ZWQoYSkgIT09IGlzS2V5ZWQoYikgfHxcbiAgICAgIGlzSW5kZXhlZChhKSAhPT0gaXNJbmRleGVkKGIpIHx8XG4gICAgICBpc09yZGVyZWQoYSkgIT09IGlzT3JkZXJlZChiKVxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChhLnNpemUgPT09IDAgJiYgYi5zaXplID09PSAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YXIgbm90QXNzb2NpYXRpdmUgPSAhaXNBc3NvY2lhdGl2ZShhKTtcblxuICAgIGlmIChpc09yZGVyZWQoYSkpIHtcbiAgICAgIHZhciBlbnRyaWVzID0gYS5lbnRyaWVzKCk7XG4gICAgICByZXR1cm4gYi5ldmVyeShmdW5jdGlvbih2LCBrKSAge1xuICAgICAgICB2YXIgZW50cnkgPSBlbnRyaWVzLm5leHQoKS52YWx1ZTtcbiAgICAgICAgcmV0dXJuIGVudHJ5ICYmIGlzKGVudHJ5WzFdLCB2KSAmJiAobm90QXNzb2NpYXRpdmUgfHwgaXMoZW50cnlbMF0sIGspKTtcbiAgICAgIH0pICYmIGVudHJpZXMubmV4dCgpLmRvbmU7XG4gICAgfVxuXG4gICAgdmFyIGZsaXBwZWQgPSBmYWxzZTtcblxuICAgIGlmIChhLnNpemUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKGIuc2l6ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYS5jYWNoZVJlc3VsdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGEuY2FjaGVSZXN1bHQoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmxpcHBlZCA9IHRydWU7XG4gICAgICAgIHZhciBfID0gYTtcbiAgICAgICAgYSA9IGI7XG4gICAgICAgIGIgPSBfO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBhbGxFcXVhbCA9IHRydWU7XG4gICAgdmFyIGJTaXplID0gYi5fX2l0ZXJhdGUoZnVuY3Rpb24odiwgaykgIHtcbiAgICAgIGlmIChub3RBc3NvY2lhdGl2ZSA/ICFhLmhhcyh2KSA6XG4gICAgICAgICAgZmxpcHBlZCA/ICFpcyh2LCBhLmdldChrLCBOT1RfU0VUKSkgOiAhaXMoYS5nZXQoaywgTk9UX1NFVCksIHYpKSB7XG4gICAgICAgIGFsbEVxdWFsID0gZmFsc2U7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBhbGxFcXVhbCAmJiBhLnNpemUgPT09IGJTaXplO1xuICB9XG5cbiAgY3JlYXRlQ2xhc3MoUmVwZWF0LCBJbmRleGVkU2VxKTtcblxuICAgIGZ1bmN0aW9uIFJlcGVhdCh2YWx1ZSwgdGltZXMpIHtcbiAgICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBSZXBlYXQpKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVwZWF0KHZhbHVlLCB0aW1lcyk7XG4gICAgICB9XG4gICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5zaXplID0gdGltZXMgPT09IHVuZGVmaW5lZCA/IEluZmluaXR5IDogTWF0aC5tYXgoMCwgdGltZXMpO1xuICAgICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCkge1xuICAgICAgICBpZiAoRU1QVFlfUkVQRUFUKSB7XG4gICAgICAgICAgcmV0dXJuIEVNUFRZX1JFUEVBVDtcbiAgICAgICAgfVxuICAgICAgICBFTVBUWV9SRVBFQVQgPSB0aGlzO1xuICAgICAgfVxuICAgIH1cblxuICAgIFJlcGVhdC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnNpemUgPT09IDApIHtcbiAgICAgICAgcmV0dXJuICdSZXBlYXQgW10nO1xuICAgICAgfVxuICAgICAgcmV0dXJuICdSZXBlYXQgWyAnICsgdGhpcy5fdmFsdWUgKyAnICcgKyB0aGlzLnNpemUgKyAnIHRpbWVzIF0nO1xuICAgIH07XG5cbiAgICBSZXBlYXQucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGluZGV4LCBub3RTZXRWYWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuaGFzKGluZGV4KSA/IHRoaXMuX3ZhbHVlIDogbm90U2V0VmFsdWU7XG4gICAgfTtcblxuICAgIFJlcGVhdC5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbihzZWFyY2hWYWx1ZSkge1xuICAgICAgcmV0dXJuIGlzKHRoaXMuX3ZhbHVlLCBzZWFyY2hWYWx1ZSk7XG4gICAgfTtcblxuICAgIFJlcGVhdC5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbihiZWdpbiwgZW5kKSB7XG4gICAgICB2YXIgc2l6ZSA9IHRoaXMuc2l6ZTtcbiAgICAgIHJldHVybiB3aG9sZVNsaWNlKGJlZ2luLCBlbmQsIHNpemUpID8gdGhpcyA6XG4gICAgICAgIG5ldyBSZXBlYXQodGhpcy5fdmFsdWUsIHJlc29sdmVFbmQoZW5kLCBzaXplKSAtIHJlc29sdmVCZWdpbihiZWdpbiwgc2l6ZSkpO1xuICAgIH07XG5cbiAgICBSZXBlYXQucHJvdG90eXBlLnJldmVyc2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBSZXBlYXQucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbihzZWFyY2hWYWx1ZSkge1xuICAgICAgaWYgKGlzKHRoaXMuX3ZhbHVlLCBzZWFyY2hWYWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgICByZXR1cm4gLTE7XG4gICAgfTtcblxuICAgIFJlcGVhdC5wcm90b3R5cGUubGFzdEluZGV4T2YgPSBmdW5jdGlvbihzZWFyY2hWYWx1ZSkge1xuICAgICAgaWYgKGlzKHRoaXMuX3ZhbHVlLCBzZWFyY2hWYWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2l6ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAtMTtcbiAgICB9O1xuXG4gICAgUmVwZWF0LnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge1xuICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IHRoaXMuc2l6ZTsgaWkrKykge1xuICAgICAgICBpZiAoZm4odGhpcy5fdmFsdWUsIGlpLCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm4gaWkgKyAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gaWk7XG4gICAgfTtcblxuICAgIFJlcGVhdC5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIHZhciBpaSA9IDA7XG4gICAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uKCkgXG4gICAgICAgIHtyZXR1cm4gaWkgPCB0aGlzJDAuc2l6ZSA/IGl0ZXJhdG9yVmFsdWUodHlwZSwgaWkrKywgdGhpcyQwLl92YWx1ZSkgOiBpdGVyYXRvckRvbmUoKX1cbiAgICAgICk7XG4gICAgfTtcblxuICAgIFJlcGVhdC5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24ob3RoZXIpIHtcbiAgICAgIHJldHVybiBvdGhlciBpbnN0YW5jZW9mIFJlcGVhdCA/XG4gICAgICAgIGlzKHRoaXMuX3ZhbHVlLCBvdGhlci5fdmFsdWUpIDpcbiAgICAgICAgZGVlcEVxdWFsKG90aGVyKTtcbiAgICB9O1xuXG5cbiAgdmFyIEVNUFRZX1JFUEVBVDtcblxuICBmdW5jdGlvbiBpbnZhcmlhbnQoY29uZGl0aW9uLCBlcnJvcikge1xuICAgIGlmICghY29uZGl0aW9uKSB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICB9XG5cbiAgY3JlYXRlQ2xhc3MoUmFuZ2UsIEluZGV4ZWRTZXEpO1xuXG4gICAgZnVuY3Rpb24gUmFuZ2Uoc3RhcnQsIGVuZCwgc3RlcCkge1xuICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFJhbmdlKSkge1xuICAgICAgICByZXR1cm4gbmV3IFJhbmdlKHN0YXJ0LCBlbmQsIHN0ZXApO1xuICAgICAgfVxuICAgICAgaW52YXJpYW50KHN0ZXAgIT09IDAsICdDYW5ub3Qgc3RlcCBhIFJhbmdlIGJ5IDAnKTtcbiAgICAgIHN0YXJ0ID0gc3RhcnQgfHwgMDtcbiAgICAgIGlmIChlbmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBlbmQgPSBJbmZpbml0eTtcbiAgICAgIH1cbiAgICAgIHN0ZXAgPSBzdGVwID09PSB1bmRlZmluZWQgPyAxIDogTWF0aC5hYnMoc3RlcCk7XG4gICAgICBpZiAoZW5kIDwgc3RhcnQpIHtcbiAgICAgICAgc3RlcCA9IC1zdGVwO1xuICAgICAgfVxuICAgICAgdGhpcy5fc3RhcnQgPSBzdGFydDtcbiAgICAgIHRoaXMuX2VuZCA9IGVuZDtcbiAgICAgIHRoaXMuX3N0ZXAgPSBzdGVwO1xuICAgICAgdGhpcy5zaXplID0gTWF0aC5tYXgoMCwgTWF0aC5jZWlsKChlbmQgLSBzdGFydCkgLyBzdGVwIC0gMSkgKyAxKTtcbiAgICAgIGlmICh0aGlzLnNpemUgPT09IDApIHtcbiAgICAgICAgaWYgKEVNUFRZX1JBTkdFKSB7XG4gICAgICAgICAgcmV0dXJuIEVNUFRZX1JBTkdFO1xuICAgICAgICB9XG4gICAgICAgIEVNUFRZX1JBTkdFID0gdGhpcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBSYW5nZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnNpemUgPT09IDApIHtcbiAgICAgICAgcmV0dXJuICdSYW5nZSBbXSc7XG4gICAgICB9XG4gICAgICByZXR1cm4gJ1JhbmdlIFsgJyArXG4gICAgICAgIHRoaXMuX3N0YXJ0ICsgJy4uLicgKyB0aGlzLl9lbmQgK1xuICAgICAgICAodGhpcy5fc3RlcCAhPT0gMSA/ICcgYnkgJyArIHRoaXMuX3N0ZXAgOiAnJykgK1xuICAgICAgJyBdJztcbiAgICB9O1xuXG4gICAgUmFuZ2UucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGluZGV4LCBub3RTZXRWYWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuaGFzKGluZGV4KSA/XG4gICAgICAgIHRoaXMuX3N0YXJ0ICsgd3JhcEluZGV4KHRoaXMsIGluZGV4KSAqIHRoaXMuX3N0ZXAgOlxuICAgICAgICBub3RTZXRWYWx1ZTtcbiAgICB9O1xuXG4gICAgUmFuZ2UucHJvdG90eXBlLmluY2x1ZGVzID0gZnVuY3Rpb24oc2VhcmNoVmFsdWUpIHtcbiAgICAgIHZhciBwb3NzaWJsZUluZGV4ID0gKHNlYXJjaFZhbHVlIC0gdGhpcy5fc3RhcnQpIC8gdGhpcy5fc3RlcDtcbiAgICAgIHJldHVybiBwb3NzaWJsZUluZGV4ID49IDAgJiZcbiAgICAgICAgcG9zc2libGVJbmRleCA8IHRoaXMuc2l6ZSAmJlxuICAgICAgICBwb3NzaWJsZUluZGV4ID09PSBNYXRoLmZsb29yKHBvc3NpYmxlSW5kZXgpO1xuICAgIH07XG5cbiAgICBSYW5nZS5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbihiZWdpbiwgZW5kKSB7XG4gICAgICBpZiAod2hvbGVTbGljZShiZWdpbiwgZW5kLCB0aGlzLnNpemUpKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgYmVnaW4gPSByZXNvbHZlQmVnaW4oYmVnaW4sIHRoaXMuc2l6ZSk7XG4gICAgICBlbmQgPSByZXNvbHZlRW5kKGVuZCwgdGhpcy5zaXplKTtcbiAgICAgIGlmIChlbmQgPD0gYmVnaW4pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSYW5nZSgwLCAwKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgUmFuZ2UodGhpcy5nZXQoYmVnaW4sIHRoaXMuX2VuZCksIHRoaXMuZ2V0KGVuZCwgdGhpcy5fZW5kKSwgdGhpcy5fc3RlcCk7XG4gICAgfTtcblxuICAgIFJhbmdlLnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24oc2VhcmNoVmFsdWUpIHtcbiAgICAgIHZhciBvZmZzZXRWYWx1ZSA9IHNlYXJjaFZhbHVlIC0gdGhpcy5fc3RhcnQ7XG4gICAgICBpZiAob2Zmc2V0VmFsdWUgJSB0aGlzLl9zdGVwID09PSAwKSB7XG4gICAgICAgIHZhciBpbmRleCA9IG9mZnNldFZhbHVlIC8gdGhpcy5fc3RlcDtcbiAgICAgICAgaWYgKGluZGV4ID49IDAgJiYgaW5kZXggPCB0aGlzLnNpemUpIHtcbiAgICAgICAgICByZXR1cm4gaW5kZXhcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG5cbiAgICBSYW5nZS5wcm90b3R5cGUubGFzdEluZGV4T2YgPSBmdW5jdGlvbihzZWFyY2hWYWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5kZXhPZihzZWFyY2hWYWx1ZSk7XG4gICAgfTtcblxuICAgIFJhbmdlLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge1xuICAgICAgdmFyIG1heEluZGV4ID0gdGhpcy5zaXplIC0gMTtcbiAgICAgIHZhciBzdGVwID0gdGhpcy5fc3RlcDtcbiAgICAgIHZhciB2YWx1ZSA9IHJldmVyc2UgPyB0aGlzLl9zdGFydCArIG1heEluZGV4ICogc3RlcCA6IHRoaXMuX3N0YXJ0O1xuICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8PSBtYXhJbmRleDsgaWkrKykge1xuICAgICAgICBpZiAoZm4odmFsdWUsIGlpLCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm4gaWkgKyAxO1xuICAgICAgICB9XG4gICAgICAgIHZhbHVlICs9IHJldmVyc2UgPyAtc3RlcCA6IHN0ZXA7XG4gICAgICB9XG4gICAgICByZXR1cm4gaWk7XG4gICAgfTtcblxuICAgIFJhbmdlLnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge1xuICAgICAgdmFyIG1heEluZGV4ID0gdGhpcy5zaXplIC0gMTtcbiAgICAgIHZhciBzdGVwID0gdGhpcy5fc3RlcDtcbiAgICAgIHZhciB2YWx1ZSA9IHJldmVyc2UgPyB0aGlzLl9zdGFydCArIG1heEluZGV4ICogc3RlcCA6IHRoaXMuX3N0YXJ0O1xuICAgICAgdmFyIGlpID0gMDtcbiAgICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuICAgICAgICB2YXIgdiA9IHZhbHVlO1xuICAgICAgICB2YWx1ZSArPSByZXZlcnNlID8gLXN0ZXAgOiBzdGVwO1xuICAgICAgICByZXR1cm4gaWkgPiBtYXhJbmRleCA/IGl0ZXJhdG9yRG9uZSgpIDogaXRlcmF0b3JWYWx1ZSh0eXBlLCBpaSsrLCB2KTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBSYW5nZS5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24ob3RoZXIpIHtcbiAgICAgIHJldHVybiBvdGhlciBpbnN0YW5jZW9mIFJhbmdlID9cbiAgICAgICAgdGhpcy5fc3RhcnQgPT09IG90aGVyLl9zdGFydCAmJlxuICAgICAgICB0aGlzLl9lbmQgPT09IG90aGVyLl9lbmQgJiZcbiAgICAgICAgdGhpcy5fc3RlcCA9PT0gb3RoZXIuX3N0ZXAgOlxuICAgICAgICBkZWVwRXF1YWwodGhpcywgb3RoZXIpO1xuICAgIH07XG5cblxuICB2YXIgRU1QVFlfUkFOR0U7XG5cbiAgY3JlYXRlQ2xhc3MoQ29sbGVjdGlvbiwgSXRlcmFibGUpO1xuICAgIGZ1bmN0aW9uIENvbGxlY3Rpb24oKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ0Fic3RyYWN0Jyk7XG4gICAgfVxuXG5cbiAgY3JlYXRlQ2xhc3MoS2V5ZWRDb2xsZWN0aW9uLCBDb2xsZWN0aW9uKTtmdW5jdGlvbiBLZXllZENvbGxlY3Rpb24oKSB7fVxuXG4gIGNyZWF0ZUNsYXNzKEluZGV4ZWRDb2xsZWN0aW9uLCBDb2xsZWN0aW9uKTtmdW5jdGlvbiBJbmRleGVkQ29sbGVjdGlvbigpIHt9XG5cbiAgY3JlYXRlQ2xhc3MoU2V0Q29sbGVjdGlvbiwgQ29sbGVjdGlvbik7ZnVuY3Rpb24gU2V0Q29sbGVjdGlvbigpIHt9XG5cblxuICBDb2xsZWN0aW9uLktleWVkID0gS2V5ZWRDb2xsZWN0aW9uO1xuICBDb2xsZWN0aW9uLkluZGV4ZWQgPSBJbmRleGVkQ29sbGVjdGlvbjtcbiAgQ29sbGVjdGlvbi5TZXQgPSBTZXRDb2xsZWN0aW9uO1xuXG4gIHZhciBpbXVsID1cbiAgICB0eXBlb2YgTWF0aC5pbXVsID09PSAnZnVuY3Rpb24nICYmIE1hdGguaW11bCgweGZmZmZmZmZmLCAyKSA9PT0gLTIgP1xuICAgIE1hdGguaW11bCA6XG4gICAgZnVuY3Rpb24gaW11bChhLCBiKSB7XG4gICAgICBhID0gYSB8IDA7IC8vIGludFxuICAgICAgYiA9IGIgfCAwOyAvLyBpbnRcbiAgICAgIHZhciBjID0gYSAmIDB4ZmZmZjtcbiAgICAgIHZhciBkID0gYiAmIDB4ZmZmZjtcbiAgICAgIC8vIFNoaWZ0IGJ5IDAgZml4ZXMgdGhlIHNpZ24gb24gdGhlIGhpZ2ggcGFydC5cbiAgICAgIHJldHVybiAoYyAqIGQpICsgKCgoKGEgPj4+IDE2KSAqIGQgKyBjICogKGIgPj4+IDE2KSkgPDwgMTYpID4+PiAwKSB8IDA7IC8vIGludFxuICAgIH07XG5cbiAgLy8gdjggaGFzIGFuIG9wdGltaXphdGlvbiBmb3Igc3RvcmluZyAzMS1iaXQgc2lnbmVkIG51bWJlcnMuXG4gIC8vIFZhbHVlcyB3aGljaCBoYXZlIGVpdGhlciAwMCBvciAxMSBhcyB0aGUgaGlnaCBvcmRlciBiaXRzIHF1YWxpZnkuXG4gIC8vIFRoaXMgZnVuY3Rpb24gZHJvcHMgdGhlIGhpZ2hlc3Qgb3JkZXIgYml0IGluIGEgc2lnbmVkIG51bWJlciwgbWFpbnRhaW5pbmdcbiAgLy8gdGhlIHNpZ24gYml0LlxuICBmdW5jdGlvbiBzbWkoaTMyKSB7XG4gICAgcmV0dXJuICgoaTMyID4+PiAxKSAmIDB4NDAwMDAwMDApIHwgKGkzMiAmIDB4QkZGRkZGRkYpO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFzaChvKSB7XG4gICAgaWYgKG8gPT09IGZhbHNlIHx8IG8gPT09IG51bGwgfHwgbyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvLnZhbHVlT2YgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIG8gPSBvLnZhbHVlT2YoKTtcbiAgICAgIGlmIChvID09PSBmYWxzZSB8fCBvID09PSBudWxsIHx8IG8gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG8gPT09IHRydWUpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBvO1xuICAgIGlmICh0eXBlID09PSAnbnVtYmVyJykge1xuICAgICAgaWYgKG8gIT09IG8gfHwgbyA9PT0gSW5maW5pdHkpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgICB2YXIgaCA9IG8gfCAwO1xuICAgICAgaWYgKGggIT09IG8pIHtcbiAgICAgICAgaCBePSBvICogMHhGRkZGRkZGRjtcbiAgICAgIH1cbiAgICAgIHdoaWxlIChvID4gMHhGRkZGRkZGRikge1xuICAgICAgICBvIC89IDB4RkZGRkZGRkY7XG4gICAgICAgIGggXj0gbztcbiAgICAgIH1cbiAgICAgIHJldHVybiBzbWkoaCk7XG4gICAgfVxuICAgIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG8ubGVuZ3RoID4gU1RSSU5HX0hBU0hfQ0FDSEVfTUlOX1NUUkxFTiA/IGNhY2hlZEhhc2hTdHJpbmcobykgOiBoYXNoU3RyaW5nKG8pO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG8uaGFzaENvZGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBvLmhhc2hDb2RlKCk7XG4gICAgfVxuICAgIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIGhhc2hKU09iaihvKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvLnRvU3RyaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gaGFzaFN0cmluZyhvLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZhbHVlIHR5cGUgJyArIHR5cGUgKyAnIGNhbm5vdCBiZSBoYXNoZWQuJyk7XG4gIH1cblxuICBmdW5jdGlvbiBjYWNoZWRIYXNoU3RyaW5nKHN0cmluZykge1xuICAgIHZhciBoYXNoID0gc3RyaW5nSGFzaENhY2hlW3N0cmluZ107XG4gICAgaWYgKGhhc2ggPT09IHVuZGVmaW5lZCkge1xuICAgICAgaGFzaCA9IGhhc2hTdHJpbmcoc3RyaW5nKTtcbiAgICAgIGlmIChTVFJJTkdfSEFTSF9DQUNIRV9TSVpFID09PSBTVFJJTkdfSEFTSF9DQUNIRV9NQVhfU0laRSkge1xuICAgICAgICBTVFJJTkdfSEFTSF9DQUNIRV9TSVpFID0gMDtcbiAgICAgICAgc3RyaW5nSGFzaENhY2hlID0ge307XG4gICAgICB9XG4gICAgICBTVFJJTkdfSEFTSF9DQUNIRV9TSVpFKys7XG4gICAgICBzdHJpbmdIYXNoQ2FjaGVbc3RyaW5nXSA9IGhhc2g7XG4gICAgfVxuICAgIHJldHVybiBoYXNoO1xuICB9XG5cbiAgLy8gaHR0cDovL2pzcGVyZi5jb20vaGFzaGluZy1zdHJpbmdzXG4gIGZ1bmN0aW9uIGhhc2hTdHJpbmcoc3RyaW5nKSB7XG4gICAgLy8gVGhpcyBpcyB0aGUgaGFzaCBmcm9tIEpWTVxuICAgIC8vIFRoZSBoYXNoIGNvZGUgZm9yIGEgc3RyaW5nIGlzIGNvbXB1dGVkIGFzXG4gICAgLy8gc1swXSAqIDMxIF4gKG4gLSAxKSArIHNbMV0gKiAzMSBeIChuIC0gMikgKyAuLi4gKyBzW24gLSAxXSxcbiAgICAvLyB3aGVyZSBzW2ldIGlzIHRoZSBpdGggY2hhcmFjdGVyIG9mIHRoZSBzdHJpbmcgYW5kIG4gaXMgdGhlIGxlbmd0aCBvZlxuICAgIC8vIHRoZSBzdHJpbmcuIFdlIFwibW9kXCIgdGhlIHJlc3VsdCB0byBtYWtlIGl0IGJldHdlZW4gMCAoaW5jbHVzaXZlKSBhbmQgMl4zMVxuICAgIC8vIChleGNsdXNpdmUpIGJ5IGRyb3BwaW5nIGhpZ2ggYml0cy5cbiAgICB2YXIgaGFzaCA9IDA7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IHN0cmluZy5sZW5ndGg7IGlpKyspIHtcbiAgICAgIGhhc2ggPSAzMSAqIGhhc2ggKyBzdHJpbmcuY2hhckNvZGVBdChpaSkgfCAwO1xuICAgIH1cbiAgICByZXR1cm4gc21pKGhhc2gpO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFzaEpTT2JqKG9iaikge1xuICAgIHZhciBoYXNoO1xuICAgIGlmICh1c2luZ1dlYWtNYXApIHtcbiAgICAgIGhhc2ggPSB3ZWFrTWFwLmdldChvYmopO1xuICAgICAgaWYgKGhhc2ggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gaGFzaDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBoYXNoID0gb2JqW1VJRF9IQVNIX0tFWV07XG4gICAgaWYgKGhhc2ggIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGhhc2g7XG4gICAgfVxuXG4gICAgaWYgKCFjYW5EZWZpbmVQcm9wZXJ0eSkge1xuICAgICAgaGFzaCA9IG9iai5wcm9wZXJ0eUlzRW51bWVyYWJsZSAmJiBvYmoucHJvcGVydHlJc0VudW1lcmFibGVbVUlEX0hBU0hfS0VZXTtcbiAgICAgIGlmIChoYXNoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGhhc2g7XG4gICAgICB9XG5cbiAgICAgIGhhc2ggPSBnZXRJRU5vZGVIYXNoKG9iaik7XG4gICAgICBpZiAoaGFzaCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBoYXNoO1xuICAgICAgfVxuICAgIH1cblxuICAgIGhhc2ggPSArK29iakhhc2hVSUQ7XG4gICAgaWYgKG9iakhhc2hVSUQgJiAweDQwMDAwMDAwKSB7XG4gICAgICBvYmpIYXNoVUlEID0gMDtcbiAgICB9XG5cbiAgICBpZiAodXNpbmdXZWFrTWFwKSB7XG4gICAgICB3ZWFrTWFwLnNldChvYmosIGhhc2gpO1xuICAgIH0gZWxzZSBpZiAoaXNFeHRlbnNpYmxlICE9PSB1bmRlZmluZWQgJiYgaXNFeHRlbnNpYmxlKG9iaikgPT09IGZhbHNlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vbi1leHRlbnNpYmxlIG9iamVjdHMgYXJlIG5vdCBhbGxvd2VkIGFzIGtleXMuJyk7XG4gICAgfSBlbHNlIGlmIChjYW5EZWZpbmVQcm9wZXJ0eSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgVUlEX0hBU0hfS0VZLCB7XG4gICAgICAgICdlbnVtZXJhYmxlJzogZmFsc2UsXG4gICAgICAgICdjb25maWd1cmFibGUnOiBmYWxzZSxcbiAgICAgICAgJ3dyaXRhYmxlJzogZmFsc2UsXG4gICAgICAgICd2YWx1ZSc6IGhhc2hcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAob2JqLnByb3BlcnR5SXNFbnVtZXJhYmxlICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgICAgIG9iai5wcm9wZXJ0eUlzRW51bWVyYWJsZSA9PT0gb2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZSkge1xuICAgICAgLy8gU2luY2Ugd2UgY2FuJ3QgZGVmaW5lIGEgbm9uLWVudW1lcmFibGUgcHJvcGVydHkgb24gdGhlIG9iamVjdFxuICAgICAgLy8gd2UnbGwgaGlqYWNrIG9uZSBvZiB0aGUgbGVzcy11c2VkIG5vbi1lbnVtZXJhYmxlIHByb3BlcnRpZXMgdG9cbiAgICAgIC8vIHNhdmUgb3VyIGhhc2ggb24gaXQuIFNpbmNlIHRoaXMgaXMgYSBmdW5jdGlvbiBpdCB3aWxsIG5vdCBzaG93IHVwIGluXG4gICAgICAvLyBgSlNPTi5zdHJpbmdpZnlgIHdoaWNoIGlzIHdoYXQgd2Ugd2FudC5cbiAgICAgIG9iai5wcm9wZXJ0eUlzRW51bWVyYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgICBvYmoucHJvcGVydHlJc0VudW1lcmFibGVbVUlEX0hBU0hfS0VZXSA9IGhhc2g7XG4gICAgfSBlbHNlIGlmIChvYmoubm9kZVR5cGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gQXQgdGhpcyBwb2ludCB3ZSBjb3VsZG4ndCBnZXQgdGhlIElFIGB1bmlxdWVJRGAgdG8gdXNlIGFzIGEgaGFzaFxuICAgICAgLy8gYW5kIHdlIGNvdWxkbid0IHVzZSBhIG5vbi1lbnVtZXJhYmxlIHByb3BlcnR5IHRvIGV4cGxvaXQgdGhlXG4gICAgICAvLyBkb250RW51bSBidWcgc28gd2Ugc2ltcGx5IGFkZCB0aGUgYFVJRF9IQVNIX0tFWWAgb24gdGhlIG5vZGVcbiAgICAgIC8vIGl0c2VsZi5cbiAgICAgIG9ialtVSURfSEFTSF9LRVldID0gaGFzaDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gc2V0IGEgbm9uLWVudW1lcmFibGUgcHJvcGVydHkgb24gb2JqZWN0LicpO1xuICAgIH1cblxuICAgIHJldHVybiBoYXNoO1xuICB9XG5cbiAgLy8gR2V0IHJlZmVyZW5jZXMgdG8gRVM1IG9iamVjdCBtZXRob2RzLlxuICB2YXIgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZTtcblxuICAvLyBUcnVlIGlmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB3b3JrcyBhcyBleHBlY3RlZC4gSUU4IGZhaWxzIHRoaXMgdGVzdC5cbiAgdmFyIGNhbkRlZmluZVByb3BlcnR5ID0gKGZ1bmN0aW9uKCkge1xuICAgIHRyeSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdAJywge30pO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSgpKTtcblxuICAvLyBJRSBoYXMgYSBgdW5pcXVlSURgIHByb3BlcnR5IG9uIERPTSBub2Rlcy4gV2UgY2FuIGNvbnN0cnVjdCB0aGUgaGFzaCBmcm9tIGl0XG4gIC8vIGFuZCBhdm9pZCBtZW1vcnkgbGVha3MgZnJvbSB0aGUgSUUgY2xvbmVOb2RlIGJ1Zy5cbiAgZnVuY3Rpb24gZ2V0SUVOb2RlSGFzaChub2RlKSB7XG4gICAgaWYgKG5vZGUgJiYgbm9kZS5ub2RlVHlwZSA+IDApIHtcbiAgICAgIHN3aXRjaCAobm9kZS5ub2RlVHlwZSkge1xuICAgICAgICBjYXNlIDE6IC8vIEVsZW1lbnRcbiAgICAgICAgICByZXR1cm4gbm9kZS51bmlxdWVJRDtcbiAgICAgICAgY2FzZSA5OiAvLyBEb2N1bWVudFxuICAgICAgICAgIHJldHVybiBub2RlLmRvY3VtZW50RWxlbWVudCAmJiBub2RlLmRvY3VtZW50RWxlbWVudC51bmlxdWVJRDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBJZiBwb3NzaWJsZSwgdXNlIGEgV2Vha01hcC5cbiAgdmFyIHVzaW5nV2Vha01hcCA9IHR5cGVvZiBXZWFrTWFwID09PSAnZnVuY3Rpb24nO1xuICB2YXIgd2Vha01hcDtcbiAgaWYgKHVzaW5nV2Vha01hcCkge1xuICAgIHdlYWtNYXAgPSBuZXcgV2Vha01hcCgpO1xuICB9XG5cbiAgdmFyIG9iakhhc2hVSUQgPSAwO1xuXG4gIHZhciBVSURfSEFTSF9LRVkgPSAnX19pbW11dGFibGVoYXNoX18nO1xuICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIFVJRF9IQVNIX0tFWSA9IFN5bWJvbChVSURfSEFTSF9LRVkpO1xuICB9XG5cbiAgdmFyIFNUUklOR19IQVNIX0NBQ0hFX01JTl9TVFJMRU4gPSAxNjtcbiAgdmFyIFNUUklOR19IQVNIX0NBQ0hFX01BWF9TSVpFID0gMjU1O1xuICB2YXIgU1RSSU5HX0hBU0hfQ0FDSEVfU0laRSA9IDA7XG4gIHZhciBzdHJpbmdIYXNoQ2FjaGUgPSB7fTtcblxuICBmdW5jdGlvbiBhc3NlcnROb3RJbmZpbml0ZShzaXplKSB7XG4gICAgaW52YXJpYW50KFxuICAgICAgc2l6ZSAhPT0gSW5maW5pdHksXG4gICAgICAnQ2Fubm90IHBlcmZvcm0gdGhpcyBhY3Rpb24gd2l0aCBhbiBpbmZpbml0ZSBzaXplLidcbiAgICApO1xuICB9XG5cbiAgY3JlYXRlQ2xhc3MoTWFwLCBLZXllZENvbGxlY3Rpb24pO1xuXG4gICAgLy8gQHByYWdtYSBDb25zdHJ1Y3Rpb25cblxuICAgIGZ1bmN0aW9uIE1hcCh2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgPyBlbXB0eU1hcCgpIDpcbiAgICAgICAgaXNNYXAodmFsdWUpICYmICFpc09yZGVyZWQodmFsdWUpID8gdmFsdWUgOlxuICAgICAgICBlbXB0eU1hcCgpLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24obWFwICkge1xuICAgICAgICAgIHZhciBpdGVyID0gS2V5ZWRJdGVyYWJsZSh2YWx1ZSk7XG4gICAgICAgICAgYXNzZXJ0Tm90SW5maW5pdGUoaXRlci5zaXplKTtcbiAgICAgICAgICBpdGVyLmZvckVhY2goZnVuY3Rpb24odiwgaykgIHtyZXR1cm4gbWFwLnNldChrLCB2KX0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBNYXAub2YgPSBmdW5jdGlvbigpIHt2YXIga2V5VmFsdWVzID0gU0xJQ0UkMC5jYWxsKGFyZ3VtZW50cywgMCk7XG4gICAgICByZXR1cm4gZW1wdHlNYXAoKS53aXRoTXV0YXRpb25zKGZ1bmN0aW9uKG1hcCApIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlWYWx1ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgICAgICBpZiAoaSArIDEgPj0ga2V5VmFsdWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIHZhbHVlIGZvciBrZXk6ICcgKyBrZXlWYWx1ZXNbaV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtYXAuc2V0KGtleVZhbHVlc1tpXSwga2V5VmFsdWVzW2kgKyAxXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBNYXAucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX3RvU3RyaW5nKCdNYXAgeycsICd9Jyk7XG4gICAgfTtcblxuICAgIC8vIEBwcmFnbWEgQWNjZXNzXG5cbiAgICBNYXAucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGssIG5vdFNldFZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcm9vdCA/XG4gICAgICAgIHRoaXMuX3Jvb3QuZ2V0KDAsIHVuZGVmaW5lZCwgaywgbm90U2V0VmFsdWUpIDpcbiAgICAgICAgbm90U2V0VmFsdWU7XG4gICAgfTtcblxuICAgIC8vIEBwcmFnbWEgTW9kaWZpY2F0aW9uXG5cbiAgICBNYXAucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGssIHYpIHtcbiAgICAgIHJldHVybiB1cGRhdGVNYXAodGhpcywgaywgdik7XG4gICAgfTtcblxuICAgIE1hcC5wcm90b3R5cGUuc2V0SW4gPSBmdW5jdGlvbihrZXlQYXRoLCB2KSB7XG4gICAgICByZXR1cm4gdGhpcy51cGRhdGVJbihrZXlQYXRoLCBOT1RfU0VULCBmdW5jdGlvbigpICB7cmV0dXJuIHZ9KTtcbiAgICB9O1xuXG4gICAgTWFwLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihrKSB7XG4gICAgICByZXR1cm4gdXBkYXRlTWFwKHRoaXMsIGssIE5PVF9TRVQpO1xuICAgIH07XG5cbiAgICBNYXAucHJvdG90eXBlLmRlbGV0ZUluID0gZnVuY3Rpb24oa2V5UGF0aCkge1xuICAgICAgcmV0dXJuIHRoaXMudXBkYXRlSW4oa2V5UGF0aCwgZnVuY3Rpb24oKSAge3JldHVybiBOT1RfU0VUfSk7XG4gICAgfTtcblxuICAgIE1hcC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oaywgbm90U2V0VmFsdWUsIHVwZGF0ZXIpIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAxID9cbiAgICAgICAgayh0aGlzKSA6XG4gICAgICAgIHRoaXMudXBkYXRlSW4oW2tdLCBub3RTZXRWYWx1ZSwgdXBkYXRlcik7XG4gICAgfTtcblxuICAgIE1hcC5wcm90b3R5cGUudXBkYXRlSW4gPSBmdW5jdGlvbihrZXlQYXRoLCBub3RTZXRWYWx1ZSwgdXBkYXRlcikge1xuICAgICAgaWYgKCF1cGRhdGVyKSB7XG4gICAgICAgIHVwZGF0ZXIgPSBub3RTZXRWYWx1ZTtcbiAgICAgICAgbm90U2V0VmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICB2YXIgdXBkYXRlZFZhbHVlID0gdXBkYXRlSW5EZWVwTWFwKFxuICAgICAgICB0aGlzLFxuICAgICAgICBmb3JjZUl0ZXJhdG9yKGtleVBhdGgpLFxuICAgICAgICBub3RTZXRWYWx1ZSxcbiAgICAgICAgdXBkYXRlclxuICAgICAgKTtcbiAgICAgIHJldHVybiB1cGRhdGVkVmFsdWUgPT09IE5PVF9TRVQgPyB1bmRlZmluZWQgOiB1cGRhdGVkVmFsdWU7XG4gICAgfTtcblxuICAgIE1hcC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnNpemUgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fX293bmVySUQpIHtcbiAgICAgICAgdGhpcy5zaXplID0gMDtcbiAgICAgICAgdGhpcy5fcm9vdCA9IG51bGw7XG4gICAgICAgIHRoaXMuX19oYXNoID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9fYWx0ZXJlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVtcHR5TWFwKCk7XG4gICAgfTtcblxuICAgIC8vIEBwcmFnbWEgQ29tcG9zaXRpb25cblxuICAgIE1hcC5wcm90b3R5cGUubWVyZ2UgPSBmdW5jdGlvbigvKi4uLml0ZXJzKi8pIHtcbiAgICAgIHJldHVybiBtZXJnZUludG9NYXBXaXRoKHRoaXMsIHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgTWFwLnByb3RvdHlwZS5tZXJnZVdpdGggPSBmdW5jdGlvbihtZXJnZXIpIHt2YXIgaXRlcnMgPSBTTElDRSQwLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgIHJldHVybiBtZXJnZUludG9NYXBXaXRoKHRoaXMsIG1lcmdlciwgaXRlcnMpO1xuICAgIH07XG5cbiAgICBNYXAucHJvdG90eXBlLm1lcmdlSW4gPSBmdW5jdGlvbihrZXlQYXRoKSB7dmFyIGl0ZXJzID0gU0xJQ0UkMC5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICByZXR1cm4gdGhpcy51cGRhdGVJbihcbiAgICAgICAga2V5UGF0aCxcbiAgICAgICAgZW1wdHlNYXAoKSxcbiAgICAgICAgZnVuY3Rpb24obSApIHtyZXR1cm4gdHlwZW9mIG0ubWVyZ2UgPT09ICdmdW5jdGlvbicgP1xuICAgICAgICAgIG0ubWVyZ2UuYXBwbHkobSwgaXRlcnMpIDpcbiAgICAgICAgICBpdGVyc1tpdGVycy5sZW5ndGggLSAxXX1cbiAgICAgICk7XG4gICAgfTtcblxuICAgIE1hcC5wcm90b3R5cGUubWVyZ2VEZWVwID0gZnVuY3Rpb24oLyouLi5pdGVycyovKSB7XG4gICAgICByZXR1cm4gbWVyZ2VJbnRvTWFwV2l0aCh0aGlzLCBkZWVwTWVyZ2VyLCBhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBNYXAucHJvdG90eXBlLm1lcmdlRGVlcFdpdGggPSBmdW5jdGlvbihtZXJnZXIpIHt2YXIgaXRlcnMgPSBTTElDRSQwLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgIHJldHVybiBtZXJnZUludG9NYXBXaXRoKHRoaXMsIGRlZXBNZXJnZXJXaXRoKG1lcmdlciksIGl0ZXJzKTtcbiAgICB9O1xuXG4gICAgTWFwLnByb3RvdHlwZS5tZXJnZURlZXBJbiA9IGZ1bmN0aW9uKGtleVBhdGgpIHt2YXIgaXRlcnMgPSBTTElDRSQwLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgIHJldHVybiB0aGlzLnVwZGF0ZUluKFxuICAgICAgICBrZXlQYXRoLFxuICAgICAgICBlbXB0eU1hcCgpLFxuICAgICAgICBmdW5jdGlvbihtICkge3JldHVybiB0eXBlb2YgbS5tZXJnZURlZXAgPT09ICdmdW5jdGlvbicgP1xuICAgICAgICAgIG0ubWVyZ2VEZWVwLmFwcGx5KG0sIGl0ZXJzKSA6XG4gICAgICAgICAgaXRlcnNbaXRlcnMubGVuZ3RoIC0gMV19XG4gICAgICApO1xuICAgIH07XG5cbiAgICBNYXAucHJvdG90eXBlLnNvcnQgPSBmdW5jdGlvbihjb21wYXJhdG9yKSB7XG4gICAgICAvLyBMYXRlIGJpbmRpbmdcbiAgICAgIHJldHVybiBPcmRlcmVkTWFwKHNvcnRGYWN0b3J5KHRoaXMsIGNvbXBhcmF0b3IpKTtcbiAgICB9O1xuXG4gICAgTWFwLnByb3RvdHlwZS5zb3J0QnkgPSBmdW5jdGlvbihtYXBwZXIsIGNvbXBhcmF0b3IpIHtcbiAgICAgIC8vIExhdGUgYmluZGluZ1xuICAgICAgcmV0dXJuIE9yZGVyZWRNYXAoc29ydEZhY3RvcnkodGhpcywgY29tcGFyYXRvciwgbWFwcGVyKSk7XG4gICAgfTtcblxuICAgIC8vIEBwcmFnbWEgTXV0YWJpbGl0eVxuXG4gICAgTWFwLnByb3RvdHlwZS53aXRoTXV0YXRpb25zID0gZnVuY3Rpb24oZm4pIHtcbiAgICAgIHZhciBtdXRhYmxlID0gdGhpcy5hc011dGFibGUoKTtcbiAgICAgIGZuKG11dGFibGUpO1xuICAgICAgcmV0dXJuIG11dGFibGUud2FzQWx0ZXJlZCgpID8gbXV0YWJsZS5fX2Vuc3VyZU93bmVyKHRoaXMuX19vd25lcklEKSA6IHRoaXM7XG4gICAgfTtcblxuICAgIE1hcC5wcm90b3R5cGUuYXNNdXRhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX293bmVySUQgPyB0aGlzIDogdGhpcy5fX2Vuc3VyZU93bmVyKG5ldyBPd25lcklEKCkpO1xuICAgIH07XG5cbiAgICBNYXAucHJvdG90eXBlLmFzSW1tdXRhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX2Vuc3VyZU93bmVyKCk7XG4gICAgfTtcblxuICAgIE1hcC5wcm90b3R5cGUud2FzQWx0ZXJlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX19hbHRlcmVkO1xuICAgIH07XG5cbiAgICBNYXAucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICByZXR1cm4gbmV3IE1hcEl0ZXJhdG9yKHRoaXMsIHR5cGUsIHJldmVyc2UpO1xuICAgIH07XG5cbiAgICBNYXAucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICB0aGlzLl9yb290ICYmIHRoaXMuX3Jvb3QuaXRlcmF0ZShmdW5jdGlvbihlbnRyeSApIHtcbiAgICAgICAgaXRlcmF0aW9ucysrO1xuICAgICAgICByZXR1cm4gZm4oZW50cnlbMV0sIGVudHJ5WzBdLCB0aGlzJDApO1xuICAgICAgfSwgcmV2ZXJzZSk7XG4gICAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgICB9O1xuXG4gICAgTWFwLnByb3RvdHlwZS5fX2Vuc3VyZU93bmVyID0gZnVuY3Rpb24ob3duZXJJRCkge1xuICAgICAgaWYgKG93bmVySUQgPT09IHRoaXMuX19vd25lcklEKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgaWYgKCFvd25lcklEKSB7XG4gICAgICAgIHRoaXMuX19vd25lcklEID0gb3duZXJJRDtcbiAgICAgICAgdGhpcy5fX2FsdGVyZWQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFrZU1hcCh0aGlzLnNpemUsIHRoaXMuX3Jvb3QsIG93bmVySUQsIHRoaXMuX19oYXNoKTtcbiAgICB9O1xuXG5cbiAgZnVuY3Rpb24gaXNNYXAobWF5YmVNYXApIHtcbiAgICByZXR1cm4gISEobWF5YmVNYXAgJiYgbWF5YmVNYXBbSVNfTUFQX1NFTlRJTkVMXSk7XG4gIH1cblxuICBNYXAuaXNNYXAgPSBpc01hcDtcblxuICB2YXIgSVNfTUFQX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfTUFQX19AQCc7XG5cbiAgdmFyIE1hcFByb3RvdHlwZSA9IE1hcC5wcm90b3R5cGU7XG4gIE1hcFByb3RvdHlwZVtJU19NQVBfU0VOVElORUxdID0gdHJ1ZTtcbiAgTWFwUHJvdG90eXBlW0RFTEVURV0gPSBNYXBQcm90b3R5cGUucmVtb3ZlO1xuICBNYXBQcm90b3R5cGUucmVtb3ZlSW4gPSBNYXBQcm90b3R5cGUuZGVsZXRlSW47XG5cblxuICAvLyAjcHJhZ21hIFRyaWUgTm9kZXNcblxuXG5cbiAgICBmdW5jdGlvbiBBcnJheU1hcE5vZGUob3duZXJJRCwgZW50cmllcykge1xuICAgICAgdGhpcy5vd25lcklEID0gb3duZXJJRDtcbiAgICAgIHRoaXMuZW50cmllcyA9IGVudHJpZXM7XG4gICAgfVxuXG4gICAgQXJyYXlNYXBOb2RlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihzaGlmdCwga2V5SGFzaCwga2V5LCBub3RTZXRWYWx1ZSkge1xuICAgICAgdmFyIGVudHJpZXMgPSB0aGlzLmVudHJpZXM7XG4gICAgICBmb3IgKHZhciBpaSA9IDAsIGxlbiA9IGVudHJpZXMubGVuZ3RoOyBpaSA8IGxlbjsgaWkrKykge1xuICAgICAgICBpZiAoaXMoa2V5LCBlbnRyaWVzW2lpXVswXSkpIHtcbiAgICAgICAgICByZXR1cm4gZW50cmllc1tpaV1bMV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBub3RTZXRWYWx1ZTtcbiAgICB9O1xuXG4gICAgQXJyYXlNYXBOb2RlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihvd25lcklELCBzaGlmdCwga2V5SGFzaCwga2V5LCB2YWx1ZSwgZGlkQ2hhbmdlU2l6ZSwgZGlkQWx0ZXIpIHtcbiAgICAgIHZhciByZW1vdmVkID0gdmFsdWUgPT09IE5PVF9TRVQ7XG5cbiAgICAgIHZhciBlbnRyaWVzID0gdGhpcy5lbnRyaWVzO1xuICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICBmb3IgKHZhciBsZW4gPSBlbnRyaWVzLmxlbmd0aDsgaWR4IDwgbGVuOyBpZHgrKykge1xuICAgICAgICBpZiAoaXMoa2V5LCBlbnRyaWVzW2lkeF1bMF0pKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhciBleGlzdHMgPSBpZHggPCBsZW47XG5cbiAgICAgIGlmIChleGlzdHMgPyBlbnRyaWVzW2lkeF1bMV0gPT09IHZhbHVlIDogcmVtb3ZlZCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgU2V0UmVmKGRpZEFsdGVyKTtcbiAgICAgIChyZW1vdmVkIHx8ICFleGlzdHMpICYmIFNldFJlZihkaWRDaGFuZ2VTaXplKTtcblxuICAgICAgaWYgKHJlbW92ZWQgJiYgZW50cmllcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmV0dXJuOyAvLyB1bmRlZmluZWRcbiAgICAgIH1cblxuICAgICAgaWYgKCFleGlzdHMgJiYgIXJlbW92ZWQgJiYgZW50cmllcy5sZW5ndGggPj0gTUFYX0FSUkFZX01BUF9TSVpFKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVOb2Rlcyhvd25lcklELCBlbnRyaWVzLCBrZXksIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGlzRWRpdGFibGUgPSBvd25lcklEICYmIG93bmVySUQgPT09IHRoaXMub3duZXJJRDtcbiAgICAgIHZhciBuZXdFbnRyaWVzID0gaXNFZGl0YWJsZSA/IGVudHJpZXMgOiBhcnJDb3B5KGVudHJpZXMpO1xuXG4gICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgIGlmIChyZW1vdmVkKSB7XG4gICAgICAgICAgaWR4ID09PSBsZW4gLSAxID8gbmV3RW50cmllcy5wb3AoKSA6IChuZXdFbnRyaWVzW2lkeF0gPSBuZXdFbnRyaWVzLnBvcCgpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdFbnRyaWVzW2lkeF0gPSBba2V5LCB2YWx1ZV07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0VudHJpZXMucHVzaChba2V5LCB2YWx1ZV0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNFZGl0YWJsZSkge1xuICAgICAgICB0aGlzLmVudHJpZXMgPSBuZXdFbnRyaWVzO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBBcnJheU1hcE5vZGUob3duZXJJRCwgbmV3RW50cmllcyk7XG4gICAgfTtcblxuXG5cblxuICAgIGZ1bmN0aW9uIEJpdG1hcEluZGV4ZWROb2RlKG93bmVySUQsIGJpdG1hcCwgbm9kZXMpIHtcbiAgICAgIHRoaXMub3duZXJJRCA9IG93bmVySUQ7XG4gICAgICB0aGlzLmJpdG1hcCA9IGJpdG1hcDtcbiAgICAgIHRoaXMubm9kZXMgPSBub2RlcztcbiAgICB9XG5cbiAgICBCaXRtYXBJbmRleGVkTm9kZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oc2hpZnQsIGtleUhhc2gsIGtleSwgbm90U2V0VmFsdWUpIHtcbiAgICAgIGlmIChrZXlIYXNoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAga2V5SGFzaCA9IGhhc2goa2V5KTtcbiAgICAgIH1cbiAgICAgIHZhciBiaXQgPSAoMSA8PCAoKHNoaWZ0ID09PSAwID8ga2V5SGFzaCA6IGtleUhhc2ggPj4+IHNoaWZ0KSAmIE1BU0spKTtcbiAgICAgIHZhciBiaXRtYXAgPSB0aGlzLmJpdG1hcDtcbiAgICAgIHJldHVybiAoYml0bWFwICYgYml0KSA9PT0gMCA/IG5vdFNldFZhbHVlIDpcbiAgICAgICAgdGhpcy5ub2Rlc1twb3BDb3VudChiaXRtYXAgJiAoYml0IC0gMSkpXS5nZXQoc2hpZnQgKyBTSElGVCwga2V5SGFzaCwga2V5LCBub3RTZXRWYWx1ZSk7XG4gICAgfTtcblxuICAgIEJpdG1hcEluZGV4ZWROb2RlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihvd25lcklELCBzaGlmdCwga2V5SGFzaCwga2V5LCB2YWx1ZSwgZGlkQ2hhbmdlU2l6ZSwgZGlkQWx0ZXIpIHtcbiAgICAgIGlmIChrZXlIYXNoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAga2V5SGFzaCA9IGhhc2goa2V5KTtcbiAgICAgIH1cbiAgICAgIHZhciBrZXlIYXNoRnJhZyA9IChzaGlmdCA9PT0gMCA/IGtleUhhc2ggOiBrZXlIYXNoID4+PiBzaGlmdCkgJiBNQVNLO1xuICAgICAgdmFyIGJpdCA9IDEgPDwga2V5SGFzaEZyYWc7XG4gICAgICB2YXIgYml0bWFwID0gdGhpcy5iaXRtYXA7XG4gICAgICB2YXIgZXhpc3RzID0gKGJpdG1hcCAmIGJpdCkgIT09IDA7XG5cbiAgICAgIGlmICghZXhpc3RzICYmIHZhbHVlID09PSBOT1RfU0VUKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICB2YXIgaWR4ID0gcG9wQ291bnQoYml0bWFwICYgKGJpdCAtIDEpKTtcbiAgICAgIHZhciBub2RlcyA9IHRoaXMubm9kZXM7XG4gICAgICB2YXIgbm9kZSA9IGV4aXN0cyA/IG5vZGVzW2lkeF0gOiB1bmRlZmluZWQ7XG4gICAgICB2YXIgbmV3Tm9kZSA9IHVwZGF0ZU5vZGUobm9kZSwgb3duZXJJRCwgc2hpZnQgKyBTSElGVCwga2V5SGFzaCwga2V5LCB2YWx1ZSwgZGlkQ2hhbmdlU2l6ZSwgZGlkQWx0ZXIpO1xuXG4gICAgICBpZiAobmV3Tm9kZSA9PT0gbm9kZSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgaWYgKCFleGlzdHMgJiYgbmV3Tm9kZSAmJiBub2Rlcy5sZW5ndGggPj0gTUFYX0JJVE1BUF9JTkRFWEVEX1NJWkUpIHtcbiAgICAgICAgcmV0dXJuIGV4cGFuZE5vZGVzKG93bmVySUQsIG5vZGVzLCBiaXRtYXAsIGtleUhhc2hGcmFnLCBuZXdOb2RlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGV4aXN0cyAmJiAhbmV3Tm9kZSAmJiBub2Rlcy5sZW5ndGggPT09IDIgJiYgaXNMZWFmTm9kZShub2Rlc1tpZHggXiAxXSkpIHtcbiAgICAgICAgcmV0dXJuIG5vZGVzW2lkeCBeIDFdO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXhpc3RzICYmIG5ld05vZGUgJiYgbm9kZXMubGVuZ3RoID09PSAxICYmIGlzTGVhZk5vZGUobmV3Tm9kZSkpIHtcbiAgICAgICAgcmV0dXJuIG5ld05vZGU7XG4gICAgICB9XG5cbiAgICAgIHZhciBpc0VkaXRhYmxlID0gb3duZXJJRCAmJiBvd25lcklEID09PSB0aGlzLm93bmVySUQ7XG4gICAgICB2YXIgbmV3Qml0bWFwID0gZXhpc3RzID8gbmV3Tm9kZSA/IGJpdG1hcCA6IGJpdG1hcCBeIGJpdCA6IGJpdG1hcCB8IGJpdDtcbiAgICAgIHZhciBuZXdOb2RlcyA9IGV4aXN0cyA/IG5ld05vZGUgP1xuICAgICAgICBzZXRJbihub2RlcywgaWR4LCBuZXdOb2RlLCBpc0VkaXRhYmxlKSA6XG4gICAgICAgIHNwbGljZU91dChub2RlcywgaWR4LCBpc0VkaXRhYmxlKSA6XG4gICAgICAgIHNwbGljZUluKG5vZGVzLCBpZHgsIG5ld05vZGUsIGlzRWRpdGFibGUpO1xuXG4gICAgICBpZiAoaXNFZGl0YWJsZSkge1xuICAgICAgICB0aGlzLmJpdG1hcCA9IG5ld0JpdG1hcDtcbiAgICAgICAgdGhpcy5ub2RlcyA9IG5ld05vZGVzO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBCaXRtYXBJbmRleGVkTm9kZShvd25lcklELCBuZXdCaXRtYXAsIG5ld05vZGVzKTtcbiAgICB9O1xuXG5cblxuXG4gICAgZnVuY3Rpb24gSGFzaEFycmF5TWFwTm9kZShvd25lcklELCBjb3VudCwgbm9kZXMpIHtcbiAgICAgIHRoaXMub3duZXJJRCA9IG93bmVySUQ7XG4gICAgICB0aGlzLmNvdW50ID0gY291bnQ7XG4gICAgICB0aGlzLm5vZGVzID0gbm9kZXM7XG4gICAgfVxuXG4gICAgSGFzaEFycmF5TWFwTm9kZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oc2hpZnQsIGtleUhhc2gsIGtleSwgbm90U2V0VmFsdWUpIHtcbiAgICAgIGlmIChrZXlIYXNoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAga2V5SGFzaCA9IGhhc2goa2V5KTtcbiAgICAgIH1cbiAgICAgIHZhciBpZHggPSAoc2hpZnQgPT09IDAgPyBrZXlIYXNoIDoga2V5SGFzaCA+Pj4gc2hpZnQpICYgTUFTSztcbiAgICAgIHZhciBub2RlID0gdGhpcy5ub2Rlc1tpZHhdO1xuICAgICAgcmV0dXJuIG5vZGUgPyBub2RlLmdldChzaGlmdCArIFNISUZULCBrZXlIYXNoLCBrZXksIG5vdFNldFZhbHVlKSA6IG5vdFNldFZhbHVlO1xuICAgIH07XG5cbiAgICBIYXNoQXJyYXlNYXBOb2RlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihvd25lcklELCBzaGlmdCwga2V5SGFzaCwga2V5LCB2YWx1ZSwgZGlkQ2hhbmdlU2l6ZSwgZGlkQWx0ZXIpIHtcbiAgICAgIGlmIChrZXlIYXNoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAga2V5SGFzaCA9IGhhc2goa2V5KTtcbiAgICAgIH1cbiAgICAgIHZhciBpZHggPSAoc2hpZnQgPT09IDAgPyBrZXlIYXNoIDoga2V5SGFzaCA+Pj4gc2hpZnQpICYgTUFTSztcbiAgICAgIHZhciByZW1vdmVkID0gdmFsdWUgPT09IE5PVF9TRVQ7XG4gICAgICB2YXIgbm9kZXMgPSB0aGlzLm5vZGVzO1xuICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpZHhdO1xuXG4gICAgICBpZiAocmVtb3ZlZCAmJiAhbm9kZSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgdmFyIG5ld05vZGUgPSB1cGRhdGVOb2RlKG5vZGUsIG93bmVySUQsIHNoaWZ0ICsgU0hJRlQsIGtleUhhc2gsIGtleSwgdmFsdWUsIGRpZENoYW5nZVNpemUsIGRpZEFsdGVyKTtcbiAgICAgIGlmIChuZXdOb2RlID09PSBub2RlKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICB2YXIgbmV3Q291bnQgPSB0aGlzLmNvdW50O1xuICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgIG5ld0NvdW50Kys7XG4gICAgICB9IGVsc2UgaWYgKCFuZXdOb2RlKSB7XG4gICAgICAgIG5ld0NvdW50LS07XG4gICAgICAgIGlmIChuZXdDb3VudCA8IE1JTl9IQVNIX0FSUkFZX01BUF9TSVpFKSB7XG4gICAgICAgICAgcmV0dXJuIHBhY2tOb2Rlcyhvd25lcklELCBub2RlcywgbmV3Q291bnQsIGlkeCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGlzRWRpdGFibGUgPSBvd25lcklEICYmIG93bmVySUQgPT09IHRoaXMub3duZXJJRDtcbiAgICAgIHZhciBuZXdOb2RlcyA9IHNldEluKG5vZGVzLCBpZHgsIG5ld05vZGUsIGlzRWRpdGFibGUpO1xuXG4gICAgICBpZiAoaXNFZGl0YWJsZSkge1xuICAgICAgICB0aGlzLmNvdW50ID0gbmV3Q291bnQ7XG4gICAgICAgIHRoaXMubm9kZXMgPSBuZXdOb2RlcztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgSGFzaEFycmF5TWFwTm9kZShvd25lcklELCBuZXdDb3VudCwgbmV3Tm9kZXMpO1xuICAgIH07XG5cblxuXG5cbiAgICBmdW5jdGlvbiBIYXNoQ29sbGlzaW9uTm9kZShvd25lcklELCBrZXlIYXNoLCBlbnRyaWVzKSB7XG4gICAgICB0aGlzLm93bmVySUQgPSBvd25lcklEO1xuICAgICAgdGhpcy5rZXlIYXNoID0ga2V5SGFzaDtcbiAgICAgIHRoaXMuZW50cmllcyA9IGVudHJpZXM7XG4gICAgfVxuXG4gICAgSGFzaENvbGxpc2lvbk5vZGUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKHNoaWZ0LCBrZXlIYXNoLCBrZXksIG5vdFNldFZhbHVlKSB7XG4gICAgICB2YXIgZW50cmllcyA9IHRoaXMuZW50cmllcztcbiAgICAgIGZvciAodmFyIGlpID0gMCwgbGVuID0gZW50cmllcy5sZW5ndGg7IGlpIDwgbGVuOyBpaSsrKSB7XG4gICAgICAgIGlmIChpcyhrZXksIGVudHJpZXNbaWldWzBdKSkge1xuICAgICAgICAgIHJldHVybiBlbnRyaWVzW2lpXVsxXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG5vdFNldFZhbHVlO1xuICAgIH07XG5cbiAgICBIYXNoQ29sbGlzaW9uTm9kZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24ob3duZXJJRCwgc2hpZnQsIGtleUhhc2gsIGtleSwgdmFsdWUsIGRpZENoYW5nZVNpemUsIGRpZEFsdGVyKSB7XG4gICAgICBpZiAoa2V5SGFzaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGtleUhhc2ggPSBoYXNoKGtleSk7XG4gICAgICB9XG5cbiAgICAgIHZhciByZW1vdmVkID0gdmFsdWUgPT09IE5PVF9TRVQ7XG5cbiAgICAgIGlmIChrZXlIYXNoICE9PSB0aGlzLmtleUhhc2gpIHtcbiAgICAgICAgaWYgKHJlbW92ZWQpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICBTZXRSZWYoZGlkQWx0ZXIpO1xuICAgICAgICBTZXRSZWYoZGlkQ2hhbmdlU2l6ZSk7XG4gICAgICAgIHJldHVybiBtZXJnZUludG9Ob2RlKHRoaXMsIG93bmVySUQsIHNoaWZ0LCBrZXlIYXNoLCBba2V5LCB2YWx1ZV0pO1xuICAgICAgfVxuXG4gICAgICB2YXIgZW50cmllcyA9IHRoaXMuZW50cmllcztcbiAgICAgIHZhciBpZHggPSAwO1xuICAgICAgZm9yICh2YXIgbGVuID0gZW50cmllcy5sZW5ndGg7IGlkeCA8IGxlbjsgaWR4KyspIHtcbiAgICAgICAgaWYgKGlzKGtleSwgZW50cmllc1tpZHhdWzBdKSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2YXIgZXhpc3RzID0gaWR4IDwgbGVuO1xuXG4gICAgICBpZiAoZXhpc3RzID8gZW50cmllc1tpZHhdWzFdID09PSB2YWx1ZSA6IHJlbW92ZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIFNldFJlZihkaWRBbHRlcik7XG4gICAgICAocmVtb3ZlZCB8fCAhZXhpc3RzKSAmJiBTZXRSZWYoZGlkQ2hhbmdlU2l6ZSk7XG5cbiAgICAgIGlmIChyZW1vdmVkICYmIGxlbiA9PT0gMikge1xuICAgICAgICByZXR1cm4gbmV3IFZhbHVlTm9kZShvd25lcklELCB0aGlzLmtleUhhc2gsIGVudHJpZXNbaWR4IF4gMV0pO1xuICAgICAgfVxuXG4gICAgICB2YXIgaXNFZGl0YWJsZSA9IG93bmVySUQgJiYgb3duZXJJRCA9PT0gdGhpcy5vd25lcklEO1xuICAgICAgdmFyIG5ld0VudHJpZXMgPSBpc0VkaXRhYmxlID8gZW50cmllcyA6IGFyckNvcHkoZW50cmllcyk7XG5cbiAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgaWYgKHJlbW92ZWQpIHtcbiAgICAgICAgICBpZHggPT09IGxlbiAtIDEgPyBuZXdFbnRyaWVzLnBvcCgpIDogKG5ld0VudHJpZXNbaWR4XSA9IG5ld0VudHJpZXMucG9wKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld0VudHJpZXNbaWR4XSA9IFtrZXksIHZhbHVlXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3RW50cmllcy5wdXNoKFtrZXksIHZhbHVlXSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0VkaXRhYmxlKSB7XG4gICAgICAgIHRoaXMuZW50cmllcyA9IG5ld0VudHJpZXM7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IEhhc2hDb2xsaXNpb25Ob2RlKG93bmVySUQsIHRoaXMua2V5SGFzaCwgbmV3RW50cmllcyk7XG4gICAgfTtcblxuXG5cblxuICAgIGZ1bmN0aW9uIFZhbHVlTm9kZShvd25lcklELCBrZXlIYXNoLCBlbnRyeSkge1xuICAgICAgdGhpcy5vd25lcklEID0gb3duZXJJRDtcbiAgICAgIHRoaXMua2V5SGFzaCA9IGtleUhhc2g7XG4gICAgICB0aGlzLmVudHJ5ID0gZW50cnk7XG4gICAgfVxuXG4gICAgVmFsdWVOb2RlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihzaGlmdCwga2V5SGFzaCwga2V5LCBub3RTZXRWYWx1ZSkge1xuICAgICAgcmV0dXJuIGlzKGtleSwgdGhpcy5lbnRyeVswXSkgPyB0aGlzLmVudHJ5WzFdIDogbm90U2V0VmFsdWU7XG4gICAgfTtcblxuICAgIFZhbHVlTm9kZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24ob3duZXJJRCwgc2hpZnQsIGtleUhhc2gsIGtleSwgdmFsdWUsIGRpZENoYW5nZVNpemUsIGRpZEFsdGVyKSB7XG4gICAgICB2YXIgcmVtb3ZlZCA9IHZhbHVlID09PSBOT1RfU0VUO1xuICAgICAgdmFyIGtleU1hdGNoID0gaXMoa2V5LCB0aGlzLmVudHJ5WzBdKTtcbiAgICAgIGlmIChrZXlNYXRjaCA/IHZhbHVlID09PSB0aGlzLmVudHJ5WzFdIDogcmVtb3ZlZCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgU2V0UmVmKGRpZEFsdGVyKTtcblxuICAgICAgaWYgKHJlbW92ZWQpIHtcbiAgICAgICAgU2V0UmVmKGRpZENoYW5nZVNpemUpO1xuICAgICAgICByZXR1cm47IC8vIHVuZGVmaW5lZFxuICAgICAgfVxuXG4gICAgICBpZiAoa2V5TWF0Y2gpIHtcbiAgICAgICAgaWYgKG93bmVySUQgJiYgb3duZXJJRCA9PT0gdGhpcy5vd25lcklEKSB7XG4gICAgICAgICAgdGhpcy5lbnRyeVsxXSA9IHZhbHVlO1xuICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgVmFsdWVOb2RlKG93bmVySUQsIHRoaXMua2V5SGFzaCwgW2tleSwgdmFsdWVdKTtcbiAgICAgIH1cblxuICAgICAgU2V0UmVmKGRpZENoYW5nZVNpemUpO1xuICAgICAgcmV0dXJuIG1lcmdlSW50b05vZGUodGhpcywgb3duZXJJRCwgc2hpZnQsIGhhc2goa2V5KSwgW2tleSwgdmFsdWVdKTtcbiAgICB9O1xuXG5cblxuICAvLyAjcHJhZ21hIEl0ZXJhdG9yc1xuXG4gIEFycmF5TWFwTm9kZS5wcm90b3R5cGUuaXRlcmF0ZSA9XG4gIEhhc2hDb2xsaXNpb25Ob2RlLnByb3RvdHlwZS5pdGVyYXRlID0gZnVuY3Rpb24gKGZuLCByZXZlcnNlKSB7XG4gICAgdmFyIGVudHJpZXMgPSB0aGlzLmVudHJpZXM7XG4gICAgZm9yICh2YXIgaWkgPSAwLCBtYXhJbmRleCA9IGVudHJpZXMubGVuZ3RoIC0gMTsgaWkgPD0gbWF4SW5kZXg7IGlpKyspIHtcbiAgICAgIGlmIChmbihlbnRyaWVzW3JldmVyc2UgPyBtYXhJbmRleCAtIGlpIDogaWldKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIEJpdG1hcEluZGV4ZWROb2RlLnByb3RvdHlwZS5pdGVyYXRlID1cbiAgSGFzaEFycmF5TWFwTm9kZS5wcm90b3R5cGUuaXRlcmF0ZSA9IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge1xuICAgIHZhciBub2RlcyA9IHRoaXMubm9kZXM7XG4gICAgZm9yICh2YXIgaWkgPSAwLCBtYXhJbmRleCA9IG5vZGVzLmxlbmd0aCAtIDE7IGlpIDw9IG1heEluZGV4OyBpaSsrKSB7XG4gICAgICB2YXIgbm9kZSA9IG5vZGVzW3JldmVyc2UgPyBtYXhJbmRleCAtIGlpIDogaWldO1xuICAgICAgaWYgKG5vZGUgJiYgbm9kZS5pdGVyYXRlKGZuLCByZXZlcnNlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIFZhbHVlTm9kZS5wcm90b3R5cGUuaXRlcmF0ZSA9IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge1xuICAgIHJldHVybiBmbih0aGlzLmVudHJ5KTtcbiAgfVxuXG4gIGNyZWF0ZUNsYXNzKE1hcEl0ZXJhdG9yLCBJdGVyYXRvcik7XG5cbiAgICBmdW5jdGlvbiBNYXBJdGVyYXRvcihtYXAsIHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xuICAgICAgdGhpcy5fcmV2ZXJzZSA9IHJldmVyc2U7XG4gICAgICB0aGlzLl9zdGFjayA9IG1hcC5fcm9vdCAmJiBtYXBJdGVyYXRvckZyYW1lKG1hcC5fcm9vdCk7XG4gICAgfVxuXG4gICAgTWFwSXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB0eXBlID0gdGhpcy5fdHlwZTtcbiAgICAgIHZhciBzdGFjayA9IHRoaXMuX3N0YWNrO1xuICAgICAgd2hpbGUgKHN0YWNrKSB7XG4gICAgICAgIHZhciBub2RlID0gc3RhY2subm9kZTtcbiAgICAgICAgdmFyIGluZGV4ID0gc3RhY2suaW5kZXgrKztcbiAgICAgICAgdmFyIG1heEluZGV4O1xuICAgICAgICBpZiAobm9kZS5lbnRyeSkge1xuICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG1hcEl0ZXJhdG9yVmFsdWUodHlwZSwgbm9kZS5lbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG5vZGUuZW50cmllcykge1xuICAgICAgICAgIG1heEluZGV4ID0gbm9kZS5lbnRyaWVzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgaWYgKGluZGV4IDw9IG1heEluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gbWFwSXRlcmF0b3JWYWx1ZSh0eXBlLCBub2RlLmVudHJpZXNbdGhpcy5fcmV2ZXJzZSA/IG1heEluZGV4IC0gaW5kZXggOiBpbmRleF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYXhJbmRleCA9IG5vZGUubm9kZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgICBpZiAoaW5kZXggPD0gbWF4SW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBzdWJOb2RlID0gbm9kZS5ub2Rlc1t0aGlzLl9yZXZlcnNlID8gbWF4SW5kZXggLSBpbmRleCA6IGluZGV4XTtcbiAgICAgICAgICAgIGlmIChzdWJOb2RlKSB7XG4gICAgICAgICAgICAgIGlmIChzdWJOb2RlLmVudHJ5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hcEl0ZXJhdG9yVmFsdWUodHlwZSwgc3ViTm9kZS5lbnRyeSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc3RhY2sgPSB0aGlzLl9zdGFjayA9IG1hcEl0ZXJhdG9yRnJhbWUoc3ViTm9kZSwgc3RhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN0YWNrID0gdGhpcy5fc3RhY2sgPSB0aGlzLl9zdGFjay5fX3ByZXY7XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmF0b3JEb25lKCk7XG4gICAgfTtcblxuXG4gIGZ1bmN0aW9uIG1hcEl0ZXJhdG9yVmFsdWUodHlwZSwgZW50cnkpIHtcbiAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZSh0eXBlLCBlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG5cbiAgZnVuY3Rpb24gbWFwSXRlcmF0b3JGcmFtZShub2RlLCBwcmV2KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5vZGU6IG5vZGUsXG4gICAgICBpbmRleDogMCxcbiAgICAgIF9fcHJldjogcHJldlxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlTWFwKHNpemUsIHJvb3QsIG93bmVySUQsIGhhc2gpIHtcbiAgICB2YXIgbWFwID0gT2JqZWN0LmNyZWF0ZShNYXBQcm90b3R5cGUpO1xuICAgIG1hcC5zaXplID0gc2l6ZTtcbiAgICBtYXAuX3Jvb3QgPSByb290O1xuICAgIG1hcC5fX293bmVySUQgPSBvd25lcklEO1xuICAgIG1hcC5fX2hhc2ggPSBoYXNoO1xuICAgIG1hcC5fX2FsdGVyZWQgPSBmYWxzZTtcbiAgICByZXR1cm4gbWFwO1xuICB9XG5cbiAgdmFyIEVNUFRZX01BUDtcbiAgZnVuY3Rpb24gZW1wdHlNYXAoKSB7XG4gICAgcmV0dXJuIEVNUFRZX01BUCB8fCAoRU1QVFlfTUFQID0gbWFrZU1hcCgwKSk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVNYXAobWFwLCBrLCB2KSB7XG4gICAgdmFyIG5ld1Jvb3Q7XG4gICAgdmFyIG5ld1NpemU7XG4gICAgaWYgKCFtYXAuX3Jvb3QpIHtcbiAgICAgIGlmICh2ID09PSBOT1RfU0VUKSB7XG4gICAgICAgIHJldHVybiBtYXA7XG4gICAgICB9XG4gICAgICBuZXdTaXplID0gMTtcbiAgICAgIG5ld1Jvb3QgPSBuZXcgQXJyYXlNYXBOb2RlKG1hcC5fX293bmVySUQsIFtbaywgdl1dKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGRpZENoYW5nZVNpemUgPSBNYWtlUmVmKENIQU5HRV9MRU5HVEgpO1xuICAgICAgdmFyIGRpZEFsdGVyID0gTWFrZVJlZihESURfQUxURVIpO1xuICAgICAgbmV3Um9vdCA9IHVwZGF0ZU5vZGUobWFwLl9yb290LCBtYXAuX19vd25lcklELCAwLCB1bmRlZmluZWQsIGssIHYsIGRpZENoYW5nZVNpemUsIGRpZEFsdGVyKTtcbiAgICAgIGlmICghZGlkQWx0ZXIudmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICAgIH1cbiAgICAgIG5ld1NpemUgPSBtYXAuc2l6ZSArIChkaWRDaGFuZ2VTaXplLnZhbHVlID8gdiA9PT0gTk9UX1NFVCA/IC0xIDogMSA6IDApO1xuICAgIH1cbiAgICBpZiAobWFwLl9fb3duZXJJRCkge1xuICAgICAgbWFwLnNpemUgPSBuZXdTaXplO1xuICAgICAgbWFwLl9yb290ID0gbmV3Um9vdDtcbiAgICAgIG1hcC5fX2hhc2ggPSB1bmRlZmluZWQ7XG4gICAgICBtYXAuX19hbHRlcmVkID0gdHJ1ZTtcbiAgICAgIHJldHVybiBtYXA7XG4gICAgfVxuICAgIHJldHVybiBuZXdSb290ID8gbWFrZU1hcChuZXdTaXplLCBuZXdSb290KSA6IGVtcHR5TWFwKCk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVOb2RlKG5vZGUsIG93bmVySUQsIHNoaWZ0LCBrZXlIYXNoLCBrZXksIHZhbHVlLCBkaWRDaGFuZ2VTaXplLCBkaWRBbHRlcikge1xuICAgIGlmICghbm9kZSkge1xuICAgICAgaWYgKHZhbHVlID09PSBOT1RfU0VUKSB7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgICAgfVxuICAgICAgU2V0UmVmKGRpZEFsdGVyKTtcbiAgICAgIFNldFJlZihkaWRDaGFuZ2VTaXplKTtcbiAgICAgIHJldHVybiBuZXcgVmFsdWVOb2RlKG93bmVySUQsIGtleUhhc2gsIFtrZXksIHZhbHVlXSk7XG4gICAgfVxuICAgIHJldHVybiBub2RlLnVwZGF0ZShvd25lcklELCBzaGlmdCwga2V5SGFzaCwga2V5LCB2YWx1ZSwgZGlkQ2hhbmdlU2l6ZSwgZGlkQWx0ZXIpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNMZWFmTm9kZShub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUuY29uc3RydWN0b3IgPT09IFZhbHVlTm9kZSB8fCBub2RlLmNvbnN0cnVjdG9yID09PSBIYXNoQ29sbGlzaW9uTm9kZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1lcmdlSW50b05vZGUobm9kZSwgb3duZXJJRCwgc2hpZnQsIGtleUhhc2gsIGVudHJ5KSB7XG4gICAgaWYgKG5vZGUua2V5SGFzaCA9PT0ga2V5SGFzaCkge1xuICAgICAgcmV0dXJuIG5ldyBIYXNoQ29sbGlzaW9uTm9kZShvd25lcklELCBrZXlIYXNoLCBbbm9kZS5lbnRyeSwgZW50cnldKTtcbiAgICB9XG5cbiAgICB2YXIgaWR4MSA9IChzaGlmdCA9PT0gMCA/IG5vZGUua2V5SGFzaCA6IG5vZGUua2V5SGFzaCA+Pj4gc2hpZnQpICYgTUFTSztcbiAgICB2YXIgaWR4MiA9IChzaGlmdCA9PT0gMCA/IGtleUhhc2ggOiBrZXlIYXNoID4+PiBzaGlmdCkgJiBNQVNLO1xuXG4gICAgdmFyIG5ld05vZGU7XG4gICAgdmFyIG5vZGVzID0gaWR4MSA9PT0gaWR4MiA/XG4gICAgICBbbWVyZ2VJbnRvTm9kZShub2RlLCBvd25lcklELCBzaGlmdCArIFNISUZULCBrZXlIYXNoLCBlbnRyeSldIDpcbiAgICAgICgobmV3Tm9kZSA9IG5ldyBWYWx1ZU5vZGUob3duZXJJRCwga2V5SGFzaCwgZW50cnkpKSwgaWR4MSA8IGlkeDIgPyBbbm9kZSwgbmV3Tm9kZV0gOiBbbmV3Tm9kZSwgbm9kZV0pO1xuXG4gICAgcmV0dXJuIG5ldyBCaXRtYXBJbmRleGVkTm9kZShvd25lcklELCAoMSA8PCBpZHgxKSB8ICgxIDw8IGlkeDIpLCBub2Rlcyk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVOb2Rlcyhvd25lcklELCBlbnRyaWVzLCBrZXksIHZhbHVlKSB7XG4gICAgaWYgKCFvd25lcklEKSB7XG4gICAgICBvd25lcklEID0gbmV3IE93bmVySUQoKTtcbiAgICB9XG4gICAgdmFyIG5vZGUgPSBuZXcgVmFsdWVOb2RlKG93bmVySUQsIGhhc2goa2V5KSwgW2tleSwgdmFsdWVdKTtcbiAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgZW50cmllcy5sZW5ndGg7IGlpKyspIHtcbiAgICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaWldO1xuICAgICAgbm9kZSA9IG5vZGUudXBkYXRlKG93bmVySUQsIDAsIHVuZGVmaW5lZCwgZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBmdW5jdGlvbiBwYWNrTm9kZXMob3duZXJJRCwgbm9kZXMsIGNvdW50LCBleGNsdWRpbmcpIHtcbiAgICB2YXIgYml0bWFwID0gMDtcbiAgICB2YXIgcGFja2VkSUkgPSAwO1xuICAgIHZhciBwYWNrZWROb2RlcyA9IG5ldyBBcnJheShjb3VudCk7XG4gICAgZm9yICh2YXIgaWkgPSAwLCBiaXQgPSAxLCBsZW4gPSBub2Rlcy5sZW5ndGg7IGlpIDwgbGVuOyBpaSsrLCBiaXQgPDw9IDEpIHtcbiAgICAgIHZhciBub2RlID0gbm9kZXNbaWldO1xuICAgICAgaWYgKG5vZGUgIT09IHVuZGVmaW5lZCAmJiBpaSAhPT0gZXhjbHVkaW5nKSB7XG4gICAgICAgIGJpdG1hcCB8PSBiaXQ7XG4gICAgICAgIHBhY2tlZE5vZGVzW3BhY2tlZElJKytdID0gbm9kZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBCaXRtYXBJbmRleGVkTm9kZShvd25lcklELCBiaXRtYXAsIHBhY2tlZE5vZGVzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGV4cGFuZE5vZGVzKG93bmVySUQsIG5vZGVzLCBiaXRtYXAsIGluY2x1ZGluZywgbm9kZSkge1xuICAgIHZhciBjb3VudCA9IDA7XG4gICAgdmFyIGV4cGFuZGVkTm9kZXMgPSBuZXcgQXJyYXkoU0laRSk7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBiaXRtYXAgIT09IDA7IGlpKyssIGJpdG1hcCA+Pj49IDEpIHtcbiAgICAgIGV4cGFuZGVkTm9kZXNbaWldID0gYml0bWFwICYgMSA/IG5vZGVzW2NvdW50KytdIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgICBleHBhbmRlZE5vZGVzW2luY2x1ZGluZ10gPSBub2RlO1xuICAgIHJldHVybiBuZXcgSGFzaEFycmF5TWFwTm9kZShvd25lcklELCBjb3VudCArIDEsIGV4cGFuZGVkTm9kZXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gbWVyZ2VJbnRvTWFwV2l0aChtYXAsIG1lcmdlciwgaXRlcmFibGVzKSB7XG4gICAgdmFyIGl0ZXJzID0gW107XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IGl0ZXJhYmxlcy5sZW5ndGg7IGlpKyspIHtcbiAgICAgIHZhciB2YWx1ZSA9IGl0ZXJhYmxlc1tpaV07XG4gICAgICB2YXIgaXRlciA9IEtleWVkSXRlcmFibGUodmFsdWUpO1xuICAgICAgaWYgKCFpc0l0ZXJhYmxlKHZhbHVlKSkge1xuICAgICAgICBpdGVyID0gaXRlci5tYXAoZnVuY3Rpb24odiApIHtyZXR1cm4gZnJvbUpTKHYpfSk7XG4gICAgICB9XG4gICAgICBpdGVycy5wdXNoKGl0ZXIpO1xuICAgIH1cbiAgICByZXR1cm4gbWVyZ2VJbnRvQ29sbGVjdGlvbldpdGgobWFwLCBtZXJnZXIsIGl0ZXJzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlZXBNZXJnZXIoZXhpc3RpbmcsIHZhbHVlLCBrZXkpIHtcbiAgICByZXR1cm4gZXhpc3RpbmcgJiYgZXhpc3RpbmcubWVyZ2VEZWVwICYmIGlzSXRlcmFibGUodmFsdWUpID9cbiAgICAgIGV4aXN0aW5nLm1lcmdlRGVlcCh2YWx1ZSkgOlxuICAgICAgaXMoZXhpc3RpbmcsIHZhbHVlKSA/IGV4aXN0aW5nIDogdmFsdWU7XG4gIH1cblxuICBmdW5jdGlvbiBkZWVwTWVyZ2VyV2l0aChtZXJnZXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oZXhpc3RpbmcsIHZhbHVlLCBrZXkpICB7XG4gICAgICBpZiAoZXhpc3RpbmcgJiYgZXhpc3RpbmcubWVyZ2VEZWVwV2l0aCAmJiBpc0l0ZXJhYmxlKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gZXhpc3RpbmcubWVyZ2VEZWVwV2l0aChtZXJnZXIsIHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHZhciBuZXh0VmFsdWUgPSBtZXJnZXIoZXhpc3RpbmcsIHZhbHVlLCBrZXkpO1xuICAgICAgcmV0dXJuIGlzKGV4aXN0aW5nLCBuZXh0VmFsdWUpID8gZXhpc3RpbmcgOiBuZXh0VmFsdWU7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1lcmdlSW50b0NvbGxlY3Rpb25XaXRoKGNvbGxlY3Rpb24sIG1lcmdlciwgaXRlcnMpIHtcbiAgICBpdGVycyA9IGl0ZXJzLmZpbHRlcihmdW5jdGlvbih4ICkge3JldHVybiB4LnNpemUgIT09IDB9KTtcbiAgICBpZiAoaXRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICB9XG4gICAgaWYgKGNvbGxlY3Rpb24uc2l6ZSA9PT0gMCAmJiAhY29sbGVjdGlvbi5fX293bmVySUQgJiYgaXRlcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbi5jb25zdHJ1Y3RvcihpdGVyc1swXSk7XG4gICAgfVxuICAgIHJldHVybiBjb2xsZWN0aW9uLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24oY29sbGVjdGlvbiApIHtcbiAgICAgIHZhciBtZXJnZUludG9NYXAgPSBtZXJnZXIgP1xuICAgICAgICBmdW5jdGlvbih2YWx1ZSwga2V5KSAge1xuICAgICAgICAgIGNvbGxlY3Rpb24udXBkYXRlKGtleSwgTk9UX1NFVCwgZnVuY3Rpb24oZXhpc3RpbmcgKVxuICAgICAgICAgICAge3JldHVybiBleGlzdGluZyA9PT0gTk9UX1NFVCA/IHZhbHVlIDogbWVyZ2VyKGV4aXN0aW5nLCB2YWx1ZSwga2V5KX1cbiAgICAgICAgICApO1xuICAgICAgICB9IDpcbiAgICAgICAgZnVuY3Rpb24odmFsdWUsIGtleSkgIHtcbiAgICAgICAgICBjb2xsZWN0aW9uLnNldChrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IGl0ZXJzLmxlbmd0aDsgaWkrKykge1xuICAgICAgICBpdGVyc1tpaV0uZm9yRWFjaChtZXJnZUludG9NYXApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlSW5EZWVwTWFwKGV4aXN0aW5nLCBrZXlQYXRoSXRlciwgbm90U2V0VmFsdWUsIHVwZGF0ZXIpIHtcbiAgICB2YXIgaXNOb3RTZXQgPSBleGlzdGluZyA9PT0gTk9UX1NFVDtcbiAgICB2YXIgc3RlcCA9IGtleVBhdGhJdGVyLm5leHQoKTtcbiAgICBpZiAoc3RlcC5kb25lKSB7XG4gICAgICB2YXIgZXhpc3RpbmdWYWx1ZSA9IGlzTm90U2V0ID8gbm90U2V0VmFsdWUgOiBleGlzdGluZztcbiAgICAgIHZhciBuZXdWYWx1ZSA9IHVwZGF0ZXIoZXhpc3RpbmdWYWx1ZSk7XG4gICAgICByZXR1cm4gbmV3VmFsdWUgPT09IGV4aXN0aW5nVmFsdWUgPyBleGlzdGluZyA6IG5ld1ZhbHVlO1xuICAgIH1cbiAgICBpbnZhcmlhbnQoXG4gICAgICBpc05vdFNldCB8fCAoZXhpc3RpbmcgJiYgZXhpc3Rpbmcuc2V0KSxcbiAgICAgICdpbnZhbGlkIGtleVBhdGgnXG4gICAgKTtcbiAgICB2YXIga2V5ID0gc3RlcC52YWx1ZTtcbiAgICB2YXIgbmV4dEV4aXN0aW5nID0gaXNOb3RTZXQgPyBOT1RfU0VUIDogZXhpc3RpbmcuZ2V0KGtleSwgTk9UX1NFVCk7XG4gICAgdmFyIG5leHRVcGRhdGVkID0gdXBkYXRlSW5EZWVwTWFwKFxuICAgICAgbmV4dEV4aXN0aW5nLFxuICAgICAga2V5UGF0aEl0ZXIsXG4gICAgICBub3RTZXRWYWx1ZSxcbiAgICAgIHVwZGF0ZXJcbiAgICApO1xuICAgIHJldHVybiBuZXh0VXBkYXRlZCA9PT0gbmV4dEV4aXN0aW5nID8gZXhpc3RpbmcgOlxuICAgICAgbmV4dFVwZGF0ZWQgPT09IE5PVF9TRVQgPyBleGlzdGluZy5yZW1vdmUoa2V5KSA6XG4gICAgICAoaXNOb3RTZXQgPyBlbXB0eU1hcCgpIDogZXhpc3RpbmcpLnNldChrZXksIG5leHRVcGRhdGVkKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBvcENvdW50KHgpIHtcbiAgICB4ID0geCAtICgoeCA+PiAxKSAmIDB4NTU1NTU1NTUpO1xuICAgIHggPSAoeCAmIDB4MzMzMzMzMzMpICsgKCh4ID4+IDIpICYgMHgzMzMzMzMzMyk7XG4gICAgeCA9ICh4ICsgKHggPj4gNCkpICYgMHgwZjBmMGYwZjtcbiAgICB4ID0geCArICh4ID4+IDgpO1xuICAgIHggPSB4ICsgKHggPj4gMTYpO1xuICAgIHJldHVybiB4ICYgMHg3ZjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEluKGFycmF5LCBpZHgsIHZhbCwgY2FuRWRpdCkge1xuICAgIHZhciBuZXdBcnJheSA9IGNhbkVkaXQgPyBhcnJheSA6IGFyckNvcHkoYXJyYXkpO1xuICAgIG5ld0FycmF5W2lkeF0gPSB2YWw7XG4gICAgcmV0dXJuIG5ld0FycmF5O1xuICB9XG5cbiAgZnVuY3Rpb24gc3BsaWNlSW4oYXJyYXksIGlkeCwgdmFsLCBjYW5FZGl0KSB7XG4gICAgdmFyIG5ld0xlbiA9IGFycmF5Lmxlbmd0aCArIDE7XG4gICAgaWYgKGNhbkVkaXQgJiYgaWR4ICsgMSA9PT0gbmV3TGVuKSB7XG4gICAgICBhcnJheVtpZHhdID0gdmFsO1xuICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH1cbiAgICB2YXIgbmV3QXJyYXkgPSBuZXcgQXJyYXkobmV3TGVuKTtcbiAgICB2YXIgYWZ0ZXIgPSAwO1xuICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBuZXdMZW47IGlpKyspIHtcbiAgICAgIGlmIChpaSA9PT0gaWR4KSB7XG4gICAgICAgIG5ld0FycmF5W2lpXSA9IHZhbDtcbiAgICAgICAgYWZ0ZXIgPSAtMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0FycmF5W2lpXSA9IGFycmF5W2lpICsgYWZ0ZXJdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3QXJyYXk7XG4gIH1cblxuICBmdW5jdGlvbiBzcGxpY2VPdXQoYXJyYXksIGlkeCwgY2FuRWRpdCkge1xuICAgIHZhciBuZXdMZW4gPSBhcnJheS5sZW5ndGggLSAxO1xuICAgIGlmIChjYW5FZGl0ICYmIGlkeCA9PT0gbmV3TGVuKSB7XG4gICAgICBhcnJheS5wb3AoKTtcbiAgICAgIHJldHVybiBhcnJheTtcbiAgICB9XG4gICAgdmFyIG5ld0FycmF5ID0gbmV3IEFycmF5KG5ld0xlbik7XG4gICAgdmFyIGFmdGVyID0gMDtcbiAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgbmV3TGVuOyBpaSsrKSB7XG4gICAgICBpZiAoaWkgPT09IGlkeCkge1xuICAgICAgICBhZnRlciA9IDE7XG4gICAgICB9XG4gICAgICBuZXdBcnJheVtpaV0gPSBhcnJheVtpaSArIGFmdGVyXTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld0FycmF5O1xuICB9XG5cbiAgdmFyIE1BWF9BUlJBWV9NQVBfU0laRSA9IFNJWkUgLyA0O1xuICB2YXIgTUFYX0JJVE1BUF9JTkRFWEVEX1NJWkUgPSBTSVpFIC8gMjtcbiAgdmFyIE1JTl9IQVNIX0FSUkFZX01BUF9TSVpFID0gU0laRSAvIDQ7XG5cbiAgY3JlYXRlQ2xhc3MoTGlzdCwgSW5kZXhlZENvbGxlY3Rpb24pO1xuXG4gICAgLy8gQHByYWdtYSBDb25zdHJ1Y3Rpb25cblxuICAgIGZ1bmN0aW9uIExpc3QodmFsdWUpIHtcbiAgICAgIHZhciBlbXB0eSA9IGVtcHR5TGlzdCgpO1xuICAgICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGVtcHR5O1xuICAgICAgfVxuICAgICAgaWYgKGlzTGlzdCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfVxuICAgICAgdmFyIGl0ZXIgPSBJbmRleGVkSXRlcmFibGUodmFsdWUpO1xuICAgICAgdmFyIHNpemUgPSBpdGVyLnNpemU7XG4gICAgICBpZiAoc2l6ZSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gZW1wdHk7XG4gICAgICB9XG4gICAgICBhc3NlcnROb3RJbmZpbml0ZShzaXplKTtcbiAgICAgIGlmIChzaXplID4gMCAmJiBzaXplIDwgU0laRSkge1xuICAgICAgICByZXR1cm4gbWFrZUxpc3QoMCwgc2l6ZSwgU0hJRlQsIG51bGwsIG5ldyBWTm9kZShpdGVyLnRvQXJyYXkoKSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVtcHR5LndpdGhNdXRhdGlvbnMoZnVuY3Rpb24obGlzdCApIHtcbiAgICAgICAgbGlzdC5zZXRTaXplKHNpemUpO1xuICAgICAgICBpdGVyLmZvckVhY2goZnVuY3Rpb24odiwgaSkgIHtyZXR1cm4gbGlzdC5zZXQoaSwgdil9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIExpc3Qub2YgPSBmdW5jdGlvbigvKi4uLnZhbHVlcyovKSB7XG4gICAgICByZXR1cm4gdGhpcyhhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBMaXN0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX190b1N0cmluZygnTGlzdCBbJywgJ10nKTtcbiAgICB9O1xuXG4gICAgLy8gQHByYWdtYSBBY2Nlc3NcblxuICAgIExpc3QucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGluZGV4LCBub3RTZXRWYWx1ZSkge1xuICAgICAgaW5kZXggPSB3cmFwSW5kZXgodGhpcywgaW5kZXgpO1xuICAgICAgaWYgKGluZGV4ID49IDAgJiYgaW5kZXggPCB0aGlzLnNpemUpIHtcbiAgICAgICAgaW5kZXggKz0gdGhpcy5fb3JpZ2luO1xuICAgICAgICB2YXIgbm9kZSA9IGxpc3ROb2RlRm9yKHRoaXMsIGluZGV4KTtcbiAgICAgICAgcmV0dXJuIG5vZGUgJiYgbm9kZS5hcnJheVtpbmRleCAmIE1BU0tdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5vdFNldFZhbHVlO1xuICAgIH07XG5cbiAgICAvLyBAcHJhZ21hIE1vZGlmaWNhdGlvblxuXG4gICAgTGlzdC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oaW5kZXgsIHZhbHVlKSB7XG4gICAgICByZXR1cm4gdXBkYXRlTGlzdCh0aGlzLCBpbmRleCwgdmFsdWUpO1xuICAgIH07XG5cbiAgICBMaXN0LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihpbmRleCkge1xuICAgICAgcmV0dXJuICF0aGlzLmhhcyhpbmRleCkgPyB0aGlzIDpcbiAgICAgICAgaW5kZXggPT09IDAgPyB0aGlzLnNoaWZ0KCkgOlxuICAgICAgICBpbmRleCA9PT0gdGhpcy5zaXplIC0gMSA/IHRoaXMucG9wKCkgOlxuICAgICAgICB0aGlzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfTtcblxuICAgIExpc3QucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uKGluZGV4LCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3BsaWNlKGluZGV4LCAwLCB2YWx1ZSk7XG4gICAgfTtcblxuICAgIExpc3QucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX19vd25lcklEKSB7XG4gICAgICAgIHRoaXMuc2l6ZSA9IHRoaXMuX29yaWdpbiA9IHRoaXMuX2NhcGFjaXR5ID0gMDtcbiAgICAgICAgdGhpcy5fbGV2ZWwgPSBTSElGVDtcbiAgICAgICAgdGhpcy5fcm9vdCA9IHRoaXMuX3RhaWwgPSBudWxsO1xuICAgICAgICB0aGlzLl9faGFzaCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5fX2FsdGVyZWQgPSB0cnVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHJldHVybiBlbXB0eUxpc3QoKTtcbiAgICB9O1xuXG4gICAgTGlzdC5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uKC8qLi4udmFsdWVzKi8pIHtcbiAgICAgIHZhciB2YWx1ZXMgPSBhcmd1bWVudHM7XG4gICAgICB2YXIgb2xkU2l6ZSA9IHRoaXMuc2l6ZTtcbiAgICAgIHJldHVybiB0aGlzLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24obGlzdCApIHtcbiAgICAgICAgc2V0TGlzdEJvdW5kcyhsaXN0LCAwLCBvbGRTaXplICsgdmFsdWVzLmxlbmd0aCk7XG4gICAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCB2YWx1ZXMubGVuZ3RoOyBpaSsrKSB7XG4gICAgICAgICAgbGlzdC5zZXQob2xkU2l6ZSArIGlpLCB2YWx1ZXNbaWldKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIExpc3QucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHNldExpc3RCb3VuZHModGhpcywgMCwgLTEpO1xuICAgIH07XG5cbiAgICBMaXN0LnByb3RvdHlwZS51bnNoaWZ0ID0gZnVuY3Rpb24oLyouLi52YWx1ZXMqLykge1xuICAgICAgdmFyIHZhbHVlcyA9IGFyZ3VtZW50cztcbiAgICAgIHJldHVybiB0aGlzLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24obGlzdCApIHtcbiAgICAgICAgc2V0TGlzdEJvdW5kcyhsaXN0LCAtdmFsdWVzLmxlbmd0aCk7XG4gICAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCB2YWx1ZXMubGVuZ3RoOyBpaSsrKSB7XG4gICAgICAgICAgbGlzdC5zZXQoaWksIHZhbHVlc1tpaV0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgTGlzdC5wcm90b3R5cGUuc2hpZnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBzZXRMaXN0Qm91bmRzKHRoaXMsIDEpO1xuICAgIH07XG5cbiAgICAvLyBAcHJhZ21hIENvbXBvc2l0aW9uXG5cbiAgICBMaXN0LnByb3RvdHlwZS5tZXJnZSA9IGZ1bmN0aW9uKC8qLi4uaXRlcnMqLykge1xuICAgICAgcmV0dXJuIG1lcmdlSW50b0xpc3RXaXRoKHRoaXMsIHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgTGlzdC5wcm90b3R5cGUubWVyZ2VXaXRoID0gZnVuY3Rpb24obWVyZ2VyKSB7dmFyIGl0ZXJzID0gU0xJQ0UkMC5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICByZXR1cm4gbWVyZ2VJbnRvTGlzdFdpdGgodGhpcywgbWVyZ2VyLCBpdGVycyk7XG4gICAgfTtcblxuICAgIExpc3QucHJvdG90eXBlLm1lcmdlRGVlcCA9IGZ1bmN0aW9uKC8qLi4uaXRlcnMqLykge1xuICAgICAgcmV0dXJuIG1lcmdlSW50b0xpc3RXaXRoKHRoaXMsIGRlZXBNZXJnZXIsIGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIExpc3QucHJvdG90eXBlLm1lcmdlRGVlcFdpdGggPSBmdW5jdGlvbihtZXJnZXIpIHt2YXIgaXRlcnMgPSBTTElDRSQwLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgIHJldHVybiBtZXJnZUludG9MaXN0V2l0aCh0aGlzLCBkZWVwTWVyZ2VyV2l0aChtZXJnZXIpLCBpdGVycyk7XG4gICAgfTtcblxuICAgIExpc3QucHJvdG90eXBlLnNldFNpemUgPSBmdW5jdGlvbihzaXplKSB7XG4gICAgICByZXR1cm4gc2V0TGlzdEJvdW5kcyh0aGlzLCAwLCBzaXplKTtcbiAgICB9O1xuXG4gICAgLy8gQHByYWdtYSBJdGVyYXRpb25cblxuICAgIExpc3QucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24oYmVnaW4sIGVuZCkge1xuICAgICAgdmFyIHNpemUgPSB0aGlzLnNpemU7XG4gICAgICBpZiAod2hvbGVTbGljZShiZWdpbiwgZW5kLCBzaXplKSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZXRMaXN0Qm91bmRzKFxuICAgICAgICB0aGlzLFxuICAgICAgICByZXNvbHZlQmVnaW4oYmVnaW4sIHNpemUpLFxuICAgICAgICByZXNvbHZlRW5kKGVuZCwgc2l6ZSlcbiAgICAgICk7XG4gICAgfTtcblxuICAgIExpc3QucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgdmFyIHZhbHVlcyA9IGl0ZXJhdGVMaXN0KHRoaXMsIHJldmVyc2UpO1xuICAgICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbigpICB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHZhbHVlcygpO1xuICAgICAgICByZXR1cm4gdmFsdWUgPT09IERPTkUgP1xuICAgICAgICAgIGl0ZXJhdG9yRG9uZSgpIDpcbiAgICAgICAgICBpdGVyYXRvclZhbHVlKHR5cGUsIGluZGV4KyssIHZhbHVlKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBMaXN0LnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge1xuICAgICAgdmFyIGluZGV4ID0gMDtcbiAgICAgIHZhciB2YWx1ZXMgPSBpdGVyYXRlTGlzdCh0aGlzLCByZXZlcnNlKTtcbiAgICAgIHZhciB2YWx1ZTtcbiAgICAgIHdoaWxlICgodmFsdWUgPSB2YWx1ZXMoKSkgIT09IERPTkUpIHtcbiAgICAgICAgaWYgKGZuKHZhbHVlLCBpbmRleCsrLCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH07XG5cbiAgICBMaXN0LnByb3RvdHlwZS5fX2Vuc3VyZU93bmVyID0gZnVuY3Rpb24ob3duZXJJRCkge1xuICAgICAgaWYgKG93bmVySUQgPT09IHRoaXMuX19vd25lcklEKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgaWYgKCFvd25lcklEKSB7XG4gICAgICAgIHRoaXMuX19vd25lcklEID0gb3duZXJJRDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFrZUxpc3QodGhpcy5fb3JpZ2luLCB0aGlzLl9jYXBhY2l0eSwgdGhpcy5fbGV2ZWwsIHRoaXMuX3Jvb3QsIHRoaXMuX3RhaWwsIG93bmVySUQsIHRoaXMuX19oYXNoKTtcbiAgICB9O1xuXG5cbiAgZnVuY3Rpb24gaXNMaXN0KG1heWJlTGlzdCkge1xuICAgIHJldHVybiAhIShtYXliZUxpc3QgJiYgbWF5YmVMaXN0W0lTX0xJU1RfU0VOVElORUxdKTtcbiAgfVxuXG4gIExpc3QuaXNMaXN0ID0gaXNMaXN0O1xuXG4gIHZhciBJU19MSVNUX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfTElTVF9fQEAnO1xuXG4gIHZhciBMaXN0UHJvdG90eXBlID0gTGlzdC5wcm90b3R5cGU7XG4gIExpc3RQcm90b3R5cGVbSVNfTElTVF9TRU5USU5FTF0gPSB0cnVlO1xuICBMaXN0UHJvdG90eXBlW0RFTEVURV0gPSBMaXN0UHJvdG90eXBlLnJlbW92ZTtcbiAgTGlzdFByb3RvdHlwZS5zZXRJbiA9IE1hcFByb3RvdHlwZS5zZXRJbjtcbiAgTGlzdFByb3RvdHlwZS5kZWxldGVJbiA9XG4gIExpc3RQcm90b3R5cGUucmVtb3ZlSW4gPSBNYXBQcm90b3R5cGUucmVtb3ZlSW47XG4gIExpc3RQcm90b3R5cGUudXBkYXRlID0gTWFwUHJvdG90eXBlLnVwZGF0ZTtcbiAgTGlzdFByb3RvdHlwZS51cGRhdGVJbiA9IE1hcFByb3RvdHlwZS51cGRhdGVJbjtcbiAgTGlzdFByb3RvdHlwZS5tZXJnZUluID0gTWFwUHJvdG90eXBlLm1lcmdlSW47XG4gIExpc3RQcm90b3R5cGUubWVyZ2VEZWVwSW4gPSBNYXBQcm90b3R5cGUubWVyZ2VEZWVwSW47XG4gIExpc3RQcm90b3R5cGUud2l0aE11dGF0aW9ucyA9IE1hcFByb3RvdHlwZS53aXRoTXV0YXRpb25zO1xuICBMaXN0UHJvdG90eXBlLmFzTXV0YWJsZSA9IE1hcFByb3RvdHlwZS5hc011dGFibGU7XG4gIExpc3RQcm90b3R5cGUuYXNJbW11dGFibGUgPSBNYXBQcm90b3R5cGUuYXNJbW11dGFibGU7XG4gIExpc3RQcm90b3R5cGUud2FzQWx0ZXJlZCA9IE1hcFByb3RvdHlwZS53YXNBbHRlcmVkO1xuXG5cblxuICAgIGZ1bmN0aW9uIFZOb2RlKGFycmF5LCBvd25lcklEKSB7XG4gICAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG4gICAgICB0aGlzLm93bmVySUQgPSBvd25lcklEO1xuICAgIH1cblxuICAgIC8vIFRPRE86IHNlZW1zIGxpa2UgdGhlc2UgbWV0aG9kcyBhcmUgdmVyeSBzaW1pbGFyXG5cbiAgICBWTm9kZS5wcm90b3R5cGUucmVtb3ZlQmVmb3JlID0gZnVuY3Rpb24ob3duZXJJRCwgbGV2ZWwsIGluZGV4KSB7XG4gICAgICBpZiAoaW5kZXggPT09IGxldmVsID8gMSA8PCBsZXZlbCA6IDAgfHwgdGhpcy5hcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICB2YXIgb3JpZ2luSW5kZXggPSAoaW5kZXggPj4+IGxldmVsKSAmIE1BU0s7XG4gICAgICBpZiAob3JpZ2luSW5kZXggPj0gdGhpcy5hcnJheS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWTm9kZShbXSwgb3duZXJJRCk7XG4gICAgICB9XG4gICAgICB2YXIgcmVtb3ZpbmdGaXJzdCA9IG9yaWdpbkluZGV4ID09PSAwO1xuICAgICAgdmFyIG5ld0NoaWxkO1xuICAgICAgaWYgKGxldmVsID4gMCkge1xuICAgICAgICB2YXIgb2xkQ2hpbGQgPSB0aGlzLmFycmF5W29yaWdpbkluZGV4XTtcbiAgICAgICAgbmV3Q2hpbGQgPSBvbGRDaGlsZCAmJiBvbGRDaGlsZC5yZW1vdmVCZWZvcmUob3duZXJJRCwgbGV2ZWwgLSBTSElGVCwgaW5kZXgpO1xuICAgICAgICBpZiAobmV3Q2hpbGQgPT09IG9sZENoaWxkICYmIHJlbW92aW5nRmlyc3QpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHJlbW92aW5nRmlyc3QgJiYgIW5ld0NoaWxkKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgdmFyIGVkaXRhYmxlID0gZWRpdGFibGVWTm9kZSh0aGlzLCBvd25lcklEKTtcbiAgICAgIGlmICghcmVtb3ZpbmdGaXJzdCkge1xuICAgICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgb3JpZ2luSW5kZXg7IGlpKyspIHtcbiAgICAgICAgICBlZGl0YWJsZS5hcnJheVtpaV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChuZXdDaGlsZCkge1xuICAgICAgICBlZGl0YWJsZS5hcnJheVtvcmlnaW5JbmRleF0gPSBuZXdDaGlsZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlZGl0YWJsZTtcbiAgICB9O1xuXG4gICAgVk5vZGUucHJvdG90eXBlLnJlbW92ZUFmdGVyID0gZnVuY3Rpb24ob3duZXJJRCwgbGV2ZWwsIGluZGV4KSB7XG4gICAgICBpZiAoaW5kZXggPT09IChsZXZlbCA/IDEgPDwgbGV2ZWwgOiAwKSB8fCB0aGlzLmFycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHZhciBzaXplSW5kZXggPSAoKGluZGV4IC0gMSkgPj4+IGxldmVsKSAmIE1BU0s7XG4gICAgICBpZiAoc2l6ZUluZGV4ID49IHRoaXMuYXJyYXkubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICB2YXIgbmV3Q2hpbGQ7XG4gICAgICBpZiAobGV2ZWwgPiAwKSB7XG4gICAgICAgIHZhciBvbGRDaGlsZCA9IHRoaXMuYXJyYXlbc2l6ZUluZGV4XTtcbiAgICAgICAgbmV3Q2hpbGQgPSBvbGRDaGlsZCAmJiBvbGRDaGlsZC5yZW1vdmVBZnRlcihvd25lcklELCBsZXZlbCAtIFNISUZULCBpbmRleCk7XG4gICAgICAgIGlmIChuZXdDaGlsZCA9PT0gb2xkQ2hpbGQgJiYgc2l6ZUluZGV4ID09PSB0aGlzLmFycmF5Lmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgZWRpdGFibGUgPSBlZGl0YWJsZVZOb2RlKHRoaXMsIG93bmVySUQpO1xuICAgICAgZWRpdGFibGUuYXJyYXkuc3BsaWNlKHNpemVJbmRleCArIDEpO1xuICAgICAgaWYgKG5ld0NoaWxkKSB7XG4gICAgICAgIGVkaXRhYmxlLmFycmF5W3NpemVJbmRleF0gPSBuZXdDaGlsZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlZGl0YWJsZTtcbiAgICB9O1xuXG5cblxuICB2YXIgRE9ORSA9IHt9O1xuXG4gIGZ1bmN0aW9uIGl0ZXJhdGVMaXN0KGxpc3QsIHJldmVyc2UpIHtcbiAgICB2YXIgbGVmdCA9IGxpc3QuX29yaWdpbjtcbiAgICB2YXIgcmlnaHQgPSBsaXN0Ll9jYXBhY2l0eTtcbiAgICB2YXIgdGFpbFBvcyA9IGdldFRhaWxPZmZzZXQocmlnaHQpO1xuICAgIHZhciB0YWlsID0gbGlzdC5fdGFpbDtcblxuICAgIHJldHVybiBpdGVyYXRlTm9kZU9yTGVhZihsaXN0Ll9yb290LCBsaXN0Ll9sZXZlbCwgMCk7XG5cbiAgICBmdW5jdGlvbiBpdGVyYXRlTm9kZU9yTGVhZihub2RlLCBsZXZlbCwgb2Zmc2V0KSB7XG4gICAgICByZXR1cm4gbGV2ZWwgPT09IDAgP1xuICAgICAgICBpdGVyYXRlTGVhZihub2RlLCBvZmZzZXQpIDpcbiAgICAgICAgaXRlcmF0ZU5vZGUobm9kZSwgbGV2ZWwsIG9mZnNldCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXRlcmF0ZUxlYWYobm9kZSwgb2Zmc2V0KSB7XG4gICAgICB2YXIgYXJyYXkgPSBvZmZzZXQgPT09IHRhaWxQb3MgPyB0YWlsICYmIHRhaWwuYXJyYXkgOiBub2RlICYmIG5vZGUuYXJyYXk7XG4gICAgICB2YXIgZnJvbSA9IG9mZnNldCA+IGxlZnQgPyAwIDogbGVmdCAtIG9mZnNldDtcbiAgICAgIHZhciB0byA9IHJpZ2h0IC0gb2Zmc2V0O1xuICAgICAgaWYgKHRvID4gU0laRSkge1xuICAgICAgICB0byA9IFNJWkU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSAge1xuICAgICAgICBpZiAoZnJvbSA9PT0gdG8pIHtcbiAgICAgICAgICByZXR1cm4gRE9ORTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaWR4ID0gcmV2ZXJzZSA/IC0tdG8gOiBmcm9tKys7XG4gICAgICAgIHJldHVybiBhcnJheSAmJiBhcnJheVtpZHhdO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpdGVyYXRlTm9kZShub2RlLCBsZXZlbCwgb2Zmc2V0KSB7XG4gICAgICB2YXIgdmFsdWVzO1xuICAgICAgdmFyIGFycmF5ID0gbm9kZSAmJiBub2RlLmFycmF5O1xuICAgICAgdmFyIGZyb20gPSBvZmZzZXQgPiBsZWZ0ID8gMCA6IChsZWZ0IC0gb2Zmc2V0KSA+PiBsZXZlbDtcbiAgICAgIHZhciB0byA9ICgocmlnaHQgLSBvZmZzZXQpID4+IGxldmVsKSArIDE7XG4gICAgICBpZiAodG8gPiBTSVpFKSB7XG4gICAgICAgIHRvID0gU0laRTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmdW5jdGlvbigpICB7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB2YWx1ZXMoKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gRE9ORSkge1xuICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZXMgPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZnJvbSA9PT0gdG8pIHtcbiAgICAgICAgICAgIHJldHVybiBET05FO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgaWR4ID0gcmV2ZXJzZSA/IC0tdG8gOiBmcm9tKys7XG4gICAgICAgICAgdmFsdWVzID0gaXRlcmF0ZU5vZGVPckxlYWYoXG4gICAgICAgICAgICBhcnJheSAmJiBhcnJheVtpZHhdLCBsZXZlbCAtIFNISUZULCBvZmZzZXQgKyAoaWR4IDw8IGxldmVsKVxuICAgICAgICAgICk7XG4gICAgICAgIH0gd2hpbGUgKHRydWUpO1xuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlTGlzdChvcmlnaW4sIGNhcGFjaXR5LCBsZXZlbCwgcm9vdCwgdGFpbCwgb3duZXJJRCwgaGFzaCkge1xuICAgIHZhciBsaXN0ID0gT2JqZWN0LmNyZWF0ZShMaXN0UHJvdG90eXBlKTtcbiAgICBsaXN0LnNpemUgPSBjYXBhY2l0eSAtIG9yaWdpbjtcbiAgICBsaXN0Ll9vcmlnaW4gPSBvcmlnaW47XG4gICAgbGlzdC5fY2FwYWNpdHkgPSBjYXBhY2l0eTtcbiAgICBsaXN0Ll9sZXZlbCA9IGxldmVsO1xuICAgIGxpc3QuX3Jvb3QgPSByb290O1xuICAgIGxpc3QuX3RhaWwgPSB0YWlsO1xuICAgIGxpc3QuX19vd25lcklEID0gb3duZXJJRDtcbiAgICBsaXN0Ll9faGFzaCA9IGhhc2g7XG4gICAgbGlzdC5fX2FsdGVyZWQgPSBmYWxzZTtcbiAgICByZXR1cm4gbGlzdDtcbiAgfVxuXG4gIHZhciBFTVBUWV9MSVNUO1xuICBmdW5jdGlvbiBlbXB0eUxpc3QoKSB7XG4gICAgcmV0dXJuIEVNUFRZX0xJU1QgfHwgKEVNUFRZX0xJU1QgPSBtYWtlTGlzdCgwLCAwLCBTSElGVCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlTGlzdChsaXN0LCBpbmRleCwgdmFsdWUpIHtcbiAgICBpbmRleCA9IHdyYXBJbmRleChsaXN0LCBpbmRleCk7XG5cbiAgICBpZiAoaW5kZXggIT09IGluZGV4KSB7XG4gICAgICByZXR1cm4gbGlzdDtcbiAgICB9XG5cbiAgICBpZiAoaW5kZXggPj0gbGlzdC5zaXplIHx8IGluZGV4IDwgMCkge1xuICAgICAgcmV0dXJuIGxpc3Qud2l0aE11dGF0aW9ucyhmdW5jdGlvbihsaXN0ICkge1xuICAgICAgICBpbmRleCA8IDAgP1xuICAgICAgICAgIHNldExpc3RCb3VuZHMobGlzdCwgaW5kZXgpLnNldCgwLCB2YWx1ZSkgOlxuICAgICAgICAgIHNldExpc3RCb3VuZHMobGlzdCwgMCwgaW5kZXggKyAxKS5zZXQoaW5kZXgsIHZhbHVlKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW5kZXggKz0gbGlzdC5fb3JpZ2luO1xuXG4gICAgdmFyIG5ld1RhaWwgPSBsaXN0Ll90YWlsO1xuICAgIHZhciBuZXdSb290ID0gbGlzdC5fcm9vdDtcbiAgICB2YXIgZGlkQWx0ZXIgPSBNYWtlUmVmKERJRF9BTFRFUik7XG4gICAgaWYgKGluZGV4ID49IGdldFRhaWxPZmZzZXQobGlzdC5fY2FwYWNpdHkpKSB7XG4gICAgICBuZXdUYWlsID0gdXBkYXRlVk5vZGUobmV3VGFpbCwgbGlzdC5fX293bmVySUQsIDAsIGluZGV4LCB2YWx1ZSwgZGlkQWx0ZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdSb290ID0gdXBkYXRlVk5vZGUobmV3Um9vdCwgbGlzdC5fX293bmVySUQsIGxpc3QuX2xldmVsLCBpbmRleCwgdmFsdWUsIGRpZEFsdGVyKTtcbiAgICB9XG5cbiAgICBpZiAoIWRpZEFsdGVyLnZhbHVlKSB7XG4gICAgICByZXR1cm4gbGlzdDtcbiAgICB9XG5cbiAgICBpZiAobGlzdC5fX293bmVySUQpIHtcbiAgICAgIGxpc3QuX3Jvb3QgPSBuZXdSb290O1xuICAgICAgbGlzdC5fdGFpbCA9IG5ld1RhaWw7XG4gICAgICBsaXN0Ll9faGFzaCA9IHVuZGVmaW5lZDtcbiAgICAgIGxpc3QuX19hbHRlcmVkID0gdHJ1ZTtcbiAgICAgIHJldHVybiBsaXN0O1xuICAgIH1cbiAgICByZXR1cm4gbWFrZUxpc3QobGlzdC5fb3JpZ2luLCBsaXN0Ll9jYXBhY2l0eSwgbGlzdC5fbGV2ZWwsIG5ld1Jvb3QsIG5ld1RhaWwpO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlVk5vZGUobm9kZSwgb3duZXJJRCwgbGV2ZWwsIGluZGV4LCB2YWx1ZSwgZGlkQWx0ZXIpIHtcbiAgICB2YXIgaWR4ID0gKGluZGV4ID4+PiBsZXZlbCkgJiBNQVNLO1xuICAgIHZhciBub2RlSGFzID0gbm9kZSAmJiBpZHggPCBub2RlLmFycmF5Lmxlbmd0aDtcbiAgICBpZiAoIW5vZGVIYXMgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG4gICAgdmFyIG5ld05vZGU7XG5cbiAgICBpZiAobGV2ZWwgPiAwKSB7XG4gICAgICB2YXIgbG93ZXJOb2RlID0gbm9kZSAmJiBub2RlLmFycmF5W2lkeF07XG4gICAgICB2YXIgbmV3TG93ZXJOb2RlID0gdXBkYXRlVk5vZGUobG93ZXJOb2RlLCBvd25lcklELCBsZXZlbCAtIFNISUZULCBpbmRleCwgdmFsdWUsIGRpZEFsdGVyKTtcbiAgICAgIGlmIChuZXdMb3dlck5vZGUgPT09IGxvd2VyTm9kZSkge1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgIH1cbiAgICAgIG5ld05vZGUgPSBlZGl0YWJsZVZOb2RlKG5vZGUsIG93bmVySUQpO1xuICAgICAgbmV3Tm9kZS5hcnJheVtpZHhdID0gbmV3TG93ZXJOb2RlO1xuICAgICAgcmV0dXJuIG5ld05vZGU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGVIYXMgJiYgbm9kZS5hcnJheVtpZHhdID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG4gICAgU2V0UmVmKGRpZEFsdGVyKTtcblxuICAgIG5ld05vZGUgPSBlZGl0YWJsZVZOb2RlKG5vZGUsIG93bmVySUQpO1xuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmIGlkeCA9PT0gbmV3Tm9kZS5hcnJheS5sZW5ndGggLSAxKSB7XG4gICAgICBuZXdOb2RlLmFycmF5LnBvcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdOb2RlLmFycmF5W2lkeF0gPSB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld05vZGU7XG4gIH1cblxuICBmdW5jdGlvbiBlZGl0YWJsZVZOb2RlKG5vZGUsIG93bmVySUQpIHtcbiAgICBpZiAob3duZXJJRCAmJiBub2RlICYmIG93bmVySUQgPT09IG5vZGUub3duZXJJRCkge1xuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIHJldHVybiBuZXcgVk5vZGUobm9kZSA/IG5vZGUuYXJyYXkuc2xpY2UoKSA6IFtdLCBvd25lcklEKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxpc3ROb2RlRm9yKGxpc3QsIHJhd0luZGV4KSB7XG4gICAgaWYgKHJhd0luZGV4ID49IGdldFRhaWxPZmZzZXQobGlzdC5fY2FwYWNpdHkpKSB7XG4gICAgICByZXR1cm4gbGlzdC5fdGFpbDtcbiAgICB9XG4gICAgaWYgKHJhd0luZGV4IDwgMSA8PCAobGlzdC5fbGV2ZWwgKyBTSElGVCkpIHtcbiAgICAgIHZhciBub2RlID0gbGlzdC5fcm9vdDtcbiAgICAgIHZhciBsZXZlbCA9IGxpc3QuX2xldmVsO1xuICAgICAgd2hpbGUgKG5vZGUgJiYgbGV2ZWwgPiAwKSB7XG4gICAgICAgIG5vZGUgPSBub2RlLmFycmF5WyhyYXdJbmRleCA+Pj4gbGV2ZWwpICYgTUFTS107XG4gICAgICAgIGxldmVsIC09IFNISUZUO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0TGlzdEJvdW5kcyhsaXN0LCBiZWdpbiwgZW5kKSB7XG4gICAgLy8gU2FuaXRpemUgYmVnaW4gJiBlbmQgdXNpbmcgdGhpcyBzaG9ydGhhbmQgZm9yIFRvSW50MzIoYXJndW1lbnQpXG4gICAgLy8gaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXRvaW50MzJcbiAgICBpZiAoYmVnaW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgYmVnaW4gPSBiZWdpbiB8IDA7XG4gICAgfVxuICAgIGlmIChlbmQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZW5kID0gZW5kIHwgMDtcbiAgICB9XG4gICAgdmFyIG93bmVyID0gbGlzdC5fX293bmVySUQgfHwgbmV3IE93bmVySUQoKTtcbiAgICB2YXIgb2xkT3JpZ2luID0gbGlzdC5fb3JpZ2luO1xuICAgIHZhciBvbGRDYXBhY2l0eSA9IGxpc3QuX2NhcGFjaXR5O1xuICAgIHZhciBuZXdPcmlnaW4gPSBvbGRPcmlnaW4gKyBiZWdpbjtcbiAgICB2YXIgbmV3Q2FwYWNpdHkgPSBlbmQgPT09IHVuZGVmaW5lZCA/IG9sZENhcGFjaXR5IDogZW5kIDwgMCA/IG9sZENhcGFjaXR5ICsgZW5kIDogb2xkT3JpZ2luICsgZW5kO1xuICAgIGlmIChuZXdPcmlnaW4gPT09IG9sZE9yaWdpbiAmJiBuZXdDYXBhY2l0eSA9PT0gb2xkQ2FwYWNpdHkpIHtcbiAgICAgIHJldHVybiBsaXN0O1xuICAgIH1cblxuICAgIC8vIElmIGl0J3MgZ29pbmcgdG8gZW5kIGFmdGVyIGl0IHN0YXJ0cywgaXQncyBlbXB0eS5cbiAgICBpZiAobmV3T3JpZ2luID49IG5ld0NhcGFjaXR5KSB7XG4gICAgICByZXR1cm4gbGlzdC5jbGVhcigpO1xuICAgIH1cblxuICAgIHZhciBuZXdMZXZlbCA9IGxpc3QuX2xldmVsO1xuICAgIHZhciBuZXdSb290ID0gbGlzdC5fcm9vdDtcblxuICAgIC8vIE5ldyBvcmlnaW4gbWlnaHQgbmVlZCBjcmVhdGluZyBhIGhpZ2hlciByb290LlxuICAgIHZhciBvZmZzZXRTaGlmdCA9IDA7XG4gICAgd2hpbGUgKG5ld09yaWdpbiArIG9mZnNldFNoaWZ0IDwgMCkge1xuICAgICAgbmV3Um9vdCA9IG5ldyBWTm9kZShuZXdSb290ICYmIG5ld1Jvb3QuYXJyYXkubGVuZ3RoID8gW3VuZGVmaW5lZCwgbmV3Um9vdF0gOiBbXSwgb3duZXIpO1xuICAgICAgbmV3TGV2ZWwgKz0gU0hJRlQ7XG4gICAgICBvZmZzZXRTaGlmdCArPSAxIDw8IG5ld0xldmVsO1xuICAgIH1cbiAgICBpZiAob2Zmc2V0U2hpZnQpIHtcbiAgICAgIG5ld09yaWdpbiArPSBvZmZzZXRTaGlmdDtcbiAgICAgIG9sZE9yaWdpbiArPSBvZmZzZXRTaGlmdDtcbiAgICAgIG5ld0NhcGFjaXR5ICs9IG9mZnNldFNoaWZ0O1xuICAgICAgb2xkQ2FwYWNpdHkgKz0gb2Zmc2V0U2hpZnQ7XG4gICAgfVxuXG4gICAgdmFyIG9sZFRhaWxPZmZzZXQgPSBnZXRUYWlsT2Zmc2V0KG9sZENhcGFjaXR5KTtcbiAgICB2YXIgbmV3VGFpbE9mZnNldCA9IGdldFRhaWxPZmZzZXQobmV3Q2FwYWNpdHkpO1xuXG4gICAgLy8gTmV3IHNpemUgbWlnaHQgbmVlZCBjcmVhdGluZyBhIGhpZ2hlciByb290LlxuICAgIHdoaWxlIChuZXdUYWlsT2Zmc2V0ID49IDEgPDwgKG5ld0xldmVsICsgU0hJRlQpKSB7XG4gICAgICBuZXdSb290ID0gbmV3IFZOb2RlKG5ld1Jvb3QgJiYgbmV3Um9vdC5hcnJheS5sZW5ndGggPyBbbmV3Um9vdF0gOiBbXSwgb3duZXIpO1xuICAgICAgbmV3TGV2ZWwgKz0gU0hJRlQ7XG4gICAgfVxuXG4gICAgLy8gTG9jYXRlIG9yIGNyZWF0ZSB0aGUgbmV3IHRhaWwuXG4gICAgdmFyIG9sZFRhaWwgPSBsaXN0Ll90YWlsO1xuICAgIHZhciBuZXdUYWlsID0gbmV3VGFpbE9mZnNldCA8IG9sZFRhaWxPZmZzZXQgP1xuICAgICAgbGlzdE5vZGVGb3IobGlzdCwgbmV3Q2FwYWNpdHkgLSAxKSA6XG4gICAgICBuZXdUYWlsT2Zmc2V0ID4gb2xkVGFpbE9mZnNldCA/IG5ldyBWTm9kZShbXSwgb3duZXIpIDogb2xkVGFpbDtcblxuICAgIC8vIE1lcmdlIFRhaWwgaW50byB0cmVlLlxuICAgIGlmIChvbGRUYWlsICYmIG5ld1RhaWxPZmZzZXQgPiBvbGRUYWlsT2Zmc2V0ICYmIG5ld09yaWdpbiA8IG9sZENhcGFjaXR5ICYmIG9sZFRhaWwuYXJyYXkubGVuZ3RoKSB7XG4gICAgICBuZXdSb290ID0gZWRpdGFibGVWTm9kZShuZXdSb290LCBvd25lcik7XG4gICAgICB2YXIgbm9kZSA9IG5ld1Jvb3Q7XG4gICAgICBmb3IgKHZhciBsZXZlbCA9IG5ld0xldmVsOyBsZXZlbCA+IFNISUZUOyBsZXZlbCAtPSBTSElGVCkge1xuICAgICAgICB2YXIgaWR4ID0gKG9sZFRhaWxPZmZzZXQgPj4+IGxldmVsKSAmIE1BU0s7XG4gICAgICAgIG5vZGUgPSBub2RlLmFycmF5W2lkeF0gPSBlZGl0YWJsZVZOb2RlKG5vZGUuYXJyYXlbaWR4XSwgb3duZXIpO1xuICAgICAgfVxuICAgICAgbm9kZS5hcnJheVsob2xkVGFpbE9mZnNldCA+Pj4gU0hJRlQpICYgTUFTS10gPSBvbGRUYWlsO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBzaXplIGhhcyBiZWVuIHJlZHVjZWQsIHRoZXJlJ3MgYSBjaGFuY2UgdGhlIHRhaWwgbmVlZHMgdG8gYmUgdHJpbW1lZC5cbiAgICBpZiAobmV3Q2FwYWNpdHkgPCBvbGRDYXBhY2l0eSkge1xuICAgICAgbmV3VGFpbCA9IG5ld1RhaWwgJiYgbmV3VGFpbC5yZW1vdmVBZnRlcihvd25lciwgMCwgbmV3Q2FwYWNpdHkpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBuZXcgb3JpZ2luIGlzIHdpdGhpbiB0aGUgdGFpbCwgdGhlbiB3ZSBkbyBub3QgbmVlZCBhIHJvb3QuXG4gICAgaWYgKG5ld09yaWdpbiA+PSBuZXdUYWlsT2Zmc2V0KSB7XG4gICAgICBuZXdPcmlnaW4gLT0gbmV3VGFpbE9mZnNldDtcbiAgICAgIG5ld0NhcGFjaXR5IC09IG5ld1RhaWxPZmZzZXQ7XG4gICAgICBuZXdMZXZlbCA9IFNISUZUO1xuICAgICAgbmV3Um9vdCA9IG51bGw7XG4gICAgICBuZXdUYWlsID0gbmV3VGFpbCAmJiBuZXdUYWlsLnJlbW92ZUJlZm9yZShvd25lciwgMCwgbmV3T3JpZ2luKTtcblxuICAgIC8vIE90aGVyd2lzZSwgaWYgdGhlIHJvb3QgaGFzIGJlZW4gdHJpbW1lZCwgZ2FyYmFnZSBjb2xsZWN0LlxuICAgIH0gZWxzZSBpZiAobmV3T3JpZ2luID4gb2xkT3JpZ2luIHx8IG5ld1RhaWxPZmZzZXQgPCBvbGRUYWlsT2Zmc2V0KSB7XG4gICAgICBvZmZzZXRTaGlmdCA9IDA7XG5cbiAgICAgIC8vIElkZW50aWZ5IHRoZSBuZXcgdG9wIHJvb3Qgbm9kZSBvZiB0aGUgc3VidHJlZSBvZiB0aGUgb2xkIHJvb3QuXG4gICAgICB3aGlsZSAobmV3Um9vdCkge1xuICAgICAgICB2YXIgYmVnaW5JbmRleCA9IChuZXdPcmlnaW4gPj4+IG5ld0xldmVsKSAmIE1BU0s7XG4gICAgICAgIGlmIChiZWdpbkluZGV4ICE9PSAobmV3VGFpbE9mZnNldCA+Pj4gbmV3TGV2ZWwpICYgTUFTSykge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiZWdpbkluZGV4KSB7XG4gICAgICAgICAgb2Zmc2V0U2hpZnQgKz0gKDEgPDwgbmV3TGV2ZWwpICogYmVnaW5JbmRleDtcbiAgICAgICAgfVxuICAgICAgICBuZXdMZXZlbCAtPSBTSElGVDtcbiAgICAgICAgbmV3Um9vdCA9IG5ld1Jvb3QuYXJyYXlbYmVnaW5JbmRleF07XG4gICAgICB9XG5cbiAgICAgIC8vIFRyaW0gdGhlIG5ldyBzaWRlcyBvZiB0aGUgbmV3IHJvb3QuXG4gICAgICBpZiAobmV3Um9vdCAmJiBuZXdPcmlnaW4gPiBvbGRPcmlnaW4pIHtcbiAgICAgICAgbmV3Um9vdCA9IG5ld1Jvb3QucmVtb3ZlQmVmb3JlKG93bmVyLCBuZXdMZXZlbCwgbmV3T3JpZ2luIC0gb2Zmc2V0U2hpZnQpO1xuICAgICAgfVxuICAgICAgaWYgKG5ld1Jvb3QgJiYgbmV3VGFpbE9mZnNldCA8IG9sZFRhaWxPZmZzZXQpIHtcbiAgICAgICAgbmV3Um9vdCA9IG5ld1Jvb3QucmVtb3ZlQWZ0ZXIob3duZXIsIG5ld0xldmVsLCBuZXdUYWlsT2Zmc2V0IC0gb2Zmc2V0U2hpZnQpO1xuICAgICAgfVxuICAgICAgaWYgKG9mZnNldFNoaWZ0KSB7XG4gICAgICAgIG5ld09yaWdpbiAtPSBvZmZzZXRTaGlmdDtcbiAgICAgICAgbmV3Q2FwYWNpdHkgLT0gb2Zmc2V0U2hpZnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGxpc3QuX19vd25lcklEKSB7XG4gICAgICBsaXN0LnNpemUgPSBuZXdDYXBhY2l0eSAtIG5ld09yaWdpbjtcbiAgICAgIGxpc3QuX29yaWdpbiA9IG5ld09yaWdpbjtcbiAgICAgIGxpc3QuX2NhcGFjaXR5ID0gbmV3Q2FwYWNpdHk7XG4gICAgICBsaXN0Ll9sZXZlbCA9IG5ld0xldmVsO1xuICAgICAgbGlzdC5fcm9vdCA9IG5ld1Jvb3Q7XG4gICAgICBsaXN0Ll90YWlsID0gbmV3VGFpbDtcbiAgICAgIGxpc3QuX19oYXNoID0gdW5kZWZpbmVkO1xuICAgICAgbGlzdC5fX2FsdGVyZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgfVxuICAgIHJldHVybiBtYWtlTGlzdChuZXdPcmlnaW4sIG5ld0NhcGFjaXR5LCBuZXdMZXZlbCwgbmV3Um9vdCwgbmV3VGFpbCk7XG4gIH1cblxuICBmdW5jdGlvbiBtZXJnZUludG9MaXN0V2l0aChsaXN0LCBtZXJnZXIsIGl0ZXJhYmxlcykge1xuICAgIHZhciBpdGVycyA9IFtdO1xuICAgIHZhciBtYXhTaXplID0gMDtcbiAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgaXRlcmFibGVzLmxlbmd0aDsgaWkrKykge1xuICAgICAgdmFyIHZhbHVlID0gaXRlcmFibGVzW2lpXTtcbiAgICAgIHZhciBpdGVyID0gSW5kZXhlZEl0ZXJhYmxlKHZhbHVlKTtcbiAgICAgIGlmIChpdGVyLnNpemUgPiBtYXhTaXplKSB7XG4gICAgICAgIG1heFNpemUgPSBpdGVyLnNpemU7XG4gICAgICB9XG4gICAgICBpZiAoIWlzSXRlcmFibGUodmFsdWUpKSB7XG4gICAgICAgIGl0ZXIgPSBpdGVyLm1hcChmdW5jdGlvbih2ICkge3JldHVybiBmcm9tSlModil9KTtcbiAgICAgIH1cbiAgICAgIGl0ZXJzLnB1c2goaXRlcik7XG4gICAgfVxuICAgIGlmIChtYXhTaXplID4gbGlzdC5zaXplKSB7XG4gICAgICBsaXN0ID0gbGlzdC5zZXRTaXplKG1heFNpemUpO1xuICAgIH1cbiAgICByZXR1cm4gbWVyZ2VJbnRvQ29sbGVjdGlvbldpdGgobGlzdCwgbWVyZ2VyLCBpdGVycyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRUYWlsT2Zmc2V0KHNpemUpIHtcbiAgICByZXR1cm4gc2l6ZSA8IFNJWkUgPyAwIDogKCgoc2l6ZSAtIDEpID4+PiBTSElGVCkgPDwgU0hJRlQpO1xuICB9XG5cbiAgY3JlYXRlQ2xhc3MoT3JkZXJlZE1hcCwgTWFwKTtcblxuICAgIC8vIEBwcmFnbWEgQ29uc3RydWN0aW9uXG5cbiAgICBmdW5jdGlvbiBPcmRlcmVkTWFwKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCA/IGVtcHR5T3JkZXJlZE1hcCgpIDpcbiAgICAgICAgaXNPcmRlcmVkTWFwKHZhbHVlKSA/IHZhbHVlIDpcbiAgICAgICAgZW1wdHlPcmRlcmVkTWFwKCkud2l0aE11dGF0aW9ucyhmdW5jdGlvbihtYXAgKSB7XG4gICAgICAgICAgdmFyIGl0ZXIgPSBLZXllZEl0ZXJhYmxlKHZhbHVlKTtcbiAgICAgICAgICBhc3NlcnROb3RJbmZpbml0ZShpdGVyLnNpemUpO1xuICAgICAgICAgIGl0ZXIuZm9yRWFjaChmdW5jdGlvbih2LCBrKSAge3JldHVybiBtYXAuc2V0KGssIHYpfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIE9yZGVyZWRNYXAub2YgPSBmdW5jdGlvbigvKi4uLnZhbHVlcyovKSB7XG4gICAgICByZXR1cm4gdGhpcyhhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBPcmRlcmVkTWFwLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX190b1N0cmluZygnT3JkZXJlZE1hcCB7JywgJ30nKTtcbiAgICB9O1xuXG4gICAgLy8gQHByYWdtYSBBY2Nlc3NcblxuICAgIE9yZGVyZWRNYXAucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGssIG5vdFNldFZhbHVlKSB7XG4gICAgICB2YXIgaW5kZXggPSB0aGlzLl9tYXAuZ2V0KGspO1xuICAgICAgcmV0dXJuIGluZGV4ICE9PSB1bmRlZmluZWQgPyB0aGlzLl9saXN0LmdldChpbmRleClbMV0gOiBub3RTZXRWYWx1ZTtcbiAgICB9O1xuXG4gICAgLy8gQHByYWdtYSBNb2RpZmljYXRpb25cblxuICAgIE9yZGVyZWRNYXAucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX19vd25lcklEKSB7XG4gICAgICAgIHRoaXMuc2l6ZSA9IDA7XG4gICAgICAgIHRoaXMuX21hcC5jbGVhcigpO1xuICAgICAgICB0aGlzLl9saXN0LmNsZWFyKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVtcHR5T3JkZXJlZE1hcCgpO1xuICAgIH07XG5cbiAgICBPcmRlcmVkTWFwLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihrLCB2KSB7XG4gICAgICByZXR1cm4gdXBkYXRlT3JkZXJlZE1hcCh0aGlzLCBrLCB2KTtcbiAgICB9O1xuXG4gICAgT3JkZXJlZE1hcC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oaykge1xuICAgICAgcmV0dXJuIHVwZGF0ZU9yZGVyZWRNYXAodGhpcywgaywgTk9UX1NFVCk7XG4gICAgfTtcblxuICAgIE9yZGVyZWRNYXAucHJvdG90eXBlLndhc0FsdGVyZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tYXAud2FzQWx0ZXJlZCgpIHx8IHRoaXMuX2xpc3Qud2FzQWx0ZXJlZCgpO1xuICAgIH07XG5cbiAgICBPcmRlcmVkTWFwLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgcmV0dXJuIHRoaXMuX2xpc3QuX19pdGVyYXRlKFxuICAgICAgICBmdW5jdGlvbihlbnRyeSApIHtyZXR1cm4gZW50cnkgJiYgZm4oZW50cnlbMV0sIGVudHJ5WzBdLCB0aGlzJDApfSxcbiAgICAgICAgcmV2ZXJzZVxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgT3JkZXJlZE1hcC5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIHJldHVybiB0aGlzLl9saXN0LmZyb21FbnRyeVNlcSgpLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgfTtcblxuICAgIE9yZGVyZWRNYXAucHJvdG90eXBlLl9fZW5zdXJlT3duZXIgPSBmdW5jdGlvbihvd25lcklEKSB7XG4gICAgICBpZiAob3duZXJJRCA9PT0gdGhpcy5fX293bmVySUQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICB2YXIgbmV3TWFwID0gdGhpcy5fbWFwLl9fZW5zdXJlT3duZXIob3duZXJJRCk7XG4gICAgICB2YXIgbmV3TGlzdCA9IHRoaXMuX2xpc3QuX19lbnN1cmVPd25lcihvd25lcklEKTtcbiAgICAgIGlmICghb3duZXJJRCkge1xuICAgICAgICB0aGlzLl9fb3duZXJJRCA9IG93bmVySUQ7XG4gICAgICAgIHRoaXMuX21hcCA9IG5ld01hcDtcbiAgICAgICAgdGhpcy5fbGlzdCA9IG5ld0xpc3Q7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1ha2VPcmRlcmVkTWFwKG5ld01hcCwgbmV3TGlzdCwgb3duZXJJRCwgdGhpcy5fX2hhc2gpO1xuICAgIH07XG5cblxuICBmdW5jdGlvbiBpc09yZGVyZWRNYXAobWF5YmVPcmRlcmVkTWFwKSB7XG4gICAgcmV0dXJuIGlzTWFwKG1heWJlT3JkZXJlZE1hcCkgJiYgaXNPcmRlcmVkKG1heWJlT3JkZXJlZE1hcCk7XG4gIH1cblxuICBPcmRlcmVkTWFwLmlzT3JkZXJlZE1hcCA9IGlzT3JkZXJlZE1hcDtcblxuICBPcmRlcmVkTWFwLnByb3RvdHlwZVtJU19PUkRFUkVEX1NFTlRJTkVMXSA9IHRydWU7XG4gIE9yZGVyZWRNYXAucHJvdG90eXBlW0RFTEVURV0gPSBPcmRlcmVkTWFwLnByb3RvdHlwZS5yZW1vdmU7XG5cblxuXG4gIGZ1bmN0aW9uIG1ha2VPcmRlcmVkTWFwKG1hcCwgbGlzdCwgb3duZXJJRCwgaGFzaCkge1xuICAgIHZhciBvbWFwID0gT2JqZWN0LmNyZWF0ZShPcmRlcmVkTWFwLnByb3RvdHlwZSk7XG4gICAgb21hcC5zaXplID0gbWFwID8gbWFwLnNpemUgOiAwO1xuICAgIG9tYXAuX21hcCA9IG1hcDtcbiAgICBvbWFwLl9saXN0ID0gbGlzdDtcbiAgICBvbWFwLl9fb3duZXJJRCA9IG93bmVySUQ7XG4gICAgb21hcC5fX2hhc2ggPSBoYXNoO1xuICAgIHJldHVybiBvbWFwO1xuICB9XG5cbiAgdmFyIEVNUFRZX09SREVSRURfTUFQO1xuICBmdW5jdGlvbiBlbXB0eU9yZGVyZWRNYXAoKSB7XG4gICAgcmV0dXJuIEVNUFRZX09SREVSRURfTUFQIHx8IChFTVBUWV9PUkRFUkVEX01BUCA9IG1ha2VPcmRlcmVkTWFwKGVtcHR5TWFwKCksIGVtcHR5TGlzdCgpKSk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVPcmRlcmVkTWFwKG9tYXAsIGssIHYpIHtcbiAgICB2YXIgbWFwID0gb21hcC5fbWFwO1xuICAgIHZhciBsaXN0ID0gb21hcC5fbGlzdDtcbiAgICB2YXIgaSA9IG1hcC5nZXQoayk7XG4gICAgdmFyIGhhcyA9IGkgIT09IHVuZGVmaW5lZDtcbiAgICB2YXIgbmV3TWFwO1xuICAgIHZhciBuZXdMaXN0O1xuICAgIGlmICh2ID09PSBOT1RfU0VUKSB7IC8vIHJlbW92ZWRcbiAgICAgIGlmICghaGFzKSB7XG4gICAgICAgIHJldHVybiBvbWFwO1xuICAgICAgfVxuICAgICAgaWYgKGxpc3Quc2l6ZSA+PSBTSVpFICYmIGxpc3Quc2l6ZSA+PSBtYXAuc2l6ZSAqIDIpIHtcbiAgICAgICAgbmV3TGlzdCA9IGxpc3QuZmlsdGVyKGZ1bmN0aW9uKGVudHJ5LCBpZHgpICB7cmV0dXJuIGVudHJ5ICE9PSB1bmRlZmluZWQgJiYgaSAhPT0gaWR4fSk7XG4gICAgICAgIG5ld01hcCA9IG5ld0xpc3QudG9LZXllZFNlcSgpLm1hcChmdW5jdGlvbihlbnRyeSApIHtyZXR1cm4gZW50cnlbMF19KS5mbGlwKCkudG9NYXAoKTtcbiAgICAgICAgaWYgKG9tYXAuX19vd25lcklEKSB7XG4gICAgICAgICAgbmV3TWFwLl9fb3duZXJJRCA9IG5ld0xpc3QuX19vd25lcklEID0gb21hcC5fX293bmVySUQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld01hcCA9IG1hcC5yZW1vdmUoayk7XG4gICAgICAgIG5ld0xpc3QgPSBpID09PSBsaXN0LnNpemUgLSAxID8gbGlzdC5wb3AoKSA6IGxpc3Quc2V0KGksIHVuZGVmaW5lZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChoYXMpIHtcbiAgICAgICAgaWYgKHYgPT09IGxpc3QuZ2V0KGkpWzFdKSB7XG4gICAgICAgICAgcmV0dXJuIG9tYXA7XG4gICAgICAgIH1cbiAgICAgICAgbmV3TWFwID0gbWFwO1xuICAgICAgICBuZXdMaXN0ID0gbGlzdC5zZXQoaSwgW2ssIHZdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld01hcCA9IG1hcC5zZXQoaywgbGlzdC5zaXplKTtcbiAgICAgICAgbmV3TGlzdCA9IGxpc3Quc2V0KGxpc3Quc2l6ZSwgW2ssIHZdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9tYXAuX19vd25lcklEKSB7XG4gICAgICBvbWFwLnNpemUgPSBuZXdNYXAuc2l6ZTtcbiAgICAgIG9tYXAuX21hcCA9IG5ld01hcDtcbiAgICAgIG9tYXAuX2xpc3QgPSBuZXdMaXN0O1xuICAgICAgb21hcC5fX2hhc2ggPSB1bmRlZmluZWQ7XG4gICAgICByZXR1cm4gb21hcDtcbiAgICB9XG4gICAgcmV0dXJuIG1ha2VPcmRlcmVkTWFwKG5ld01hcCwgbmV3TGlzdCk7XG4gIH1cblxuICBjcmVhdGVDbGFzcyhUb0tleWVkU2VxdWVuY2UsIEtleWVkU2VxKTtcbiAgICBmdW5jdGlvbiBUb0tleWVkU2VxdWVuY2UoaW5kZXhlZCwgdXNlS2V5cykge1xuICAgICAgdGhpcy5faXRlciA9IGluZGV4ZWQ7XG4gICAgICB0aGlzLl91c2VLZXlzID0gdXNlS2V5cztcbiAgICAgIHRoaXMuc2l6ZSA9IGluZGV4ZWQuc2l6ZTtcbiAgICB9XG5cbiAgICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGtleSwgbm90U2V0VmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9pdGVyLmdldChrZXksIG5vdFNldFZhbHVlKTtcbiAgICB9O1xuXG4gICAgVG9LZXllZFNlcXVlbmNlLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9pdGVyLmhhcyhrZXkpO1xuICAgIH07XG5cbiAgICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLnZhbHVlU2VxID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5faXRlci52YWx1ZVNlcSgpO1xuICAgIH07XG5cbiAgICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLnJldmVyc2UgPSBmdW5jdGlvbigpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIHZhciByZXZlcnNlZFNlcXVlbmNlID0gcmV2ZXJzZUZhY3RvcnkodGhpcywgdHJ1ZSk7XG4gICAgICBpZiAoIXRoaXMuX3VzZUtleXMpIHtcbiAgICAgICAgcmV2ZXJzZWRTZXF1ZW5jZS52YWx1ZVNlcSA9IGZ1bmN0aW9uKCkgIHtyZXR1cm4gdGhpcyQwLl9pdGVyLnRvU2VxKCkucmV2ZXJzZSgpfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXZlcnNlZFNlcXVlbmNlO1xuICAgIH07XG5cbiAgICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uKG1hcHBlciwgY29udGV4dCkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgdmFyIG1hcHBlZFNlcXVlbmNlID0gbWFwRmFjdG9yeSh0aGlzLCBtYXBwZXIsIGNvbnRleHQpO1xuICAgICAgaWYgKCF0aGlzLl91c2VLZXlzKSB7XG4gICAgICAgIG1hcHBlZFNlcXVlbmNlLnZhbHVlU2VxID0gZnVuY3Rpb24oKSAge3JldHVybiB0aGlzJDAuX2l0ZXIudG9TZXEoKS5tYXAobWFwcGVyLCBjb250ZXh0KX07XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFwcGVkU2VxdWVuY2U7XG4gICAgfTtcblxuICAgIFRvS2V5ZWRTZXF1ZW5jZS5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIHZhciBpaTtcbiAgICAgIHJldHVybiB0aGlzLl9pdGVyLl9faXRlcmF0ZShcbiAgICAgICAgdGhpcy5fdXNlS2V5cyA/XG4gICAgICAgICAgZnVuY3Rpb24odiwgaykgIHtyZXR1cm4gZm4odiwgaywgdGhpcyQwKX0gOlxuICAgICAgICAgICgoaWkgPSByZXZlcnNlID8gcmVzb2x2ZVNpemUodGhpcykgOiAwKSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKHYgKSB7cmV0dXJuIGZuKHYsIHJldmVyc2UgPyAtLWlpIDogaWkrKywgdGhpcyQwKX0pLFxuICAgICAgICByZXZlcnNlXG4gICAgICApO1xuICAgIH07XG5cbiAgICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICBpZiAodGhpcy5fdXNlS2V5cykge1xuICAgICAgICByZXR1cm4gdGhpcy5faXRlci5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICAgICAgfVxuICAgICAgdmFyIGl0ZXJhdG9yID0gdGhpcy5faXRlci5fX2l0ZXJhdG9yKElURVJBVEVfVkFMVUVTLCByZXZlcnNlKTtcbiAgICAgIHZhciBpaSA9IHJldmVyc2UgPyByZXNvbHZlU2l6ZSh0aGlzKSA6IDA7XG4gICAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgIHJldHVybiBzdGVwLmRvbmUgPyBzdGVwIDpcbiAgICAgICAgICBpdGVyYXRvclZhbHVlKHR5cGUsIHJldmVyc2UgPyAtLWlpIDogaWkrKywgc3RlcC52YWx1ZSwgc3RlcCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gIFRvS2V5ZWRTZXF1ZW5jZS5wcm90b3R5cGVbSVNfT1JERVJFRF9TRU5USU5FTF0gPSB0cnVlO1xuXG5cbiAgY3JlYXRlQ2xhc3MoVG9JbmRleGVkU2VxdWVuY2UsIEluZGV4ZWRTZXEpO1xuICAgIGZ1bmN0aW9uIFRvSW5kZXhlZFNlcXVlbmNlKGl0ZXIpIHtcbiAgICAgIHRoaXMuX2l0ZXIgPSBpdGVyO1xuICAgICAgdGhpcy5zaXplID0gaXRlci5zaXplO1xuICAgIH1cblxuICAgIFRvSW5kZXhlZFNlcXVlbmNlLnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5faXRlci5pbmNsdWRlcyh2YWx1ZSk7XG4gICAgfTtcblxuICAgIFRvSW5kZXhlZFNlcXVlbmNlLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgcmV0dXJuIHRoaXMuX2l0ZXIuX19pdGVyYXRlKGZ1bmN0aW9uKHYgKSB7cmV0dXJuIGZuKHYsIGl0ZXJhdGlvbnMrKywgdGhpcyQwKX0sIHJldmVyc2UpO1xuICAgIH07XG5cbiAgICBUb0luZGV4ZWRTZXF1ZW5jZS5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIHZhciBpdGVyYXRvciA9IHRoaXMuX2l0ZXIuX19pdGVyYXRvcihJVEVSQVRFX1ZBTFVFUywgcmV2ZXJzZSk7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgIHJldHVybiBzdGVwLmRvbmUgPyBzdGVwIDpcbiAgICAgICAgICBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgc3RlcC52YWx1ZSwgc3RlcClcbiAgICAgIH0pO1xuICAgIH07XG5cblxuXG4gIGNyZWF0ZUNsYXNzKFRvU2V0U2VxdWVuY2UsIFNldFNlcSk7XG4gICAgZnVuY3Rpb24gVG9TZXRTZXF1ZW5jZShpdGVyKSB7XG4gICAgICB0aGlzLl9pdGVyID0gaXRlcjtcbiAgICAgIHRoaXMuc2l6ZSA9IGl0ZXIuc2l6ZTtcbiAgICB9XG5cbiAgICBUb1NldFNlcXVlbmNlLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9pdGVyLmluY2x1ZGVzKGtleSk7XG4gICAgfTtcblxuICAgIFRvU2V0U2VxdWVuY2UucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICByZXR1cm4gdGhpcy5faXRlci5fX2l0ZXJhdGUoZnVuY3Rpb24odiApIHtyZXR1cm4gZm4odiwgdiwgdGhpcyQwKX0sIHJldmVyc2UpO1xuICAgIH07XG5cbiAgICBUb1NldFNlcXVlbmNlLnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yID0gdGhpcy5faXRlci5fX2l0ZXJhdG9yKElURVJBVEVfVkFMVUVTLCByZXZlcnNlKTtcbiAgICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuICAgICAgICB2YXIgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgcmV0dXJuIHN0ZXAuZG9uZSA/IHN0ZXAgOlxuICAgICAgICAgIGl0ZXJhdG9yVmFsdWUodHlwZSwgc3RlcC52YWx1ZSwgc3RlcC52YWx1ZSwgc3RlcCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG5cblxuICBjcmVhdGVDbGFzcyhGcm9tRW50cmllc1NlcXVlbmNlLCBLZXllZFNlcSk7XG4gICAgZnVuY3Rpb24gRnJvbUVudHJpZXNTZXF1ZW5jZShlbnRyaWVzKSB7XG4gICAgICB0aGlzLl9pdGVyID0gZW50cmllcztcbiAgICAgIHRoaXMuc2l6ZSA9IGVudHJpZXMuc2l6ZTtcbiAgICB9XG5cbiAgICBGcm9tRW50cmllc1NlcXVlbmNlLnByb3RvdHlwZS5lbnRyeVNlcSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2l0ZXIudG9TZXEoKTtcbiAgICB9O1xuXG4gICAgRnJvbUVudHJpZXNTZXF1ZW5jZS5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIHJldHVybiB0aGlzLl9pdGVyLl9faXRlcmF0ZShmdW5jdGlvbihlbnRyeSApIHtcbiAgICAgICAgLy8gQ2hlY2sgaWYgZW50cnkgZXhpc3RzIGZpcnN0IHNvIGFycmF5IGFjY2VzcyBkb2Vzbid0IHRocm93IGZvciBob2xlc1xuICAgICAgICAvLyBpbiB0aGUgcGFyZW50IGl0ZXJhdGlvbi5cbiAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgdmFsaWRhdGVFbnRyeShlbnRyeSk7XG4gICAgICAgICAgdmFyIGluZGV4ZWRJdGVyYWJsZSA9IGlzSXRlcmFibGUoZW50cnkpO1xuICAgICAgICAgIHJldHVybiBmbihcbiAgICAgICAgICAgIGluZGV4ZWRJdGVyYWJsZSA/IGVudHJ5LmdldCgxKSA6IGVudHJ5WzFdLFxuICAgICAgICAgICAgaW5kZXhlZEl0ZXJhYmxlID8gZW50cnkuZ2V0KDApIDogZW50cnlbMF0sXG4gICAgICAgICAgICB0aGlzJDBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9LCByZXZlcnNlKTtcbiAgICB9O1xuXG4gICAgRnJvbUVudHJpZXNTZXF1ZW5jZS5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIHZhciBpdGVyYXRvciA9IHRoaXMuX2l0ZXIuX19pdGVyYXRvcihJVEVSQVRFX1ZBTFVFUywgcmV2ZXJzZSk7XG4gICAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICB2YXIgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICBpZiAoc3RlcC5kb25lKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RlcDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIGVudHJ5ID0gc3RlcC52YWx1ZTtcbiAgICAgICAgICAvLyBDaGVjayBpZiBlbnRyeSBleGlzdHMgZmlyc3Qgc28gYXJyYXkgYWNjZXNzIGRvZXNuJ3QgdGhyb3cgZm9yIGhvbGVzXG4gICAgICAgICAgLy8gaW4gdGhlIHBhcmVudCBpdGVyYXRpb24uXG4gICAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgICB2YWxpZGF0ZUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICAgIHZhciBpbmRleGVkSXRlcmFibGUgPSBpc0l0ZXJhYmxlKGVudHJ5KTtcbiAgICAgICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKFxuICAgICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgICBpbmRleGVkSXRlcmFibGUgPyBlbnRyeS5nZXQoMCkgOiBlbnRyeVswXSxcbiAgICAgICAgICAgICAgaW5kZXhlZEl0ZXJhYmxlID8gZW50cnkuZ2V0KDEpIDogZW50cnlbMV0sXG4gICAgICAgICAgICAgIHN0ZXBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG5cbiAgVG9JbmRleGVkU2VxdWVuY2UucHJvdG90eXBlLmNhY2hlUmVzdWx0ID1cbiAgVG9LZXllZFNlcXVlbmNlLnByb3RvdHlwZS5jYWNoZVJlc3VsdCA9XG4gIFRvU2V0U2VxdWVuY2UucHJvdG90eXBlLmNhY2hlUmVzdWx0ID1cbiAgRnJvbUVudHJpZXNTZXF1ZW5jZS5wcm90b3R5cGUuY2FjaGVSZXN1bHQgPVxuICAgIGNhY2hlUmVzdWx0VGhyb3VnaDtcblxuXG4gIGZ1bmN0aW9uIGZsaXBGYWN0b3J5KGl0ZXJhYmxlKSB7XG4gICAgdmFyIGZsaXBTZXF1ZW5jZSA9IG1ha2VTZXF1ZW5jZShpdGVyYWJsZSk7XG4gICAgZmxpcFNlcXVlbmNlLl9pdGVyID0gaXRlcmFibGU7XG4gICAgZmxpcFNlcXVlbmNlLnNpemUgPSBpdGVyYWJsZS5zaXplO1xuICAgIGZsaXBTZXF1ZW5jZS5mbGlwID0gZnVuY3Rpb24oKSAge3JldHVybiBpdGVyYWJsZX07XG4gICAgZmxpcFNlcXVlbmNlLnJldmVyc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcmV2ZXJzZWRTZXF1ZW5jZSA9IGl0ZXJhYmxlLnJldmVyc2UuYXBwbHkodGhpcyk7IC8vIHN1cGVyLnJldmVyc2UoKVxuICAgICAgcmV2ZXJzZWRTZXF1ZW5jZS5mbGlwID0gZnVuY3Rpb24oKSAge3JldHVybiBpdGVyYWJsZS5yZXZlcnNlKCl9O1xuICAgICAgcmV0dXJuIHJldmVyc2VkU2VxdWVuY2U7XG4gICAgfTtcbiAgICBmbGlwU2VxdWVuY2UuaGFzID0gZnVuY3Rpb24oa2V5ICkge3JldHVybiBpdGVyYWJsZS5pbmNsdWRlcyhrZXkpfTtcbiAgICBmbGlwU2VxdWVuY2UuaW5jbHVkZXMgPSBmdW5jdGlvbihrZXkgKSB7cmV0dXJuIGl0ZXJhYmxlLmhhcyhrZXkpfTtcbiAgICBmbGlwU2VxdWVuY2UuY2FjaGVSZXN1bHQgPSBjYWNoZVJlc3VsdFRocm91Z2g7XG4gICAgZmxpcFNlcXVlbmNlLl9faXRlcmF0ZVVuY2FjaGVkID0gZnVuY3Rpb24gKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICByZXR1cm4gaXRlcmFibGUuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGspICB7cmV0dXJuIGZuKGssIHYsIHRoaXMkMCkgIT09IGZhbHNlfSwgcmV2ZXJzZSk7XG4gICAgfVxuICAgIGZsaXBTZXF1ZW5jZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICBpZiAodHlwZSA9PT0gSVRFUkFURV9FTlRSSUVTKSB7XG4gICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhYmxlLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuICAgICAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICAgIGlmICghc3RlcC5kb25lKSB7XG4gICAgICAgICAgICB2YXIgayA9IHN0ZXAudmFsdWVbMF07XG4gICAgICAgICAgICBzdGVwLnZhbHVlWzBdID0gc3RlcC52YWx1ZVsxXTtcbiAgICAgICAgICAgIHN0ZXAudmFsdWVbMV0gPSBrO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gc3RlcDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmFibGUuX19pdGVyYXRvcihcbiAgICAgICAgdHlwZSA9PT0gSVRFUkFURV9WQUxVRVMgPyBJVEVSQVRFX0tFWVMgOiBJVEVSQVRFX1ZBTFVFUyxcbiAgICAgICAgcmV2ZXJzZVxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIGZsaXBTZXF1ZW5jZTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gbWFwRmFjdG9yeShpdGVyYWJsZSwgbWFwcGVyLCBjb250ZXh0KSB7XG4gICAgdmFyIG1hcHBlZFNlcXVlbmNlID0gbWFrZVNlcXVlbmNlKGl0ZXJhYmxlKTtcbiAgICBtYXBwZWRTZXF1ZW5jZS5zaXplID0gaXRlcmFibGUuc2l6ZTtcbiAgICBtYXBwZWRTZXF1ZW5jZS5oYXMgPSBmdW5jdGlvbihrZXkgKSB7cmV0dXJuIGl0ZXJhYmxlLmhhcyhrZXkpfTtcbiAgICBtYXBwZWRTZXF1ZW5jZS5nZXQgPSBmdW5jdGlvbihrZXksIG5vdFNldFZhbHVlKSAge1xuICAgICAgdmFyIHYgPSBpdGVyYWJsZS5nZXQoa2V5LCBOT1RfU0VUKTtcbiAgICAgIHJldHVybiB2ID09PSBOT1RfU0VUID9cbiAgICAgICAgbm90U2V0VmFsdWUgOlxuICAgICAgICBtYXBwZXIuY2FsbChjb250ZXh0LCB2LCBrZXksIGl0ZXJhYmxlKTtcbiAgICB9O1xuICAgIG1hcHBlZFNlcXVlbmNlLl9faXRlcmF0ZVVuY2FjaGVkID0gZnVuY3Rpb24gKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICByZXR1cm4gaXRlcmFibGUuX19pdGVyYXRlKFxuICAgICAgICBmdW5jdGlvbih2LCBrLCBjKSAge3JldHVybiBmbihtYXBwZXIuY2FsbChjb250ZXh0LCB2LCBrLCBjKSwgaywgdGhpcyQwKSAhPT0gZmFsc2V9LFxuICAgICAgICByZXZlcnNlXG4gICAgICApO1xuICAgIH1cbiAgICBtYXBwZWRTZXF1ZW5jZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbiAodHlwZSwgcmV2ZXJzZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmFibGUuX19pdGVyYXRvcihJVEVSQVRFX0VOVFJJRVMsIHJldmVyc2UpO1xuICAgICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbigpICB7XG4gICAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICBpZiAoc3RlcC5kb25lKSB7XG4gICAgICAgICAgcmV0dXJuIHN0ZXA7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVudHJ5ID0gc3RlcC52YWx1ZTtcbiAgICAgICAgdmFyIGtleSA9IGVudHJ5WzBdO1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZShcbiAgICAgICAgICB0eXBlLFxuICAgICAgICAgIGtleSxcbiAgICAgICAgICBtYXBwZXIuY2FsbChjb250ZXh0LCBlbnRyeVsxXSwga2V5LCBpdGVyYWJsZSksXG4gICAgICAgICAgc3RlcFxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBtYXBwZWRTZXF1ZW5jZTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gcmV2ZXJzZUZhY3RvcnkoaXRlcmFibGUsIHVzZUtleXMpIHtcbiAgICB2YXIgcmV2ZXJzZWRTZXF1ZW5jZSA9IG1ha2VTZXF1ZW5jZShpdGVyYWJsZSk7XG4gICAgcmV2ZXJzZWRTZXF1ZW5jZS5faXRlciA9IGl0ZXJhYmxlO1xuICAgIHJldmVyc2VkU2VxdWVuY2Uuc2l6ZSA9IGl0ZXJhYmxlLnNpemU7XG4gICAgcmV2ZXJzZWRTZXF1ZW5jZS5yZXZlcnNlID0gZnVuY3Rpb24oKSAge3JldHVybiBpdGVyYWJsZX07XG4gICAgaWYgKGl0ZXJhYmxlLmZsaXApIHtcbiAgICAgIHJldmVyc2VkU2VxdWVuY2UuZmxpcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGZsaXBTZXF1ZW5jZSA9IGZsaXBGYWN0b3J5KGl0ZXJhYmxlKTtcbiAgICAgICAgZmxpcFNlcXVlbmNlLnJldmVyc2UgPSBmdW5jdGlvbigpICB7cmV0dXJuIGl0ZXJhYmxlLmZsaXAoKX07XG4gICAgICAgIHJldHVybiBmbGlwU2VxdWVuY2U7XG4gICAgICB9O1xuICAgIH1cbiAgICByZXZlcnNlZFNlcXVlbmNlLmdldCA9IGZ1bmN0aW9uKGtleSwgbm90U2V0VmFsdWUpIFxuICAgICAge3JldHVybiBpdGVyYWJsZS5nZXQodXNlS2V5cyA/IGtleSA6IC0xIC0ga2V5LCBub3RTZXRWYWx1ZSl9O1xuICAgIHJldmVyc2VkU2VxdWVuY2UuaGFzID0gZnVuY3Rpb24oa2V5IClcbiAgICAgIHtyZXR1cm4gaXRlcmFibGUuaGFzKHVzZUtleXMgPyBrZXkgOiAtMSAtIGtleSl9O1xuICAgIHJldmVyc2VkU2VxdWVuY2UuaW5jbHVkZXMgPSBmdW5jdGlvbih2YWx1ZSApIHtyZXR1cm4gaXRlcmFibGUuaW5jbHVkZXModmFsdWUpfTtcbiAgICByZXZlcnNlZFNlcXVlbmNlLmNhY2hlUmVzdWx0ID0gY2FjaGVSZXN1bHRUaHJvdWdoO1xuICAgIHJldmVyc2VkU2VxdWVuY2UuX19pdGVyYXRlID0gZnVuY3Rpb24gKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICByZXR1cm4gaXRlcmFibGUuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGspICB7cmV0dXJuIGZuKHYsIGssIHRoaXMkMCl9LCAhcmV2ZXJzZSk7XG4gICAgfTtcbiAgICByZXZlcnNlZFNlcXVlbmNlLl9faXRlcmF0b3IgPVxuICAgICAgZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkgIHtyZXR1cm4gaXRlcmFibGUuX19pdGVyYXRvcih0eXBlLCAhcmV2ZXJzZSl9O1xuICAgIHJldHVybiByZXZlcnNlZFNlcXVlbmNlO1xuICB9XG5cblxuICBmdW5jdGlvbiBmaWx0ZXJGYWN0b3J5KGl0ZXJhYmxlLCBwcmVkaWNhdGUsIGNvbnRleHQsIHVzZUtleXMpIHtcbiAgICB2YXIgZmlsdGVyU2VxdWVuY2UgPSBtYWtlU2VxdWVuY2UoaXRlcmFibGUpO1xuICAgIGlmICh1c2VLZXlzKSB7XG4gICAgICBmaWx0ZXJTZXF1ZW5jZS5oYXMgPSBmdW5jdGlvbihrZXkgKSB7XG4gICAgICAgIHZhciB2ID0gaXRlcmFibGUuZ2V0KGtleSwgTk9UX1NFVCk7XG4gICAgICAgIHJldHVybiB2ICE9PSBOT1RfU0VUICYmICEhcHJlZGljYXRlLmNhbGwoY29udGV4dCwgdiwga2V5LCBpdGVyYWJsZSk7XG4gICAgICB9O1xuICAgICAgZmlsdGVyU2VxdWVuY2UuZ2V0ID0gZnVuY3Rpb24oa2V5LCBub3RTZXRWYWx1ZSkgIHtcbiAgICAgICAgdmFyIHYgPSBpdGVyYWJsZS5nZXQoa2V5LCBOT1RfU0VUKTtcbiAgICAgICAgcmV0dXJuIHYgIT09IE5PVF9TRVQgJiYgcHJlZGljYXRlLmNhbGwoY29udGV4dCwgdiwga2V5LCBpdGVyYWJsZSkgP1xuICAgICAgICAgIHYgOiBub3RTZXRWYWx1ZTtcbiAgICAgIH07XG4gICAgfVxuICAgIGZpbHRlclNlcXVlbmNlLl9faXRlcmF0ZVVuY2FjaGVkID0gZnVuY3Rpb24gKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICBpdGVyYWJsZS5fX2l0ZXJhdGUoZnVuY3Rpb24odiwgaywgYykgIHtcbiAgICAgICAgaWYgKHByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHYsIGssIGMpKSB7XG4gICAgICAgICAgaXRlcmF0aW9ucysrO1xuICAgICAgICAgIHJldHVybiBmbih2LCB1c2VLZXlzID8gayA6IGl0ZXJhdGlvbnMgLSAxLCB0aGlzJDApO1xuICAgICAgICB9XG4gICAgICB9LCByZXZlcnNlKTtcbiAgICAgIHJldHVybiBpdGVyYXRpb25zO1xuICAgIH07XG4gICAgZmlsdGVyU2VxdWVuY2UuX19pdGVyYXRvclVuY2FjaGVkID0gZnVuY3Rpb24gKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhYmxlLl9faXRlcmF0b3IoSVRFUkFURV9FTlRSSUVTLCByZXZlcnNlKTtcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICAgIGlmIChzdGVwLmRvbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGVwO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgZW50cnkgPSBzdGVwLnZhbHVlO1xuICAgICAgICAgIHZhciBrZXkgPSBlbnRyeVswXTtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBlbnRyeVsxXTtcbiAgICAgICAgICBpZiAocHJlZGljYXRlLmNhbGwoY29udGV4dCwgdmFsdWUsIGtleSwgaXRlcmFibGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZSh0eXBlLCB1c2VLZXlzID8ga2V5IDogaXRlcmF0aW9ucysrLCB2YWx1ZSwgc3RlcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGZpbHRlclNlcXVlbmNlO1xuICB9XG5cblxuICBmdW5jdGlvbiBjb3VudEJ5RmFjdG9yeShpdGVyYWJsZSwgZ3JvdXBlciwgY29udGV4dCkge1xuICAgIHZhciBncm91cHMgPSBNYXAoKS5hc011dGFibGUoKTtcbiAgICBpdGVyYWJsZS5fX2l0ZXJhdGUoZnVuY3Rpb24odiwgaykgIHtcbiAgICAgIGdyb3Vwcy51cGRhdGUoXG4gICAgICAgIGdyb3VwZXIuY2FsbChjb250ZXh0LCB2LCBrLCBpdGVyYWJsZSksXG4gICAgICAgIDAsXG4gICAgICAgIGZ1bmN0aW9uKGEgKSB7cmV0dXJuIGEgKyAxfVxuICAgICAgKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZ3JvdXBzLmFzSW1tdXRhYmxlKCk7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIGdyb3VwQnlGYWN0b3J5KGl0ZXJhYmxlLCBncm91cGVyLCBjb250ZXh0KSB7XG4gICAgdmFyIGlzS2V5ZWRJdGVyID0gaXNLZXllZChpdGVyYWJsZSk7XG4gICAgdmFyIGdyb3VwcyA9IChpc09yZGVyZWQoaXRlcmFibGUpID8gT3JkZXJlZE1hcCgpIDogTWFwKCkpLmFzTXV0YWJsZSgpO1xuICAgIGl0ZXJhYmxlLl9faXRlcmF0ZShmdW5jdGlvbih2LCBrKSAge1xuICAgICAgZ3JvdXBzLnVwZGF0ZShcbiAgICAgICAgZ3JvdXBlci5jYWxsKGNvbnRleHQsIHYsIGssIGl0ZXJhYmxlKSxcbiAgICAgICAgZnVuY3Rpb24oYSApIHtyZXR1cm4gKGEgPSBhIHx8IFtdLCBhLnB1c2goaXNLZXllZEl0ZXIgPyBbaywgdl0gOiB2KSwgYSl9XG4gICAgICApO1xuICAgIH0pO1xuICAgIHZhciBjb2VyY2UgPSBpdGVyYWJsZUNsYXNzKGl0ZXJhYmxlKTtcbiAgICByZXR1cm4gZ3JvdXBzLm1hcChmdW5jdGlvbihhcnIgKSB7cmV0dXJuIHJlaWZ5KGl0ZXJhYmxlLCBjb2VyY2UoYXJyKSl9KTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gc2xpY2VGYWN0b3J5KGl0ZXJhYmxlLCBiZWdpbiwgZW5kLCB1c2VLZXlzKSB7XG4gICAgdmFyIG9yaWdpbmFsU2l6ZSA9IGl0ZXJhYmxlLnNpemU7XG5cbiAgICAvLyBTYW5pdGl6ZSBiZWdpbiAmIGVuZCB1c2luZyB0aGlzIHNob3J0aGFuZCBmb3IgVG9JbnQzMihhcmd1bWVudClcbiAgICAvLyBodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtdG9pbnQzMlxuICAgIGlmIChiZWdpbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBiZWdpbiA9IGJlZ2luIHwgMDtcbiAgICB9XG4gICAgaWYgKGVuZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoZW5kID09PSBJbmZpbml0eSkge1xuICAgICAgICBlbmQgPSBvcmlnaW5hbFNpemU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbmQgPSBlbmQgfCAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh3aG9sZVNsaWNlKGJlZ2luLCBlbmQsIG9yaWdpbmFsU2l6ZSkpIHtcbiAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICB9XG5cbiAgICB2YXIgcmVzb2x2ZWRCZWdpbiA9IHJlc29sdmVCZWdpbihiZWdpbiwgb3JpZ2luYWxTaXplKTtcbiAgICB2YXIgcmVzb2x2ZWRFbmQgPSByZXNvbHZlRW5kKGVuZCwgb3JpZ2luYWxTaXplKTtcblxuICAgIC8vIGJlZ2luIG9yIGVuZCB3aWxsIGJlIE5hTiBpZiB0aGV5IHdlcmUgcHJvdmlkZWQgYXMgbmVnYXRpdmUgbnVtYmVycyBhbmRcbiAgICAvLyB0aGlzIGl0ZXJhYmxlJ3Mgc2l6ZSBpcyB1bmtub3duLiBJbiB0aGF0IGNhc2UsIGNhY2hlIGZpcnN0IHNvIHRoZXJlIGlzXG4gICAgLy8gYSBrbm93biBzaXplIGFuZCB0aGVzZSBkbyBub3QgcmVzb2x2ZSB0byBOYU4uXG4gICAgaWYgKHJlc29sdmVkQmVnaW4gIT09IHJlc29sdmVkQmVnaW4gfHwgcmVzb2x2ZWRFbmQgIT09IHJlc29sdmVkRW5kKSB7XG4gICAgICByZXR1cm4gc2xpY2VGYWN0b3J5KGl0ZXJhYmxlLnRvU2VxKCkuY2FjaGVSZXN1bHQoKSwgYmVnaW4sIGVuZCwgdXNlS2V5cyk7XG4gICAgfVxuXG4gICAgLy8gTm90ZTogcmVzb2x2ZWRFbmQgaXMgdW5kZWZpbmVkIHdoZW4gdGhlIG9yaWdpbmFsIHNlcXVlbmNlJ3MgbGVuZ3RoIGlzXG4gICAgLy8gdW5rbm93biBhbmQgdGhpcyBzbGljZSBkaWQgbm90IHN1cHBseSBhbiBlbmQgYW5kIHNob3VsZCBjb250YWluIGFsbFxuICAgIC8vIGVsZW1lbnRzIGFmdGVyIHJlc29sdmVkQmVnaW4uXG4gICAgLy8gSW4gdGhhdCBjYXNlLCByZXNvbHZlZFNpemUgd2lsbCBiZSBOYU4gYW5kIHNsaWNlU2l6ZSB3aWxsIHJlbWFpbiB1bmRlZmluZWQuXG4gICAgdmFyIHJlc29sdmVkU2l6ZSA9IHJlc29sdmVkRW5kIC0gcmVzb2x2ZWRCZWdpbjtcbiAgICB2YXIgc2xpY2VTaXplO1xuICAgIGlmIChyZXNvbHZlZFNpemUgPT09IHJlc29sdmVkU2l6ZSkge1xuICAgICAgc2xpY2VTaXplID0gcmVzb2x2ZWRTaXplIDwgMCA/IDAgOiByZXNvbHZlZFNpemU7XG4gICAgfVxuXG4gICAgdmFyIHNsaWNlU2VxID0gbWFrZVNlcXVlbmNlKGl0ZXJhYmxlKTtcblxuICAgIC8vIElmIGl0ZXJhYmxlLnNpemUgaXMgdW5kZWZpbmVkLCB0aGUgc2l6ZSBvZiB0aGUgcmVhbGl6ZWQgc2xpY2VTZXEgaXNcbiAgICAvLyB1bmtub3duIGF0IHRoaXMgcG9pbnQgdW5sZXNzIHRoZSBudW1iZXIgb2YgaXRlbXMgdG8gc2xpY2UgaXMgMFxuICAgIHNsaWNlU2VxLnNpemUgPSBzbGljZVNpemUgPT09IDAgPyBzbGljZVNpemUgOiBpdGVyYWJsZS5zaXplICYmIHNsaWNlU2l6ZSB8fCB1bmRlZmluZWQ7XG5cbiAgICBpZiAoIXVzZUtleXMgJiYgaXNTZXEoaXRlcmFibGUpICYmIHNsaWNlU2l6ZSA+PSAwKSB7XG4gICAgICBzbGljZVNlcS5nZXQgPSBmdW5jdGlvbiAoaW5kZXgsIG5vdFNldFZhbHVlKSB7XG4gICAgICAgIGluZGV4ID0gd3JhcEluZGV4KHRoaXMsIGluZGV4KTtcbiAgICAgICAgcmV0dXJuIGluZGV4ID49IDAgJiYgaW5kZXggPCBzbGljZVNpemUgP1xuICAgICAgICAgIGl0ZXJhYmxlLmdldChpbmRleCArIHJlc29sdmVkQmVnaW4sIG5vdFNldFZhbHVlKSA6XG4gICAgICAgICAgbm90U2V0VmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2xpY2VTZXEuX19pdGVyYXRlVW5jYWNoZWQgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgaWYgKHNsaWNlU2l6ZSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cbiAgICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlUmVzdWx0KCkuX19pdGVyYXRlKGZuLCByZXZlcnNlKTtcbiAgICAgIH1cbiAgICAgIHZhciBza2lwcGVkID0gMDtcbiAgICAgIHZhciBpc1NraXBwaW5nID0gdHJ1ZTtcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIGl0ZXJhYmxlLl9faXRlcmF0ZShmdW5jdGlvbih2LCBrKSAge1xuICAgICAgICBpZiAoIShpc1NraXBwaW5nICYmIChpc1NraXBwaW5nID0gc2tpcHBlZCsrIDwgcmVzb2x2ZWRCZWdpbikpKSB7XG4gICAgICAgICAgaXRlcmF0aW9ucysrO1xuICAgICAgICAgIHJldHVybiBmbih2LCB1c2VLZXlzID8gayA6IGl0ZXJhdGlvbnMgLSAxLCB0aGlzJDApICE9PSBmYWxzZSAmJlxuICAgICAgICAgICAgICAgICBpdGVyYXRpb25zICE9PSBzbGljZVNpemU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gICAgfTtcblxuICAgIHNsaWNlU2VxLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIGlmIChzbGljZVNpemUgIT09IDAgJiYgcmV2ZXJzZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgICB9XG4gICAgICAvLyBEb24ndCBib3RoZXIgaW5zdGFudGlhdGluZyBwYXJlbnQgaXRlcmF0b3IgaWYgdGFraW5nIDAuXG4gICAgICB2YXIgaXRlcmF0b3IgPSBzbGljZVNpemUgIT09IDAgJiYgaXRlcmFibGUuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcbiAgICAgIHZhciBza2lwcGVkID0gMDtcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuICAgICAgICB3aGlsZSAoc2tpcHBlZCsrIDwgcmVzb2x2ZWRCZWdpbikge1xuICAgICAgICAgIGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKytpdGVyYXRpb25zID4gc2xpY2VTaXplKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZXJhdG9yRG9uZSgpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICBpZiAodXNlS2V5cyB8fCB0eXBlID09PSBJVEVSQVRFX1ZBTFVFUykge1xuICAgICAgICAgIHJldHVybiBzdGVwO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IElURVJBVEVfS0VZUykge1xuICAgICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMgLSAxLCB1bmRlZmluZWQsIHN0ZXApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMgLSAxLCBzdGVwLnZhbHVlWzFdLCBzdGVwKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNsaWNlU2VxO1xuICB9XG5cblxuICBmdW5jdGlvbiB0YWtlV2hpbGVGYWN0b3J5KGl0ZXJhYmxlLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgdGFrZVNlcXVlbmNlID0gbWFrZVNlcXVlbmNlKGl0ZXJhYmxlKTtcbiAgICB0YWtlU2VxdWVuY2UuX19pdGVyYXRlVW5jYWNoZWQgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgaWYgKHJldmVyc2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVSZXN1bHQoKS5fX2l0ZXJhdGUoZm4sIHJldmVyc2UpO1xuICAgICAgfVxuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgaXRlcmFibGUuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGssIGMpIFxuICAgICAgICB7cmV0dXJuIHByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHYsIGssIGMpICYmICsraXRlcmF0aW9ucyAmJiBmbih2LCBrLCB0aGlzJDApfVxuICAgICAgKTtcbiAgICAgIHJldHVybiBpdGVyYXRpb25zO1xuICAgIH07XG4gICAgdGFrZVNlcXVlbmNlLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlUmVzdWx0KCkuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcbiAgICAgIH1cbiAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhYmxlLl9faXRlcmF0b3IoSVRFUkFURV9FTlRSSUVTLCByZXZlcnNlKTtcbiAgICAgIHZhciBpdGVyYXRpbmcgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbigpICB7XG4gICAgICAgIGlmICghaXRlcmF0aW5nKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZXJhdG9yRG9uZSgpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICBpZiAoc3RlcC5kb25lKSB7XG4gICAgICAgICAgcmV0dXJuIHN0ZXA7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVudHJ5ID0gc3RlcC52YWx1ZTtcbiAgICAgICAgdmFyIGsgPSBlbnRyeVswXTtcbiAgICAgICAgdmFyIHYgPSBlbnRyeVsxXTtcbiAgICAgICAgaWYgKCFwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2LCBrLCB0aGlzJDApKSB7XG4gICAgICAgICAgaXRlcmF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIGl0ZXJhdG9yRG9uZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0eXBlID09PSBJVEVSQVRFX0VOVFJJRVMgPyBzdGVwIDpcbiAgICAgICAgICBpdGVyYXRvclZhbHVlKHR5cGUsIGssIHYsIHN0ZXApO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gdGFrZVNlcXVlbmNlO1xuICB9XG5cblxuICBmdW5jdGlvbiBza2lwV2hpbGVGYWN0b3J5KGl0ZXJhYmxlLCBwcmVkaWNhdGUsIGNvbnRleHQsIHVzZUtleXMpIHtcbiAgICB2YXIgc2tpcFNlcXVlbmNlID0gbWFrZVNlcXVlbmNlKGl0ZXJhYmxlKTtcbiAgICBza2lwU2VxdWVuY2UuX19pdGVyYXRlVW5jYWNoZWQgPSBmdW5jdGlvbiAoZm4sIHJldmVyc2UpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlUmVzdWx0KCkuX19pdGVyYXRlKGZuLCByZXZlcnNlKTtcbiAgICAgIH1cbiAgICAgIHZhciBpc1NraXBwaW5nID0gdHJ1ZTtcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIGl0ZXJhYmxlLl9faXRlcmF0ZShmdW5jdGlvbih2LCBrLCBjKSAge1xuICAgICAgICBpZiAoIShpc1NraXBwaW5nICYmIChpc1NraXBwaW5nID0gcHJlZGljYXRlLmNhbGwoY29udGV4dCwgdiwgaywgYykpKSkge1xuICAgICAgICAgIGl0ZXJhdGlvbnMrKztcbiAgICAgICAgICByZXR1cm4gZm4odiwgdXNlS2V5cyA/IGsgOiBpdGVyYXRpb25zIC0gMSwgdGhpcyQwKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgICB9O1xuICAgIHNraXBTZXF1ZW5jZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgICB9XG4gICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYWJsZS5fX2l0ZXJhdG9yKElURVJBVEVfRU5UUklFUywgcmV2ZXJzZSk7XG4gICAgICB2YXIgc2tpcHBpbmcgPSB0cnVlO1xuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbigpICB7XG4gICAgICAgIHZhciBzdGVwLCBrLCB2O1xuICAgICAgICBkbyB7XG4gICAgICAgICAgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICBpZiAoc3RlcC5kb25lKSB7XG4gICAgICAgICAgICBpZiAodXNlS2V5cyB8fCB0eXBlID09PSBJVEVSQVRFX1ZBTFVFUykge1xuICAgICAgICAgICAgICByZXR1cm4gc3RlcDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gSVRFUkFURV9LRVlTKSB7XG4gICAgICAgICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgdW5kZWZpbmVkLCBzdGVwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgc3RlcC52YWx1ZVsxXSwgc3RlcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG4gICAgICAgICAgayA9IGVudHJ5WzBdO1xuICAgICAgICAgIHYgPSBlbnRyeVsxXTtcbiAgICAgICAgICBza2lwcGluZyAmJiAoc2tpcHBpbmcgPSBwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2LCBrLCB0aGlzJDApKTtcbiAgICAgICAgfSB3aGlsZSAoc2tpcHBpbmcpO1xuICAgICAgICByZXR1cm4gdHlwZSA9PT0gSVRFUkFURV9FTlRSSUVTID8gc3RlcCA6XG4gICAgICAgICAgaXRlcmF0b3JWYWx1ZSh0eXBlLCBrLCB2LCBzdGVwKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIHNraXBTZXF1ZW5jZTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gY29uY2F0RmFjdG9yeShpdGVyYWJsZSwgdmFsdWVzKSB7XG4gICAgdmFyIGlzS2V5ZWRJdGVyYWJsZSA9IGlzS2V5ZWQoaXRlcmFibGUpO1xuICAgIHZhciBpdGVycyA9IFtpdGVyYWJsZV0uY29uY2F0KHZhbHVlcykubWFwKGZ1bmN0aW9uKHYgKSB7XG4gICAgICBpZiAoIWlzSXRlcmFibGUodikpIHtcbiAgICAgICAgdiA9IGlzS2V5ZWRJdGVyYWJsZSA/XG4gICAgICAgICAga2V5ZWRTZXFGcm9tVmFsdWUodikgOlxuICAgICAgICAgIGluZGV4ZWRTZXFGcm9tVmFsdWUoQXJyYXkuaXNBcnJheSh2KSA/IHYgOiBbdl0pO1xuICAgICAgfSBlbHNlIGlmIChpc0tleWVkSXRlcmFibGUpIHtcbiAgICAgICAgdiA9IEtleWVkSXRlcmFibGUodik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdjtcbiAgICB9KS5maWx0ZXIoZnVuY3Rpb24odiApIHtyZXR1cm4gdi5zaXplICE9PSAwfSk7XG5cbiAgICBpZiAoaXRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgfVxuXG4gICAgaWYgKGl0ZXJzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdmFyIHNpbmdsZXRvbiA9IGl0ZXJzWzBdO1xuICAgICAgaWYgKHNpbmdsZXRvbiA9PT0gaXRlcmFibGUgfHxcbiAgICAgICAgICBpc0tleWVkSXRlcmFibGUgJiYgaXNLZXllZChzaW5nbGV0b24pIHx8XG4gICAgICAgICAgaXNJbmRleGVkKGl0ZXJhYmxlKSAmJiBpc0luZGV4ZWQoc2luZ2xldG9uKSkge1xuICAgICAgICByZXR1cm4gc2luZ2xldG9uO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjb25jYXRTZXEgPSBuZXcgQXJyYXlTZXEoaXRlcnMpO1xuICAgIGlmIChpc0tleWVkSXRlcmFibGUpIHtcbiAgICAgIGNvbmNhdFNlcSA9IGNvbmNhdFNlcS50b0tleWVkU2VxKCk7XG4gICAgfSBlbHNlIGlmICghaXNJbmRleGVkKGl0ZXJhYmxlKSkge1xuICAgICAgY29uY2F0U2VxID0gY29uY2F0U2VxLnRvU2V0U2VxKCk7XG4gICAgfVxuICAgIGNvbmNhdFNlcSA9IGNvbmNhdFNlcS5mbGF0dGVuKHRydWUpO1xuICAgIGNvbmNhdFNlcS5zaXplID0gaXRlcnMucmVkdWNlKFxuICAgICAgZnVuY3Rpb24oc3VtLCBzZXEpICB7XG4gICAgICAgIGlmIChzdW0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhciBzaXplID0gc2VxLnNpemU7XG4gICAgICAgICAgaWYgKHNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHN1bSArIHNpemU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgMFxuICAgICk7XG4gICAgcmV0dXJuIGNvbmNhdFNlcTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gZmxhdHRlbkZhY3RvcnkoaXRlcmFibGUsIGRlcHRoLCB1c2VLZXlzKSB7XG4gICAgdmFyIGZsYXRTZXF1ZW5jZSA9IG1ha2VTZXF1ZW5jZShpdGVyYWJsZSk7XG4gICAgZmxhdFNlcXVlbmNlLl9faXRlcmF0ZVVuY2FjaGVkID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHtcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHZhciBzdG9wcGVkID0gZmFsc2U7XG4gICAgICBmdW5jdGlvbiBmbGF0RGVlcChpdGVyLCBjdXJyZW50RGVwdGgpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgICAgaXRlci5fX2l0ZXJhdGUoZnVuY3Rpb24odiwgaykgIHtcbiAgICAgICAgICBpZiAoKCFkZXB0aCB8fCBjdXJyZW50RGVwdGggPCBkZXB0aCkgJiYgaXNJdGVyYWJsZSh2KSkge1xuICAgICAgICAgICAgZmxhdERlZXAodiwgY3VycmVudERlcHRoICsgMSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChmbih2LCB1c2VLZXlzID8gayA6IGl0ZXJhdGlvbnMrKywgdGhpcyQwKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHN0b3BwZWQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gIXN0b3BwZWQ7XG4gICAgICAgIH0sIHJldmVyc2UpO1xuICAgICAgfVxuICAgICAgZmxhdERlZXAoaXRlcmFibGUsIDApO1xuICAgICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gICAgfVxuICAgIGZsYXRTZXF1ZW5jZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYWJsZS5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICAgICAgdmFyIHN0YWNrID0gW107XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgd2hpbGUgKGl0ZXJhdG9yKSB7XG4gICAgICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgaWYgKHN0ZXAuZG9uZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHYgPSBzdGVwLnZhbHVlO1xuICAgICAgICAgIGlmICh0eXBlID09PSBJVEVSQVRFX0VOVFJJRVMpIHtcbiAgICAgICAgICAgIHYgPSB2WzFdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoKCFkZXB0aCB8fCBzdGFjay5sZW5ndGggPCBkZXB0aCkgJiYgaXNJdGVyYWJsZSh2KSkge1xuICAgICAgICAgICAgc3RhY2sucHVzaChpdGVyYXRvcik7XG4gICAgICAgICAgICBpdGVyYXRvciA9IHYuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHVzZUtleXMgPyBzdGVwIDogaXRlcmF0b3JWYWx1ZSh0eXBlLCBpdGVyYXRpb25zKyssIHYsIHN0ZXApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXRlcmF0b3JEb25lKCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGZsYXRTZXF1ZW5jZTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gZmxhdE1hcEZhY3RvcnkoaXRlcmFibGUsIG1hcHBlciwgY29udGV4dCkge1xuICAgIHZhciBjb2VyY2UgPSBpdGVyYWJsZUNsYXNzKGl0ZXJhYmxlKTtcbiAgICByZXR1cm4gaXRlcmFibGUudG9TZXEoKS5tYXAoXG4gICAgICBmdW5jdGlvbih2LCBrKSAge3JldHVybiBjb2VyY2UobWFwcGVyLmNhbGwoY29udGV4dCwgdiwgaywgaXRlcmFibGUpKX1cbiAgICApLmZsYXR0ZW4odHJ1ZSk7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIGludGVycG9zZUZhY3RvcnkoaXRlcmFibGUsIHNlcGFyYXRvcikge1xuICAgIHZhciBpbnRlcnBvc2VkU2VxdWVuY2UgPSBtYWtlU2VxdWVuY2UoaXRlcmFibGUpO1xuICAgIGludGVycG9zZWRTZXF1ZW5jZS5zaXplID0gaXRlcmFibGUuc2l6ZSAmJiBpdGVyYWJsZS5zaXplICogMiAtMTtcbiAgICBpbnRlcnBvc2VkU2VxdWVuY2UuX19pdGVyYXRlVW5jYWNoZWQgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgaXRlcmFibGUuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGspIFxuICAgICAgICB7cmV0dXJuICghaXRlcmF0aW9ucyB8fCBmbihzZXBhcmF0b3IsIGl0ZXJhdGlvbnMrKywgdGhpcyQwKSAhPT0gZmFsc2UpICYmXG4gICAgICAgIGZuKHYsIGl0ZXJhdGlvbnMrKywgdGhpcyQwKSAhPT0gZmFsc2V9LFxuICAgICAgICByZXZlcnNlXG4gICAgICApO1xuICAgICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gICAgfTtcbiAgICBpbnRlcnBvc2VkU2VxdWVuY2UuX19pdGVyYXRvclVuY2FjaGVkID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmFibGUuX19pdGVyYXRvcihJVEVSQVRFX1ZBTFVFUywgcmV2ZXJzZSk7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICB2YXIgc3RlcDtcbiAgICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuICAgICAgICBpZiAoIXN0ZXAgfHwgaXRlcmF0aW9ucyAlIDIpIHtcbiAgICAgICAgICBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICAgIGlmIChzdGVwLmRvbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGVwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXRlcmF0aW9ucyAlIDIgP1xuICAgICAgICAgIGl0ZXJhdG9yVmFsdWUodHlwZSwgaXRlcmF0aW9ucysrLCBzZXBhcmF0b3IpIDpcbiAgICAgICAgICBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgc3RlcC52YWx1ZSwgc3RlcCk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiBpbnRlcnBvc2VkU2VxdWVuY2U7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIHNvcnRGYWN0b3J5KGl0ZXJhYmxlLCBjb21wYXJhdG9yLCBtYXBwZXIpIHtcbiAgICBpZiAoIWNvbXBhcmF0b3IpIHtcbiAgICAgIGNvbXBhcmF0b3IgPSBkZWZhdWx0Q29tcGFyYXRvcjtcbiAgICB9XG4gICAgdmFyIGlzS2V5ZWRJdGVyYWJsZSA9IGlzS2V5ZWQoaXRlcmFibGUpO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIGVudHJpZXMgPSBpdGVyYWJsZS50b1NlcSgpLm1hcChcbiAgICAgIGZ1bmN0aW9uKHYsIGspICB7cmV0dXJuIFtrLCB2LCBpbmRleCsrLCBtYXBwZXIgPyBtYXBwZXIodiwgaywgaXRlcmFibGUpIDogdl19XG4gICAgKS50b0FycmF5KCk7XG4gICAgZW50cmllcy5zb3J0KGZ1bmN0aW9uKGEsIGIpICB7cmV0dXJuIGNvbXBhcmF0b3IoYVszXSwgYlszXSkgfHwgYVsyXSAtIGJbMl19KS5mb3JFYWNoKFxuICAgICAgaXNLZXllZEl0ZXJhYmxlID9cbiAgICAgIGZ1bmN0aW9uKHYsIGkpICB7IGVudHJpZXNbaV0ubGVuZ3RoID0gMjsgfSA6XG4gICAgICBmdW5jdGlvbih2LCBpKSAgeyBlbnRyaWVzW2ldID0gdlsxXTsgfVxuICAgICk7XG4gICAgcmV0dXJuIGlzS2V5ZWRJdGVyYWJsZSA/IEtleWVkU2VxKGVudHJpZXMpIDpcbiAgICAgIGlzSW5kZXhlZChpdGVyYWJsZSkgPyBJbmRleGVkU2VxKGVudHJpZXMpIDpcbiAgICAgIFNldFNlcShlbnRyaWVzKTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gbWF4RmFjdG9yeShpdGVyYWJsZSwgY29tcGFyYXRvciwgbWFwcGVyKSB7XG4gICAgaWYgKCFjb21wYXJhdG9yKSB7XG4gICAgICBjb21wYXJhdG9yID0gZGVmYXVsdENvbXBhcmF0b3I7XG4gICAgfVxuICAgIGlmIChtYXBwZXIpIHtcbiAgICAgIHZhciBlbnRyeSA9IGl0ZXJhYmxlLnRvU2VxKClcbiAgICAgICAgLm1hcChmdW5jdGlvbih2LCBrKSAge3JldHVybiBbdiwgbWFwcGVyKHYsIGssIGl0ZXJhYmxlKV19KVxuICAgICAgICAucmVkdWNlKGZ1bmN0aW9uKGEsIGIpICB7cmV0dXJuIG1heENvbXBhcmUoY29tcGFyYXRvciwgYVsxXSwgYlsxXSkgPyBiIDogYX0pO1xuICAgICAgcmV0dXJuIGVudHJ5ICYmIGVudHJ5WzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gaXRlcmFibGUucmVkdWNlKGZ1bmN0aW9uKGEsIGIpICB7cmV0dXJuIG1heENvbXBhcmUoY29tcGFyYXRvciwgYSwgYikgPyBiIDogYX0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG1heENvbXBhcmUoY29tcGFyYXRvciwgYSwgYikge1xuICAgIHZhciBjb21wID0gY29tcGFyYXRvcihiLCBhKTtcbiAgICAvLyBiIGlzIGNvbnNpZGVyZWQgdGhlIG5ldyBtYXggaWYgdGhlIGNvbXBhcmF0b3IgZGVjbGFyZXMgdGhlbSBlcXVhbCwgYnV0XG4gICAgLy8gdGhleSBhcmUgbm90IGVxdWFsIGFuZCBiIGlzIGluIGZhY3QgYSBudWxsaXNoIHZhbHVlLlxuICAgIHJldHVybiAoY29tcCA9PT0gMCAmJiBiICE9PSBhICYmIChiID09PSB1bmRlZmluZWQgfHwgYiA9PT0gbnVsbCB8fCBiICE9PSBiKSkgfHwgY29tcCA+IDA7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIHppcFdpdGhGYWN0b3J5KGtleUl0ZXIsIHppcHBlciwgaXRlcnMpIHtcbiAgICB2YXIgemlwU2VxdWVuY2UgPSBtYWtlU2VxdWVuY2Uoa2V5SXRlcik7XG4gICAgemlwU2VxdWVuY2Uuc2l6ZSA9IG5ldyBBcnJheVNlcShpdGVycykubWFwKGZ1bmN0aW9uKGkgKSB7cmV0dXJuIGkuc2l6ZX0pLm1pbigpO1xuICAgIC8vIE5vdGU6IHRoaXMgYSBnZW5lcmljIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgX19pdGVyYXRlIGluIHRlcm1zIG9mXG4gICAgLy8gX19pdGVyYXRvciB3aGljaCBtYXkgYmUgbW9yZSBnZW5lcmljYWxseSB1c2VmdWwgaW4gdGhlIGZ1dHVyZS5cbiAgICB6aXBTZXF1ZW5jZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge1xuICAgICAgLyogZ2VuZXJpYzpcbiAgICAgIHZhciBpdGVyYXRvciA9IHRoaXMuX19pdGVyYXRvcihJVEVSQVRFX0VOVFJJRVMsIHJldmVyc2UpO1xuICAgICAgdmFyIHN0ZXA7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgIGl0ZXJhdGlvbnMrKztcbiAgICAgICAgaWYgKGZuKHN0ZXAudmFsdWVbMV0sIHN0ZXAudmFsdWVbMF0sIHRoaXMpID09PSBmYWxzZSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgICAgICovXG4gICAgICAvLyBpbmRleGVkOlxuICAgICAgdmFyIGl0ZXJhdG9yID0gdGhpcy5fX2l0ZXJhdG9yKElURVJBVEVfVkFMVUVTLCByZXZlcnNlKTtcbiAgICAgIHZhciBzdGVwO1xuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICBpZiAoZm4oc3RlcC52YWx1ZSwgaXRlcmF0aW9ucysrLCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gICAgfTtcbiAgICB6aXBTZXF1ZW5jZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICB2YXIgaXRlcmF0b3JzID0gaXRlcnMubWFwKGZ1bmN0aW9uKGkgKVxuICAgICAgICB7cmV0dXJuIChpID0gSXRlcmFibGUoaSksIGdldEl0ZXJhdG9yKHJldmVyc2UgPyBpLnJldmVyc2UoKSA6IGkpKX1cbiAgICAgICk7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICB2YXIgaXNEb25lID0gZmFsc2U7XG4gICAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgdmFyIHN0ZXBzO1xuICAgICAgICBpZiAoIWlzRG9uZSkge1xuICAgICAgICAgIHN0ZXBzID0gaXRlcmF0b3JzLm1hcChmdW5jdGlvbihpICkge3JldHVybiBpLm5leHQoKX0pO1xuICAgICAgICAgIGlzRG9uZSA9IHN0ZXBzLnNvbWUoZnVuY3Rpb24ocyApIHtyZXR1cm4gcy5kb25lfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzRG9uZSkge1xuICAgICAgICAgIHJldHVybiBpdGVyYXRvckRvbmUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZShcbiAgICAgICAgICB0eXBlLFxuICAgICAgICAgIGl0ZXJhdGlvbnMrKyxcbiAgICAgICAgICB6aXBwZXIuYXBwbHkobnVsbCwgc3RlcHMubWFwKGZ1bmN0aW9uKHMgKSB7cmV0dXJuIHMudmFsdWV9KSlcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIHppcFNlcXVlbmNlXG4gIH1cblxuXG4gIC8vICNwcmFnbWEgSGVscGVyIEZ1bmN0aW9uc1xuXG4gIGZ1bmN0aW9uIHJlaWZ5KGl0ZXIsIHNlcSkge1xuICAgIHJldHVybiBpc1NlcShpdGVyKSA/IHNlcSA6IGl0ZXIuY29uc3RydWN0b3Ioc2VxKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHZhbGlkYXRlRW50cnkoZW50cnkpIHtcbiAgICBpZiAoZW50cnkgIT09IE9iamVjdChlbnRyeSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIFtLLCBWXSB0dXBsZTogJyArIGVudHJ5KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZXNvbHZlU2l6ZShpdGVyKSB7XG4gICAgYXNzZXJ0Tm90SW5maW5pdGUoaXRlci5zaXplKTtcbiAgICByZXR1cm4gZW5zdXJlU2l6ZShpdGVyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGl0ZXJhYmxlQ2xhc3MoaXRlcmFibGUpIHtcbiAgICByZXR1cm4gaXNLZXllZChpdGVyYWJsZSkgPyBLZXllZEl0ZXJhYmxlIDpcbiAgICAgIGlzSW5kZXhlZChpdGVyYWJsZSkgPyBJbmRleGVkSXRlcmFibGUgOlxuICAgICAgU2V0SXRlcmFibGU7XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlU2VxdWVuY2UoaXRlcmFibGUpIHtcbiAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShcbiAgICAgIChcbiAgICAgICAgaXNLZXllZChpdGVyYWJsZSkgPyBLZXllZFNlcSA6XG4gICAgICAgIGlzSW5kZXhlZChpdGVyYWJsZSkgPyBJbmRleGVkU2VxIDpcbiAgICAgICAgU2V0U2VxXG4gICAgICApLnByb3RvdHlwZVxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiBjYWNoZVJlc3VsdFRocm91Z2goKSB7XG4gICAgaWYgKHRoaXMuX2l0ZXIuY2FjaGVSZXN1bHQpIHtcbiAgICAgIHRoaXMuX2l0ZXIuY2FjaGVSZXN1bHQoKTtcbiAgICAgIHRoaXMuc2l6ZSA9IHRoaXMuX2l0ZXIuc2l6ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gU2VxLnByb3RvdHlwZS5jYWNoZVJlc3VsdC5jYWxsKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGRlZmF1bHRDb21wYXJhdG9yKGEsIGIpIHtcbiAgICByZXR1cm4gYSA+IGIgPyAxIDogYSA8IGIgPyAtMSA6IDA7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JjZUl0ZXJhdG9yKGtleVBhdGgpIHtcbiAgICB2YXIgaXRlciA9IGdldEl0ZXJhdG9yKGtleVBhdGgpO1xuICAgIGlmICghaXRlcikge1xuICAgICAgLy8gQXJyYXkgbWlnaHQgbm90IGJlIGl0ZXJhYmxlIGluIHRoaXMgZW52aXJvbm1lbnQsIHNvIHdlIG5lZWQgYSBmYWxsYmFja1xuICAgICAgLy8gdG8gb3VyIHdyYXBwZWQgdHlwZS5cbiAgICAgIGlmICghaXNBcnJheUxpa2Uoa2V5UGF0aCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgaXRlcmFibGUgb3IgYXJyYXktbGlrZTogJyArIGtleVBhdGgpO1xuICAgICAgfVxuICAgICAgaXRlciA9IGdldEl0ZXJhdG9yKEl0ZXJhYmxlKGtleVBhdGgpKTtcbiAgICB9XG4gICAgcmV0dXJuIGl0ZXI7XG4gIH1cblxuICBjcmVhdGVDbGFzcyhSZWNvcmQsIEtleWVkQ29sbGVjdGlvbik7XG5cbiAgICBmdW5jdGlvbiBSZWNvcmQoZGVmYXVsdFZhbHVlcywgbmFtZSkge1xuICAgICAgdmFyIGhhc0luaXRpYWxpemVkO1xuXG4gICAgICB2YXIgUmVjb3JkVHlwZSA9IGZ1bmN0aW9uIFJlY29yZCh2YWx1ZXMpIHtcbiAgICAgICAgaWYgKHZhbHVlcyBpbnN0YW5jZW9mIFJlY29yZFR5cGUpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWVzO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBSZWNvcmRUeXBlKSkge1xuICAgICAgICAgIHJldHVybiBuZXcgUmVjb3JkVHlwZSh2YWx1ZXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaGFzSW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICBoYXNJbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhkZWZhdWx0VmFsdWVzKTtcbiAgICAgICAgICBzZXRQcm9wcyhSZWNvcmRUeXBlUHJvdG90eXBlLCBrZXlzKTtcbiAgICAgICAgICBSZWNvcmRUeXBlUHJvdG90eXBlLnNpemUgPSBrZXlzLmxlbmd0aDtcbiAgICAgICAgICBSZWNvcmRUeXBlUHJvdG90eXBlLl9uYW1lID0gbmFtZTtcbiAgICAgICAgICBSZWNvcmRUeXBlUHJvdG90eXBlLl9rZXlzID0ga2V5cztcbiAgICAgICAgICBSZWNvcmRUeXBlUHJvdG90eXBlLl9kZWZhdWx0VmFsdWVzID0gZGVmYXVsdFZhbHVlcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9tYXAgPSBNYXAodmFsdWVzKTtcbiAgICAgIH07XG5cbiAgICAgIHZhciBSZWNvcmRUeXBlUHJvdG90eXBlID0gUmVjb3JkVHlwZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFJlY29yZFByb3RvdHlwZSk7XG4gICAgICBSZWNvcmRUeXBlUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUmVjb3JkVHlwZTtcblxuICAgICAgcmV0dXJuIFJlY29yZFR5cGU7XG4gICAgfVxuXG4gICAgUmVjb3JkLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX190b1N0cmluZyhyZWNvcmROYW1lKHRoaXMpICsgJyB7JywgJ30nKTtcbiAgICB9O1xuXG4gICAgLy8gQHByYWdtYSBBY2Nlc3NcblxuICAgIFJlY29yZC5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24oaykge1xuICAgICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRWYWx1ZXMuaGFzT3duUHJvcGVydHkoayk7XG4gICAgfTtcblxuICAgIFJlY29yZC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oaywgbm90U2V0VmFsdWUpIHtcbiAgICAgIGlmICghdGhpcy5oYXMoaykpIHtcbiAgICAgICAgcmV0dXJuIG5vdFNldFZhbHVlO1xuICAgICAgfVxuICAgICAgdmFyIGRlZmF1bHRWYWwgPSB0aGlzLl9kZWZhdWx0VmFsdWVzW2tdO1xuICAgICAgcmV0dXJuIHRoaXMuX21hcCA/IHRoaXMuX21hcC5nZXQoaywgZGVmYXVsdFZhbCkgOiBkZWZhdWx0VmFsO1xuICAgIH07XG5cbiAgICAvLyBAcHJhZ21hIE1vZGlmaWNhdGlvblxuXG4gICAgUmVjb3JkLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuX19vd25lcklEKSB7XG4gICAgICAgIHRoaXMuX21hcCAmJiB0aGlzLl9tYXAuY2xlYXIoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICB2YXIgUmVjb3JkVHlwZSA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICByZXR1cm4gUmVjb3JkVHlwZS5fZW1wdHkgfHwgKFJlY29yZFR5cGUuX2VtcHR5ID0gbWFrZVJlY29yZCh0aGlzLCBlbXB0eU1hcCgpKSk7XG4gICAgfTtcblxuICAgIFJlY29yZC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oaywgdikge1xuICAgICAgaWYgKCF0aGlzLmhhcyhrKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBzZXQgdW5rbm93biBrZXkgXCInICsgayArICdcIiBvbiAnICsgcmVjb3JkTmFtZSh0aGlzKSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fbWFwICYmICF0aGlzLl9tYXAuaGFzKGspKSB7XG4gICAgICAgIHZhciBkZWZhdWx0VmFsID0gdGhpcy5fZGVmYXVsdFZhbHVlc1trXTtcbiAgICAgICAgaWYgKHYgPT09IGRlZmF1bHRWYWwpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFyIG5ld01hcCA9IHRoaXMuX21hcCAmJiB0aGlzLl9tYXAuc2V0KGssIHYpO1xuICAgICAgaWYgKHRoaXMuX19vd25lcklEIHx8IG5ld01hcCA9PT0gdGhpcy5fbWFwKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1ha2VSZWNvcmQodGhpcywgbmV3TWFwKTtcbiAgICB9O1xuXG4gICAgUmVjb3JkLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihrKSB7XG4gICAgICBpZiAoIXRoaXMuaGFzKGspKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgdmFyIG5ld01hcCA9IHRoaXMuX21hcCAmJiB0aGlzLl9tYXAucmVtb3ZlKGspO1xuICAgICAgaWYgKHRoaXMuX19vd25lcklEIHx8IG5ld01hcCA9PT0gdGhpcy5fbWFwKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1ha2VSZWNvcmQodGhpcywgbmV3TWFwKTtcbiAgICB9O1xuXG4gICAgUmVjb3JkLnByb3RvdHlwZS53YXNBbHRlcmVkID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbWFwLndhc0FsdGVyZWQoKTtcbiAgICB9O1xuXG4gICAgUmVjb3JkLnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgcmV0dXJuIEtleWVkSXRlcmFibGUodGhpcy5fZGVmYXVsdFZhbHVlcykubWFwKGZ1bmN0aW9uKF8sIGspICB7cmV0dXJuIHRoaXMkMC5nZXQoayl9KS5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICAgIH07XG5cbiAgICBSZWNvcmQucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICByZXR1cm4gS2V5ZWRJdGVyYWJsZSh0aGlzLl9kZWZhdWx0VmFsdWVzKS5tYXAoZnVuY3Rpb24oXywgaykgIHtyZXR1cm4gdGhpcyQwLmdldChrKX0pLl9faXRlcmF0ZShmbiwgcmV2ZXJzZSk7XG4gICAgfTtcblxuICAgIFJlY29yZC5wcm90b3R5cGUuX19lbnN1cmVPd25lciA9IGZ1bmN0aW9uKG93bmVySUQpIHtcbiAgICAgIGlmIChvd25lcklEID09PSB0aGlzLl9fb3duZXJJRCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHZhciBuZXdNYXAgPSB0aGlzLl9tYXAgJiYgdGhpcy5fbWFwLl9fZW5zdXJlT3duZXIob3duZXJJRCk7XG4gICAgICBpZiAoIW93bmVySUQpIHtcbiAgICAgICAgdGhpcy5fX293bmVySUQgPSBvd25lcklEO1xuICAgICAgICB0aGlzLl9tYXAgPSBuZXdNYXA7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1ha2VSZWNvcmQodGhpcywgbmV3TWFwLCBvd25lcklEKTtcbiAgICB9O1xuXG5cbiAgdmFyIFJlY29yZFByb3RvdHlwZSA9IFJlY29yZC5wcm90b3R5cGU7XG4gIFJlY29yZFByb3RvdHlwZVtERUxFVEVdID0gUmVjb3JkUHJvdG90eXBlLnJlbW92ZTtcbiAgUmVjb3JkUHJvdG90eXBlLmRlbGV0ZUluID1cbiAgUmVjb3JkUHJvdG90eXBlLnJlbW92ZUluID0gTWFwUHJvdG90eXBlLnJlbW92ZUluO1xuICBSZWNvcmRQcm90b3R5cGUubWVyZ2UgPSBNYXBQcm90b3R5cGUubWVyZ2U7XG4gIFJlY29yZFByb3RvdHlwZS5tZXJnZVdpdGggPSBNYXBQcm90b3R5cGUubWVyZ2VXaXRoO1xuICBSZWNvcmRQcm90b3R5cGUubWVyZ2VJbiA9IE1hcFByb3RvdHlwZS5tZXJnZUluO1xuICBSZWNvcmRQcm90b3R5cGUubWVyZ2VEZWVwID0gTWFwUHJvdG90eXBlLm1lcmdlRGVlcDtcbiAgUmVjb3JkUHJvdG90eXBlLm1lcmdlRGVlcFdpdGggPSBNYXBQcm90b3R5cGUubWVyZ2VEZWVwV2l0aDtcbiAgUmVjb3JkUHJvdG90eXBlLm1lcmdlRGVlcEluID0gTWFwUHJvdG90eXBlLm1lcmdlRGVlcEluO1xuICBSZWNvcmRQcm90b3R5cGUuc2V0SW4gPSBNYXBQcm90b3R5cGUuc2V0SW47XG4gIFJlY29yZFByb3RvdHlwZS51cGRhdGUgPSBNYXBQcm90b3R5cGUudXBkYXRlO1xuICBSZWNvcmRQcm90b3R5cGUudXBkYXRlSW4gPSBNYXBQcm90b3R5cGUudXBkYXRlSW47XG4gIFJlY29yZFByb3RvdHlwZS53aXRoTXV0YXRpb25zID0gTWFwUHJvdG90eXBlLndpdGhNdXRhdGlvbnM7XG4gIFJlY29yZFByb3RvdHlwZS5hc011dGFibGUgPSBNYXBQcm90b3R5cGUuYXNNdXRhYmxlO1xuICBSZWNvcmRQcm90b3R5cGUuYXNJbW11dGFibGUgPSBNYXBQcm90b3R5cGUuYXNJbW11dGFibGU7XG5cblxuICBmdW5jdGlvbiBtYWtlUmVjb3JkKGxpa2VSZWNvcmQsIG1hcCwgb3duZXJJRCkge1xuICAgIHZhciByZWNvcmQgPSBPYmplY3QuY3JlYXRlKE9iamVjdC5nZXRQcm90b3R5cGVPZihsaWtlUmVjb3JkKSk7XG4gICAgcmVjb3JkLl9tYXAgPSBtYXA7XG4gICAgcmVjb3JkLl9fb3duZXJJRCA9IG93bmVySUQ7XG4gICAgcmV0dXJuIHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlY29yZE5hbWUocmVjb3JkKSB7XG4gICAgcmV0dXJuIHJlY29yZC5fbmFtZSB8fCByZWNvcmQuY29uc3RydWN0b3IubmFtZSB8fCAnUmVjb3JkJztcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFByb3BzKHByb3RvdHlwZSwgbmFtZXMpIHtcbiAgICB0cnkge1xuICAgICAgbmFtZXMuZm9yRWFjaChzZXRQcm9wLmJpbmQodW5kZWZpbmVkLCBwcm90b3R5cGUpKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgLy8gT2JqZWN0LmRlZmluZVByb3BlcnR5IGZhaWxlZC4gUHJvYmFibHkgSUU4LlxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFByb3AocHJvdG90eXBlLCBuYW1lKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvdHlwZSwgbmFtZSwge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KG5hbWUpO1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgaW52YXJpYW50KHRoaXMuX19vd25lcklELCAnQ2Fubm90IHNldCBvbiBhbiBpbW11dGFibGUgcmVjb3JkLicpO1xuICAgICAgICB0aGlzLnNldChuYW1lLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBjcmVhdGVDbGFzcyhTZXQsIFNldENvbGxlY3Rpb24pO1xuXG4gICAgLy8gQHByYWdtYSBDb25zdHJ1Y3Rpb25cblxuICAgIGZ1bmN0aW9uIFNldCh2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgPyBlbXB0eVNldCgpIDpcbiAgICAgICAgaXNTZXQodmFsdWUpICYmICFpc09yZGVyZWQodmFsdWUpID8gdmFsdWUgOlxuICAgICAgICBlbXB0eVNldCgpLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24oc2V0ICkge1xuICAgICAgICAgIHZhciBpdGVyID0gU2V0SXRlcmFibGUodmFsdWUpO1xuICAgICAgICAgIGFzc2VydE5vdEluZmluaXRlKGl0ZXIuc2l6ZSk7XG4gICAgICAgICAgaXRlci5mb3JFYWNoKGZ1bmN0aW9uKHYgKSB7cmV0dXJuIHNldC5hZGQodil9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgU2V0Lm9mID0gZnVuY3Rpb24oLyouLi52YWx1ZXMqLykge1xuICAgICAgcmV0dXJuIHRoaXMoYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgU2V0LmZyb21LZXlzID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzKEtleWVkSXRlcmFibGUodmFsdWUpLmtleVNlcSgpKTtcbiAgICB9O1xuXG4gICAgU2V0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX190b1N0cmluZygnU2V0IHsnLCAnfScpO1xuICAgIH07XG5cbiAgICAvLyBAcHJhZ21hIEFjY2Vzc1xuXG4gICAgU2V0LnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX21hcC5oYXModmFsdWUpO1xuICAgIH07XG5cbiAgICAvLyBAcHJhZ21hIE1vZGlmaWNhdGlvblxuXG4gICAgU2V0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHVwZGF0ZVNldCh0aGlzLCB0aGlzLl9tYXAuc2V0KHZhbHVlLCB0cnVlKSk7XG4gICAgfTtcblxuICAgIFNldC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB1cGRhdGVTZXQodGhpcywgdGhpcy5fbWFwLnJlbW92ZSh2YWx1ZSkpO1xuICAgIH07XG5cbiAgICBTZXQucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdXBkYXRlU2V0KHRoaXMsIHRoaXMuX21hcC5jbGVhcigpKTtcbiAgICB9O1xuXG4gICAgLy8gQHByYWdtYSBDb21wb3NpdGlvblxuXG4gICAgU2V0LnByb3RvdHlwZS51bmlvbiA9IGZ1bmN0aW9uKCkge3ZhciBpdGVycyA9IFNMSUNFJDAuY2FsbChhcmd1bWVudHMsIDApO1xuICAgICAgaXRlcnMgPSBpdGVycy5maWx0ZXIoZnVuY3Rpb24oeCApIHtyZXR1cm4geC5zaXplICE9PSAwfSk7XG4gICAgICBpZiAoaXRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCAmJiAhdGhpcy5fX293bmVySUQgJiYgaXRlcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yKGl0ZXJzWzBdKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24oc2V0ICkge1xuICAgICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgaXRlcnMubGVuZ3RoOyBpaSsrKSB7XG4gICAgICAgICAgU2V0SXRlcmFibGUoaXRlcnNbaWldKS5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlICkge3JldHVybiBzZXQuYWRkKHZhbHVlKX0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgU2V0LnByb3RvdHlwZS5pbnRlcnNlY3QgPSBmdW5jdGlvbigpIHt2YXIgaXRlcnMgPSBTTElDRSQwLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgICAgIGlmIChpdGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICBpdGVycyA9IGl0ZXJzLm1hcChmdW5jdGlvbihpdGVyICkge3JldHVybiBTZXRJdGVyYWJsZShpdGVyKX0pO1xuICAgICAgdmFyIG9yaWdpbmFsU2V0ID0gdGhpcztcbiAgICAgIHJldHVybiB0aGlzLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24oc2V0ICkge1xuICAgICAgICBvcmlnaW5hbFNldC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlICkge1xuICAgICAgICAgIGlmICghaXRlcnMuZXZlcnkoZnVuY3Rpb24oaXRlciApIHtyZXR1cm4gaXRlci5pbmNsdWRlcyh2YWx1ZSl9KSkge1xuICAgICAgICAgICAgc2V0LnJlbW92ZSh2YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBTZXQucHJvdG90eXBlLnN1YnRyYWN0ID0gZnVuY3Rpb24oKSB7dmFyIGl0ZXJzID0gU0xJQ0UkMC5jYWxsKGFyZ3VtZW50cywgMCk7XG4gICAgICBpZiAoaXRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgaXRlcnMgPSBpdGVycy5tYXAoZnVuY3Rpb24oaXRlciApIHtyZXR1cm4gU2V0SXRlcmFibGUoaXRlcil9KTtcbiAgICAgIHZhciBvcmlnaW5hbFNldCA9IHRoaXM7XG4gICAgICByZXR1cm4gdGhpcy53aXRoTXV0YXRpb25zKGZ1bmN0aW9uKHNldCApIHtcbiAgICAgICAgb3JpZ2luYWxTZXQuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSApIHtcbiAgICAgICAgICBpZiAoaXRlcnMuc29tZShmdW5jdGlvbihpdGVyICkge3JldHVybiBpdGVyLmluY2x1ZGVzKHZhbHVlKX0pKSB7XG4gICAgICAgICAgICBzZXQucmVtb3ZlKHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIFNldC5wcm90b3R5cGUubWVyZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnVuaW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIFNldC5wcm90b3R5cGUubWVyZ2VXaXRoID0gZnVuY3Rpb24obWVyZ2VyKSB7dmFyIGl0ZXJzID0gU0xJQ0UkMC5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICByZXR1cm4gdGhpcy51bmlvbi5hcHBseSh0aGlzLCBpdGVycyk7XG4gICAgfTtcblxuICAgIFNldC5wcm90b3R5cGUuc29ydCA9IGZ1bmN0aW9uKGNvbXBhcmF0b3IpIHtcbiAgICAgIC8vIExhdGUgYmluZGluZ1xuICAgICAgcmV0dXJuIE9yZGVyZWRTZXQoc29ydEZhY3RvcnkodGhpcywgY29tcGFyYXRvcikpO1xuICAgIH07XG5cbiAgICBTZXQucHJvdG90eXBlLnNvcnRCeSA9IGZ1bmN0aW9uKG1hcHBlciwgY29tcGFyYXRvcikge1xuICAgICAgLy8gTGF0ZSBiaW5kaW5nXG4gICAgICByZXR1cm4gT3JkZXJlZFNldChzb3J0RmFjdG9yeSh0aGlzLCBjb21wYXJhdG9yLCBtYXBwZXIpKTtcbiAgICB9O1xuXG4gICAgU2V0LnByb3RvdHlwZS53YXNBbHRlcmVkID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbWFwLndhc0FsdGVyZWQoKTtcbiAgICB9O1xuXG4gICAgU2V0LnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgcmV0dXJuIHRoaXMuX21hcC5fX2l0ZXJhdGUoZnVuY3Rpb24oXywgaykgIHtyZXR1cm4gZm4oaywgaywgdGhpcyQwKX0sIHJldmVyc2UpO1xuICAgIH07XG5cbiAgICBTZXQucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbWFwLm1hcChmdW5jdGlvbihfLCBrKSAge3JldHVybiBrfSkuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcbiAgICB9O1xuXG4gICAgU2V0LnByb3RvdHlwZS5fX2Vuc3VyZU93bmVyID0gZnVuY3Rpb24ob3duZXJJRCkge1xuICAgICAgaWYgKG93bmVySUQgPT09IHRoaXMuX19vd25lcklEKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgdmFyIG5ld01hcCA9IHRoaXMuX21hcC5fX2Vuc3VyZU93bmVyKG93bmVySUQpO1xuICAgICAgaWYgKCFvd25lcklEKSB7XG4gICAgICAgIHRoaXMuX19vd25lcklEID0gb3duZXJJRDtcbiAgICAgICAgdGhpcy5fbWFwID0gbmV3TWFwO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLl9fbWFrZShuZXdNYXAsIG93bmVySUQpO1xuICAgIH07XG5cblxuICBmdW5jdGlvbiBpc1NldChtYXliZVNldCkge1xuICAgIHJldHVybiAhIShtYXliZVNldCAmJiBtYXliZVNldFtJU19TRVRfU0VOVElORUxdKTtcbiAgfVxuXG4gIFNldC5pc1NldCA9IGlzU2V0O1xuXG4gIHZhciBJU19TRVRfU0VOVElORUwgPSAnQEBfX0lNTVVUQUJMRV9TRVRfX0BAJztcblxuICB2YXIgU2V0UHJvdG90eXBlID0gU2V0LnByb3RvdHlwZTtcbiAgU2V0UHJvdG90eXBlW0lTX1NFVF9TRU5USU5FTF0gPSB0cnVlO1xuICBTZXRQcm90b3R5cGVbREVMRVRFXSA9IFNldFByb3RvdHlwZS5yZW1vdmU7XG4gIFNldFByb3RvdHlwZS5tZXJnZURlZXAgPSBTZXRQcm90b3R5cGUubWVyZ2U7XG4gIFNldFByb3RvdHlwZS5tZXJnZURlZXBXaXRoID0gU2V0UHJvdG90eXBlLm1lcmdlV2l0aDtcbiAgU2V0UHJvdG90eXBlLndpdGhNdXRhdGlvbnMgPSBNYXBQcm90b3R5cGUud2l0aE11dGF0aW9ucztcbiAgU2V0UHJvdG90eXBlLmFzTXV0YWJsZSA9IE1hcFByb3RvdHlwZS5hc011dGFibGU7XG4gIFNldFByb3RvdHlwZS5hc0ltbXV0YWJsZSA9IE1hcFByb3RvdHlwZS5hc0ltbXV0YWJsZTtcblxuICBTZXRQcm90b3R5cGUuX19lbXB0eSA9IGVtcHR5U2V0O1xuICBTZXRQcm90b3R5cGUuX19tYWtlID0gbWFrZVNldDtcblxuICBmdW5jdGlvbiB1cGRhdGVTZXQoc2V0LCBuZXdNYXApIHtcbiAgICBpZiAoc2V0Ll9fb3duZXJJRCkge1xuICAgICAgc2V0LnNpemUgPSBuZXdNYXAuc2l6ZTtcbiAgICAgIHNldC5fbWFwID0gbmV3TWFwO1xuICAgICAgcmV0dXJuIHNldDtcbiAgICB9XG4gICAgcmV0dXJuIG5ld01hcCA9PT0gc2V0Ll9tYXAgPyBzZXQgOlxuICAgICAgbmV3TWFwLnNpemUgPT09IDAgPyBzZXQuX19lbXB0eSgpIDpcbiAgICAgIHNldC5fX21ha2UobmV3TWFwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1ha2VTZXQobWFwLCBvd25lcklEKSB7XG4gICAgdmFyIHNldCA9IE9iamVjdC5jcmVhdGUoU2V0UHJvdG90eXBlKTtcbiAgICBzZXQuc2l6ZSA9IG1hcCA/IG1hcC5zaXplIDogMDtcbiAgICBzZXQuX21hcCA9IG1hcDtcbiAgICBzZXQuX19vd25lcklEID0gb3duZXJJRDtcbiAgICByZXR1cm4gc2V0O1xuICB9XG5cbiAgdmFyIEVNUFRZX1NFVDtcbiAgZnVuY3Rpb24gZW1wdHlTZXQoKSB7XG4gICAgcmV0dXJuIEVNUFRZX1NFVCB8fCAoRU1QVFlfU0VUID0gbWFrZVNldChlbXB0eU1hcCgpKSk7XG4gIH1cblxuICBjcmVhdGVDbGFzcyhPcmRlcmVkU2V0LCBTZXQpO1xuXG4gICAgLy8gQHByYWdtYSBDb25zdHJ1Y3Rpb25cblxuICAgIGZ1bmN0aW9uIE9yZGVyZWRTZXQodmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gZW1wdHlPcmRlcmVkU2V0KCkgOlxuICAgICAgICBpc09yZGVyZWRTZXQodmFsdWUpID8gdmFsdWUgOlxuICAgICAgICBlbXB0eU9yZGVyZWRTZXQoKS53aXRoTXV0YXRpb25zKGZ1bmN0aW9uKHNldCApIHtcbiAgICAgICAgICB2YXIgaXRlciA9IFNldEl0ZXJhYmxlKHZhbHVlKTtcbiAgICAgICAgICBhc3NlcnROb3RJbmZpbml0ZShpdGVyLnNpemUpO1xuICAgICAgICAgIGl0ZXIuZm9yRWFjaChmdW5jdGlvbih2ICkge3JldHVybiBzZXQuYWRkKHYpfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIE9yZGVyZWRTZXQub2YgPSBmdW5jdGlvbigvKi4uLnZhbHVlcyovKSB7XG4gICAgICByZXR1cm4gdGhpcyhhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBPcmRlcmVkU2V0LmZyb21LZXlzID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzKEtleWVkSXRlcmFibGUodmFsdWUpLmtleVNlcSgpKTtcbiAgICB9O1xuXG4gICAgT3JkZXJlZFNldC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcoJ09yZGVyZWRTZXQgeycsICd9Jyk7XG4gICAgfTtcblxuXG4gIGZ1bmN0aW9uIGlzT3JkZXJlZFNldChtYXliZU9yZGVyZWRTZXQpIHtcbiAgICByZXR1cm4gaXNTZXQobWF5YmVPcmRlcmVkU2V0KSAmJiBpc09yZGVyZWQobWF5YmVPcmRlcmVkU2V0KTtcbiAgfVxuXG4gIE9yZGVyZWRTZXQuaXNPcmRlcmVkU2V0ID0gaXNPcmRlcmVkU2V0O1xuXG4gIHZhciBPcmRlcmVkU2V0UHJvdG90eXBlID0gT3JkZXJlZFNldC5wcm90b3R5cGU7XG4gIE9yZGVyZWRTZXRQcm90b3R5cGVbSVNfT1JERVJFRF9TRU5USU5FTF0gPSB0cnVlO1xuXG4gIE9yZGVyZWRTZXRQcm90b3R5cGUuX19lbXB0eSA9IGVtcHR5T3JkZXJlZFNldDtcbiAgT3JkZXJlZFNldFByb3RvdHlwZS5fX21ha2UgPSBtYWtlT3JkZXJlZFNldDtcblxuICBmdW5jdGlvbiBtYWtlT3JkZXJlZFNldChtYXAsIG93bmVySUQpIHtcbiAgICB2YXIgc2V0ID0gT2JqZWN0LmNyZWF0ZShPcmRlcmVkU2V0UHJvdG90eXBlKTtcbiAgICBzZXQuc2l6ZSA9IG1hcCA/IG1hcC5zaXplIDogMDtcbiAgICBzZXQuX21hcCA9IG1hcDtcbiAgICBzZXQuX19vd25lcklEID0gb3duZXJJRDtcbiAgICByZXR1cm4gc2V0O1xuICB9XG5cbiAgdmFyIEVNUFRZX09SREVSRURfU0VUO1xuICBmdW5jdGlvbiBlbXB0eU9yZGVyZWRTZXQoKSB7XG4gICAgcmV0dXJuIEVNUFRZX09SREVSRURfU0VUIHx8IChFTVBUWV9PUkRFUkVEX1NFVCA9IG1ha2VPcmRlcmVkU2V0KGVtcHR5T3JkZXJlZE1hcCgpKSk7XG4gIH1cblxuICBjcmVhdGVDbGFzcyhTdGFjaywgSW5kZXhlZENvbGxlY3Rpb24pO1xuXG4gICAgLy8gQHByYWdtYSBDb25zdHJ1Y3Rpb25cblxuICAgIGZ1bmN0aW9uIFN0YWNrKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCA/IGVtcHR5U3RhY2soKSA6XG4gICAgICAgIGlzU3RhY2sodmFsdWUpID8gdmFsdWUgOlxuICAgICAgICBlbXB0eVN0YWNrKCkudW5zaGlmdEFsbCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgU3RhY2sub2YgPSBmdW5jdGlvbigvKi4uLnZhbHVlcyovKSB7XG4gICAgICByZXR1cm4gdGhpcyhhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBTdGFjay5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcoJ1N0YWNrIFsnLCAnXScpO1xuICAgIH07XG5cbiAgICAvLyBAcHJhZ21hIEFjY2Vzc1xuXG4gICAgU3RhY2sucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGluZGV4LCBub3RTZXRWYWx1ZSkge1xuICAgICAgdmFyIGhlYWQgPSB0aGlzLl9oZWFkO1xuICAgICAgaW5kZXggPSB3cmFwSW5kZXgodGhpcywgaW5kZXgpO1xuICAgICAgd2hpbGUgKGhlYWQgJiYgaW5kZXgtLSkge1xuICAgICAgICBoZWFkID0gaGVhZC5uZXh0O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGhlYWQgPyBoZWFkLnZhbHVlIDogbm90U2V0VmFsdWU7XG4gICAgfTtcblxuICAgIFN0YWNrLnByb3RvdHlwZS5wZWVrID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5faGVhZCAmJiB0aGlzLl9oZWFkLnZhbHVlO1xuICAgIH07XG5cbiAgICAvLyBAcHJhZ21hIE1vZGlmaWNhdGlvblxuXG4gICAgU3RhY2sucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbigvKi4uLnZhbHVlcyovKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHZhciBuZXdTaXplID0gdGhpcy5zaXplICsgYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgIHZhciBoZWFkID0gdGhpcy5faGVhZDtcbiAgICAgIGZvciAodmFyIGlpID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7IGlpID49IDA7IGlpLS0pIHtcbiAgICAgICAgaGVhZCA9IHtcbiAgICAgICAgICB2YWx1ZTogYXJndW1lbnRzW2lpXSxcbiAgICAgICAgICBuZXh0OiBoZWFkXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fX293bmVySUQpIHtcbiAgICAgICAgdGhpcy5zaXplID0gbmV3U2l6ZTtcbiAgICAgICAgdGhpcy5faGVhZCA9IGhlYWQ7XG4gICAgICAgIHRoaXMuX19oYXNoID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9fYWx0ZXJlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1ha2VTdGFjayhuZXdTaXplLCBoZWFkKTtcbiAgICB9O1xuXG4gICAgU3RhY2sucHJvdG90eXBlLnB1c2hBbGwgPSBmdW5jdGlvbihpdGVyKSB7XG4gICAgICBpdGVyID0gSW5kZXhlZEl0ZXJhYmxlKGl0ZXIpO1xuICAgICAgaWYgKGl0ZXIuc2l6ZSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIGFzc2VydE5vdEluZmluaXRlKGl0ZXIuc2l6ZSk7XG4gICAgICB2YXIgbmV3U2l6ZSA9IHRoaXMuc2l6ZTtcbiAgICAgIHZhciBoZWFkID0gdGhpcy5faGVhZDtcbiAgICAgIGl0ZXIucmV2ZXJzZSgpLmZvckVhY2goZnVuY3Rpb24odmFsdWUgKSB7XG4gICAgICAgIG5ld1NpemUrKztcbiAgICAgICAgaGVhZCA9IHtcbiAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgbmV4dDogaGVhZFxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgICBpZiAodGhpcy5fX293bmVySUQpIHtcbiAgICAgICAgdGhpcy5zaXplID0gbmV3U2l6ZTtcbiAgICAgICAgdGhpcy5faGVhZCA9IGhlYWQ7XG4gICAgICAgIHRoaXMuX19oYXNoID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9fYWx0ZXJlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1ha2VTdGFjayhuZXdTaXplLCBoZWFkKTtcbiAgICB9O1xuXG4gICAgU3RhY2sucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2xpY2UoMSk7XG4gICAgfTtcblxuICAgIFN0YWNrLnByb3RvdHlwZS51bnNoaWZ0ID0gZnVuY3Rpb24oLyouLi52YWx1ZXMqLykge1xuICAgICAgcmV0dXJuIHRoaXMucHVzaC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBTdGFjay5wcm90b3R5cGUudW5zaGlmdEFsbCA9IGZ1bmN0aW9uKGl0ZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLnB1c2hBbGwoaXRlcik7XG4gICAgfTtcblxuICAgIFN0YWNrLnByb3RvdHlwZS5zaGlmdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucG9wLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIFN0YWNrLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9fb3duZXJJRCkge1xuICAgICAgICB0aGlzLnNpemUgPSAwO1xuICAgICAgICB0aGlzLl9oZWFkID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9faGFzaCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5fX2FsdGVyZWQgPSB0cnVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHJldHVybiBlbXB0eVN0YWNrKCk7XG4gICAgfTtcblxuICAgIFN0YWNrLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uKGJlZ2luLCBlbmQpIHtcbiAgICAgIGlmICh3aG9sZVNsaWNlKGJlZ2luLCBlbmQsIHRoaXMuc2l6ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICB2YXIgcmVzb2x2ZWRCZWdpbiA9IHJlc29sdmVCZWdpbihiZWdpbiwgdGhpcy5zaXplKTtcbiAgICAgIHZhciByZXNvbHZlZEVuZCA9IHJlc29sdmVFbmQoZW5kLCB0aGlzLnNpemUpO1xuICAgICAgaWYgKHJlc29sdmVkRW5kICE9PSB0aGlzLnNpemUpIHtcbiAgICAgICAgLy8gc3VwZXIuc2xpY2UoYmVnaW4sIGVuZCk7XG4gICAgICAgIHJldHVybiBJbmRleGVkQ29sbGVjdGlvbi5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLCBiZWdpbiwgZW5kKTtcbiAgICAgIH1cbiAgICAgIHZhciBuZXdTaXplID0gdGhpcy5zaXplIC0gcmVzb2x2ZWRCZWdpbjtcbiAgICAgIHZhciBoZWFkID0gdGhpcy5faGVhZDtcbiAgICAgIHdoaWxlIChyZXNvbHZlZEJlZ2luLS0pIHtcbiAgICAgICAgaGVhZCA9IGhlYWQubmV4dDtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9fb3duZXJJRCkge1xuICAgICAgICB0aGlzLnNpemUgPSBuZXdTaXplO1xuICAgICAgICB0aGlzLl9oZWFkID0gaGVhZDtcbiAgICAgICAgdGhpcy5fX2hhc2ggPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX19hbHRlcmVkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFrZVN0YWNrKG5ld1NpemUsIGhlYWQpO1xuICAgIH07XG5cbiAgICAvLyBAcHJhZ21hIE11dGFiaWxpdHlcblxuICAgIFN0YWNrLnByb3RvdHlwZS5fX2Vuc3VyZU93bmVyID0gZnVuY3Rpb24ob3duZXJJRCkge1xuICAgICAgaWYgKG93bmVySUQgPT09IHRoaXMuX19vd25lcklEKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgaWYgKCFvd25lcklEKSB7XG4gICAgICAgIHRoaXMuX19vd25lcklEID0gb3duZXJJRDtcbiAgICAgICAgdGhpcy5fX2FsdGVyZWQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFrZVN0YWNrKHRoaXMuc2l6ZSwgdGhpcy5faGVhZCwgb3duZXJJRCwgdGhpcy5fX2hhc2gpO1xuICAgIH07XG5cbiAgICAvLyBAcHJhZ21hIEl0ZXJhdGlvblxuXG4gICAgU3RhY2sucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7XG4gICAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXZlcnNlKCkuX19pdGVyYXRlKGZuKTtcbiAgICAgIH1cbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHZhciBub2RlID0gdGhpcy5faGVhZDtcbiAgICAgIHdoaWxlIChub2RlKSB7XG4gICAgICAgIGlmIChmbihub2RlLnZhbHVlLCBpdGVyYXRpb25zKyssIHRoaXMpID09PSBmYWxzZSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgICB9O1xuXG4gICAgU3RhY2sucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXZlcnNlKCkuX19pdGVyYXRvcih0eXBlKTtcbiAgICAgIH1cbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHZhciBub2RlID0gdGhpcy5faGVhZDtcbiAgICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgIHZhciB2YWx1ZSA9IG5vZGUudmFsdWU7XG4gICAgICAgICAgbm9kZSA9IG5vZGUubmV4dDtcbiAgICAgICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZSh0eXBlLCBpdGVyYXRpb25zKyssIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXRlcmF0b3JEb25lKCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG5cbiAgZnVuY3Rpb24gaXNTdGFjayhtYXliZVN0YWNrKSB7XG4gICAgcmV0dXJuICEhKG1heWJlU3RhY2sgJiYgbWF5YmVTdGFja1tJU19TVEFDS19TRU5USU5FTF0pO1xuICB9XG5cbiAgU3RhY2suaXNTdGFjayA9IGlzU3RhY2s7XG5cbiAgdmFyIElTX1NUQUNLX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfU1RBQ0tfX0BAJztcblxuICB2YXIgU3RhY2tQcm90b3R5cGUgPSBTdGFjay5wcm90b3R5cGU7XG4gIFN0YWNrUHJvdG90eXBlW0lTX1NUQUNLX1NFTlRJTkVMXSA9IHRydWU7XG4gIFN0YWNrUHJvdG90eXBlLndpdGhNdXRhdGlvbnMgPSBNYXBQcm90b3R5cGUud2l0aE11dGF0aW9ucztcbiAgU3RhY2tQcm90b3R5cGUuYXNNdXRhYmxlID0gTWFwUHJvdG90eXBlLmFzTXV0YWJsZTtcbiAgU3RhY2tQcm90b3R5cGUuYXNJbW11dGFibGUgPSBNYXBQcm90b3R5cGUuYXNJbW11dGFibGU7XG4gIFN0YWNrUHJvdG90eXBlLndhc0FsdGVyZWQgPSBNYXBQcm90b3R5cGUud2FzQWx0ZXJlZDtcblxuXG4gIGZ1bmN0aW9uIG1ha2VTdGFjayhzaXplLCBoZWFkLCBvd25lcklELCBoYXNoKSB7XG4gICAgdmFyIG1hcCA9IE9iamVjdC5jcmVhdGUoU3RhY2tQcm90b3R5cGUpO1xuICAgIG1hcC5zaXplID0gc2l6ZTtcbiAgICBtYXAuX2hlYWQgPSBoZWFkO1xuICAgIG1hcC5fX293bmVySUQgPSBvd25lcklEO1xuICAgIG1hcC5fX2hhc2ggPSBoYXNoO1xuICAgIG1hcC5fX2FsdGVyZWQgPSBmYWxzZTtcbiAgICByZXR1cm4gbWFwO1xuICB9XG5cbiAgdmFyIEVNUFRZX1NUQUNLO1xuICBmdW5jdGlvbiBlbXB0eVN0YWNrKCkge1xuICAgIHJldHVybiBFTVBUWV9TVEFDSyB8fCAoRU1QVFlfU1RBQ0sgPSBtYWtlU3RhY2soMCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnRyaWJ1dGVzIGFkZGl0aW9uYWwgbWV0aG9kcyB0byBhIGNvbnN0cnVjdG9yXG4gICAqL1xuICBmdW5jdGlvbiBtaXhpbihjdG9yLCBtZXRob2RzKSB7XG4gICAgdmFyIGtleUNvcGllciA9IGZ1bmN0aW9uKGtleSApIHsgY3Rvci5wcm90b3R5cGVba2V5XSA9IG1ldGhvZHNba2V5XTsgfTtcbiAgICBPYmplY3Qua2V5cyhtZXRob2RzKS5mb3JFYWNoKGtleUNvcGllcik7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyAmJlxuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhtZXRob2RzKS5mb3JFYWNoKGtleUNvcGllcik7XG4gICAgcmV0dXJuIGN0b3I7XG4gIH1cblxuICBJdGVyYWJsZS5JdGVyYXRvciA9IEl0ZXJhdG9yO1xuXG4gIG1peGluKEl0ZXJhYmxlLCB7XG5cbiAgICAvLyAjIyMgQ29udmVyc2lvbiB0byBvdGhlciB0eXBlc1xuXG4gICAgdG9BcnJheTogZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnROb3RJbmZpbml0ZSh0aGlzLnNpemUpO1xuICAgICAgdmFyIGFycmF5ID0gbmV3IEFycmF5KHRoaXMuc2l6ZSB8fCAwKTtcbiAgICAgIHRoaXMudmFsdWVTZXEoKS5fX2l0ZXJhdGUoZnVuY3Rpb24odiwgaSkgIHsgYXJyYXlbaV0gPSB2OyB9KTtcbiAgICAgIHJldHVybiBhcnJheTtcbiAgICB9LFxuXG4gICAgdG9JbmRleGVkU2VxOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgVG9JbmRleGVkU2VxdWVuY2UodGhpcyk7XG4gICAgfSxcblxuICAgIHRvSlM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudG9TZXEoKS5tYXAoXG4gICAgICAgIGZ1bmN0aW9uKHZhbHVlICkge3JldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUudG9KUyA9PT0gJ2Z1bmN0aW9uJyA/IHZhbHVlLnRvSlMoKSA6IHZhbHVlfVxuICAgICAgKS5fX3RvSlMoKTtcbiAgICB9LFxuXG4gICAgdG9KU09OOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvU2VxKCkubWFwKFxuICAgICAgICBmdW5jdGlvbih2YWx1ZSApIHtyZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLnRvSlNPTiA9PT0gJ2Z1bmN0aW9uJyA/IHZhbHVlLnRvSlNPTigpIDogdmFsdWV9XG4gICAgICApLl9fdG9KUygpO1xuICAgIH0sXG5cbiAgICB0b0tleWVkU2VxOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgVG9LZXllZFNlcXVlbmNlKHRoaXMsIHRydWUpO1xuICAgIH0sXG5cbiAgICB0b01hcDogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBVc2UgTGF0ZSBCaW5kaW5nIGhlcmUgdG8gc29sdmUgdGhlIGNpcmN1bGFyIGRlcGVuZGVuY3kuXG4gICAgICByZXR1cm4gTWFwKHRoaXMudG9LZXllZFNlcSgpKTtcbiAgICB9LFxuXG4gICAgdG9PYmplY3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0Tm90SW5maW5pdGUodGhpcy5zaXplKTtcbiAgICAgIHZhciBvYmplY3QgPSB7fTtcbiAgICAgIHRoaXMuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGspICB7IG9iamVjdFtrXSA9IHY7IH0pO1xuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9LFxuXG4gICAgdG9PcmRlcmVkTWFwOiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIFVzZSBMYXRlIEJpbmRpbmcgaGVyZSB0byBzb2x2ZSB0aGUgY2lyY3VsYXIgZGVwZW5kZW5jeS5cbiAgICAgIHJldHVybiBPcmRlcmVkTWFwKHRoaXMudG9LZXllZFNlcSgpKTtcbiAgICB9LFxuXG4gICAgdG9PcmRlcmVkU2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIFVzZSBMYXRlIEJpbmRpbmcgaGVyZSB0byBzb2x2ZSB0aGUgY2lyY3VsYXIgZGVwZW5kZW5jeS5cbiAgICAgIHJldHVybiBPcmRlcmVkU2V0KGlzS2V5ZWQodGhpcykgPyB0aGlzLnZhbHVlU2VxKCkgOiB0aGlzKTtcbiAgICB9LFxuXG4gICAgdG9TZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gVXNlIExhdGUgQmluZGluZyBoZXJlIHRvIHNvbHZlIHRoZSBjaXJjdWxhciBkZXBlbmRlbmN5LlxuICAgICAgcmV0dXJuIFNldChpc0tleWVkKHRoaXMpID8gdGhpcy52YWx1ZVNlcSgpIDogdGhpcyk7XG4gICAgfSxcblxuICAgIHRvU2V0U2VxOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgVG9TZXRTZXF1ZW5jZSh0aGlzKTtcbiAgICB9LFxuXG4gICAgdG9TZXE6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGlzSW5kZXhlZCh0aGlzKSA/IHRoaXMudG9JbmRleGVkU2VxKCkgOlxuICAgICAgICBpc0tleWVkKHRoaXMpID8gdGhpcy50b0tleWVkU2VxKCkgOlxuICAgICAgICB0aGlzLnRvU2V0U2VxKCk7XG4gICAgfSxcblxuICAgIHRvU3RhY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gVXNlIExhdGUgQmluZGluZyBoZXJlIHRvIHNvbHZlIHRoZSBjaXJjdWxhciBkZXBlbmRlbmN5LlxuICAgICAgcmV0dXJuIFN0YWNrKGlzS2V5ZWQodGhpcykgPyB0aGlzLnZhbHVlU2VxKCkgOiB0aGlzKTtcbiAgICB9LFxuXG4gICAgdG9MaXN0OiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIFVzZSBMYXRlIEJpbmRpbmcgaGVyZSB0byBzb2x2ZSB0aGUgY2lyY3VsYXIgZGVwZW5kZW5jeS5cbiAgICAgIHJldHVybiBMaXN0KGlzS2V5ZWQodGhpcykgPyB0aGlzLnZhbHVlU2VxKCkgOiB0aGlzKTtcbiAgICB9LFxuXG5cbiAgICAvLyAjIyMgQ29tbW9uIEphdmFTY3JpcHQgbWV0aG9kcyBhbmQgcHJvcGVydGllc1xuXG4gICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICdbSXRlcmFibGVdJztcbiAgICB9LFxuXG4gICAgX190b1N0cmluZzogZnVuY3Rpb24oaGVhZCwgdGFpbCkge1xuICAgICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gaGVhZCArIHRhaWw7XG4gICAgICB9XG4gICAgICByZXR1cm4gaGVhZCArICcgJyArIHRoaXMudG9TZXEoKS5tYXAodGhpcy5fX3RvU3RyaW5nTWFwcGVyKS5qb2luKCcsICcpICsgJyAnICsgdGFpbDtcbiAgICB9LFxuXG5cbiAgICAvLyAjIyMgRVM2IENvbGxlY3Rpb24gbWV0aG9kcyAoRVM2IEFycmF5IGFuZCBNYXApXG5cbiAgICBjb25jYXQ6IGZ1bmN0aW9uKCkge3ZhciB2YWx1ZXMgPSBTTElDRSQwLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBjb25jYXRGYWN0b3J5KHRoaXMsIHZhbHVlcykpO1xuICAgIH0sXG5cbiAgICBpbmNsdWRlczogZnVuY3Rpb24oc2VhcmNoVmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLnNvbWUoZnVuY3Rpb24odmFsdWUgKSB7cmV0dXJuIGlzKHZhbHVlLCBzZWFyY2hWYWx1ZSl9KTtcbiAgICB9LFxuXG4gICAgZW50cmllczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX2l0ZXJhdG9yKElURVJBVEVfRU5UUklFUyk7XG4gICAgfSxcblxuICAgIGV2ZXJ5OiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIGFzc2VydE5vdEluZmluaXRlKHRoaXMuc2l6ZSk7XG4gICAgICB2YXIgcmV0dXJuVmFsdWUgPSB0cnVlO1xuICAgICAgdGhpcy5fX2l0ZXJhdGUoZnVuY3Rpb24odiwgaywgYykgIHtcbiAgICAgICAgaWYgKCFwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2LCBrLCBjKSkge1xuICAgICAgICAgIHJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgICB9LFxuXG4gICAgZmlsdGVyOiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBmaWx0ZXJGYWN0b3J5KHRoaXMsIHByZWRpY2F0ZSwgY29udGV4dCwgdHJ1ZSkpO1xuICAgIH0sXG5cbiAgICBmaW5kOiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQsIG5vdFNldFZhbHVlKSB7XG4gICAgICB2YXIgZW50cnkgPSB0aGlzLmZpbmRFbnRyeShwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgICAgcmV0dXJuIGVudHJ5ID8gZW50cnlbMV0gOiBub3RTZXRWYWx1ZTtcbiAgICB9LFxuXG4gICAgZm9yRWFjaDogZnVuY3Rpb24oc2lkZUVmZmVjdCwgY29udGV4dCkge1xuICAgICAgYXNzZXJ0Tm90SW5maW5pdGUodGhpcy5zaXplKTtcbiAgICAgIHJldHVybiB0aGlzLl9faXRlcmF0ZShjb250ZXh0ID8gc2lkZUVmZmVjdC5iaW5kKGNvbnRleHQpIDogc2lkZUVmZmVjdCk7XG4gICAgfSxcblxuICAgIGpvaW46IGZ1bmN0aW9uKHNlcGFyYXRvcikge1xuICAgICAgYXNzZXJ0Tm90SW5maW5pdGUodGhpcy5zaXplKTtcbiAgICAgIHNlcGFyYXRvciA9IHNlcGFyYXRvciAhPT0gdW5kZWZpbmVkID8gJycgKyBzZXBhcmF0b3IgOiAnLCc7XG4gICAgICB2YXIgam9pbmVkID0gJyc7XG4gICAgICB2YXIgaXNGaXJzdCA9IHRydWU7XG4gICAgICB0aGlzLl9faXRlcmF0ZShmdW5jdGlvbih2ICkge1xuICAgICAgICBpc0ZpcnN0ID8gKGlzRmlyc3QgPSBmYWxzZSkgOiAoam9pbmVkICs9IHNlcGFyYXRvcik7XG4gICAgICAgIGpvaW5lZCArPSB2ICE9PSBudWxsICYmIHYgIT09IHVuZGVmaW5lZCA/IHYudG9TdHJpbmcoKSA6ICcnO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gam9pbmVkO1xuICAgIH0sXG5cbiAgICBrZXlzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9faXRlcmF0b3IoSVRFUkFURV9LRVlTKTtcbiAgICB9LFxuXG4gICAgbWFwOiBmdW5jdGlvbihtYXBwZXIsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBtYXBGYWN0b3J5KHRoaXMsIG1hcHBlciwgY29udGV4dCkpO1xuICAgIH0sXG5cbiAgICByZWR1Y2U6IGZ1bmN0aW9uKHJlZHVjZXIsIGluaXRpYWxSZWR1Y3Rpb24sIGNvbnRleHQpIHtcbiAgICAgIGFzc2VydE5vdEluZmluaXRlKHRoaXMuc2l6ZSk7XG4gICAgICB2YXIgcmVkdWN0aW9uO1xuICAgICAgdmFyIHVzZUZpcnN0O1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICAgIHVzZUZpcnN0ID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlZHVjdGlvbiA9IGluaXRpYWxSZWR1Y3Rpb247XG4gICAgICB9XG4gICAgICB0aGlzLl9faXRlcmF0ZShmdW5jdGlvbih2LCBrLCBjKSAge1xuICAgICAgICBpZiAodXNlRmlyc3QpIHtcbiAgICAgICAgICB1c2VGaXJzdCA9IGZhbHNlO1xuICAgICAgICAgIHJlZHVjdGlvbiA9IHY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVkdWN0aW9uID0gcmVkdWNlci5jYWxsKGNvbnRleHQsIHJlZHVjdGlvbiwgdiwgaywgYyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlZHVjdGlvbjtcbiAgICB9LFxuXG4gICAgcmVkdWNlUmlnaHQ6IGZ1bmN0aW9uKHJlZHVjZXIsIGluaXRpYWxSZWR1Y3Rpb24sIGNvbnRleHQpIHtcbiAgICAgIHZhciByZXZlcnNlZCA9IHRoaXMudG9LZXllZFNlcSgpLnJldmVyc2UoKTtcbiAgICAgIHJldHVybiByZXZlcnNlZC5yZWR1Y2UuYXBwbHkocmV2ZXJzZWQsIGFyZ3VtZW50cyk7XG4gICAgfSxcblxuICAgIHJldmVyc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHJldmVyc2VGYWN0b3J5KHRoaXMsIHRydWUpKTtcbiAgICB9LFxuXG4gICAgc2xpY2U6IGZ1bmN0aW9uKGJlZ2luLCBlbmQpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBzbGljZUZhY3RvcnkodGhpcywgYmVnaW4sIGVuZCwgdHJ1ZSkpO1xuICAgIH0sXG5cbiAgICBzb21lOiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiAhdGhpcy5ldmVyeShub3QocHJlZGljYXRlKSwgY29udGV4dCk7XG4gICAgfSxcblxuICAgIHNvcnQ6IGZ1bmN0aW9uKGNvbXBhcmF0b3IpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBzb3J0RmFjdG9yeSh0aGlzLCBjb21wYXJhdG9yKSk7XG4gICAgfSxcblxuICAgIHZhbHVlczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX2l0ZXJhdG9yKElURVJBVEVfVkFMVUVTKTtcbiAgICB9LFxuXG5cbiAgICAvLyAjIyMgTW9yZSBzZXF1ZW50aWFsIG1ldGhvZHNcblxuICAgIGJ1dExhc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2xpY2UoMCwgLTEpO1xuICAgIH0sXG5cbiAgICBpc0VtcHR5OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnNpemUgIT09IHVuZGVmaW5lZCA/IHRoaXMuc2l6ZSA9PT0gMCA6ICF0aGlzLnNvbWUoZnVuY3Rpb24oKSAge3JldHVybiB0cnVlfSk7XG4gICAgfSxcblxuICAgIGNvdW50OiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiBlbnN1cmVTaXplKFxuICAgICAgICBwcmVkaWNhdGUgPyB0aGlzLnRvU2VxKCkuZmlsdGVyKHByZWRpY2F0ZSwgY29udGV4dCkgOiB0aGlzXG4gICAgICApO1xuICAgIH0sXG5cbiAgICBjb3VudEJ5OiBmdW5jdGlvbihncm91cGVyLCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gY291bnRCeUZhY3RvcnkodGhpcywgZ3JvdXBlciwgY29udGV4dCk7XG4gICAgfSxcblxuICAgIGVxdWFsczogZnVuY3Rpb24ob3RoZXIpIHtcbiAgICAgIHJldHVybiBkZWVwRXF1YWwodGhpcywgb3RoZXIpO1xuICAgIH0sXG5cbiAgICBlbnRyeVNlcTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaXRlcmFibGUgPSB0aGlzO1xuICAgICAgaWYgKGl0ZXJhYmxlLl9jYWNoZSkge1xuICAgICAgICAvLyBXZSBjYWNoZSBhcyBhbiBlbnRyaWVzIGFycmF5LCBzbyB3ZSBjYW4ganVzdCByZXR1cm4gdGhlIGNhY2hlIVxuICAgICAgICByZXR1cm4gbmV3IEFycmF5U2VxKGl0ZXJhYmxlLl9jYWNoZSk7XG4gICAgICB9XG4gICAgICB2YXIgZW50cmllc1NlcXVlbmNlID0gaXRlcmFibGUudG9TZXEoKS5tYXAoZW50cnlNYXBwZXIpLnRvSW5kZXhlZFNlcSgpO1xuICAgICAgZW50cmllc1NlcXVlbmNlLmZyb21FbnRyeVNlcSA9IGZ1bmN0aW9uKCkgIHtyZXR1cm4gaXRlcmFibGUudG9TZXEoKX07XG4gICAgICByZXR1cm4gZW50cmllc1NlcXVlbmNlO1xuICAgIH0sXG5cbiAgICBmaWx0ZXJOb3Q6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyKG5vdChwcmVkaWNhdGUpLCBjb250ZXh0KTtcbiAgICB9LFxuXG4gICAgZmluZEVudHJ5OiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQsIG5vdFNldFZhbHVlKSB7XG4gICAgICB2YXIgZm91bmQgPSBub3RTZXRWYWx1ZTtcbiAgICAgIHRoaXMuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGssIGMpICB7XG4gICAgICAgIGlmIChwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2LCBrLCBjKSkge1xuICAgICAgICAgIGZvdW5kID0gW2ssIHZdO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gZm91bmQ7XG4gICAgfSxcblxuICAgIGZpbmRLZXk6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgICAgdmFyIGVudHJ5ID0gdGhpcy5maW5kRW50cnkocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICAgIHJldHVybiBlbnRyeSAmJiBlbnRyeVswXTtcbiAgICB9LFxuXG4gICAgZmluZExhc3Q6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCwgbm90U2V0VmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvS2V5ZWRTZXEoKS5yZXZlcnNlKCkuZmluZChwcmVkaWNhdGUsIGNvbnRleHQsIG5vdFNldFZhbHVlKTtcbiAgICB9LFxuXG4gICAgZmluZExhc3RFbnRyeTogZnVuY3Rpb24ocHJlZGljYXRlLCBjb250ZXh0LCBub3RTZXRWYWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMudG9LZXllZFNlcSgpLnJldmVyc2UoKS5maW5kRW50cnkocHJlZGljYXRlLCBjb250ZXh0LCBub3RTZXRWYWx1ZSk7XG4gICAgfSxcblxuICAgIGZpbmRMYXN0S2V5OiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvS2V5ZWRTZXEoKS5yZXZlcnNlKCkuZmluZEtleShwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIH0sXG5cbiAgICBmaXJzdDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kKHJldHVyblRydWUpO1xuICAgIH0sXG5cbiAgICBmbGF0TWFwOiBmdW5jdGlvbihtYXBwZXIsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBmbGF0TWFwRmFjdG9yeSh0aGlzLCBtYXBwZXIsIGNvbnRleHQpKTtcbiAgICB9LFxuXG4gICAgZmxhdHRlbjogZnVuY3Rpb24oZGVwdGgpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBmbGF0dGVuRmFjdG9yeSh0aGlzLCBkZXB0aCwgdHJ1ZSkpO1xuICAgIH0sXG5cbiAgICBmcm9tRW50cnlTZXE6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBGcm9tRW50cmllc1NlcXVlbmNlKHRoaXMpO1xuICAgIH0sXG5cbiAgICBnZXQ6IGZ1bmN0aW9uKHNlYXJjaEtleSwgbm90U2V0VmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbmQoZnVuY3Rpb24oXywga2V5KSAge3JldHVybiBpcyhrZXksIHNlYXJjaEtleSl9LCB1bmRlZmluZWQsIG5vdFNldFZhbHVlKTtcbiAgICB9LFxuXG4gICAgZ2V0SW46IGZ1bmN0aW9uKHNlYXJjaEtleVBhdGgsIG5vdFNldFZhbHVlKSB7XG4gICAgICB2YXIgbmVzdGVkID0gdGhpcztcbiAgICAgIC8vIE5vdGU6IGluIGFuIEVTNiBlbnZpcm9ubWVudCwgd2Ugd291bGQgcHJlZmVyOlxuICAgICAgLy8gZm9yICh2YXIga2V5IG9mIHNlYXJjaEtleVBhdGgpIHtcbiAgICAgIHZhciBpdGVyID0gZm9yY2VJdGVyYXRvcihzZWFyY2hLZXlQYXRoKTtcbiAgICAgIHZhciBzdGVwO1xuICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXIubmV4dCgpKS5kb25lKSB7XG4gICAgICAgIHZhciBrZXkgPSBzdGVwLnZhbHVlO1xuICAgICAgICBuZXN0ZWQgPSBuZXN0ZWQgJiYgbmVzdGVkLmdldCA/IG5lc3RlZC5nZXQoa2V5LCBOT1RfU0VUKSA6IE5PVF9TRVQ7XG4gICAgICAgIGlmIChuZXN0ZWQgPT09IE5PVF9TRVQpIHtcbiAgICAgICAgICByZXR1cm4gbm90U2V0VmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXN0ZWQ7XG4gICAgfSxcblxuICAgIGdyb3VwQnk6IGZ1bmN0aW9uKGdyb3VwZXIsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiBncm91cEJ5RmFjdG9yeSh0aGlzLCBncm91cGVyLCBjb250ZXh0KTtcbiAgICB9LFxuXG4gICAgaGFzOiBmdW5jdGlvbihzZWFyY2hLZXkpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldChzZWFyY2hLZXksIE5PVF9TRVQpICE9PSBOT1RfU0VUO1xuICAgIH0sXG5cbiAgICBoYXNJbjogZnVuY3Rpb24oc2VhcmNoS2V5UGF0aCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0SW4oc2VhcmNoS2V5UGF0aCwgTk9UX1NFVCkgIT09IE5PVF9TRVQ7XG4gICAgfSxcblxuICAgIGlzU3Vic2V0OiBmdW5jdGlvbihpdGVyKSB7XG4gICAgICBpdGVyID0gdHlwZW9mIGl0ZXIuaW5jbHVkZXMgPT09ICdmdW5jdGlvbicgPyBpdGVyIDogSXRlcmFibGUoaXRlcik7XG4gICAgICByZXR1cm4gdGhpcy5ldmVyeShmdW5jdGlvbih2YWx1ZSApIHtyZXR1cm4gaXRlci5pbmNsdWRlcyh2YWx1ZSl9KTtcbiAgICB9LFxuXG4gICAgaXNTdXBlcnNldDogZnVuY3Rpb24oaXRlcikge1xuICAgICAgaXRlciA9IHR5cGVvZiBpdGVyLmlzU3Vic2V0ID09PSAnZnVuY3Rpb24nID8gaXRlciA6IEl0ZXJhYmxlKGl0ZXIpO1xuICAgICAgcmV0dXJuIGl0ZXIuaXNTdWJzZXQodGhpcyk7XG4gICAgfSxcblxuICAgIGtleU9mOiBmdW5jdGlvbihzZWFyY2hWYWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuZmluZEtleShmdW5jdGlvbih2YWx1ZSApIHtyZXR1cm4gaXModmFsdWUsIHNlYXJjaFZhbHVlKX0pO1xuICAgIH0sXG5cbiAgICBrZXlTZXE6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudG9TZXEoKS5tYXAoa2V5TWFwcGVyKS50b0luZGV4ZWRTZXEoKTtcbiAgICB9LFxuXG4gICAgbGFzdDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy50b1NlcSgpLnJldmVyc2UoKS5maXJzdCgpO1xuICAgIH0sXG5cbiAgICBsYXN0S2V5T2Y6IGZ1bmN0aW9uKHNlYXJjaFZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy50b0tleWVkU2VxKCkucmV2ZXJzZSgpLmtleU9mKHNlYXJjaFZhbHVlKTtcbiAgICB9LFxuXG4gICAgbWF4OiBmdW5jdGlvbihjb21wYXJhdG9yKSB7XG4gICAgICByZXR1cm4gbWF4RmFjdG9yeSh0aGlzLCBjb21wYXJhdG9yKTtcbiAgICB9LFxuXG4gICAgbWF4Qnk6IGZ1bmN0aW9uKG1hcHBlciwgY29tcGFyYXRvcikge1xuICAgICAgcmV0dXJuIG1heEZhY3RvcnkodGhpcywgY29tcGFyYXRvciwgbWFwcGVyKTtcbiAgICB9LFxuXG4gICAgbWluOiBmdW5jdGlvbihjb21wYXJhdG9yKSB7XG4gICAgICByZXR1cm4gbWF4RmFjdG9yeSh0aGlzLCBjb21wYXJhdG9yID8gbmVnKGNvbXBhcmF0b3IpIDogZGVmYXVsdE5lZ0NvbXBhcmF0b3IpO1xuICAgIH0sXG5cbiAgICBtaW5CeTogZnVuY3Rpb24obWFwcGVyLCBjb21wYXJhdG9yKSB7XG4gICAgICByZXR1cm4gbWF4RmFjdG9yeSh0aGlzLCBjb21wYXJhdG9yID8gbmVnKGNvbXBhcmF0b3IpIDogZGVmYXVsdE5lZ0NvbXBhcmF0b3IsIG1hcHBlcik7XG4gICAgfSxcblxuICAgIHJlc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2xpY2UoMSk7XG4gICAgfSxcblxuICAgIHNraXA6IGZ1bmN0aW9uKGFtb3VudCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2xpY2UoTWF0aC5tYXgoMCwgYW1vdW50KSk7XG4gICAgfSxcblxuICAgIHNraXBMYXN0OiBmdW5jdGlvbihhbW91bnQpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCB0aGlzLnRvU2VxKCkucmV2ZXJzZSgpLnNraXAoYW1vdW50KS5yZXZlcnNlKCkpO1xuICAgIH0sXG5cbiAgICBza2lwV2hpbGU6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHNraXBXaGlsZUZhY3RvcnkodGhpcywgcHJlZGljYXRlLCBjb250ZXh0LCB0cnVlKSk7XG4gICAgfSxcblxuICAgIHNraXBVbnRpbDogZnVuY3Rpb24ocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gdGhpcy5za2lwV2hpbGUobm90KHByZWRpY2F0ZSksIGNvbnRleHQpO1xuICAgIH0sXG5cbiAgICBzb3J0Qnk6IGZ1bmN0aW9uKG1hcHBlciwgY29tcGFyYXRvcikge1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHNvcnRGYWN0b3J5KHRoaXMsIGNvbXBhcmF0b3IsIG1hcHBlcikpO1xuICAgIH0sXG5cbiAgICB0YWtlOiBmdW5jdGlvbihhbW91bnQpIHtcbiAgICAgIHJldHVybiB0aGlzLnNsaWNlKDAsIE1hdGgubWF4KDAsIGFtb3VudCkpO1xuICAgIH0sXG5cbiAgICB0YWtlTGFzdDogZnVuY3Rpb24oYW1vdW50KSB7XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgdGhpcy50b1NlcSgpLnJldmVyc2UoKS50YWtlKGFtb3VudCkucmV2ZXJzZSgpKTtcbiAgICB9LFxuXG4gICAgdGFrZVdoaWxlOiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCB0YWtlV2hpbGVGYWN0b3J5KHRoaXMsIHByZWRpY2F0ZSwgY29udGV4dCkpO1xuICAgIH0sXG5cbiAgICB0YWtlVW50aWw6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgICAgcmV0dXJuIHRoaXMudGFrZVdoaWxlKG5vdChwcmVkaWNhdGUpLCBjb250ZXh0KTtcbiAgICB9LFxuXG4gICAgdmFsdWVTZXE6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudG9JbmRleGVkU2VxKCk7XG4gICAgfSxcblxuXG4gICAgLy8gIyMjIEhhc2hhYmxlIE9iamVjdFxuXG4gICAgaGFzaENvZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX19oYXNoIHx8ICh0aGlzLl9faGFzaCA9IGhhc2hJdGVyYWJsZSh0aGlzKSk7XG4gICAgfVxuXG5cbiAgICAvLyAjIyMgSW50ZXJuYWxcblxuICAgIC8vIGFic3RyYWN0IF9faXRlcmF0ZShmbiwgcmV2ZXJzZSlcblxuICAgIC8vIGFic3RyYWN0IF9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSlcbiAgfSk7XG5cbiAgLy8gdmFyIElTX0lURVJBQkxFX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfSVRFUkFCTEVfX0BAJztcbiAgLy8gdmFyIElTX0tFWUVEX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfS0VZRURfX0BAJztcbiAgLy8gdmFyIElTX0lOREVYRURfU0VOVElORUwgPSAnQEBfX0lNTVVUQUJMRV9JTkRFWEVEX19AQCc7XG4gIC8vIHZhciBJU19PUkRFUkVEX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfT1JERVJFRF9fQEAnO1xuXG4gIHZhciBJdGVyYWJsZVByb3RvdHlwZSA9IEl0ZXJhYmxlLnByb3RvdHlwZTtcbiAgSXRlcmFibGVQcm90b3R5cGVbSVNfSVRFUkFCTEVfU0VOVElORUxdID0gdHJ1ZTtcbiAgSXRlcmFibGVQcm90b3R5cGVbSVRFUkFUT1JfU1lNQk9MXSA9IEl0ZXJhYmxlUHJvdG90eXBlLnZhbHVlcztcbiAgSXRlcmFibGVQcm90b3R5cGUuX190b0pTID0gSXRlcmFibGVQcm90b3R5cGUudG9BcnJheTtcbiAgSXRlcmFibGVQcm90b3R5cGUuX190b1N0cmluZ01hcHBlciA9IHF1b3RlU3RyaW5nO1xuICBJdGVyYWJsZVByb3RvdHlwZS5pbnNwZWN0ID1cbiAgSXRlcmFibGVQcm90b3R5cGUudG9Tb3VyY2UgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTsgfTtcbiAgSXRlcmFibGVQcm90b3R5cGUuY2hhaW4gPSBJdGVyYWJsZVByb3RvdHlwZS5mbGF0TWFwO1xuICBJdGVyYWJsZVByb3RvdHlwZS5jb250YWlucyA9IEl0ZXJhYmxlUHJvdG90eXBlLmluY2x1ZGVzO1xuXG4gIG1peGluKEtleWVkSXRlcmFibGUsIHtcblxuICAgIC8vICMjIyBNb3JlIHNlcXVlbnRpYWwgbWV0aG9kc1xuXG4gICAgZmxpcDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgZmxpcEZhY3RvcnkodGhpcykpO1xuICAgIH0sXG5cbiAgICBtYXBFbnRyaWVzOiBmdW5jdGlvbihtYXBwZXIsIGNvbnRleHQpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLFxuICAgICAgICB0aGlzLnRvU2VxKCkubWFwKFxuICAgICAgICAgIGZ1bmN0aW9uKHYsIGspICB7cmV0dXJuIG1hcHBlci5jYWxsKGNvbnRleHQsIFtrLCB2XSwgaXRlcmF0aW9ucysrLCB0aGlzJDApfVxuICAgICAgICApLmZyb21FbnRyeVNlcSgpXG4gICAgICApO1xuICAgIH0sXG5cbiAgICBtYXBLZXlzOiBmdW5jdGlvbihtYXBwZXIsIGNvbnRleHQpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLFxuICAgICAgICB0aGlzLnRvU2VxKCkuZmxpcCgpLm1hcChcbiAgICAgICAgICBmdW5jdGlvbihrLCB2KSAge3JldHVybiBtYXBwZXIuY2FsbChjb250ZXh0LCBrLCB2LCB0aGlzJDApfVxuICAgICAgICApLmZsaXAoKVxuICAgICAgKTtcbiAgICB9XG5cbiAgfSk7XG5cbiAgdmFyIEtleWVkSXRlcmFibGVQcm90b3R5cGUgPSBLZXllZEl0ZXJhYmxlLnByb3RvdHlwZTtcbiAgS2V5ZWRJdGVyYWJsZVByb3RvdHlwZVtJU19LRVlFRF9TRU5USU5FTF0gPSB0cnVlO1xuICBLZXllZEl0ZXJhYmxlUHJvdG90eXBlW0lURVJBVE9SX1NZTUJPTF0gPSBJdGVyYWJsZVByb3RvdHlwZS5lbnRyaWVzO1xuICBLZXllZEl0ZXJhYmxlUHJvdG90eXBlLl9fdG9KUyA9IEl0ZXJhYmxlUHJvdG90eXBlLnRvT2JqZWN0O1xuICBLZXllZEl0ZXJhYmxlUHJvdG90eXBlLl9fdG9TdHJpbmdNYXBwZXIgPSBmdW5jdGlvbih2LCBrKSAge3JldHVybiBKU09OLnN0cmluZ2lmeShrKSArICc6ICcgKyBxdW90ZVN0cmluZyh2KX07XG5cblxuXG4gIG1peGluKEluZGV4ZWRJdGVyYWJsZSwge1xuXG4gICAgLy8gIyMjIENvbnZlcnNpb24gdG8gb3RoZXIgdHlwZXNcblxuICAgIHRvS2V5ZWRTZXE6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBUb0tleWVkU2VxdWVuY2UodGhpcywgZmFsc2UpO1xuICAgIH0sXG5cblxuICAgIC8vICMjIyBFUzYgQ29sbGVjdGlvbiBtZXRob2RzIChFUzYgQXJyYXkgYW5kIE1hcClcblxuICAgIGZpbHRlcjogZnVuY3Rpb24ocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgZmlsdGVyRmFjdG9yeSh0aGlzLCBwcmVkaWNhdGUsIGNvbnRleHQsIGZhbHNlKSk7XG4gICAgfSxcblxuICAgIGZpbmRJbmRleDogZnVuY3Rpb24ocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgICB2YXIgZW50cnkgPSB0aGlzLmZpbmRFbnRyeShwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgICAgcmV0dXJuIGVudHJ5ID8gZW50cnlbMF0gOiAtMTtcbiAgICB9LFxuXG4gICAgaW5kZXhPZjogZnVuY3Rpb24oc2VhcmNoVmFsdWUpIHtcbiAgICAgIHZhciBrZXkgPSB0aGlzLmtleU9mKHNlYXJjaFZhbHVlKTtcbiAgICAgIHJldHVybiBrZXkgPT09IHVuZGVmaW5lZCA/IC0xIDoga2V5O1xuICAgIH0sXG5cbiAgICBsYXN0SW5kZXhPZjogZnVuY3Rpb24oc2VhcmNoVmFsdWUpIHtcbiAgICAgIHZhciBrZXkgPSB0aGlzLmxhc3RLZXlPZihzZWFyY2hWYWx1ZSk7XG4gICAgICByZXR1cm4ga2V5ID09PSB1bmRlZmluZWQgPyAtMSA6IGtleTtcbiAgICB9LFxuXG4gICAgcmV2ZXJzZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgcmV2ZXJzZUZhY3RvcnkodGhpcywgZmFsc2UpKTtcbiAgICB9LFxuXG4gICAgc2xpY2U6IGZ1bmN0aW9uKGJlZ2luLCBlbmQpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBzbGljZUZhY3RvcnkodGhpcywgYmVnaW4sIGVuZCwgZmFsc2UpKTtcbiAgICB9LFxuXG4gICAgc3BsaWNlOiBmdW5jdGlvbihpbmRleCwgcmVtb3ZlTnVtIC8qLCAuLi52YWx1ZXMqLykge1xuICAgICAgdmFyIG51bUFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgcmVtb3ZlTnVtID0gTWF0aC5tYXgocmVtb3ZlTnVtIHwgMCwgMCk7XG4gICAgICBpZiAobnVtQXJncyA9PT0gMCB8fCAobnVtQXJncyA9PT0gMiAmJiAhcmVtb3ZlTnVtKSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIC8vIElmIGluZGV4IGlzIG5lZ2F0aXZlLCBpdCBzaG91bGQgcmVzb2x2ZSByZWxhdGl2ZSB0byB0aGUgc2l6ZSBvZiB0aGVcbiAgICAgIC8vIGNvbGxlY3Rpb24uIEhvd2V2ZXIgc2l6ZSBtYXkgYmUgZXhwZW5zaXZlIHRvIGNvbXB1dGUgaWYgbm90IGNhY2hlZCwgc29cbiAgICAgIC8vIG9ubHkgY2FsbCBjb3VudCgpIGlmIHRoZSBudW1iZXIgaXMgaW4gZmFjdCBuZWdhdGl2ZS5cbiAgICAgIGluZGV4ID0gcmVzb2x2ZUJlZ2luKGluZGV4LCBpbmRleCA8IDAgPyB0aGlzLmNvdW50KCkgOiB0aGlzLnNpemUpO1xuICAgICAgdmFyIHNwbGljZWQgPSB0aGlzLnNsaWNlKDAsIGluZGV4KTtcbiAgICAgIHJldHVybiByZWlmeShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgbnVtQXJncyA9PT0gMSA/XG4gICAgICAgICAgc3BsaWNlZCA6XG4gICAgICAgICAgc3BsaWNlZC5jb25jYXQoYXJyQ29weShhcmd1bWVudHMsIDIpLCB0aGlzLnNsaWNlKGluZGV4ICsgcmVtb3ZlTnVtKSlcbiAgICAgICk7XG4gICAgfSxcblxuXG4gICAgLy8gIyMjIE1vcmUgY29sbGVjdGlvbiBtZXRob2RzXG5cbiAgICBmaW5kTGFzdEluZGV4OiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHZhciBlbnRyeSA9IHRoaXMuZmluZExhc3RFbnRyeShwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgICAgcmV0dXJuIGVudHJ5ID8gZW50cnlbMF0gOiAtMTtcbiAgICB9LFxuXG4gICAgZmlyc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0KDApO1xuICAgIH0sXG5cbiAgICBmbGF0dGVuOiBmdW5jdGlvbihkZXB0aCkge1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIGZsYXR0ZW5GYWN0b3J5KHRoaXMsIGRlcHRoLCBmYWxzZSkpO1xuICAgIH0sXG5cbiAgICBnZXQ6IGZ1bmN0aW9uKGluZGV4LCBub3RTZXRWYWx1ZSkge1xuICAgICAgaW5kZXggPSB3cmFwSW5kZXgodGhpcywgaW5kZXgpO1xuICAgICAgcmV0dXJuIChpbmRleCA8IDAgfHwgKHRoaXMuc2l6ZSA9PT0gSW5maW5pdHkgfHxcbiAgICAgICAgICAodGhpcy5zaXplICE9PSB1bmRlZmluZWQgJiYgaW5kZXggPiB0aGlzLnNpemUpKSkgP1xuICAgICAgICBub3RTZXRWYWx1ZSA6XG4gICAgICAgIHRoaXMuZmluZChmdW5jdGlvbihfLCBrZXkpICB7cmV0dXJuIGtleSA9PT0gaW5kZXh9LCB1bmRlZmluZWQsIG5vdFNldFZhbHVlKTtcbiAgICB9LFxuXG4gICAgaGFzOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgaW5kZXggPSB3cmFwSW5kZXgodGhpcywgaW5kZXgpO1xuICAgICAgcmV0dXJuIGluZGV4ID49IDAgJiYgKHRoaXMuc2l6ZSAhPT0gdW5kZWZpbmVkID9cbiAgICAgICAgdGhpcy5zaXplID09PSBJbmZpbml0eSB8fCBpbmRleCA8IHRoaXMuc2l6ZSA6XG4gICAgICAgIHRoaXMuaW5kZXhPZihpbmRleCkgIT09IC0xXG4gICAgICApO1xuICAgIH0sXG5cbiAgICBpbnRlcnBvc2U6IGZ1bmN0aW9uKHNlcGFyYXRvcikge1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIGludGVycG9zZUZhY3RvcnkodGhpcywgc2VwYXJhdG9yKSk7XG4gICAgfSxcblxuICAgIGludGVybGVhdmU6IGZ1bmN0aW9uKC8qLi4uaXRlcmFibGVzKi8pIHtcbiAgICAgIHZhciBpdGVyYWJsZXMgPSBbdGhpc10uY29uY2F0KGFyckNvcHkoYXJndW1lbnRzKSk7XG4gICAgICB2YXIgemlwcGVkID0gemlwV2l0aEZhY3RvcnkodGhpcy50b1NlcSgpLCBJbmRleGVkU2VxLm9mLCBpdGVyYWJsZXMpO1xuICAgICAgdmFyIGludGVybGVhdmVkID0gemlwcGVkLmZsYXR0ZW4odHJ1ZSk7XG4gICAgICBpZiAoemlwcGVkLnNpemUpIHtcbiAgICAgICAgaW50ZXJsZWF2ZWQuc2l6ZSA9IHppcHBlZC5zaXplICogaXRlcmFibGVzLmxlbmd0aDtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBpbnRlcmxlYXZlZCk7XG4gICAgfSxcblxuICAgIGtleVNlcTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gUmFuZ2UoMCwgdGhpcy5zaXplKTtcbiAgICB9LFxuXG4gICAgbGFzdDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXQoLTEpO1xuICAgIH0sXG5cbiAgICBza2lwV2hpbGU6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHNraXBXaGlsZUZhY3RvcnkodGhpcywgcHJlZGljYXRlLCBjb250ZXh0LCBmYWxzZSkpO1xuICAgIH0sXG5cbiAgICB6aXA6IGZ1bmN0aW9uKC8qLCAuLi5pdGVyYWJsZXMgKi8pIHtcbiAgICAgIHZhciBpdGVyYWJsZXMgPSBbdGhpc10uY29uY2F0KGFyckNvcHkoYXJndW1lbnRzKSk7XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgemlwV2l0aEZhY3RvcnkodGhpcywgZGVmYXVsdFppcHBlciwgaXRlcmFibGVzKSk7XG4gICAgfSxcblxuICAgIHppcFdpdGg6IGZ1bmN0aW9uKHppcHBlci8qLCAuLi5pdGVyYWJsZXMgKi8pIHtcbiAgICAgIHZhciBpdGVyYWJsZXMgPSBhcnJDb3B5KGFyZ3VtZW50cyk7XG4gICAgICBpdGVyYWJsZXNbMF0gPSB0aGlzO1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHppcFdpdGhGYWN0b3J5KHRoaXMsIHppcHBlciwgaXRlcmFibGVzKSk7XG4gICAgfVxuXG4gIH0pO1xuXG4gIEluZGV4ZWRJdGVyYWJsZS5wcm90b3R5cGVbSVNfSU5ERVhFRF9TRU5USU5FTF0gPSB0cnVlO1xuICBJbmRleGVkSXRlcmFibGUucHJvdG90eXBlW0lTX09SREVSRURfU0VOVElORUxdID0gdHJ1ZTtcblxuXG5cbiAgbWl4aW4oU2V0SXRlcmFibGUsIHtcblxuICAgIC8vICMjIyBFUzYgQ29sbGVjdGlvbiBtZXRob2RzIChFUzYgQXJyYXkgYW5kIE1hcClcblxuICAgIGdldDogZnVuY3Rpb24odmFsdWUsIG5vdFNldFZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYXModmFsdWUpID8gdmFsdWUgOiBub3RTZXRWYWx1ZTtcbiAgICB9LFxuXG4gICAgaW5jbHVkZXM6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYXModmFsdWUpO1xuICAgIH0sXG5cblxuICAgIC8vICMjIyBNb3JlIHNlcXVlbnRpYWwgbWV0aG9kc1xuXG4gICAga2V5U2VxOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlU2VxKCk7XG4gICAgfVxuXG4gIH0pO1xuXG4gIFNldEl0ZXJhYmxlLnByb3RvdHlwZS5oYXMgPSBJdGVyYWJsZVByb3RvdHlwZS5pbmNsdWRlcztcbiAgU2V0SXRlcmFibGUucHJvdG90eXBlLmNvbnRhaW5zID0gU2V0SXRlcmFibGUucHJvdG90eXBlLmluY2x1ZGVzO1xuXG5cbiAgLy8gTWl4aW4gc3ViY2xhc3Nlc1xuXG4gIG1peGluKEtleWVkU2VxLCBLZXllZEl0ZXJhYmxlLnByb3RvdHlwZSk7XG4gIG1peGluKEluZGV4ZWRTZXEsIEluZGV4ZWRJdGVyYWJsZS5wcm90b3R5cGUpO1xuICBtaXhpbihTZXRTZXEsIFNldEl0ZXJhYmxlLnByb3RvdHlwZSk7XG5cbiAgbWl4aW4oS2V5ZWRDb2xsZWN0aW9uLCBLZXllZEl0ZXJhYmxlLnByb3RvdHlwZSk7XG4gIG1peGluKEluZGV4ZWRDb2xsZWN0aW9uLCBJbmRleGVkSXRlcmFibGUucHJvdG90eXBlKTtcbiAgbWl4aW4oU2V0Q29sbGVjdGlvbiwgU2V0SXRlcmFibGUucHJvdG90eXBlKTtcblxuXG4gIC8vICNwcmFnbWEgSGVscGVyIGZ1bmN0aW9uc1xuXG4gIGZ1bmN0aW9uIGtleU1hcHBlcih2LCBrKSB7XG4gICAgcmV0dXJuIGs7XG4gIH1cblxuICBmdW5jdGlvbiBlbnRyeU1hcHBlcih2LCBrKSB7XG4gICAgcmV0dXJuIFtrLCB2XTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vdChwcmVkaWNhdGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gIXByZWRpY2F0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG5lZyhwcmVkaWNhdGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gLXByZWRpY2F0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHF1b3RlU3RyaW5nKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkgOiBTdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVmYXVsdFppcHBlcigpIHtcbiAgICByZXR1cm4gYXJyQ29weShhcmd1bWVudHMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVmYXVsdE5lZ0NvbXBhcmF0b3IoYSwgYikge1xuICAgIHJldHVybiBhIDwgYiA/IDEgOiBhID4gYiA/IC0xIDogMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhc2hJdGVyYWJsZShpdGVyYWJsZSkge1xuICAgIGlmIChpdGVyYWJsZS5zaXplID09PSBJbmZpbml0eSkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIHZhciBvcmRlcmVkID0gaXNPcmRlcmVkKGl0ZXJhYmxlKTtcbiAgICB2YXIga2V5ZWQgPSBpc0tleWVkKGl0ZXJhYmxlKTtcbiAgICB2YXIgaCA9IG9yZGVyZWQgPyAxIDogMDtcbiAgICB2YXIgc2l6ZSA9IGl0ZXJhYmxlLl9faXRlcmF0ZShcbiAgICAgIGtleWVkID9cbiAgICAgICAgb3JkZXJlZCA/XG4gICAgICAgICAgZnVuY3Rpb24odiwgaykgIHsgaCA9IDMxICogaCArIGhhc2hNZXJnZShoYXNoKHYpLCBoYXNoKGspKSB8IDA7IH0gOlxuICAgICAgICAgIGZ1bmN0aW9uKHYsIGspICB7IGggPSBoICsgaGFzaE1lcmdlKGhhc2godiksIGhhc2goaykpIHwgMDsgfSA6XG4gICAgICAgIG9yZGVyZWQgP1xuICAgICAgICAgIGZ1bmN0aW9uKHYgKSB7IGggPSAzMSAqIGggKyBoYXNoKHYpIHwgMDsgfSA6XG4gICAgICAgICAgZnVuY3Rpb24odiApIHsgaCA9IGggKyBoYXNoKHYpIHwgMDsgfVxuICAgICk7XG4gICAgcmV0dXJuIG11cm11ckhhc2hPZlNpemUoc2l6ZSwgaCk7XG4gIH1cblxuICBmdW5jdGlvbiBtdXJtdXJIYXNoT2ZTaXplKHNpemUsIGgpIHtcbiAgICBoID0gaW11bChoLCAweENDOUUyRDUxKTtcbiAgICBoID0gaW11bChoIDw8IDE1IHwgaCA+Pj4gLTE1LCAweDFCODczNTkzKTtcbiAgICBoID0gaW11bChoIDw8IDEzIHwgaCA+Pj4gLTEzLCA1KTtcbiAgICBoID0gKGggKyAweEU2NTQ2QjY0IHwgMCkgXiBzaXplO1xuICAgIGggPSBpbXVsKGggXiBoID4+PiAxNiwgMHg4NUVCQ0E2Qik7XG4gICAgaCA9IGltdWwoaCBeIGggPj4+IDEzLCAweEMyQjJBRTM1KTtcbiAgICBoID0gc21pKGggXiBoID4+PiAxNik7XG4gICAgcmV0dXJuIGg7XG4gIH1cblxuICBmdW5jdGlvbiBoYXNoTWVyZ2UoYSwgYikge1xuICAgIHJldHVybiBhIF4gYiArIDB4OUUzNzc5QjkgKyAoYSA8PCA2KSArIChhID4+IDIpIHwgMDsgLy8gaW50XG4gIH1cblxuICB2YXIgSW1tdXRhYmxlID0ge1xuXG4gICAgSXRlcmFibGU6IEl0ZXJhYmxlLFxuXG4gICAgU2VxOiBTZXEsXG4gICAgQ29sbGVjdGlvbjogQ29sbGVjdGlvbixcbiAgICBNYXA6IE1hcCxcbiAgICBPcmRlcmVkTWFwOiBPcmRlcmVkTWFwLFxuICAgIExpc3Q6IExpc3QsXG4gICAgU3RhY2s6IFN0YWNrLFxuICAgIFNldDogU2V0LFxuICAgIE9yZGVyZWRTZXQ6IE9yZGVyZWRTZXQsXG5cbiAgICBSZWNvcmQ6IFJlY29yZCxcbiAgICBSYW5nZTogUmFuZ2UsXG4gICAgUmVwZWF0OiBSZXBlYXQsXG5cbiAgICBpczogaXMsXG4gICAgZnJvbUpTOiBmcm9tSlNcblxuICB9O1xuXG4gIHJldHVybiBJbW11dGFibGU7XG5cbn0pKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9pbW11dGFibGUvZGlzdC9pbW11dGFibGUuanNcbiAqKiBtb2R1bGUgaWQgPSA1NDlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMVxuICoqLyIsIi8vIGxldCBPYmplY3RBc3NpZ249cmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xubGV0IEVjaG89cmVxdWlyZSgnLi9lY2hvJyk7XG5sZXQgSW1tdXRhYmxlPXJlcXVpcmUoJ2ltbXV0YWJsZScpO1xubGV0IHBhcnNlcj0gbmV3IERPTVBhcnNlcigpO1xubGV0IGNvbWljcz17XG5cdHJlZ2V4OiAvaHR0cFxcOlxcL1xcL3d3d1xcLmNvbWljYnVzXFwuY29tXFwvb25saW5lKFxcLy4qLVxcZCouaHRtbFxcP2NoPVxcZCopLyxcblxuXHRiYXNlVVJMOiBcImh0dHA6Ly93d3cuY29taWNidXMuY29tL29ubGluZS9cIixcblx0XG5cdGNvbWljc3BhZ2VVUkw6IFwiaHR0cDovL3d3dy5jb21pY2J1cy5jb20vaHRtbC9cIixcdFxuXG5cdGhhbmRsZVVybEhhc2g6ZnVuY3Rpb24obWVudUl0ZW1zKXtcblx0XHRsZXQgcGFyYW1zX3N0cj13aW5kb3cubG9jYXRpb24uaGFzaDtcblx0ICAgIHRoaXMuc2l0ZT0gL3NpdGVcXC8oXFx3KikvLmV4ZWMocGFyYW1zX3N0cilbMV07XG5cdCAgICB0aGlzLnBhZ2VVUkw9L2NoYXB0ZXJcXC8uKi0oXFxkKlxcLmh0bWwpXFw/Ly5leGVjKHBhcmFtc19zdHIpWzFdOyAgIFxuXHQgICAgdGhpcy5jaGFwdGVyTnVtPS9jaGFwdGVyXFwvLipcXD9jaFxcPShcXGQqKS8uZXhlYyhwYXJhbXNfc3RyKVsxXTtcblx0ICAgIHRoaXMucHJlZml4VVJMPS9jaGFwdGVyXFwvKC4qXFw/Y2hcXD0pXFxkKi8uZXhlYyhwYXJhbXNfc3RyKVsxXTs7ICBcblx0ICAgIHRoaXMuaW5kZXhVUkw9dGhpcy5jb21pY3NwYWdlVVJMK3RoaXMucGFnZVVSTDtcblx0ICAgIC8vIGNvbnNvbGUubG9nKCdwYXJhbXNfc3RyJyxwYXJhbXNfc3RyKTtcbiAgICBcdGlmKCEoLyMkLy50ZXN0KHBhcmFtc19zdHIpKSl7XG5cdCAgICAgIC8vIGNvbnNvbGUubG9nKCdwYWdlIGJhY2snKTtcblx0ICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb21pY3NfcGFuZWxcIikuaW5uZXJIVE1MPVwiXCI7XG5cdCAgICAgIGxldCBpbmRleD0tMTtcblx0ICAgICAgZm9yKGxldCBpPTA7aTxtZW51SXRlbXMuc2l6ZTsrK2kpe1xuXHQgICAgICAgIGlmKG1lbnVJdGVtcy5nZXQoaSkuZ2V0KCdwYXlsb2FkJyk9PT10aGlzLmJhc2VVUkwrdGhpcy5wcmVmaXhVUkwrdGhpcy5jaGFwdGVyTnVtKXtcblx0ICAgICAgICAgIGluZGV4PWk7XG5cdCAgICAgICAgICB0aGlzLmxhc3RJbmRleD1pbmRleDtcblx0ICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgICB0aGlzLmdldEltYWdlKGluZGV4LHRoaXMuY2hhcHRlck51bSk7XG5cdCAgICB9ZWxzZXtcblx0ICAgICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKCcnLGRvY3VtZW50LnRpdGxlLFwiIy9zaXRlL2NvbWljczgvY2hhcHRlci9cIisoL2NoYXB0ZXJcXC8oLiopIyQvLmV4ZWMocGFyYW1zX3N0cilbMV0pKTtcblx0ICAgIH0gIFxuXHR9LFxuXG5cdGdldENoYXB0ZXI6IGZ1bmN0aW9uKGRvYyl7XG5cdFx0bGV0IG5sPWRvYy5xdWVyeVNlbGVjdG9yQWxsKFwiLlZvbCAsIC5jaCAsICNsY2hcIik7XG5cdFx0cmV0dXJuIG5sO1xuXHR9LFxuXG5cdGdldENoYXB0ZXJVcmw6ZnVuY3Rpb24oc3RyKXtcblx0XHRsZXQgcF9hcnJheT0vY3ZpZXdcXChcXCcoLiotXFxkKlxcLmh0bWwpXFwnLChcXGQqKS8uZXhlYyhzdHIpO1xuICAgICAgXHRsZXQgY2F0aWQ9cF9hcnJheVsyXTtcbiAgICAgIFx0bGV0IHVybD1wX2FycmF5WzFdO1xuXHRcdGxldCBiYXNldXJsPVwiXCI7XG5cdFx0aWYoY2F0aWQ9PTQgfHwgY2F0aWQ9PTYgfHwgY2F0aWQ9PTEyIHx8Y2F0aWQ9PTIyICkgYmFzZXVybD1cIi9vbmxpbmUvRG9tYWluLVwiO1xuXHRcdGlmKGNhdGlkPT0xIHx8IGNhdGlkPT0xNyB8fCBjYXRpZD09MTkgfHwgY2F0aWQ9PTIxKSBiYXNldXJsPVwiL29ubGluZS9maW5hbmNlLVwiO1xuXHRcdGlmKGNhdGlkPT0yIHx8IGNhdGlkPT01IHx8IGNhdGlkPT03IHx8IGNhdGlkPT05KSAgYmFzZXVybD1cIi9vbmxpbmUvaW5zdXJhbmNlLVwiO1xuXHRcdGlmKGNhdGlkPT0xMCB8fCBjYXRpZD09MTEgfHwgY2F0aWQ9PTEzIHx8IGNhdGlkPT0xNCkgYmFzZXVybD1cIi9vbmxpbmUvaW5zdXJhbmNlLVwiO1xuXHRcdFx0aWYoY2F0aWQ9PTMgfHwgY2F0aWQ9PTggfHwgY2F0aWQ9PTE1IHx8IGNhdGlkPT0xNiB8fGNhdGlkPT0xOCB8fGNhdGlkPT0yMCliYXNldXJsPVwiL29ubGluZS9maW5hbmNlLVwiO1xuXHRcdHVybD11cmwucmVwbGFjZShcIi5odG1sXCIsXCJcIikucmVwbGFjZShcIi1cIixcIi5odG1sP2NoPVwiKTtcblx0XHRyZXR1cm4gXCJodHRwOi8vd3d3LmNvbWljYnVzLmNvbVwiK2Jhc2V1cmwrdXJsO1xuXHR9LFxuXG5cdGdldFRpdGxlTmFtZTogZnVuY3Rpb24oZG9jKXtcblx0XHR0aGlzLnRpdGxlPWRvYy5xdWVyeVNlbGVjdG9yKFwiYm9keSA+IHRhYmxlOm50aC1jaGlsZCg3KSA+IHRib2R5ID4gdHIgPiB0ZCA+IHRhYmxlID4gdGJvZHkgPiB0cjpudGgtY2hpbGQoMSkgPiB0ZDpudGgtY2hpbGQoMikgPiB0YWJsZTpudGgtY2hpbGQoMSkgPiB0Ym9keSA+IHRyOm50aC1jaGlsZCgxKSA+IHRkID4gdGFibGUgPiB0Ym9keSA+IHRyID4gdGQ6bnRoLWNoaWxkKDIpID4gZm9udFwiKS50ZXh0Q29udGVudDtcblx0XHQvLyB0aGlzLnRpdGxlPWVuY29kZVVSSUNvbXBvbmVudCh0aGlzLnRpdGxlKTtcblx0XHRyZXR1cm4gdGhpcy50aXRsZTtcblx0fSxcblxuXHRnZXRDb3ZlckltZzpmdW5jdGlvbihkb2Mpe1xuXHRcdHRoaXMuaWNvblVybD1kb2MucXVlcnlTZWxlY3RvcihcImJvZHkgPiB0YWJsZTpudGgtY2hpbGQoNykgPiB0Ym9keSA+IHRyID4gdGQgPiB0YWJsZSA+IHRib2R5ID4gdHI6bnRoLWNoaWxkKDEpID4gdGQ6bnRoLWNoaWxkKDEpID4gaW1nXCIpLnNyYztcblx0XHRyZXR1cm4gdGhpcy5pY29uVXJsO1xuXHR9LFxuXG5cdGdldEluZGV4VVJMOmFzeW5jIGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHRoaXMuaW5kZXhVUkw7XG5cdH0sXG5cblx0Z2V0SW1hZ2U6IGFzeW5jIGZ1bmN0aW9uKGluZGV4LHVybCl7XG5cdFx0Y29uc29sZS5sb2codGhpcy5iYXNlVVJMK3RoaXMucHJlZml4VVJMK3VybCk7XG5cdCAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godGhpcy5iYXNlVVJMK3RoaXMucHJlZml4VVJMK3VybCk7XG5cdFx0bGV0IHJ0eHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG5cdFx0bGV0IGRvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcocnR4dCxcInRleHQvaHRtbFwiKTtcblx0XHR0aGlzLnNldEltYWdlcyh0aGlzLmJhc2VVUkwrdGhpcy5wcmVmaXhVUkwrdXJsLGluZGV4LGRvYyk7XG5cdH0sXG5cblx0Z2V0TWVudUl0ZW1zOmZ1bmN0aW9uKGRvYyxtYXJrZWRJdGVtcyl7XG5cdCAgbGV0IG5sID0gdGhpcy5nZXRDaGFwdGVyKGRvYyk7XG5cdCAgbGV0IGFycmF5PVtdO1xuICAgICAgdGhpcy5pbml0SW5kZXg9LTE7XG4gICAgICBsZXQgaXRlbT17fTtcbiAgICAgIGl0ZW0ucGF5bG9hZD0gdGhpcy5nZXRDaGFwdGVyVXJsKG5sW25sLmxlbmd0aC0yXS5nZXRBdHRyaWJ1dGUoXCJvbmNsaWNrXCIpKTtcbiAgICAgIGl0ZW0udGV4dD1ubFtubC5sZW5ndGgtMV0udGV4dENvbnRlbnQ7XG4gICAgICBpZihpdGVtLnBheWxvYWQ9PT10aGlzLmJhc2VVUkwrdGhpcy5wcmVmaXhVUkwrdGhpcy5jaGFwdGVyTnVtJiZ0aGlzLmluaXRJbmRleD09PS0xKXtcbiAgICAgICAgdGhpcy5pbml0SW5kZXg9MDtcbiAgICAgICAgZG9jdW1lbnQudGl0bGU9dGhpcy50aXRsZStcIiBcIitpdGVtLnRleHQ7XG4gICAgICAgIHRoaXMuc2V0SW1hZ2VJbmRleCh0aGlzLmluaXRJbmRleCk7XG4gICAgICAgIGl0ZW0uaXNNYXJrZWQ9dHJ1ZTtcbiAgICAgICAgaWYoIW1hcmtlZEl0ZW1zLmhhcyhpdGVtLnBheWxvYWQpKXtcbiAgICAgICAgICBtYXJrZWRJdGVtcz1tYXJrZWRJdGVtcy5hZGQoaXRlbS5wYXlsb2FkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYobWFya2VkSXRlbXMuaGFzKGl0ZW0ucGF5bG9hZCkpe1xuICAgICAgICBpdGVtLmlzTWFya2VkPXRydWU7ICBcbiAgICAgIH1cbiAgICAgIGl0ZW09SW1tdXRhYmxlLk1hcChpdGVtKTtcbiAgICAgIGFycmF5LnB1c2goaXRlbSk7XG4gICAgICBmb3IobGV0IGk9bmwubGVuZ3RoLTM7aT49MDstLWkpe1xuICAgICAgICBsZXQgaXRlbT17fTtcbiAgICAgICAgaXRlbS5wYXlsb2FkPXRoaXMuZ2V0Q2hhcHRlclVybChubFtpXS5nZXRBdHRyaWJ1dGUoXCJvbmNsaWNrXCIpKTtcbiAgICAgICAgaXRlbS50ZXh0PW5sW2ldLnRleHRDb250ZW50O1xuICAgICAgICBjb25zb2xlLmxvZyhpdGVtLnBheWxvYWQpO1xuICAgICAgICBpZigoaXRlbS5wYXlsb2FkPT09dGhpcy5iYXNlVVJMK3RoaXMucHJlZml4VVJMK3RoaXMuY2hhcHRlck51bSkmJnRoaXMuaW5pdEluZGV4PT09LTEpe1xuICAgICAgICAgIHRoaXMuaW5pdEluZGV4PW5sLmxlbmd0aC1pLTI7XG4gICAgICAgICAgZG9jdW1lbnQudGl0bGU9dGhpcy50aXRsZStcIiBcIitpdGVtLnRleHQ7XG4gICAgICAgICAgdGhpcy5zZXRJbWFnZUluZGV4KHRoaXMuaW5pdEluZGV4KTtcbiAgICAgICAgICBpdGVtLmlzTWFya2VkPXRydWU7XG4gICAgICAgICAgaWYoIW1hcmtlZEl0ZW1zLmhhcyhpdGVtLnBheWxvYWQpKXtcbiAgICAgICAgICAgIG1hcmtlZEl0ZW1zPW1hcmtlZEl0ZW1zLmFkZChpdGVtLnBheWxvYWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpdGVtLnRleHQ9bmxbaV0udGV4dENvbnRlbnQudHJpbSgpO1xuICAgICAgICBpZihtYXJrZWRJdGVtcy5oYXMoaXRlbS5wYXlsb2FkKSl7XG4gICAgICAgICAgaXRlbS5pc01hcmtlZD10cnVlOyAgXG4gICAgICAgIH1cbiAgICAgICAgaXRlbT1JbW11dGFibGUuTWFwKGl0ZW0pO1xuICAgICAgICBhcnJheS5wdXNoKGl0ZW0pO1xuICAgICAgfVxuICAgICAgdGhpcy5tYXJrZWRJdGVtcz1tYXJrZWRJdGVtcztcbiAgICAgIHJldHVybiBJbW11dGFibGUuTGlzdChhcnJheSk7XG5cdH0sXG5cblx0Y2hhcHRlclVwZGF0ZUluZGV4OiAtMSxcbiAgXG4gIFx0c2V0SW1hZ2VJbmRleDpmdW5jdGlvbihpbmRleCl7XG4gICAgXHRpZih0aGlzLmNoYXB0ZXJVcGRhdGVJbmRleD09PS0xKXtcbiAgICAgIFx0XHR0aGlzLmNoYXB0ZXJVcGRhdGVJbmRleD1pbmRleDtcbiAgICBcdH1lbHNlIGlmKHRoaXMuY2hhcHRlclVwZGF0ZUluZGV4PT09LTIpe1xuICAgICAgXHRcdGxldCBpbWdzPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2ltZ1tkYXRhLWNoYXB0ZXI9XFxcIi0xXFxcIl0nKTtcbiAgICAgIFx0XHRmb3IobGV0IGk9MDtpPGltZ3MubGVuZ3RoOysraSl7XG4gICAgICAgIFx0XHRpbWdzW2ldLnNldEF0dHJpYnV0ZShcImRhdGEtY2hhcHRlclwiLGluZGV4KTtcbiAgICAgIFx0XHR9XG4gICAgICBcdFx0dGhpcy5jaGFwdGVyVXBkYXRlSW5kZXg9LTE7ICBcbiAgICBcdH1cblx0fSxcblxuXHRzZXRJbWFnZXM6IGZ1bmN0aW9uKHVybCxpbmRleCxkb2Mpe1xuXHRcdGxldCBzY3JpcHQ9ZG9jLmV2YWx1YXRlKFwiLy8qW0BpZD1cXFwiRm9ybTFcXFwiXS9zY3JpcHQvdGV4dCgpXCIsZG9jLG51bGwsWFBhdGhSZXN1bHQuQU5ZX1RZUEUsIG51bGwpLml0ZXJhdGVOZXh0KCkudGV4dENvbnRlbnQuc3BsaXQoJ2V2YWwnKVswXTtcblx0XHRldmFsKHNjcmlwdCk7XG5cdFx0bGV0IGNoID0gLy4qY2hcXD0oLiopLy5leGVjKHVybClbMV07XG5cdFx0aWYgKGNoLmluZGV4T2YoJyMnKSA+IDApXG5cdFx0XHRjaCA9IGNoLnNwbGl0KCcjJylbMF07XG5cdFx0bGV0IHAgPSAxO1xuXHRcdGxldCBmID0gNTA7XG5cdFx0aWYgKGNoLmluZGV4T2YoJy0nKSA+IDApIHtcblx0XHRcdHAgPSBwYXJzZUludChjaC5zcGxpdCgnLScpWzFdKTtcblx0XHRcdGNoID0gY2guc3BsaXQoJy0nKVswXTtcblx0XHR9XG5cdFx0aWYgKGNoID09ICcnKVxuXHRcdFx0Y2ggPSAxO1xuXHRcdGVsc2Vcblx0ICAgXHRcdGNoID0gcGFyc2VJbnQoY2gpO1xuXHRcdGxldCBzcz1mdW5jdGlvbiAoYSwgYiwgYywgZCkge1xuXHRcdFx0bGV0IGUgPSBhLnN1YnN0cmluZyhiLCBiICsgYyk7XG5cdFx0XHRyZXR1cm4gZCA9PSBudWxsID8gZS5yZXBsYWNlKC9bYS16XSovZ2ksIFwiXCIpIDogZTtcblx0XHR9O1xuXHRcdGxldCBubiA9IGZ1bmN0aW9uKG4pIHtcblx0XHRcdHJldHVybiBuIDwgMTAgPyAnMDAnICsgbiA6IG4gPCAxMDAgPyAnMCcgKyBuIDogbjtcblx0XHR9O1xuXHRcdGxldCBtbSA9IGZ1bmN0aW9uIChwKSB7XG5cdFx0XHRyZXR1cm4gKHBhcnNlSW50KChwIC0gMSkgLyAxMCkgJSAxMCkgKyAoKChwIC0gMSkgJSAxMCkgKiAzKVxuXHRcdH07XG5cdFx0bGV0IGM9XCJcIjtcblx0XHRsZXQgY2MgPSBjcy5sZW5ndGg7XG5cdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBjYyAvIGY7IGorKykge1xuXHRcdFx0aWYgKHNzKGNzLCBqICogZiwgNCkgPT0gY2gpIHtcblx0XHQgICAgXHRjID0gc3MoY3MsIGogKiBmLCBmLCBmKTtcblx0XHRcdCAgICBjaSA9IGo7XG5cdFx0XHQgICAgYnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChjID09ICcnKSB7XG5cdFx0XHRjID0gc3MoY3MsIGNjIC0gZiwgZik7XG5cdFx0XHRjaCA9IGM7XG5cdFx0fVx0XHRcdCAgICBcblx0XHRwcz1zcyhjLCA3LCAzKTtcblx0XHR0aGlzLnBhZ2VNYXg9cHM7XG5cdFx0bGV0IGltZz1bXTtcblx0XHRmb3IobGV0IGk9MDtpPHRoaXMucGFnZU1heDsrK2kpe1xuXHRcdFx0bGV0IGM9XCJcIjtcblx0XHRcdGxldCBjYyA9IGNzLmxlbmd0aDtcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgY2MgLyBmOyBqKyspIHtcblx0XHRcdCAgICBpZiAoc3MoY3MsIGogKiBmLCA0KSA9PSBjaCkge1xuXHRcdFx0ICAgICAgICBjID0gc3MoY3MsIGogKiBmLCBmLCBmKTtcblx0XHRcdCAgICAgICAgY2kgPSBqO1xuXHRcdFx0ICAgICAgICBicmVhaztcblx0XHRcdCAgICB9XG5cdFx0XHR9XG5cdFx0XHRpZiAoYyA9PSAnJykge1xuXHRcdFx0ICAgIGMgPSBzcyhjcywgY2MgLSBmLCBmKTtcblx0XHRcdCAgICBjaCA9IGNocztcblx0XHRcdH1cblx0XHRcdGltZ1tpXT0naHR0cDovL2ltZycgKyBzcyhjLCA0LCAyKSArICcuNmNvbWljLmNvbTo5OS8nICsgc3MoYywgNiwgMSkgKyAnLycgKyB0aSArICcvJyArIHNzKGMsIDAsIDQpICsgJy8nICsgbm4oaSsxKSArICdfJyArIHNzKGMsIG1tKGkrMSkgKyAxMCwgMywgZikgKyAnLmpwZyc7XG5cdFx0fVxuXHRcdHRoaXMuaW1hZ2VzPWltZztcblx0XHR0aGlzLmFwcGVuZEltYWdlKGluZGV4KTtcblx0fSxcblxuXHRhcHBlbmRJbWFnZTpmdW5jdGlvbihpbmRleCl7XG5cdCAgbGV0IGNvbWljc19wYW5lbD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbWljc19wYW5lbFwiKTtcblx0ICBpZihpbmRleD09PS0xKXtcblx0ICAgIGluZGV4PXRoaXMuY2hhcHRlclVwZGF0ZUluZGV4O1xuXHQgICAgdGhpcy5jaGFwdGVyVXBkYXRlSW5kZXg9LTI7XG5cdCAgfVxuXHQgIGZvcihsZXQgaT0wO2k8dGhpcy5wYWdlTWF4OysraSl7XG5cdCAgICAgIGxldCBpbWc9bmV3IEltYWdlKCk7XG5cdCAgICAgIGltZy5zcmM9XCJkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhBUUFCQUlBQUFBQUFBUC8vL3lINUJBRUFBQUFBTEFBQUFBQUJBQUVBQUFJQlJBQTdcIlxuXHQgICAgICBpbWcuc2V0QXR0cmlidXRlKFwiZGF0YS1lY2hvXCIsdGhpcy5pbWFnZXNbaV0pO1xuXHQgICAgICBpbWcuc2V0QXR0cmlidXRlKFwiZGF0YS1udW1cIixpKzEpO1xuXHQgICAgICBpbWcuc2V0QXR0cmlidXRlKFwiZGF0YS1jaGFwdGVyXCIsaW5kZXgpO1xuXHQgICAgICBpbWcuc3R5bGUud2lkdGg9XCI5MDBweFwiO1xuXHQgICAgICBpbWcuc3R5bGUuaGVpZ2h0PVwiMTMwMHB4XCI7XG5cdCAgICAgIGltZy5zdHlsZS5kaXNwbGF5PSdibG9jayc7XG5cdCAgICAgIGltZy5zdHlsZS5ib3JkZXJXaWR0aD1cIjFweFwiO1xuXHQgICAgICBpbWcuc3R5bGUuYm9yZGVyQ29sb3I9XCJ3aGl0ZVwiO1xuXHQgICAgICBpbWcuc3R5bGUuYm9yZGVyU3R5bGU9XCJzb2xpZFwiO1xuXHQgICAgICBpbWcuc3R5bGUubWFyZ2luTGVmdD0nYXV0byc7XG5cdCAgICAgIGltZy5zdHlsZS5tYXJnaW5SaWdodD0nYXV0byc7XG5cdCAgICAgIGltZy5zdHlsZS5tYXJnaW5Ub3A9JzEwcHgnO1xuXHQgICAgICBpbWcuc3R5bGUubWFyZ2luQm90dG9tPSc1MHB4Jztcblx0ICAgICAgaW1nLnN0eWxlLm1heFdpZHRoPScxMDAlJztcblx0ICAgICAgaW1nLnN0eWxlLmJhY2tncm91bmQ9JyMyYTJhMmEgdXJsKGh0dHA6Ly9pLmltZ3VyLmNvbS9tc2RwZFFtLmdpZikgbm8tcmVwZWF0IGNlbnRlciBjZW50ZXInO1xuXHQgICAgICBpbWcuc2V0QXR0cmlidXRlKFwiZGF0YS1wYWdlTWF4XCIsdGhpcy5wYWdlTWF4KTtcblx0ICAgICAgY29taWNzX3BhbmVsLmFwcGVuZENoaWxkKGltZyk7XG5cdCAgICB9XG5cdCAgRWNoby5ub2Rlcz1jb21pY3NfcGFuZWwuY2hpbGRyZW47XG5cdCAgbGV0IGNoYXB0ZXJFbmQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0ICBjaGFwdGVyRW5kLmNsYXNzTmFtZT1cImNvbWljc19pbWdfZW5kXCI7XG5cdCAgY2hhcHRlckVuZC50ZXh0Q29udGVudD1cIuacrOipsee1kOadn1wiO1xuXHQgIGNvbWljc19wYW5lbC5hcHBlbmRDaGlsZChjaGFwdGVyRW5kKTtcblx0ICBsZXQgY2hhcHRlclByb21vdGU9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0ICBjaGFwdGVyUHJvbW90ZS5jbGFzc05hbWU9XCJjb21pY3NfaW1nX3Byb21vdGVcIjtcblx0ICBjaGFwdGVyUHJvbW90ZS50ZXh0Q29udGVudD1cIklmIHlvdSBsaWtlIENvbWljcyBTY3JvbGxlciwgZ2l2ZSBtZSBhIGxpa2Ugb24gRkIgb3IgR2l0aHViLlwiO1xuXHQgIGNvbWljc19wYW5lbC5hcHBlbmRDaGlsZChjaGFwdGVyUHJvbW90ZSk7XG5cdCAgaWYoIUVjaG8uaGFkSW5pdGVkKXtcblx0ICAgIEVjaG8uaW5pdCgpOyBcblx0ICB9ZWxzZXtcblx0ICAgIEVjaG8ucmVuZGVyKCk7XG5cdCAgfVxuXHR9LFxuXG5cdGJhY2tncm91bmRPbmxvYWQ6ZnVuY3Rpb24oaW5kZXhVUkwsY2hhcHRlcnMscmVxLGl0ZW1zLGspe1xuXHQgICAgbGV0IGRvYz1yZXEucmVzcG9uc2U7XG5cdFx0bGV0IG5sID0gdGhpcy5nZXRDaGFwdGVyKGRvYyk7XG5cdFx0bGV0IHRpdGxlPXRoaXMuZ2V0VGl0bGVOYW1lKGRvYyk7XG5cdCAgICBsZXQgaW1nVXJsPXRoaXMuZ2V0Q292ZXJJbWcoZG9jKTtcblx0ICAgIGxldCBhcnJheT1bXTtcblx0XHRsZXQgb2JqPXt9O1xuXHRcdGxldCBpdGVtPXt9O1xuXHRcdGl0ZW0ucGF5bG9hZD10aGlzLmdldENoYXB0ZXJVcmwobmxbbmwubGVuZ3RoLTJdLmdldEF0dHJpYnV0ZShcIm9uY2xpY2tcIikpO1xuXHRcdGl0ZW0udGV4dD1ubFtubC5sZW5ndGgtMV0udGV4dENvbnRlbnQ7XG5cdFx0YXJyYXkucHVzaChpdGVtKTtcblx0XHRsZXQgdXJsSW5DaGFwdGVyPWZhbHNlO1xuXHQgICAgZm9yKGxldCBqPTA7ajxjaGFwdGVycy5sZW5ndGg7KytqKXtcblx0ICAgIFx0aWYoY2hhcHRlcnNbal0ucGF5bG9hZD09PWl0ZW0ucGF5bG9hZCl7XG5cdCAgICBcdFx0dXJsSW5DaGFwdGVyPXRydWU7XG5cdCAgICBcdFx0YnJlYWs7XG5cdCAgICBcdH1cblx0ICAgIH1cbiAgICBcdGlmKHVybEluQ2hhcHRlcj09PWZhbHNlJiZjaGFwdGVycy5sZW5ndGg+MCl7XG4gICAgXHRcdGxldCBvYmo9e1xuXHRcdFx0XHR1cmw6aW5kZXhVUkwsXG5cdFx0XHRcdHRpdGxlOnRpdGxlLFxuXHRcdFx0XHRzaXRlOidjb21pY3M4Jyxcblx0XHRcdFx0aWNvblVybDppbWdVcmwsXG5cdFx0XHRcdGxhc3RSZWFkZWQ6aXRlbVxuXHRcdFx0fTtcblx0XHQgICAgY2hyb21lLm5vdGlmaWNhdGlvbnMuY3JlYXRlKGl0ZW0ucGF5bG9hZCx7XG5cdFx0XHRcdHR5cGU6XCJpbWFnZVwiLFxuXHRcdFx0XHRpY29uVXJsOidpbWcvY29taWNzLTY0LnBuZycsXG5cdFx0XHRcdHRpdGxlOlwiQ29taWNzIFVwZGF0ZVwiLFxuXHRcdFx0XHRtZXNzYWdlOnRpdGxlK1wiICBcIitvYmoubGFzdFJlYWRlZC50ZXh0LFxuXHRcdFx0XHRpbWFnZVVybDppbWdVcmxcblx0XHRcdH0pO1xuXHRcdFx0Y2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCd1cGRhdGUnLGZ1bmN0aW9uKGl0ZW1zKXtcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRpdGVtcy51cGRhdGUucHVzaCh0aGlzKTtcblx0XHRcdFx0bGV0IG51bT1pdGVtcy51cGRhdGUubGVuZ3RoLnRvU3RyaW5nKCk7XG5cdFx0XHRcdGNocm9tZS5icm93c2VyQWN0aW9uLnNldEJhZGdlVGV4dCh7dGV4dDpudW19KTtcblx0XHRcdFx0Y2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KGl0ZW1zKTtcblx0XHRcdH0uYmluZChvYmopKTtcblx0XHR9XG5cdFx0Zm9yKGxldCBpPW5sLmxlbmd0aC0zO2k+PTA7LS1pKXtcblx0XHRcdGxldCBpdGVtPXt9O1xuICAgICAgXHRcdGl0ZW0ucGF5bG9hZD0gdGhpcy5nZXRDaGFwdGVyVXJsKG5sW2ldLmdldEF0dHJpYnV0ZShcIm9uY2xpY2tcIikpO1xuXHRcdCAgICBpdGVtLnRleHQ9bmxbaV0udGV4dENvbnRlbnQudHJpbSgpO1xuXHRcdCAgICBhcnJheS5wdXNoKGl0ZW0pO1xuXHRcdCAgICBsZXQgb2JqPXt9O1xuXHRcdCAgICBsZXQgdXJsSW5DaGFwdGVyPWZhbHNlO1xuXHRcdCAgICBmb3IobGV0IGo9MDtqPGNoYXB0ZXJzLmxlbmd0aDsrK2ope1xuXHRcdFx0ICAgIGlmKGNoYXB0ZXJzW2pdLnBheWxvYWQ9PT1pdGVtLnBheWxvYWQpe1xuXHRcdFx0ICAgIFx0dXJsSW5DaGFwdGVyPXRydWU7XG5cdFx0XHQgICAgXHRicmVhaztcblx0XHRcdCAgICB9XG5cdFx0XHR9XG5cdFx0ICAgIGlmKHVybEluQ2hhcHRlcj09PWZhbHNlJiZjaGFwdGVycy5sZW5ndGg+MCl7XG5cdFx0XHQgICAgb2JqPXtcblx0XHRcdFx0XHR1cmw6aW5kZXhVUkwsXG5cdFx0XHRcdFx0dGl0bGU6dGl0bGUsXG5cdFx0XHRcdFx0c2l0ZTonY29taWNzOCcsXG5cdFx0XHRcdFx0aWNvblVybDppbWdVcmwsXG5cdFx0XHRcdFx0bGFzdFJlYWRlZDppdGVtXG5cdFx0XHRcdH07XG5cdFx0XHRcdGNocm9tZS5ub3RpZmljYXRpb25zLmNyZWF0ZShpdGVtLnBheWxvYWQse1xuXHRcdFx0XHRcdHR5cGU6XCJpbWFnZVwiLFxuXHRcdFx0XHRcdGljb25Vcmw6J2ltZy9jb21pY3MtNjQucG5nJyxcblx0XHRcdFx0XHR0aXRsZTpcIkNvbWljcyBVcGRhdGVcIixcblx0XHRcdFx0XHRtZXNzYWdlOnRpdGxlK1wiICBcIitvYmoubGFzdFJlYWRlZC50ZXh0LFxuXHRcdFx0XHRcdGltYWdlVXJsOmltZ1VybFxuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCd1cGRhdGUnLGZ1bmN0aW9uKGl0ZW1zKXtcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdGl0ZW1zLnVwZGF0ZS5wdXNoKHRoaXMpO1xuXHRcdFx0XHRcdGxldCBudW09aXRlbXMudXBkYXRlLmxlbmd0aC50b1N0cmluZygpO1xuXHRcdFx0XHRcdGNocm9tZS5icm93c2VyQWN0aW9uLnNldEJhZGdlVGV4dCh7dGV4dDpudW19KTtcblx0XHRcdFx0XHRjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoaXRlbXMpO1xuXHRcdFx0XHR9LmJpbmQob2JqKSk7XG5cdFx0ICAgIH1cblx0XHR9XG5cdFx0aXRlbXNbJ2NvbGxlY3RlZCddW2tdLm1lbnVJdGVtcz1hcnJheTtcblx0XHRjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoaXRlbXMpO1x0XHRcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb21pY3M7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9hcHAvY29taWNzXzguanNcbiAqKi8iLCJsZXQgRWNobz1yZXF1aXJlKCcuL2VjaG8nKTtcbmxldCBJbW11dGFibGUgPSByZXF1aXJlKCdpbW11dGFibGUnKTtcbmxldCBwYXJzZXI9IG5ldyBET01QYXJzZXIoKTtcbmxldCBjb21pY3M9e1xuXHRyZWdleDogL2h0dHBcXDpcXC9cXC93d3dcXC5kbTVcXC5jb20oXFwvbVxcZCtcXC8pLyxcblxuXHRkbTVyZWdleDogL2h0dHBcXDpcXC9cXC8odGVsfHx3d3cpXFwuZG01XFwuY29tKFxcL21cXGQrXFwvKS8sXG5cdFxuXHRiYXNlVVJMOlwiaHR0cDovL3d3dy5kbTUuY29tXCIsXG5cblx0aGFuZGxlVXJsSGFzaDogZnVuY3Rpb24obWVudUl0ZW1zKXtcblx0XHRsZXQgcGFyYW1zX3N0cj13aW5kb3cubG9jYXRpb24uaGFzaDtcbiAgICBcdHRoaXMuc2l0ZT0gL3NpdGVcXC8oLiopXFwvY2hhcHRlci8uZXhlYyhwYXJhbXNfc3RyKVsxXTtcbiAgICBcdHRoaXMuY2hhcHRlclVSTD10aGlzLmJhc2VVUkwrKC9jaGFwdGVyKFxcLy4qXFwvKS8uZXhlYyhwYXJhbXNfc3RyKVsxXSk7XG5cbiAgICBcdGlmKCEoLyMkLy50ZXN0KHBhcmFtc19zdHIpKSl7XG5cdCAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29taWNzX3BhbmVsXCIpLmlubmVySFRNTD1cIlwiO1xuXHQgICAgICBsZXQgaW5kZXg9LTE7XG5cdCAgICAgIGZvcihsZXQgaT0wO2k8bWVudUl0ZW1zLnNpemU7KytpKXtcblx0ICAgICAgICBpZihtZW51SXRlbXMuZ2V0KGkpLmdldCgncGF5bG9hZCcpPT09dGhpcy5jaGFwdGVyVVJMKXtcblx0ICAgICAgICAgIGluZGV4PWk7XG5cdCAgICAgICAgICB0aGlzLmxhc3RJbmRleD1pbmRleDtcblx0ICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgICB0aGlzLmdldEltYWdlKGluZGV4LHRoaXMuY2hhcHRlclVSTCk7XG5cdCAgICB9ZWxzZXtcblx0ICAgICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKCcnLGRvY3VtZW50LnRpdGxlLFwiIy9zaXRlL2RtNS9jaGFwdGVyL1wiKygvY2hhcHRlclxcLyguKlxcLykvLmV4ZWMocGFyYW1zX3N0cilbMV0pKTtcblx0ICAgIH0gIFxuXHR9LFx0XG5cblx0Z2V0Q2hhcHRlcjpmdW5jdGlvbihkb2Mpe1xuXHRcdGxldCBubD1kb2MucXVlcnlTZWxlY3RvckFsbChcIi5ucjYubGFuMj5saT4udGdcIik7XG5cdFx0cmV0dXJuIG5sO1xuXHR9LFxuXG5cdGdldFRpdGxlTmFtZTpmdW5jdGlvbihkb2Mpe1xuXHRcdHRoaXMudGl0bGU9ZG9jLnF1ZXJ5U2VsZWN0b3IoXCIuaW5idF90aXRsZV9oMlwiKS50ZXh0Q29udGVudDtcblx0XHRyZXR1cm4gdGhpcy50aXRsZTtcblx0fSxcblxuXHRnZXRDb3ZlckltZzpmdW5jdGlvbihkb2Mpe1xuXHRcdHRoaXMuaWNvblVybD1kb2MucXVlcnlTZWxlY3RvcihcIi5pbm5yOTE+aW1nXCIpLnNyYztcblx0XHRyZXR1cm4gdGhpcy5pY29uVXJsO1xuXHR9LFxuXG5cdGdldEluZGV4VVJMOmFzeW5jIGZ1bmN0aW9uKCl7XG5cdFx0Ly8gY29uc29sZS5sb2coZG9jKTtcblx0XHRsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh0aGlzLmNoYXB0ZXJVUkwpO1xuICAgIFx0bGV0IHJ0eHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gICAgXHRsZXQgZG9jPXBhcnNlci5wYXJzZUZyb21TdHJpbmcocnR4dCxcInRleHQvaHRtbFwiKTtcblx0XHR0aGlzLmluZGV4VVJMPXRoaXMuYmFzZVVSTCtkb2MucXVlcnlTZWxlY3RvcihcIiNpbmRleF9yaWdodCA+IGRpdi5sYW5fa2syID4gZGl2Om50aC1jaGlsZCgxKSA+IGRsID4gZHQucmVkX2xqID4gYVwiKS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcblx0XHRyZXR1cm4gdGhpcy5pbmRleFVSTDtcblx0fSxcblxuXHQvLyBtYXJrZWRJdGVtczogSW1tdXRhYmxlLlNldCgpLFxuXG5cdGdldE1lbnVJdGVtczpmdW5jdGlvbihkb2MsbWFya2VkSXRlbXMpe1xuXHRcdGxldCBubCA9IHRoaXMuZ2V0Q2hhcHRlcihkb2MpOyAgICAgIFxuXHQgICAgbGV0IGFycmF5PVtdO1xuXHQgICAgdGhpcy5pbml0SW5kZXg9LTE7XG5cdCAgICBmb3IobGV0IGk9MDtpPG5sLmxlbmd0aDsrK2kpe1xuXHQgICAgICBsZXQgaXRlbT17fTtcblx0ICAgICAgaXRlbS5wYXlsb2FkPXRoaXMuYmFzZVVSTCtubFtpXS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcblx0ICAgICAgLy8gY29uc29sZS5sb2coaXRlbS5wYXlsb2FkKTtcblx0ICAgICAgaXRlbS50ZXh0PW5sW2ldLnRleHRDb250ZW50O1xuXHQgICAgICBpZihpdGVtLnBheWxvYWQ9PT10aGlzLmNoYXB0ZXJVUkwmJnRoaXMuaW5pdEluZGV4PT09LTEpe1xuXHQgICAgICAgIHRoaXMuaW5pdEluZGV4PWk7XG5cdCAgICAgICAgZG9jdW1lbnQudGl0bGU9dGhpcy50aXRsZStcIiBcIitpdGVtLnRleHQ7XG5cdCAgICAgICAgdGhpcy5zZXRJbWFnZUluZGV4KGkpO1xuXHQgICAgICAgIGl0ZW0uaXNNYXJrZWQ9dHJ1ZTtcblx0ICAgICAgICBpZighbWFya2VkSXRlbXMuaGFzKGl0ZW0ucGF5bG9hZCkpe1xuXHQgICAgICAgICAgbWFya2VkSXRlbXM9bWFya2VkSXRlbXMuYWRkKGl0ZW0ucGF5bG9hZCk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICAgIGlmKG1hcmtlZEl0ZW1zLmhhcyhpdGVtLnBheWxvYWQpKXtcblx0ICAgICAgICBpdGVtLmlzTWFya2VkPXRydWU7ICBcblx0ICAgICAgfVxuXHQgICAgICBpdGVtPUltbXV0YWJsZS5NYXAoaXRlbSk7XG5cdCAgICAgIGFycmF5LnB1c2goaXRlbSk7XG5cdCAgICB9XG5cdCAgICB0aGlzLm1hcmtlZEl0ZW1zPW1hcmtlZEl0ZW1zO1xuXHQgICAgcmV0dXJuIEltbXV0YWJsZS5MaXN0KGFycmF5KTtcblx0fSxcblxuXHRnZXRJbWFnZTogYXN5bmMgZnVuY3Rpb24oaW5kZXgsdXJsKXtcblx0ICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpO1xuXHQgIGxldCBydHh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuXHQgIGxldCBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHJ0eHQsXCJ0ZXh0L2h0bWxcIik7XG5cdCAgdGhpcy5zZXRJbWFnZXModXJsLGluZGV4LGRvYyk7XG5cdH0sXG5cblx0Y2hhcHRlclVwZGF0ZUluZGV4OiAtMSxcbiAgXG4gIFx0c2V0SW1hZ2VJbmRleDpmdW5jdGlvbihpbmRleCl7XG4gICAgXHRpZih0aGlzLmNoYXB0ZXJVcGRhdGVJbmRleD09PS0xKXtcbiAgICAgIFx0XHR0aGlzLmNoYXB0ZXJVcGRhdGVJbmRleD1pbmRleDtcbiAgICBcdH1lbHNlIGlmKHRoaXMuY2hhcHRlclVwZGF0ZUluZGV4PT09LTIpe1xuICAgICAgXHRcdGxldCBpbWdzPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2ltZ1tkYXRhLWNoYXB0ZXI9XFxcIi0xXFxcIl0nKTtcbiAgICAgIFx0XHRmb3IobGV0IGk9MDtpPGltZ3MubGVuZ3RoOysraSl7XG4gICAgICAgIFx0XHRpbWdzW2ldLnNldEF0dHJpYnV0ZShcImRhdGEtY2hhcHRlclwiLGluZGV4KTtcbiAgICAgIFx0XHR9XG4gICAgICBcdFx0dGhpcy5jaGFwdGVyVXBkYXRlSW5kZXg9LTE7ICBcbiAgICBcdH1cblx0fSxcblxuXHRzZXRJbWFnZXM6ZnVuY3Rpb24odXJsLGluZGV4LGRvYyl7XG5cdFx0bGV0IHNjcmlwdDE9LzxzY3JpcHQgdHlwZVxcPVxcXCJ0ZXh0XFwvamF2YXNjcmlwdFxcXCI+KC4qKXJlc2V0dXJsLy5leGVjKGRvYy5oZWFkLmlubmVySFRNTClbMV07XG5cdFx0ZXZhbChzY3JpcHQxKTtcblx0XHR0aGlzLnBhZ2VNYXg9RE01X0lNQUdFX0NPVU5UO1xuXHRcdGxldCBpbWc9W107XG5cdFx0Zm9yKGxldCBpPTA7aTx0aGlzLnBhZ2VNYXg7KytpKXtcblx0XHRcdGltZ1tpXT11cmwrXCJjaGFwdGVyZnVuLmFzaHg/Y2lkPVwiK0RNNV9DSUQudG9TdHJpbmcoKStcIiZwYWdlPVwiKyhpKzEpK1wiJmtleT0mbGFuZ3VhZ2U9MVwiO1xuXHRcdH1cblx0XHR0aGlzLmltYWdlcz1pbWc7XG5cdFx0dGhpcy5hcHBlbmRJbWFnZShpbmRleCk7XHRcdFxuXHR9LFxuXG5cdGFwcGVuZEltYWdlOmZ1bmN0aW9uKGluZGV4KXtcblx0ICAgIGxldCBjb21pY3NfcGFuZWw9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb21pY3NfcGFuZWxcIik7XG5cdCAgICBpZihpbmRleD09PS0xKXtcblx0ICAgICAgaW5kZXg9dGhpcy5jaGFwdGVyVXBkYXRlSW5kZXg7XG5cdCAgICAgIHRoaXMuY2hhcHRlclVwZGF0ZUluZGV4PS0yO1xuXHQgICAgfVxuXHQgICAgZm9yKGxldCBpPTA7aTx0aGlzLnBhZ2VNYXg7KytpKXtcblx0ICAgICAgbGV0IGltZz1uZXcgSW1hZ2UoKTtcblx0ICAgICAgaW1nLnNyYz1cImRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEFRQUJBSUFBQUFBQUFQLy8veUg1QkFFQUFBQUFMQUFBQUFBQkFBRUFBQUlCUkFBN1wiXG5cdCAgICAgIGltZy5zZXRBdHRyaWJ1dGUoXCJkYXRhLWVjaG9cIix0aGlzLmltYWdlc1tpXSk7XG5cdCAgICAgIGltZy5zZXRBdHRyaWJ1dGUoXCJkYXRhLW51bVwiLGkrMSk7XG5cdCAgICAgIGltZy5zZXRBdHRyaWJ1dGUoXCJkYXRhLWNoYXB0ZXJcIixpbmRleCk7XG5cdCAgICAgIGltZy5zdHlsZS53aWR0aD1cIjkwMHB4XCI7XG5cdCAgICAgIGltZy5zdHlsZS5oZWlnaHQ9XCIxMzAwcHhcIjtcblx0ICAgICAgaW1nLnN0eWxlLmRpc3BsYXk9J2Jsb2NrJztcblx0ICAgICAgaW1nLnN0eWxlLmJvcmRlcldpZHRoPVwiMXB4XCI7XG5cdCAgICAgIGltZy5zdHlsZS5ib3JkZXJDb2xvcj1cIndoaXRlXCI7XG5cdCAgICAgIGltZy5zdHlsZS5ib3JkZXJTdHlsZT1cInNvbGlkXCI7XG5cdCAgICAgIGltZy5zdHlsZS5tYXJnaW5MZWZ0PSdhdXRvJztcblx0ICAgICAgaW1nLnN0eWxlLm1hcmdpblJpZ2h0PSdhdXRvJztcblx0ICAgICAgaW1nLnN0eWxlLm1hcmdpblRvcD0nMTBweCc7XG5cdCAgICAgIGltZy5zdHlsZS5tYXJnaW5Cb3R0b209JzUwcHgnO1xuXHQgICAgICBpbWcuc3R5bGUubWF4V2lkdGg9JzEwMCUnO1xuXHQgICAgICBpbWcuc3R5bGUuYmFja2dyb3VuZD0nIzJhMmEyYSB1cmwoaHR0cDovL2kuaW1ndXIuY29tL21zZHBkUW0uZ2lmKSBuby1yZXBlYXQgY2VudGVyIGNlbnRlcic7XG5cdCAgICAgIGltZy5zZXRBdHRyaWJ1dGUoXCJkYXRhLXBhZ2VNYXhcIix0aGlzLnBhZ2VNYXgpO1xuXHQgICAgICBjb21pY3NfcGFuZWwuYXBwZW5kQ2hpbGQoaW1nKTtcblx0ICAgIH1cblx0XHRFY2hvLm5vZGVzPWNvbWljc19wYW5lbC5jaGlsZHJlbjtcblx0ICAgIGxldCBjaGFwdGVyRW5kPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdCAgICBjaGFwdGVyRW5kLmNsYXNzTmFtZT1cImNvbWljc19pbWdfZW5kXCI7XG5cdCAgICBjaGFwdGVyRW5kLnRleHRDb250ZW50PVwi5pys6Kmx57WQ5p2fXCI7XG5cdCAgICBjb21pY3NfcGFuZWwuYXBwZW5kQ2hpbGQoY2hhcHRlckVuZCk7XG5cdCAgICBsZXQgY2hhcHRlclByb21vdGU9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0ICAgIGNoYXB0ZXJQcm9tb3RlLmNsYXNzTmFtZT1cImNvbWljc19pbWdfcHJvbW90ZVwiO1xuXHQgICAgY2hhcHRlclByb21vdGUudGV4dENvbnRlbnQ9XCJJZiB5b3UgbGlrZSBDb21pY3MgU2Nyb2xsZXIsIGdpdmUgbWUgYSBsaWtlIG9uIEZCIG9yIEdpdGh1Yi5cIjtcblx0ICAgIGNvbWljc19wYW5lbC5hcHBlbmRDaGlsZChjaGFwdGVyUHJvbW90ZSk7XG5cdCAgICBpZighRWNoby5oYWRJbml0ZWQpe1xuXHQgICAgICBFY2hvLmluaXQoe1xuXHQgICAgICAgIGltZ1JlbmRlcjogYXN5bmMgZnVuY3Rpb24oZWxlbSl7XG5cdCAgICAgICAgICBsZXQgcmVzcG9uc2U9IGF3YWl0IGZldGNoKGVsZW0uZ2V0QXR0cmlidXRlKFwiZGF0YS1lY2hvXCIpKTtcblx0ICAgICAgICAgIGxldCBydHh0PSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG5cdCAgICAgICAgICBldmFsKHJ0eHQpO1xuXHQgICAgICAgICAgbGV0IHJlcT1uZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0ICAgICAgICAgIGlmICh0eXBlb2YgKGhkX2MpICE9IFwidW5kZWZpbmVkXCIgJiYgaGRfYy5sZW5ndGggPiAwICYmIHR5cGVvZiAoaXNyZXZ0dCkgIT0gXCJ1bmRlZmluZWRcIikge1xuXHQgICAgICAgICAgICBlbGVtLnNyYz1oZF9jWzBdO1xuXHQgICAgICAgICAgfWVsc2V7XG5cdCAgICAgICAgICAgIGVsZW0uc3JjPWRbMF07XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1lY2hvJyk7XG5cdCAgICAgIFx0fVxuXHQgICAgICB9KTtcblx0ICAgIH1lbHNle1xuXHQgICAgICBFY2hvLnJlbmRlcigpO1xuXHQgICAgfVxuXHR9LFxuXG5cdGJhY2tncm91bmRPbmxvYWQ6ZnVuY3Rpb24oaW5kZXhVUkwsY2hhcHRlcnMscmVxLGl0ZW1zLGspe1xuICAgICAgXHRsZXQgZG9jPXJlcS5yZXNwb25zZTtcblx0ICAgXHRsZXQgbmwgPSB0aGlzLmdldENoYXB0ZXIoZG9jKTtcblx0ICAgXHRsZXQgdGl0bGU9dGhpcy5nZXRUaXRsZU5hbWUoZG9jKTtcblx0ICAgXHRsZXQgaW1nVXJsPXRoaXMuZ2V0Q292ZXJJbWcoZG9jKTtcbiAgICAgIFx0bGV0IGFycmF5PVtdO1xuICAgICAgXHRpZihubC5sZW5ndGghPT1jaGFwdGVycy5sZW5ndGgpIHtcbiAgICAgIFx0XHRjb25zb2xlLmxvZygndXBkYXRlJyxubC5sZW5ndGgsY2hhcHRlcnMubGVuZ3RoKTtcdFxuICAgICAgXHR9XG5cbiAgICAgIFx0Zm9yKGxldCBpPTA7aTxubC5sZW5ndGg7KytpKXtcblx0XHQgIFx0bGV0IGl0ZW09e307XG5cdCAgICAgICBcdGl0ZW0ucGF5bG9hZD10aGlzLmJhc2VVUkwrbmxbaV0uZ2V0QXR0cmlidXRlKCdocmVmJyk7XG5cdCAgICAgICBcdGl0ZW0udGV4dD1ubFtpXS50ZXh0Q29udGVudDtcdFx0XHRcdCAgICAgIFx0XG5cdFx0ICAgIGFycmF5LnB1c2goaXRlbSk7XG5cdFx0ICAgIGxldCB1cmxJbkNoYXB0ZXI9ZmFsc2U7XG5cdFx0ICBcdGZvcihsZXQgaj0wO2o8Y2hhcHRlcnMubGVuZ3RoOysrail7XG4gICAgXHRcdFx0aWYoY2hhcHRlcnNbal0ucGF5bG9hZD09PWl0ZW0ucGF5bG9hZCl7XG4gICAgXHRcdFx0XHR1cmxJbkNoYXB0ZXI9dHJ1ZTtcbiAgICBcdFx0XHRcdGJyZWFrO1xuICAgIFx0XHRcdH1cbiAgICBcdFx0fVxuXHRcdCAgICBpZighdXJsSW5DaGFwdGVyJiZjaGFwdGVycy5sZW5ndGg+MCl7XG5cdFx0XHRcdGxldCBvYmo9e1xuXHRcdFx0XHRcdHVybDppbmRleFVSTCxcblx0XHRcdFx0XHR0aXRsZTp0aXRsZSxcblx0XHRcdFx0XHRzaXRlOidkbTUnLFxuXHRcdFx0XHRcdGljb25Vcmw6aW1nVXJsLFxuXHRcdFx0XHRcdGxhc3RSZWFkZWQ6aXRlbVxuXHRcdFx0XHR9O1xuXHRcdCAgICBcdGNocm9tZS5ub3RpZmljYXRpb25zLmNyZWF0ZShpdGVtLnBheWxvYWQse1xuXHRcdFx0XHRcdHR5cGU6XCJpbWFnZVwiLFxuXHRcdFx0XHRcdGljb25Vcmw6J2ltZy9jb21pY3MtNjQucG5nJyxcblx0XHRcdFx0XHR0aXRsZTpcIkNvbWljcyBVcGRhdGVcIixcblx0XHRcdFx0XHRtZXNzYWdlOnRpdGxlK1wiICBcIitvYmoubGFzdFJlYWRlZC50ZXh0LFxuXHRcdFx0XHRcdGltYWdlVXJsOmltZ1VybFxuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCd1cGRhdGUnLGZ1bmN0aW9uKGl0ZW1zKXtcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdGl0ZW1zLnVwZGF0ZS5wdXNoKHRoaXMpO1xuXHRcdFx0XHRcdGxldCBudW09aXRlbXMudXBkYXRlLmxlbmd0aC50b1N0cmluZygpO1xuXHRcdFx0XHRcdGNocm9tZS5icm93c2VyQWN0aW9uLnNldEJhZGdlVGV4dCh7dGV4dDpudW19KTtcblx0XHRcdFx0XHRjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoaXRlbXMpO1xuXHRcdFx0XHR9LmJpbmQob2JqKSk7XG5cdFx0XHR9XG5cdFx0fVxuXHQgICAgaXRlbXNbJ2NvbGxlY3RlZCddW2tdLm1lbnVJdGVtcz1hcnJheTtcblx0ICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldChpdGVtcyk7XHRcdFxuXHR9XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzPWNvbWljcztcblxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvYXBwL2NvbWljc19kbTUuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9