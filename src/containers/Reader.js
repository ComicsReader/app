import React, {
	Component,
	PropTypes
} from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Radium from 'radium';

import { AppBar } from 'material-ui';
import { grey800 } from 'material-ui/styles/colors';

import DocumentTitle from 'react-document-title';

import Icon from '../components/Icon';
import ComicListView from '../components/ComicListView';
import ChapterSidebar from '../components/ChapterSidebar';
import NavigationSidebar from '../components/NavigationSidebar';

import * as ChapterActions from '../actions/ChapterActions';
import {toggleAppDrawer} from '../actions/UIActions';
import { getNextChapterIndex, getPreviousChapterIndex } from '../reducers/selectors';

import '../styles/SwitchArea.scss';

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
		/* redux actions */
		switchChapter: PropTypes.func,
		comicManager: PropTypes.object,
		switchChapterRequest: PropTypes.object,
		initComicManager: PropTypes.func,
		params: PropTypes.object,
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
		const {comicManager, chapters, switchChapter} = this.props;

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
			chapters,
			appBarTitle
		} = this.props;

		return(
			<DocumentTitle title={this.getDocumentTitle()}>
				<div style={{overflow: 'hidden'}}>
					<AppBar
						title={appBarTitle}
						style={{backgroundColor: grey800, position: 'fixed'}}
						// iconElementRight={<Link to="/"><FlatButton label="收藏" /></Link>}
						// iconElementRight={ <i className="material-icons md-36">face</i> }
						onLeftIconButtonTouchTap={this.onLeftIconButtonTouchTap}
					/>
					<NavigationSidebar />
					<div
						ref="scrollContainer"
						style={{
							marginTop: 70,
							overflow: 'auto',
							position: 'absolute',
							height: 'calc(100% - 70px)',
							width: 'calc(100% - 35px)'
						}}
					>
						<div className='switchArea' onClick={this.switchChapterBy(getPreviousChapterIndex)}>
							<Icon iconName='navigate_before'/>
						</div>
						<div className='switchArea right' onClick={this.switchChapterBy(getNextChapterIndex)}>
							<Icon iconName='navigate_next'/>
						</div>
						<ChapterSidebar
							chapters={chapters}
							onChapterItemClick={this.handleChapterClick}
							drawerAutoClose={true}
							isSelected={this.sidebarIsSelected}
						/>
						<ComicListView
							comicImages={readingImages}
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
		...state.comics
	};
}, dispatch => {
	/* map dispatch to props */
	return({...bindActionCreators(ChapterActions, dispatch), dispatch});
})(Reader);
