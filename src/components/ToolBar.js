import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import Draggable from 'react-draggable';
import { grey800, grey500 } from 'material-ui/styles/colors';

import Icon from 'components/Icon';

const styles = {
	container: {
		position: 'fixed',
		backgroundColor: grey800,
		maxWidth: 500,
		borderColor: '#505050',
		borderStyle: 'solid',
		borderWidth: '.5px',
		display: 'flex',
		bottom: '1em',
		padding: 1,
		zIndex: 9999,
		boxShadow: '1px 1px 1em rgba(0, 0, 0, 0.45)',
		WebkitUserSelect: 'none',
		WebkitAppRegion: 'no-drag'
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

@Radium
export default class ToolBar extends Component {
	static propTypes = {
		loadNextChapter: PropTypes.func,
		loadPreviousChapter: PropTypes.func,

		increaseZoomRate: PropTypes.func,
		decreaseZoomRate: PropTypes.func,
		resetZoomRate: PropTypes.func,

		position: PropTypes.object,
		show: PropTypes.bool
	}

	static defaultProps = {
		show: true
	}

	constructor(props) {
		super(props);

		this.state = {
			position: null
		};
	}

	componentWillReceiveProps(nextProps) {
		const { position } = nextProps;

		if (position) {
			this.setState({
				position: position
			});
		}
	}

	onDrag = (e, data) => {
		this.setState({
			position: {
				x: data.x,
				y: data.y
			}
		});
	}

	render() {
		const {
			loadPreviousChapter,
			loadNextChapter,
			increaseZoomRate,
			decreaseZoomRate,
			resetZoomRate,
			show
		} = this.props;

		const displayStyle = show ? {} : {
			display: 'none'
		};

		return(
			<Draggable
				position={this.state.position}
				onDrag={this.onDrag}
			>
				<div className="toolbar" style={[styles.container, displayStyle]}>
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
