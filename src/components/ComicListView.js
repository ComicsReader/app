import {
	Component,
	PropTypes
} from 'react';

import ComicImage from './ComicImage';
import ChapterSeperator from './ChapterSeperator';
import LoadIndicator from './LoadIndicator';

export default class ComicListView extends Component {
	static propTypes = {
		comicManager: PropTypes.func,
		comicImages: PropTypes.array
	}

	renderChapterComics = (chapterImages) => {
		if (chapterImages.length == 0) {
			return(<LoadIndicator />);
		} else {
			return(
				<div>
					{
						chapterImages.map(image => {
							return(<ComicImage key={image} src={image} />);
						})
					}
					<ChapterSeperator />
				</div>
			);
		}
	}

	render() {
		const { comicImages } = this.props;

		if (comicImages.length == 0) {
			return(<LoadIndicator />);
		} else {
			return(
				<div>
					{ comicImages.map(this.renderChapterComics) }
				</div>
			);
		}
	}
}
