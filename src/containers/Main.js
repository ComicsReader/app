import React, {
	Component
} from 'react';

import { AppBar, Drawer, MenuItem } from 'material-ui';
import { grey800 } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';

import Waypoint from 'react-waypoint';
import queryString from 'query-string'

import DM5 from '../comics/dm5';
import ComicImage from '../components/ComicImage';
import ComicListView from '../components/ComicListView';

export default class Main extends Component {

	constructor(props) {
		super(props);
		this.state = {
			drawerOpen: false,
			appBarTitle: "Loading...",
			chapters: [],
			isLoading: false,
			comicManager: null,
			viewingCID: null,
			comicListRefresh: false
		};
	}

	async componentDidMount() {
		// m251123, m144591, m4866
		const { site, chapter } = queryString.parse(window.location.search)
		var dm5 = new DM5(chapter);
		this.setState({
			comicManager: dm5
		})
	}

	handleToggle = () => {
		this.setState({drawerOpen: !this.state.drawerOpen});
	}

	handleChapterClick = (chapterItem) => {
		return () => {
			this.setState({
				viewingCID: chapterItem.cid,
				drawerOpen: !this.state.drawerOpen,
				comicListRefresh: true
			})
		}
	}

	renderComicListView = () => {
		if (this.state.comicManager) {
			return(
				<ComicListView
					comicManager={this.state.comicManager}
					onChaptersLoaded={(chapters) => { this.setState({chapters}) }}
					onViewingChapterChanged={(title, cid) => { this.setState({appBarTitle: title, viewingCID: cid, comicListRefresh: false}) }}
					viewingCID={this.state.viewingCID}
					refresh={this.state.comicListRefresh}
				/>
			)
		}
		return null;
	}

	render() {
		return(
			<div>
				<AppBar
					title={this.state.appBarTitle}
					style={{backgroundColor: grey800, position: 'fixed'}}
					// iconElementRight={
				 //    <FlatButton label="Save" />
					// }
					// iconClassNameRight="muidocs-icon-navigation-expand-more"
					iconElementRight={ <i className="material-icons md-36">face</i> }
					onLeftIconButtonTouchTap={this.handleToggle}
				/>
				<Drawer
					open={this.state.drawerOpen}
					docked={false}
					onRequestChange={(drawerOpen) => this.setState({drawerOpen})}
				>
					<MenuItem
						style={{backgroundColor: '#424242', color: 'white', height: 64, fontSize: 24, paddingTop: '.5rem'}}
					>
						章節
					</MenuItem>
					{
						this.state.chapters.map((chapterItem) => {
							var style = (this.state.viewingCID === chapterItem.cid) ? { backgroundColor: 'rgba(0, 0, 0, 0.098)' } : {}
							return(
								<MenuItem
									onClick={this.handleChapterClick(chapterItem)}
									style={style}
								>
									{chapterItem.title}
								</MenuItem>
							)
						})
					}
				</Drawer>
				<div style={{paddingTop: 80}}>
					{ this.renderComicListView() }
				</div>
			</div>
		);
	}
}
