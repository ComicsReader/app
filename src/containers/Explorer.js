import {
	Component,
	PropTypes
} from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Radium from 'radium';

import DocumentTitle from 'react-document-title';

import SearchBar from 'components/SearchBar';
import NavigationSidebar from 'components/NavigationSidebar';
import ComicBookShelf from 'components/ComicBookShelf';

import * as t from 'constants/ActionTypes';
import * as SearchActions from 'actions/SearchActions';
import {toggleAppDrawer} from 'actions/UIActions';

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

	onSubmit = () => {
		this.props.searchComics();
	}

	loadMore = () => {
		const { searchKeyword, currentPage, isLoading, totalPage } = this.props;
		if (document.body.scrollHeight - document.body.scrollTop < 1000 && !isLoading) {
			if (totalPage && (currentPage + 1) <= totalPage || !totalPage) {
				this.props.searchComics(currentPage + 1);
			}
		}
	}

	onLeftIconButtonTouchTap = () => {
		this.props.dispatch(toggleAppDrawer());
	}

	getDocumentTitle = () => {
		const { searchKeyword, currentPage, totalPage } = this.props;
		return searchKeyword ? `${searchKeyword} - ${currentPage}/${totalPage} | ComicsReader` : 'Explore | ComicsReader';
	}

	onInputChange = (event) => {
		this.props.dispatch({type: t.UPDATE_SEARCH_KEYWORD, keyword: event.target.value});
	}

	render() {
		const { comics, isLoading, searchKeyword } = this.props;

		return(
			<DocumentTitle title={this.getDocumentTitle()}>
				<div style={{height: '100%', overflow: 'hidden', paddingLeft: 60}}>
					<NavigationSidebar highlightTag="search" />

					<div style={{padding: '10px 0', position: 'fixed', width: '100%', backgroundColor: '#2a2a2a', zIndex: 1}}>
						<SearchBar onSubmit={this.onSubmit} containerStyle={{display: 'block', margin: '10px auto 0'}} value={searchKeyword} onChange={this.onInputChange}/>
					</div>

					<ComicBookShelf
						comics={comics}
						isLoading={isLoading}
						style={{padding: '65px 20px 0 20px'}}
					/>

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
	return({
		...bindActionCreators(SearchActions, dispatch),
		dispatch
	});
})(Explorer);
