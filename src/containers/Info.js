import React, { Component } from 'react';
import NavigationSidebar from 'components/NavigationSidebar';

export default class Info extends Component {
	onClick = (event) => {
		if (window.PLATFORM === 'electron') {
			event.preventDefault();

			const { shell } = require('electron');
			shell.openExternal(event.target.href);

			return false;
		} else {
			return true;
		}
	}

	render() {
		return(
			<div style={{overflow: 'hidden', paddingLeft: 95, color: 'white', height: '100%'}}>
				<NavigationSidebar highlightTag="info" />

				<h2>About</h2>

				<p>
					ComicsReader 是一個基於 React/Redux/Electron 等網頁技術構建的漫畫閱讀器。漫畫來源來自 DM5，前身為 <a href="https://github.com/zeroshine/ComicsScroller" target="_blank" onClick={this.onClick}>ComicsScroller</a> 這款 Chrome Extension，本軟體作者基於其原始碼重新建構。
				</p>

				<h2>Source Code</h2>
				<p>
					GitHub: <a href="https://github.com/ComicsReader/app" target="_blank" onClick={this.onClick}>https://github.com/ComicsReader/app</a>
				</p>


				<p>The MIT License (MIT)</p>
				<p>Copyright (c) 2016 Yukai Huang</p>

				<p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>

				<p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>

				<p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
			</div>
		);
	}
}
