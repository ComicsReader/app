import {
	Component,
	PropTypes
} from 'react';

import Radium from 'radium';

import { yellow500 } from 'material-ui/styles/colors';

import Icon from 'components/Icon';
import { Link } from 'react-router';

const styles = {
	container: {
		display: 'inline-block',
		padding: 10,
		WebkitAppRegion: 'no-drag'
	},
	book: {
		display: 'flex',
		flexDirection: 'column',
		textAlign: 'center'
	},
	link: {
		color: 'white',
		fontSize: 16,
		width: 195,
		textDecoration: 'none'
	},
	image: {
		width: 195,
		height: 260
	},
	starButton: {
		fontSize: '40px',
		cursor: 'pointer',
		color: yellow500
	},
	starred: {
		color: yellow500
	},
	starButtonContainer: {
		position: 'absolute',
		marginLeft: '150px'
	}
};

@Radium
export default class ComicBook extends Component {
	static propTypes = {
		coverImage: PropTypes.string,
		latestChapter: PropTypes.string,
		comicName: PropTypes.string,
		starred: PropTypes.bool,
		onStarButtonClick: PropTypes.func,

		showStarButton: PropTypes.bool
	}

	static defaultProps = {
		showStarButton: true
	}

	iconName = () => this.props.starred ? 'star' : 'star_border';

	iconStyle = () => this.props.starred ? styles.starred : { };

	renderStarButton = () => {
		const { onStarButtonClick } = this.props;

		return(
			<Icon
				iconName={this.iconName()}
				style={{
					...styles.starButton,
					...this.iconStyle()
				}}
				onClick={onStarButtonClick}
			/>
		);
	}

	render() {
		const {
			coverImage,
			latestChapter,
			comicName,
			showStarButton
		} = this.props;

		return(
			<div style={{...styles.container, WebkitUserSelect: 'none'}}>
				<div style={styles.starButtonContainer}>
					{ showStarButton ? this.renderStarButton() : null }
				</div>
				<div style={styles.book}>
					<Link to={`/reader/dm5/${latestChapter}`}>
						<img src={coverImage} style={styles.image}/>
					</Link>
					<Link to={`/reader/dm5/${latestChapter}`} style={styles.link}>
						{comicName}
					</Link>
				</div>
			</div>
		);
	}
}
