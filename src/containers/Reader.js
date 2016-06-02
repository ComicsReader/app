import React, {
	Component
} from 'react';

import { Link } from 'react-router';

import Radium from 'radium';

import { AppBar, Drawer, MenuItem } from 'material-ui';
import { grey800, grey50 } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';

import Waypoint from 'react-waypoint';
import queryString from 'query-string';

import DM5 from '../comics/dm5';
import ComicImage from '../components/ComicImage';
import ComicListView from '../components/ComicListView';

@Radium
export default class Reader extends Component {

	constructor(props) {
		super(props);
		this.state = {
			drawerOpen: false,
			appBarTitle: "Loading...",
			chapters: [],
			isLoading: false,
			comicManager: null,
			viewingCID: null,
			comicListRefresh: false,
			comicID: null,
		};
	}

	async componentDidMount() {
		// m251123, m144591, m4866
		const { site, chapter } = this.props.params;
		DM5.fetchComicIDbyChapterID(chapter).then(comicID => {
			this.setState({
				comicManager: DM5,
				comicID: comicID
			})
		})
	}

	handleToggle = () => {
		this.setState({drawerOpen: !this.state.drawerOpen});
	}

	handleChapterClick = (chapterItem) => {
		return () => {
			this.setState({
				viewingCID: chapterItem.cid,
				drawerOpen: false,
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
					scrollContainerRef={this.refs.scrollContainer}
					comicID={this.state.comicID}
				/>
			)
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
					onLeftIconButtonTouchTap={this.handleToggle}
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
					<div>
						<Drawer
							open={this.state.drawerOpen}
							docked={true}
							// onRequestChange={(drawerOpen) => this.setState({drawerOpen})}
							openSecondary={true}
							containerStyle={{marginTop: 80, height: 'calc(100% - 96px)', width: 300}}
						>
							<MenuItem
								style={{backgroundColor: grey800, color: grey50, height: 64, fontSize: 24, paddingTop: '.5rem'}}
								onClick={() => this.setState({drawerOpen: !this.state.drawerOpen})}
								innerDivStyle={{paddingLeft: 8}}
							>
								<i className="material-icons" style={{fontSize: 30, verticalAlign: 'middle'}}>keyboard_arrow_left</i>
								章節
							</MenuItem>
							{
								this.state.chapters.map((chapterItem) => {
									var style = (this.state.viewingCID === chapterItem.cid) ? { backgroundColor: 'rgba(0, 0, 0, 0.098)' } : {}
									return(
										<MenuItem
											onClick={this.handleChapterClick(chapterItem)}
											style={style}
											innerDivStyle={{paddingLeft: 37}}
										>
											{chapterItem.title}
										</MenuItem>
									)
								})
							}
						</Drawer>
					</div>
					{ this.renderComicListView() }
				</div>
			</div>
		);
	}
}
