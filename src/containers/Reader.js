import React, {
	Component
} from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { Link } from 'react-router';

import Radium from 'radium';

import { AppBar } from 'material-ui';
import { grey800 } from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';

import ComicListView from '../components/ComicListView';
import ChapterSidebar from '../components/ChapterSidebar';

import * as ChapterActions from '../actions/ChapterActions';

@Radium
class Reader extends Component {

	constructor(props) {
		super(props);
		this.state = {
			appBarTitle: 'Loading...',
			chapters: [],
			isLoading: false,
			comicManager: null,
			viewingCID: null,
			comicListRefresh: false,
			comicID: null
		};
	}

	componentDidMount() {
		// m251123, m144591, m4866
		const { site, chapter } = this.props.params;
		const { initComicManager } = this.props;

		initComicManager(site, chapter);
	}

	handleChapterClick = (chapterItem) => {
		const { switchChapter, comicManager, chapters, history } = this.props;
		return () => {
			switchChapter({comicManager, chapterItem, chapters, history});
		};
	}

	render() {
		const {
			readingComicID,
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
					<ChapterSidebar
						chapters={chapters}
						onChapterItemClick={this.handleChapterClick}
						drawerAutoClose={true}
					/>
					<ComicListView
						comicImages={readingImages}
					/>
					{ /* this.renderComicListView()*/ }
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
