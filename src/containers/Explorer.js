import {
	Component,
	PropTypes
} from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Radium from 'radium';

import { grey800 } from 'material-ui/styles/colors';
import { AppBar} from 'material-ui';

import DocumentTitle from 'react-document-title';

import SearchBar from '../components/SearchBar';
import NavigationSidebar from '../components/NavigationSidebar';
import ComicBook from '../components/ComicBook';
import LoadIndicator from '../components/LoadIndicator';

import * as SearchActions from '../actions/SearchActions';
import {toggleAppDrawer} from '../actions/UIActions';

@Radium
class Explorer extends Component {
	static propTypes = {
		/* injected by redux */
		comics: PropTypes.array,
		isLoading: PropTypes.bool,
		searchComics: PropTypes.func.isRequired,
		searchKeyword: PropTypes.string,
		currentPage: PropTypes.number,
		totalPage: PropTypes.number,
		dispatch: PropTypes.func
	}

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		document.body.onscroll = this.loadMore;
	}

	componentWillUnmount() {
		document.body.onscroll = null;
	}

	onSubmit = (value) => {
		this.props.searchComics(value);
	}

	loadMore = () => {
		const { searchKeyword, currentPage, isLoading, totalPage } = this.props;
		if (document.body.scrollHeight - document.body.scrollTop < 1000 && !isLoading) {
			if (totalPage && (currentPage + 1) <= totalPage || !totalPage) {
				this.props.searchComics(searchKeyword, currentPage + 1);
			}
		}
	}

	onLeftIconButtonTouchTap = () => {
		this.props.dispatch(toggleAppDrawer());
	}

	getDocumentTitle = () => {
		const { searchKeyword, currentPage, totalPage } = this.props;
		return searchKeyword ? `${searchKeyword} - ${currentPage}/${totalPage} | ComicsReader` : 'Explorer | ComicsReader';
	}

	render() {
		const { comics, isLoading } = this.props;

		return(
			<DocumentTitle title={this.getDocumentTitle()}>
				<div style={{height: '100%', overflow: 'hidden'}}>
					<AppBar
						title="Explore"
						style={{backgroundColor: grey800, position: 'fixed'}}
						onLeftIconButtonTouchTap={this.onLeftIconButtonTouchTap}
					>
						<SearchBar onSubmit={this.onSubmit}/>
					</AppBar>

					<NavigationSidebar />

					<div style={{padding: '80px 20px 0', textAlign: 'center', height: 'calc(100% - 80px)'}} ref="scrollContainerRef">
						{
							comics.map(comic => {
								return(<ComicBook {...comic} key={comic.comicID}/>);
							})
						}
						{ isLoading ? <LoadIndicator style={{height: 100}}/> : null }
					</div>
				</div>
			</DocumentTitle>
		);
	}
}

export default connect(state => {
	/* map state to props */
	return {
		...state.searchState
	};
}, dispatch => {
	/* map dispatch to props */
	return({...bindActionCreators(SearchActions, dispatch), dispatch});
})(Explorer);
