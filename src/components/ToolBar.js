import React, { Component, PropTypes } from 'react';
import Draggable from 'react-draggable';
import { grey800, grey900, grey500 } from 'material-ui/styles/colors';

import Icon from 'components/Icon';

const styles = {
	container: {
		position: 'fixed',
		backgroundColor: grey800,
		maxWidth: 500,
		borderColor: grey900,
		borderStyle: 'solid',
		borderWidth: '.5px',
		display: 'flex',
		bottom: '1em',
		padding: 1,
		zIndex: 9999,
		WebkitUserSelect: 'none'
	},
	iconStyle: {
		margin: '0 0.06em',
		color: grey500,
		cursor: 'pointer',
		fontSize: '2em',
		':hover': {
			color: 'white'
		}
	}
};

export default class ToolBar extends Component {
	static propTypes = {
		loadNextChapter: PropTypes.func,
		loadPreviousChapter: PropTypes.func,

		increaseZoomRate: PropTypes.func,
		decreaseZoomRate: PropTypes.func,
		resetZoomRate: PropTypes.func
	}

	render() {
		const {
			loadPreviousChapter,
			loadNextChapter,
			increaseZoomRate,
			decreaseZoomRate,
			resetZoomRate
		} = this.props;

		return(
			<Draggable>
				<div className="toolbar" style={styles.container}>
					<Icon
						iconName="navigate_before"
						style={styles.iconStyle}
						onClick={loadPreviousChapter}
					/>
					<Icon
						iconName="navigate_next"
						style={styles.iconStyle}
						onClick={loadNextChapter}
					/>
					<Icon
						iconName="zoom_in"
						style={styles.iconStyle}
						onClick={increaseZoomRate}
					/>
					<Icon
						iconName="zoom_out"
						style={styles.iconStyle}
						onClick={decreaseZoomRate}
					/>
					<Icon
						iconName="aspect_ratio"
						style={styles.iconStyle}
						onClick={resetZoomRate}
					/>
					<Icon
						iconName="open_with"
						style={[styles.iconStyle]}
					/>
				</div>
			</Draggable>
		);
	}
}
