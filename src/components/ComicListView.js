import {
	Component,
	PropTypes
} from 'react';

import ComicImage from './ComicImage';
import LoadIndicator from './LoadIndicator';

import RaisedButton from 'material-ui/RaisedButton';
import { grey900, grey50 } from 'material-ui/styles/colors';

export default class ComicListView extends Component {
	static propTypes = {
		comicManager: PropTypes.func,
		comicImages: PropTypes.array,
		loadNextChapter: PropTypes.func,
		loadPreviousChapter: PropTypes.func,
		hasNextChapter: PropTypes.bool,
		hasPrevioushapter: PropTypes.bool,
		zoomRate: PropTypes.number
	}

	renderChapterComics = (chapterImages, index) => {
		if (chapterImages.length == 0) {
			return(<LoadIndicator />);
		} else {
			const {
				loadNextChapter,
				hasNextChapter,
				zoomRate
			} = this.props;

			return(
				<div key={index}>
					{
						chapterImages.map(image => {
							return(<ComicImage key={image} src={image} zoomRate={zoomRate} />);
						})
					}
					{ hasNextChapter ? <RaisedButton label="載入下一章" fullWidth={true} onClick={loadNextChapter} backgroundColor={grey900} labelColor={grey50} labelStyle={{fontSize: '1.3em'}} style={{height: '2.2em'}}/> : null }
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
