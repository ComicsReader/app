import {
	Component,
	PropTypes
} from 'react';

import { connect } from 'react-redux';

import { Drawer, MenuItem } from 'material-ui';
import { grey800, grey50 } from 'material-ui/styles/colors';

import Icon from 'components/Icon';

import * as t from 'constants/ActionTypes';
import {toggleAppDrawer} from 'actions/UIActions';

const styles = {
	iconStyle: {fontSize: 22, verticalAlign: 'middle', marginRight: 30}
};

class NavigationSidebar extends Component {
	static propTypes = {
		/* injected by redux */
		drawerOpen: PropTypes.bool,
		dispatch: PropTypes.func
	}

	onSearchClick = () => {
		this.props.dispatch({type: t.NAVIGATE, pathname: '/explore'});
		this.props.dispatch(toggleAppDrawer());
	}

	onCollectionClick = () => {
		this.props.dispatch({type: t.NAVIGATE, pathname: '/collection'});
		this.props.dispatch(toggleAppDrawer());
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
					style={{color: grey50, paddingLeft: 10, lineHeight: '60px'}}
					onClick={this.onSearchClick}
				>
					<Icon iconName="search" style={styles.iconStyle} />
						Search
				</MenuItem>
				<MenuItem style={{color: grey50, paddingLeft: 10, lineHeight: '60px'}}>
					<Icon iconName="history" style={styles.iconStyle} />
						Recent
				</MenuItem>
				<MenuItem
					style={{color: grey50, paddingLeft: 10, lineHeight: '60px'}}
					onClick={this.onCollectionClick}
				>
					<Icon iconName="library_books" style={styles.iconStyle} />
						Collection
				</MenuItem>
			</Drawer>
		);
	}
}

export default connect(state => {
	return {drawerOpen: state.uiState.drawerOpen};
})(NavigationSidebar);
