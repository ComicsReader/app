import { Component, PropTypes } from 'react';
import Radium from 'radium';

const styles = {
	imageStyle: {
		inactive: {
			opacity: 0
		},
		active: {
			opacity: 1,
			height: '100%'
		}
	},
	containerStyle: {
		inactive: {
			width: 700,
			height: 1000,
			borderWidth: 1,
			borderColor: 'white',
			borderStyle: 'solid'
		},
		active: {
			width: '100%',
			height: 'auto',
			borderWidth: 0
		}
	}
};

@Radium
export default class ComicImage extends Component {
	static propTypes = {
		src: PropTypes.string,
		style: PropTypes.object,
		zoomRate: PropTypes.number
	}

	constructor(props) {
		super(props);
		this.state = {
			style: styles.imageStyle.inactive,
			containerStyle: styles.containerStyle.inactive,
			width: 700,
			height: 1000
		};
	}

	componentWillReceiveProps(nextProps) {
		const { src } = nextProps;
		if (this.props.src !== src) {
			this.inactivate();
		}
	}

	activate = () => {
		this.setState({
			style: styles.imageStyle.active,
			containerStyle: styles.containerStyle.active
		});
	}

	inactivate = () => {
		this.setState({
			style: styles.imageStyle.inactive,
			containerStyle: styles.containerStyle.inactive
		});
	}

	onImageLoad = () => {
		if (this.refs.image.src && this.refs.image.src !== '') {
			this.activate();
		}
	}

	render() {
		const { src, style, zoomRate } = this.props;

		const zoomProperty = {
			width: `${100 + zoomRate}%`,
			maxWidth: `${100 + zoomRate}%`
		};

		return(
			<div style={{
				background: 'url(http://i.imgur.com/ybQEnOQ.gif) 50% no-repeat',
				margin: '0 auto 16px',
				WebkitAppRegion: 'drag',
				...this.state.containerStyle
			}}>
				<img
					src={src}
					ref='image'
					className="comic-image"
					style={[{
						display: 'block',
						position: 'relative',
						WebkitAppRegion: 'no-drag',
						zIndex: 2,
						margin: '0 auto 16px',
						maxWidth: '100%',
						transition: 'opacity .25s'
					}, this.state.style, zoomProperty, style]}
					onLoad={this.onImageLoad}
				/>
			</div>
		);
	}
}
