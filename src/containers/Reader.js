import React, {
	Component,
	PropTypes
} from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';

import Radium from 'radium';

import { AppBar } from 'material-ui';
import { grey800 } from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';

import Icon from '../components/Icon';
import ComicListView from '../components/ComicListView';
import ChapterSidebar from '../components/ChapterSidebar';

import * as ChapterActions from '../actions/ChapterActions';
import { getNextChapterIndex, getPreviousChapterIndex } from '../reducers/selectors';

import '../styles/SwitchArea.scss';

const styles = {
	iconStyle: {fontSize: 22, verticalAlign: 'middle', marginRight: 30}
};

@Radium
class Reader extends Component {
	static propTypes = {
		/* injected by redux */
		readingComicID: PropTypes.string,
		readingCID: PropTypes.string,
		readingImages: PropTypes.array,
		chapters: PropTypes.array,
		appBarTitle: PropTypes.string.isRequired,
		/* redux actions */
		switchChapter: PropTypes.func,
		comicManager: PropTypes.object,
		switchChapterRequest: PropTypes.object,
		initComicManager: PropTypes.func,
		params: PropTypes.object
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

	sidebarIsSelected = (chapterItem) => this.props.readingCID == chapterItem.cid;

	render() {
		const {
			readingImages,
			chapters,
			appBarTitle
		} = this.props;

		return(
			<div style={{overflow: 'hidden'}}>
				<AppBar
					title={appBarTitle}
					style={{backgroundColor: grey800, position: 'fixed'}}
					iconElementRight={<Link to="/"><FlatButton label="收藏" /></Link>}
					// iconElementRight={ <i className="material-icons md-36">face</i> }
					// onLeftIconButtonTouchTap={this.handleToggle}
				/>
				<div
					ref="scrollContainer"
					style={{
						marginTop: 80,
						overflow: 'auto',
						position: 'absolute',
						height: 'calc(100% - 80px)',
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
	return(bindActionCreators(ChapterActions, dispatch));
})(Reader);
