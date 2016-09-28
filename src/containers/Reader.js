import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Radium from 'radium';

import DocumentTitle from 'react-document-title';

import Icon from 'components/Icon';
import ComicListView from 'components/ComicListView';
import ChapterSidebar from 'components/ChapterSidebar';
import NavigationSidebar from 'components/NavigationSidebar';
import ToolBar from 'components/ToolBar';

import * as ChapterActions from 'actions/ChapterActions';
import { toggleAppDrawer } from 'actions/UIActions';
import * as UIActions from 'actions/UIActions';
import { getNextChapterIndex, getPreviousChapterIndex } from 'reducers/selectors';

import 'styles/SwitchArea.scss';

@Radium
class Reader extends Component {
	static propTypes = {
		/* injected by redux */
		readingComicID: PropTypes.string,
		readingCID: PropTypes.string,
		readingImages: PropTypes.array,
		chapters: PropTypes.array,
		appBarTitle: PropTypes.string.isRequired,
		comicName: PropTypes.string,
		zoomRate: PropTypes.number,

		/* chapter actions */
		switchChapter: PropTypes.func,
		comicManager: PropTypes.object,
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
		this.init();
	}

	componentWillReceiveProps(nextProps) {
		const { site: nextSite, chapter: nextChapter } = nextProps.params;
		const { site, chapter } = this.props.params;
		const { comicManager, chapters, switchChapter } = this.props;

		if (nextSite !== site) {
			this.init();
		} else if (nextChapter !== chapter) {
			let chapterItem = chapters.find(c => c.cid == comicManager.getCID(nextChapter));
			switchChapter(chapterItem);
		}
	}

	init = () => {
		const { site, chapter } = this.props.params;
		const { initComicManager } = this.props;

		initComicManager({site, chapterID: chapter});
	}

	handleChapterClick = (chapterItem) => {
		const { switchChapter } = this.props;
		return () => {
			switchChapter(chapterItem);
		};
	}

	switchChapterBy = (getterFunction) => {
		return () => {
			const { chapters, readingCID, switchChapter } = this.props;
			let index = getterFunction(chapters, readingCID);
			if ( index != -1 ) {
				switchChapter(chapters[index]);
			}
		};
	}

	hasNextChapter = () => {
		return getNextChapterIndex(this.props.chapters, this.props.readingCID) !== -1;
	}

	hasPrevioushapter = () => {
		return getPreviousChapterIndex(this.props.chapters, this.props.readingCID) !== -1;
	}

	sidebarIsSelected = (chapterItem) => {
		return this.props.readingCID == chapterItem.cid;
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

	render() {
		const {
			readingImages,
			chapters
		} = this.props;

		return(
			<DocumentTitle title={this.getDocumentTitle()}>
				<div style={{overflow: 'hidden', paddingLeft: 60}}>
					<NavigationSidebar />
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
		zoomRate: state.uiState.zoomRate
	};
}, dispatch => {
	/* map dispatch to props */
	return({...bindActionCreators(ChapterActions, dispatch), ...bindActionCreators(UIActions, dispatch), dispatch});
})(Reader);
