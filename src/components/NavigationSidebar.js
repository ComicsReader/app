import {
	Component,
	PropTypes
} from 'react';
import { connect } from 'react-redux';
import { goBack } from 'react-router-redux';
import Radium from 'radium';

import { grey800, grey50, grey500 } from 'material-ui/styles/colors';

import Icon from 'components/Icon';

import * as t from 'constants/ActionTypes';

const styles = {
	iconStyle: {
		fontSize: '1.8em',
		verticalAlign: 'middle',
		margin: '20% auto',
		color: grey500,
		cursor: 'default',
		':hover': {
			color: 'white'
		}
	},
	iconHighlighted: {
		color: 'white'
	},
	menuItem: {color: grey50, paddingLeft: 10, lineHeight: '60px'},
	seperator: {
		color: grey500,
		border: 'solid 1px',
		borderBottomWidth: '0px',
		width: '80%',
		margin: '12px auto'
	},
	navigationSidebar: {
		position: 'fixed',
		height: '100%',
		width: 60,
		left: 0,
		backgroundColor: grey800,
		display: 'flex',
		paddingTop: '1em',
		flexDirection: 'column',
		justifyContent: 'space-between',
		zIndex: 9999,
		WebkitAppRegion: 'drag',
		WebkitUserSelect: 'none',
		borderStyle: 'solid',
		borderWidth: '0 1px 0 0',
		borderColor: '#505050',
		boxShadow: '1px 1px 30px rgba(31, 31, 31, 0.48)',
		boxSizing: 'border-box'
	},
	navigationGroup: {
		display: 'flex',
		flexDirection: 'column'
	}
};

@Radium
class NavigationSidebar extends Component {
	static propTypes = {
		/* injected by redux */
		drawerOpen: PropTypes.bool,
		readingChapterID: PropTypes.string,
		dispatch: PropTypes.func,
		location: PropTypes.string,

		highlightTag: PropTypes.string
	}

	navigateTo = (pathname) => {
		return () => {
			this.props.dispatch({type: t.NAVIGATE, pathname: pathname});
		};
	}

	onRequestChange = (drawerOpen) => {
		const { dispatch } = this.props;
		dispatch({type: t.CHANGE_DRAWER_STATE, drawerOpen});
	}

	highlightStyle = (tag) => {
		const { highlightTag } = this.props;

		return tag === highlightTag ? styles.iconHighlighted : null;
	}

	toggleToolbar = () => {
		this.props.dispatch({type: t.TOGGLE_TOOLBAR});
		this.props.dispatch({type: t.RESET_TOOLBAR_POSITION});
	}

	navigateBack = () => {
		this.props.dispatch(goBack());
	}

	isReaderMode = () => {
		return !!location.toString().match(/\/reader\//);
	}

	render() {
		const { readingChapterID } = this.props;

		const navigationStyle = process.platform === 'darwin' ? {
			...styles.navigationSidebar,
			paddingTop: '2em',
			height: '100%',
			width: 75
		} : styles.navigationSidebar;

		return(
			<div style={navigationStyle}>
				<div style={styles.navigationGroup}>
					{
						(typeof readingChapterID !== 'undefined' && readingChapterID) ?
							<Icon
								iconName="insert_photo"
								style={[styles.iconStyle, this.highlightStyle('reader')]}
								onClick={this.navigateTo(`/reader/dm5/${readingChapterID}`)}
							/> :
							<Icon
								iconName="insert_photo"
								style={[styles.iconStyle, this.highlightStyle('reader')]}
							/>
					}
					<Icon
						iconName="search"
						style={[styles.iconStyle, this.highlightStyle('search')]}
						onClick={this.navigateTo('/explore')}
					/>
					<Icon
						iconName="library_books"
						style={[styles.iconStyle, this.highlightStyle('collection')]}
						onClick={this.navigateTo('/collection?tab=collection')}
					/>
					<Icon iconName="info" style={styles.iconStyle} />
					<div style={styles.seperator} />
					<Icon
						iconName="keyboard_backspace"
						style={styles.iconStyle}
						onClick={this.navigateBack}
					/>
				</div>
				{
					this.isReaderMode() ?
						<div style={styles.navigationGroup}>
							<Icon
								iconName="input"
								style={styles.iconStyle}
								onClick={this.toggleToolbar}
							/>
						</div>
						: null
				}
			</div>
		);
	}
}

export default connect(state => {
	return({
		readingChapterID: state.comics.readingChapterID
	});
})(NavigationSidebar);
