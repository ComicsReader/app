import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Radium from 'radium';

import DocumentTitle from 'react-document-title';

import ComicListView from 'components/ComicListView';
import ChapterSidebar from 'components/ChapterSidebar';
import NavigationSidebar from 'components/NavigationSidebar';
import ToolBar from 'components/ToolBar';

import * as ChapterActions from 'actions/ChapterActions';
import { toggleAppDrawer } from 'actions/UIActions';
import * as UIActions from 'actions/UIActions';
import { fetchReadingRecord } from 'actions/ConfigActions';
import { getNextChapterIndex, getPreviousChapterIndex } from 'reducers/selectors';

@Radium
class Reader extends Component {
	static propTypes = {
		/* injected by redux */
		readingChapterID: PropTypes.string,
		readingImages: PropTypes.array,
		chapters: PropTypes.array,
		appBarTitle: PropTypes.string.isRequired,
		comicName: PropTypes.string,
		zoomRate: PropTypes.number,
		readingRecord: PropTypes.object,
		comicID: PropTypes.string,

		/* chapter actions */
		switchChapter: PropTypes.func,
		switchChapterRequest: PropTypes.object,
		initComicManager: PropTypes.func,
		params: PropTypes.object,

		/* ui actions */
		increaseZoomRate: PropTypes.func,
		decreaseZoomRate: PropTypes.func,
		resetZoomRate: PropTypes.func,

		dispatch: PropTypes.func
	}

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		const { site, chapter } = this.props.params;
		const { initComicManager, readingChapterID, dispatch } = this.props;

		fetchReadingRecord()(dispatch);
		initComicManager({site, chapterID: chapter, readingChapterID});
	}

	componentWillReceiveProps(nextProps) {
		const { site: nextSite, chapter: nextChapter } = nextProps.params;
		const { site, chapter } = this.props.params;
		const { chapters, switchChapter, readingChapterID, initComicManager, comicID, dispatch } = this.props;

		if (nextSite !== site ) {
			// TODO: currently we only implement dm5
			initComicManager({site, chapterID: chapter, readingChapterID});
		} else {
			let chapterItem = chapters.find(c => c.chapterID == nextChapter);

			if (nextChapter !== chapter) {
				if (typeof chapterItem !== 'undefined') {
					switchChapter(chapterItem);
				} else {
					initComicManager({site, chapterID: nextChapter, readingChapterID});
				}
			} else {
				// do nothing, chapter is the same
				return;
			}
		}
	}

	init = () => {
		const { site, chapter } = this.props.params;
		const { initComicManager, readingChapterID, dispatch } = this.props;

		fetchReadingRecord()(dispatch);
		initComicManager({site, chapterID: chapter, readingChapterID});
	}

	handleChapterClick = (chapterItem) => {
		const { switchChapter } = this.props;
		return () => {
			switchChapter(chapterItem);
		};
	}

	switchChapterBy = (getterFunction) => {
		return () => {
			const { chapters, readingChapterID, switchChapter } = this.props;
			let index = getterFunction(chapters, readingChapterID);
			if ( index != -1 ) {
				switchChapter(chapters[index]);
			}
		};
	}

	hasNextChapter = () => {
		return getNextChapterIndex(this.props.chapters, this.props.readingChapterID) !== -1;
	}

	hasPrevioushapter = () => {
		return getPreviousChapterIndex(this.props.chapters, this.props.readingChapterID) !== -1;
	}

	sidebarIsSelected = (chapterItem) => {
		return this.props.readingChapterID == chapterItem.chapterID;
	}

	onLeftIconButtonTouchTap = () => {
		this.props.dispatch(toggleAppDrawer());
	}

	getDocumentTitle = () => {
		const { comicName, appBarTitle } = this.props;
		if (comicName) {
			if (appBarTitle.includes(comicName)) {
				return `${appBarTitle} | ComicsReader`;
			} else {
				return `${comicName} - ${appBarTitle} | ComicsReader`;
			}
		} else {
			return 'Reader | ComicsReader';
		}
	}

	isChapterUnread = (chapterItem) => {
		const { readingRecord, comicID } = this.props;
		return typeof readingRecord[comicID] == 'undefined' ||
						typeof readingRecord[comicID][chapterItem.chapterID] ==='undefined' ||
						!readingRecord[comicID][chapterItem.chapterID];
	}

	render() {
		const {
			readingImages,
			chapters
		} = this.props;

		return(
			<DocumentTitle title={this.getDocumentTitle()}>
				<div style={{overflow: 'hidden', paddingLeft: 60}}>
					<NavigationSidebar highlightTag="reader" />
					<ToolBar
						loadNextChapter={this.switchChapterBy(getNextChapterIndex)}
						loadPreviousChapter={this.switchChapterBy(getPreviousChapterIndex)}
						increaseZoomRate={this.props.increaseZoomRate}
						decreaseZoomRate={this.props.decreaseZoomRate}
						resetZoomRate={this.props.resetZoomRate}
					/>
					<div
						ref="scrollContainer"
						style={{
							marginTop: 25,
							overflow: 'auto',
							height: 'calc(100% - 70px)',
							width: 'calc(100% - 38px)'
						}}
					>
						<ChapterSidebar
							chapters={chapters}
							onChapterItemClick={this.handleChapterClick}
							drawerAutoClose={true}
							isSelected={this.sidebarIsSelected}
							isUnread={this.isChapterUnread}
						/>
						<ComicListView
							comicImages={readingImages}
							loadNextChapter={this.switchChapterBy(getNextChapterIndex)}
							loadPreviousChapter={this.switchChapterBy(getPreviousChapterIndex)}
							hasNextChapter={this.hasNextChapter()}
							hasPrevioushapter={this.hasPrevioushapter()}
							zoomRate={this.props.zoomRate}
						/>
					</div>
				</div>
			</DocumentTitle>
		);
	}
}

export default connect(state => {
	/* map state to props */
	return {
		...state.comics,
		zoomRate: state.uiState.zoomRate,
		readingRecord: state.config.readingRecord,
		comicID: state.comics.comicID
	};
}, dispatch => {
	/* map dispatch to props */
	return({
		...bindActionCreators(ChapterActions, dispatch),
		...bindActionCreators(UIActions, dispatch),
		dispatch
	});
})(Reader);
