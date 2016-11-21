import React, {
	Component,
	PropTypes
} from 'react';

import Radium from 'radium';

import { MenuItem, Drawer } from 'material-ui';
import { grey800, grey50 } from 'material-ui/styles/colors';

import 'styles/UnreadDot.scss';

@Radium
export default class ChapterSidebar extends Component {
	static propTypes = {
		onChapterItemClick: PropTypes.func,
		chapters: PropTypes.array,
		drawerAutoClose: PropTypes.bool,
		isSelected: PropTypes.func,
		isUnread: PropTypes.func
	}

	static defaultProps = {
		drawerAutoClose: false
	}

	constructor(props) {
		super(props);
		this.state = {
			drawerOpen: false
		};
	}

	onChapterItemClick = (chapterItem) => {
		const { onChapterItemClick, drawerAutoClose } = this.props;
		return () => {
			if (drawerAutoClose) { this.setState({drawerOpen: false}); }

			onChapterItemClick(chapterItem)();
		};
	}

	toggleDrawer = () => {
		this.setState({drawerOpen: !this.state.drawerOpen});
	}

	render() {
		const { chapters, isSelected, isUnread } = this.props;

		return(
			<Drawer
				open={this.state.drawerOpen}
				docked={true}
				openSecondary={true}
				containerStyle={{marginTop: 80, height: 'calc(100% - 96px)', width: 300, WebkitUserSelect: 'none'}}
			>
				<MenuItem
					style={{backgroundColor: grey800, color: grey50, height: 64, fontSize: 24, paddingTop: '.5rem'}}
					onClick={this.toggleDrawer}
					innerDivStyle={{paddingLeft: 8}}
				>
					<i className="material-icons" style={{fontSize: 30, verticalAlign: 'middle'}}>keyboard_arrow_left</i>
					章節
				</MenuItem>
				<div style={{height: 'calc(100% - 65px)', overflowY: 'scroll', overflowX: 'hidden'}}>
					{
						chapters.map((chapterItem, index) => {
							var style = isSelected(chapterItem) ? { backgroundColor: 'rgba(0, 0, 0, 0.098)' } : {};
							var dotStyle = isUnread(chapterItem) ? { color: '#ababab', background: '#ababab' } : {};

							return(
								<MenuItem
									onClick={this.onChapterItemClick(chapterItem)}
									style={style}
									innerDivStyle={{paddingLeft: 17}}
									key={`chapter_item_${chapterItem.chapterID}_${index}`}
								>
									<div className="unread-dot" style={dotStyle} />
									{chapterItem.title}
								</MenuItem>
							);
						})
					}
				</div>
			</Drawer>
		);
	}
}
