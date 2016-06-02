import {
	Component
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
	render() {
		const {
			cover_img,
			latest_chapter,
			comicName
		} = this.props;

		return(
			<div style={style.container}>
				<div style={style.book}>
					<Link to={`/reader/dm5/${latest_chapter}`}>
						<img src={cover_img} style={style.image}/>
					</Link>
					<Link to={`/reader/dm5/${latest_chapter}`} style={style.link}>
						{comicName}
					</Link>
				</div>
			</div>
		);
	}
}
