import {
	Component,
	PropTypes
} from 'react';

import { Link } from 'react-router';

const style = {
	container: {
		display: 'inline-block',
		padding: 10
	},
	book: {
		display: 'flex',
		flexDirection: 'column',
		textAlign: 'center'
	},
	link: {
		color: 'white',
		fontSize: 16,
		textDecoration: 'none'
	},
	image: {
		width: 195,
		height: 260
	}
};

export default class ComicBook extends Component {
	static propTypes = {
		coverImage: PropTypes.string,
		latestChapter: PropTypes.string,
		comicName: PropTypes.string
	}

	render() {
		const {
			coverImage,
			latestChapter,
			comicName
		} = this.props;

		return(
			<div style={style.container}>
				<div style={style.book}>
					<Link to={`/reader/dm5/${latestChapter}`}>
						<img src={coverImage} style={style.image}/>
					</Link>
					<Link to={`/reader/dm5/${latestChapter}`} style={style.link}>
						{comicName}
					</Link>
				</div>
			</div>
		);
	}
}
