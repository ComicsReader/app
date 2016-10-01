import { Component, PropTypes } from 'react';

import Radium from 'radium';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ConfigActions from 'actions/ConfigActions';

import ComicBook from 'components/ComicBook';
import LoadIndicator from 'components/LoadIndicator';

const styles = {
	padding: '20px 20px 0',
	textAlign: 'center',
	height: 'calc(100% - 20px)'
};

@Radium
class ComicBookShelf extends Component {
	static propTypes = {
		/* general props */
		comics: PropTypes.array,
		onStarButtonClick: PropTypes.func,
		style: PropTypes.object,

		/* injected by redux */
		collections: PropTypes.object,
		addCollection: PropTypes.func,
		removeCollection: PropTypes.func,
		fetchCollections: PropTypes.func,
		turnOffFetchCollectionCallback: PropTypes.func,
		fetchRecentComic: PropTypes.func,
		turnOffFetchRecentComicCallback: PropTypes.func,
		fetchChapterCache: PropTypes.func,

		/* control whether LoadIndicator would show */
		isLoading: PropTypes.bool,
		showLoadingWhileEmpty: PropTypes.bool,
		showStarButton: PropTypes.bool
	}

	static defaultProps = {
		showLoadingWhileEmpty: true,
		isLoading: false,
		showStarButton: true
	};

	componentDidMount() {
		this.props.fetchCollections();
		this.props.fetchRecentComic();
		this.props.fetchChapterCache();
	}

	componentWillUnmount() {
		this.props.turnOffFetchCollectionCallback();
		this.props.turnOffFetchRecentComicCallback();
	}

	isStarred = (comic) => {
		return typeof this.props.collections[comic.comicID] === 'object';
	}

	toggleCollection = (comic) => {
		if (this.isStarred(comic)) {
			return () => {
				this.props.removeCollection(comic.comicID);
			};
		} else {
			return () => {
				this.props.addCollection(comic);
			};
		}
	}

	onStarButtonClick = (comic) => {
		const { onStarButtonClick } = this.props;
		if (typeof onStarButtonClick !== 'undefined') {
			return onStarButtonClick(comic);
		} else {
			return this.toggleCollection(comic);
		}
	}

	render() {
		const {
			comics,
			showLoadingWhileEmpty,
			isLoading,
			showStarButton
		} = this.props;

		return(
			<div style={[styles, this.props.style]}>
				{
					comics.map(comic => {
						return(
							<ComicBook
								{...comic}
								key={comic.comicID}
								onStarButtonClick={this.onStarButtonClick(comic)}
								starred={this.isStarred(comic)}
								showStarButton={showStarButton}
							/>
						);
					})
				}
				{ (showLoadingWhileEmpty && isLoading) ? <LoadIndicator style={{height: 100}}/> : null }
			</div>
		);
	}
}

export default connect(state => {
	/* map state to props */
	return {
		collections: state.config.collections,
		recentComics: state.config.recentComics
	};
}, dispatch => {
	/* map dispatch to props */
	return(bindActionCreators(ConfigActions, dispatch));
})(ComicBookShelf);
