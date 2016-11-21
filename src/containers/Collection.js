import { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import DocumentTitle from 'react-document-title';

import { grey800 } from 'material-ui/styles/colors';
import { Dialog, FlatButton, RaisedButton } from 'material-ui';
import { Tabs, Tab } from 'material-ui/Tabs';

import NavigationSidebar from 'components/NavigationSidebar';
import ComicBookShelf from 'components/ComicBookShelf';

import * as ConfigActions from 'actions/ConfigActions';
import { NAVIGATE } from 'constants/ActionTypes';
import { toggleAppDrawer } from 'actions/UIActions';

class Collection extends Component {
	static propTypes = {
		/* injected by redux */
		dispatch: PropTypes.func,

		collections: PropTypes.object,
		removeCollection: PropTypes.func,
		recentComics: PropTypes.object,
		tabValue: PropTypes.string
	}

	constructor(props) {
		super(props);
		this.state = {
			modalOpen: false
		};
	}

	componentDidMount() {
		if (typeof this.props.tabValue === 'undefined') {
			this.props.dispatch({
				type: NAVIGATE,
				pathname: '/collection?tab=collection'
			});
		}
	}

	handleClose = () => {
		this.setState({modalOpen: false});
	};

	onLeftIconButtonTouchTap = () => {
		this.props.dispatch(toggleAppDrawer());
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

	handleChange = (value) => {
		this.props.dispatch({
			type: NAVIGATE,
			pathname: `/collection?tab=${value}`
		});
	}

	getDocumentTitle = () => {
		switch(this.props.tabValue) {
		case 'recentComics':
			return('Recent Comics | ComicsReader');
		default:
			return('Collection | ComicsReader');
		}
	}

	render() {
		return(
			<DocumentTitle title={this.getDocumentTitle()}>
				<div style={{height: '100%', overflow: 'hidden', paddingLeft: 60}}>
					<NavigationSidebar highlightTag="collection" />

					<Dialog
						title="Remove Collection?"
						actions={this.modalActions()}
						modal={false}
						open={this.state.modalOpen}
						onRequestClose={this.handleClose}
					>
						你確定要移除 { this.state.comic && this.state.comic.comicName } 的收藏嗎？
					</Dialog>

					<Tabs
						value={this.props.tabValue}
						onChange={this.handleChange}
						contentContainerStyle={{position: 'fixed', height: 'calc(100% - 48px)', overflowY: 'scroll', width: '100%'}}
						tabItemContainerStyle={{WebkitAppRegion: 'drag', WebkitUserSelect: 'none'}}
					>
						<Tab
							label="Collection"
							value="collection"
							style={{backgroundColor: grey800}}
						>
							<ComicBookShelf
								comics={
									Object.keys(this.props.collections)
										.map(comicID => this.props.collections[comicID])
										.sort((a, b) => b.updated_at - a.updated_at)
									}
								onStarButtonClick={this.onStarButtonClick}
								style={{padding: '20px 20px 0'}}
							/>
						</Tab>
						<Tab
							label="Recent Comics"
							value="recentComics"
							style={{backgroundColor: grey800}}
						>
							<ComicBookShelf
								comics={
									Object.keys(this.props.recentComics)
										.map(comicID => this.props.recentComics[comicID])
										.sort((a, b) => b.last_read_at - a.last_read_at)
									}
								showStarButton={false}
								style={{padding: '20px 20px 0'}}
							/>
						</Tab>
					</Tabs>
				</div>
			</DocumentTitle>
		);
	}
}

export default connect((state, ownProps) => {
	return {
		collections: state.config.collections,
		recentComics: state.config.recentComics,
		tabValue: ownProps.location.query.tab
	};
}, dispatch => {
	return({...bindActionCreators(ConfigActions, dispatch), dispatch});
})(Collection);
