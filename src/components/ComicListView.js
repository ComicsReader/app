import {
	Component,
	PropTypes
} from 'react';

import ReactDOM from 'react-dom';
import * as _ from 'lodash';

import ComicImage from './ComicImage';
import ChapterSeperator from './ChapterSeperator';
import LoadIndicator from './LoadIndicator';

// var comicImages = {
//   "12345": { // cid
//     count: 20,
//     images: [
//       "fghjmnm,..png",
//       "fghjmnm,..png",
//       "fghjmnm,..png"
//     ]
//   }
// }

// var chapters = {
//   "manhua-yiquanchaoren": [
//     {
//       title: "rtyukjkl"
//       link: "sfdafg"
//       cid: "asdfasdf",
//       next: "12333",
//       previous: null
//     },
//     {
//       title: "rtyukjkl"
//       link: "sfdafg"
//       cid: "12333"
//     }
//   ]
// }

export default class ChapterListView extends Component {
	static propTypes = {
		comicManager: PropTypes.object.isRequired,
		viewingCID: PropTypes.string,
		onChaptersLoaded: PropTypes.func,
		onViewingChapterChanged: PropTypes.func,
		refresh: PropTypes.boolean,
	}

	constructor(props) {
		super(props);
		this.state = {
			chapters: {},
			viewingCID: null,
			viewingChapters: [], // visible chapters
			isLoading: false,
			comicImages: {} // TODO: load from storage
		}
	}

	componentDidMount() {
		this.initialize();
		document.addEventListener("scroll", this.checkLoadNewChapter);
		document.addEventListener("scroll", _.debounce(this.checkViewingChapter, 100));
	}

	componentWillUnmount() {
		document.removeEventListener("scroll", this.checkLoadNewChapter);
		document.removeEventListener("scroll", _.debounce(this.checkViewingChapter, 100));
	}

	componentWillReceiveProps(nextProps) {
		// * comics changes <=> comic manager changes
		// * chapter changes(new chapterID from parent component)
		// * refetch chpater info
		// * handle chapter name changed
		const {
			viewingCID,
			comicManager,
			refresh
		} = nextProps;

		// viewing chapters changes
		if (typeof viewingCID !== 'undefined'
				&& refresh
				&& this.state.viewingCID
				&& viewingCID !== this.state.viewingCID
				) {
			var viewingChapters = [
					this.filterChapter(this.state.chapters[comicManager.comicID], viewingCID)
				];
			this.setState({
				viewingChapters: viewingChapters
			})
			this.onViewingChapterChanged(viewingChapters[0])

			// fetch chapters images if not loaded yet
			var cid = viewingChapters[0].cid;
			if (typeof this.state.comicImages[cid] === 'undefined') {
				var comicImages = {...this.state.comicImages};
				comicManager.getChapterImages(cid).then(images => {
					comicImages[cid] = {...comicImages[cid], images: images}
					this.setState({
						comicImages: comicImages
					})
				});
			}
		}
	}

	initialize = async () => {
		const { comicManager, viewingCID } = this.props;

		var chapters = await (comicManager.getChapters());
		var chapterObject = {...this.state.chapters, [comicManager.comicID]: chapters};
		var viewingChapters = (typeof viewingCID !== 'undefined' && viewingCID) ? [this.filterChapter(chapters, viewingCID)] : [chapters[0]];
		var cid = viewingChapters[0].cid;

		this.onChaptersLoaded(chapters);
		this.onViewingChapterChanged(viewingChapters[0]);

		comicManager.getChapterImages(cid).then(images => {
			var comicImages = {...this.state.comicImages, [cid]: {images: images}};
			// comicImages[cid] = {...comicImages[cid], images: images};
			this.setState({
				viewingChapters: viewingChapters,
				chapters: chapterObject,
				comicImages: comicImages
			})
		});
	}

	filterChapter(chapters, cid) {
		return chapters.find(c => c.cid === cid)
	}

	onChaptersLoaded = (chapters) => {
		const { onChaptersLoaded } = this.props;
		if (typeof onChaptersLoaded !== 'undefined' && onChaptersLoaded) {
			onChaptersLoaded(chapters)
		}
	}

	firstImage = () => {
		var firstChapter = this.state.viewingChapters.slice(0)[0];
		var cid = firstChapter.cid;
		return this.refs[this.comicRef(cid, 0)];
	}

	lastImage = () => {
		var lastChapter = this.state.viewingChapters.slice(-1)[0];
		var cid = lastChapter.cid;
		return this.refs[this.comicRef(cid, this.state.comicImages[cid].images.length-1)];
	}

	firstImageByCID = (cid) => {
		return this.refs[this.comicRef(cid, 0)];
	}

	lastImageByCID = (cid) => {
		return this.refs[this.comicRef(cid, this.state.comicImages[cid].images.length-1)];
	}

	comicRef(cid, index) {
		return `comic_${cid}_${index}`;
	}

	loadNextChapter = (callback) => {
		const { comicManager } = this.props;
		const { viewingChapters } = this.state;

		var curIndex = this.availableChapters().findIndex(c => {
			return c.cid === viewingChapters.slice(-1)[0].cid;
		})

		let targetChapter = null;
		if (curIndex > 0) {
			targetChapter = this.availableChapters()[curIndex-1];
		}

		if (targetChapter) {
			if (!viewingChapters.includes(targetChapter)) { // hasn't loaded yet
				let cid = targetChapter.cid;
				comicManager.getChapterImages(cid).then(images => {

					this.setState({
						comicImages: {...this.state.comicImages, [cid]: {images: images}},
						viewingChapters: [...viewingChapters, targetChapter]
					})

					if (typeof callback !== 'undefined' && callback) { callback() }
				})
			} else {
				if (typeof callback !== 'undefined' && callback) { callback() }
			}
		} else {
			if (typeof callback !== 'undefined' && callback) { callback() }
		}

	}

	checkLoadNewChapter = () => {
		if (!this.state.isLoading) {
			var lastImage = ReactDOM.findDOMNode(this.lastImage())

			if ( typeof lastImage !== 'undefined' && lastImage) {
				if (lastImage.getBoundingClientRect().top < 20000) { // threshold

					this.setState({isLoading: true});

					this.loadNextChapter(() => {
						this.setState({isLoading: false});
					})
				}
			}
		}
	}

	checkViewingChapter = () => {
		// check scrolling region, 有點太狂了
		for(let chapter of this.state.viewingChapters) {
			var firstImage = ReactDOM.findDOMNode(this.firstImageByCID(chapter.cid))
			var lastImage = ReactDOM.findDOMNode(this.lastImageByCID(chapter.cid))

			var scrollTop = document.body.scrollTop;
			if ( scrollTop > firstImage.offsetTop && scrollTop < (lastImage.offsetTop + lastImage.firstChild.height) ) {
				this.onViewingChapterChanged(chapter);
				break;
			}
		}
	}

	onViewingChapterChanged = (chapter) => {
		const { comicManager, onViewingChapterChanged } = this.props;
		if (typeof onViewingChapterChanged !== 'undefined') {
			onViewingChapterChanged(`${comicManager.comicName} - ${chapter.title}`, chapter.cid)
		}
		this.setState({
			viewingCID: chapter.cid
		})
	}

	availableChapters = () => {
		const { comicManager } = this.props;
		return this.state.chapters[comicManager.comicID];
	}

	renderChapterComics = (chapter) => {
		return(
			<div>
				{
					this.state.comicImages[chapter.cid] ?
						this.state.comicImages[chapter.cid].images.map((image, index) => {
							return(
								<ComicImage key={image} src={image} ref={this.comicRef(chapter.cid, index)}/>
							)
						})
						: <LoadIndicator />
				}
				{
					this.state.comicImages[chapter.cid] ?
						<ChapterSeperator chapter={chapter.title}/>
						: null
				}
			</div>
		);
	}

	render() {
		return(
			<div>
				{
					(this.state.viewingChapters.length != 0) ?
						this.state.viewingChapters.map(chapter => {
							return(this.renderChapterComics(chapter))
						})
						: <LoadIndicator />
				}
			</div>
		);
	}
}
