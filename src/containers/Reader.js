import React, {
	Component
} from 'react';

import { Link } from 'react-router';

import Radium from 'radium';

import { AppBar, Drawer, MenuItem } from 'material-ui';
import { grey800, grey50 } from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';

import DM5 from '../comics/dm5';
import ComicListView from '../components/ComicListView';
import ChapterSidebar from '../components/ChapterSidebar';

@Radium
export default class Reader extends Component {

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

	async componentDidMount() {
		// m251123, m144591, m4866
		const { chapter } = this.props.params;
		DM5.fetchComicIDbyChapterID(chapter).then(comicID => {
			this.setState({
				comicManager: DM5,
				comicID: comicID
			});
		});
	}

	// handleToggle = () => {
	// 	this.setState({drawerOpen: !this.state.drawerOpen});
	// }

	handleChapterClick = (chapterItem) => {
		return () => {
			this.setState({
				viewingCID: chapterItem.cid,
				comicListRefresh: true
			});
		};
	}

	renderComicListView = () => {
		if (this.state.comicManager) {
			return(
				<ComicListView
					comicManager={this.state.comicManager}
					onChaptersLoaded={(chapters) => { this.setState({chapters}); }}
					onViewingChapterChanged={(title, cid) => { this.setState({appBarTitle: title, viewingCID: cid, comicListRefresh: false}); }}
					viewingCID={this.state.viewingCID}
					refresh={this.state.comicListRefresh}
					scrollContainerRef={this.refs.scrollContainer}
					comicID={this.state.comicID}
				/>
			);
		}
		return null;
	}

	render() {
		return(
			<div style={{overflow: 'hidden'}}>
				<AppBar
					title={this.state.appBarTitle}
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
						chapters={this.state.chapters}
						onChapterItemClick={this.handleChapterClick}
						drawerAutoClose={true}
					/>
					{ this.renderComicListView() }
				</div>
			</div>
		);
	}
}
