import {
	Component,
	PropTypes
} from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Radium from 'radium';

import { grey800, grey50 } from 'material-ui/styles/colors';
import { AppBar, Drawer, MenuItem } from 'material-ui';

import Icon from '../components/Icon';
import SearchBar from '../components/SearchBar';
import ComicBook from '../components/ComicBook';
import LoadIndicator from '../components/LoadIndicator';

import * as SearchActions from '../actions/SearchActions';

const styles = {
	iconStyle: {fontSize: 22, verticalAlign: 'middle', marginRight: 30}
};

@Radium
class Explorer extends Component {
	static propTypes = {
		/* injected by redux */
		comics: PropTypes.array,
		isLoading: PropTypes.bool,
		searchComics: PropTypes.func.isRequired,
		searchKeyword: PropTypes.string,
		currentPage: PropTypes.number
	}

	constructor(props) {
		super(props);
		this.state = {
			drawerOpen: false
		};
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
		const { searchKeyword, currentPage, isLoading } = this.props;
		if (document.body.scrollHeight - document.body.scrollTop < 1000 && !isLoading) {
			this.props.searchComics(searchKeyword, currentPage + 1);
		}
	}

	render() {
		const { comics, isLoading } = this.props;

		return(
			<div style={{height: '100%', overflow: 'hidden'}}>
				<AppBar
					title="Explore"
					style={{backgroundColor: grey800, position: 'fixed'}}
					// iconElementRight={<Link to="/"><FlatButton label="收藏" /></Link>}
					// iconElementRight={ <i className="material-icons md-36">face</i> }
					onLeftIconButtonTouchTap={() => { this.setState({drawerOpen: !this.state.drawerOpen}); }}
				>
					<SearchBar onSubmit={this.onSubmit}/>
				</AppBar>

				<Drawer
					open={this.state.drawerOpen}
					containerStyle={{backgroundColor: grey800}}
					width={300}
					docked={false}
					onRequestChange={(drawerOpen) => this.setState({drawerOpen})}
					overlayStyle={{backgroundColor: 'transparent'}}
					style={{color: grey50}}
				>
					<MenuItem style={{color: grey50, paddingLeft: 10, lineHeight: '60px'}}>
						<Icon iconName="search" style={styles.iconStyle} />
							Search
					</MenuItem>
					<MenuItem style={{color: grey50, paddingLeft: 10, lineHeight: '60px'}}>
						<Icon iconName="history" style={styles.iconStyle} />
							Recent
					</MenuItem>
					<MenuItem style={{color: grey50, paddingLeft: 10, lineHeight: '60px'}}>
						<Icon iconName="library_books" style={styles.iconStyle} />
							Collection
					</MenuItem>
				</Drawer>

				<div style={{padding: '80px 20px 0', textAlign: 'center', height: 'calc(100% - 80px)'}} ref="scrollContainerRef">
					{
						comics.map(comic => {
							return(<ComicBook {...comic} key={comic.comicID}/>);
						})
					}
					{ isLoading ? <LoadIndicator style={{height: 100}}/> : null }
				</div>
			</div>
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
	return(bindActionCreators(SearchActions, dispatch));
})(Explorer);
