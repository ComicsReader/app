import {
  Component,
  PropTypes
} from 'react';

import Waypoint from 'react-waypoint';
import ComicImage from './ComicImage';
import LoadIndicator from './LoadIndicator';

// var comicImages = {
//   "12345": { // cid
//     count: 20,
//     images: [
//       "fghjmnm,..png",
//       "fghjmnm,..png",
//       "fghjmnm,..png"
//     ]
//   }
// }

// var chapters = {
//   "manhua-yiquanchaoren": [
//     {
//       title: "rtyukjkl"
//       link: "sfdafg"
//       cid: "asdfasdf",
//       next: "12333",
//       previous: null
//     },
//     {
//       title: "rtyukjkl"
//       link: "sfdafg"
//       cid: "12333"
//     }
//   ]
// }

export default class ChapterListView extends Component {
  static propTypes = {
    comicManager: PropTypes.object.isRequired,
    viewingCID: PropTypes.string,
    onChaptersLoaded: PropTypes.func,
    onViewingChapterChanged: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      chapters: {},
      viewingCID: null,
      viewingChapters: [], // visible chapters
      comicImages: {} // TODO: load from storage
    }
  }

  componentDidMount() {
    this.initialize();
  }

  componentWillReceiveProps(nextProps) {
    // * comics changes <=> comic manager changes
    // * chapter changes(new chapterID from parent component)
    // * refetch chpater info
    // * handle chapter name changed
    const {
      viewingCID,
      comicManager
    } = nextProps;

    // viewing chapters changes
    if (typeof viewingCID !== 'undefined'
        && this.state.viewingCID
        && viewingCID !== this.state.viewingCID
        ) {
      var viewingChapters = [
          this.filterChapter(this.state.chapters[comicManager.comicID], viewingCID)
        ];
      this.setState({
        viewingChapters: viewingChapters
      })
      this.onViewingChapterChanged(viewingChapters[0])

      var comicImages = {...this.state.comicImages};
      var cid = viewingChapters[0].cid;
      comicManager.getChapterImages(cid).then(images => {
        comicImages[cid] = {...comicImages[cid], images: images}
        this.setState({
          comicImages: comicImages
        })
      });
    }
  }

  initialize = async () => {
    const { comicManager, viewingCID } = this.props;

    var chapters = await (comicManager.getChapters());
    var chapterObject = {[comicManager.comicID]: chapters};
    var viewingChapters = (typeof viewingCID !== 'undefined' && viewingCID) ? [this.filterChapter(chapters, viewingCID)] : [chapters[0]];
    var cid = viewingChapters[0].cid;

    this.onChaptersLoaded(chapters);
    this.onViewingChapterChanged(viewingChapters[0]);

    comicManager.getChapterImages(cid).then(images => {
      var comicImages = {...this.state.comicImages};
      comicImages[cid] = {...comicImages[cid], images: images};
      this.setState({
        viewingChapters: viewingChapters,
        chapters: chapterObject,
        comicImages: comicImages
      })
    });
  }

  filterChapter(chapters, cid) {
    if (typeof chapters === 'undefined') { console.log("heyyyyy") }
    return chapters.find(c => c.cid === cid)
  }

  onChaptersLoaded = (chapters) => {
    const { onChaptersLoaded } = this.props;
    if (typeof onChaptersLoaded !== 'undefined' && onChaptersLoaded) {
      onChaptersLoaded(chapters)
    }
  }

  onViewingChapterChanged = (chapter) => {
    const { comicManager, onViewingChapterChanged } = this.props;
    if (typeof onViewingChapterChanged !== 'undefined') {
      onViewingChapterChanged(`${comicManager.comicName} - ${chapter.title}`, chapter.cid)
    }
    this.setState({
      viewingCID: chapter.cid
    })
  }

  onPreviousWaypointEnter = () => {
    // * fetch previous chapter if any
    // * handle chapter name changed
    // * keep current scrolling position (calculating new added images?)
    console.log("way point enter!!!!")
  }

  onPreviousWaypointLeave = () => {
    // * handle chapter name changed
  }

  onNextWaypointEnter = () => {
    console.log("way point enter!!!!")
  }

  onNextWaypointLeave = () => {

  }

  availableChapters = () => {
    const { comicManager } = this.props;
    return this.chapters[comicManager.comicID];
  }

  renderChapterComics = (chapter) => {
    return(
      <div>
        <Waypoint
          onEnter={this.onPreviousWaypointEnter}
          onLeave={() => { console.log("way point leave!!!!") }}
          threshold={2.6}
        />
        {
          this.state.comicImages[chapter.cid] ?
            this.state.comicImages[chapter.cid].images.map(image => {
              return(
                <ComicImage key={image} src={image}/>
              )
            })
            : <LoadIndicator />
        }
        <Waypoint
          onEnter={this.onNextWaypointEnter}
          onLeave={() => { console.log("way point leave!!!!") }}
          threshold={2.6}
        />
      </div>
    );
  }

  render() {
    return(
      <div>
        {
          (this.state.viewingChapters.length != 0) ?
            this.state.viewingChapters.map(chapter => {
              return(this.renderChapterComics(chapter))
            })
            : <LoadIndicator />
        }
      </div>
    );
  }
}
