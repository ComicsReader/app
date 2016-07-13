import {
	Component,
	PropTypes
} from 'react';

import { connect } from 'react-redux';

import { Drawer, MenuItem } from 'material-ui';
import { grey800, grey50, grey500 } from 'material-ui/styles/colors';

import Icon from 'components/Icon';

import * as t from 'constants/ActionTypes';
import {toggleAppDrawer} from 'actions/UIActions';

const styles = {
	iconStyle: {fontSize: 22, verticalAlign: 'middle', marginRight: 30},
	menuItem: {color: grey50, paddingLeft: 10, lineHeight: '60px'},
	seperator: {
		color: grey500,
		border: 'solid 0.5px',
		borderBottomWidth: '0px'
	}
};

class NavigationSidebar extends Component {
	static propTypes = {
		/* injected by redux */
		drawerOpen: PropTypes.bool,
		dispatch: PropTypes.func
	}

	navigateTo = (pathname) => {
		return () => {
			this.props.dispatch({type: t.NAVIGATE, pathname: pathname});
			this.props.dispatch(toggleAppDrawer());
		};
	}

	onRequestChange = (drawerOpen) => {
		const { dispatch } = this.props;
		dispatch({type: t.CHANGE_DRAWER_STATE, drawerOpen});
	}

	render() {
		const { drawerOpen } = this.props;

		return(
			<Drawer
				open={drawerOpen}
				containerStyle={{backgroundColor: grey800}}
				width={300}
				docked={false}
				onRequestChange={this.onRequestChange}
				overlayStyle={{backgroundColor: 'transparent'}}
				style={{color: grey50}}
			>
				<MenuItem
					style={styles.menuItem}
					onClick={this.navigateTo('/explore')}
				>
					<Icon iconName="search" style={styles.iconStyle} />
						Search
				</MenuItem>
				<MenuItem
					style={styles.menuItem}
					onClick={this.navigateTo('/collection?tab=collection')}
				>
					<Icon iconName="library_books" style={styles.iconStyle} />
						Collection & Recents
				</MenuItem>
				<div style={styles.seperator} />
				<MenuItem
					style={styles.menuItem}
					// onClick={null}
				>
					<Icon iconName="settings" style={styles.iconStyle} />
						Setting
				</MenuItem>
				<MenuItem
					style={styles.menuItem}
					// onClick={null}
				>
					<Icon iconName="info" style={styles.iconStyle} />
						About
				</MenuItem>
			</Drawer>
		);
	}
}

export default connect(state => {
	return {drawerOpen: state.uiState.drawerOpen};
})(NavigationSidebar);
