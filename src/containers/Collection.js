import { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import DocumentTitle from 'react-document-title';

import { grey800 } from 'material-ui/styles/colors';
import { AppBar, Dialog, FlatButton, RaisedButton } from 'material-ui';

import NavigationSidebar from 'components/NavigationSidebar';
import ComicBook from 'components/ComicBook';

import * as ConfigActions from 'actions/ConfigActions';
import {toggleAppDrawer} from 'actions/UIActions';

class Collection extends Component {
	static propTypes = {
		/* injected by redux */
		dispatch: PropTypes.func,

		collections: PropTypes.object,
		addCollection: PropTypes.func,
		removeCollection: PropTypes.func,
		fetchCollections: PropTypes.func,
		turnOffFetchCollectionCallback: PropTypes.func
	}

	constructor(props) {
		super(props);
		this.state = {
			modalOpen: false
		};
	}

	componentDidMount() {
		this.props.fetchCollections();
	}

	componentWillUnmount() {
		this.props.turnOffFetchCollectionCallback();
	}

	handleClose = () => {
		this.setState({modalOpen: false});
	};

	onLeftIconButtonTouchTap = () => {
		this.props.dispatch(toggleAppDrawer());
	}

	isStarred = (comic) => {
		return typeof this.props.collections[comic.comicID] === 'object';
	}

	removeCollection = (comic) => {
		return () => {
			this.props.removeCollection(comic.comicID, () => {
				this.handleClose();
			});
		};
	}

	modalActions = () => {
		const { comic } = this.state;

		return [
			<FlatButton
				label="Cancel"
				primary={true}
				onTouchTap={this.handleClose}
			/>,
			<RaisedButton
				label="Remove"
				secondary={true}
				onTouchTap={comic && this.removeCollection(comic)}
			/>
		];
	};

	onStarButtonClick = (comic) => {
		return () => {
			this.setState({modalOpen: true, comic: comic});
		};
	}

	render() {
		return(
			<DocumentTitle title="Collections | ComicsReader">
				<div style={{height: '100%', overflow: 'hidden'}}>
					<AppBar
						title="Collection"
						style={{backgroundColor: grey800, position: 'fixed'}}
						onLeftIconButtonTouchTap={this.onLeftIconButtonTouchTap}
					>
					</AppBar>

					<NavigationSidebar />

					<Dialog
						title="Remove Collection?"
						actions={this.modalActions()}
						modal={false}
						open={this.state.modalOpen}
						onRequestClose={this.handleClose}
					>
						你確定要移除 { this.state.comic && this.state.comic.comicName } 的收藏嗎？
					</Dialog>

					<div style={{padding: '80px 20px 0', textAlign: 'center', height: 'calc(100% - 80px)'}}>
						{
							Object.keys(this.props.collections)
								.map(comicID => this.props.collections[comicID])
								.sort((a, b) => b.updated_at - a.updated_at)
								.map(comic => {
									return(
										<ComicBook
											{...comic}
											key={comic.comicID}
											onStarButtonClick={this.onStarButtonClick(comic)}
											starred={this.isStarred(comic)}
										/>
									);
								}
							)
						}
					</div>
				</div>
			</DocumentTitle>
		);
	}
}

export default connect(state => {
	return {
		collections: state.config.collections
	};
}, dispatch => {
	return({...bindActionCreators(ConfigActions, dispatch), dispatch});
})(Collection);
