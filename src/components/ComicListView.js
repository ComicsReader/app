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

	rowRenderer = ({index}) => {
		const { comicImages } = this.props;
		var image = comicImages[index];
		return <ComicImage key={image} src={image} />;
	}

	render() {
		const { comicImages } = this.props;

		/*
		<AutoSizer>
			{({ height, width }) => (
				<VirtualScroll
					// ref={registerChild}
					rowCount={comicImages.length}
					width={width}
					height={height}
					rowHeight={500}
					rowRenderer={this.rowRenderer}
				/>
			)}
		</AutoSizer>
		*/

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
