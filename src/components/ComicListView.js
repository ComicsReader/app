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
    comicManager: PropTypes.object,
    viewingCID: PropTypes.string,
    onChaptersLoaded: PropTypes.func,
    onViewingChapterTitleChanged: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      chapters: {},
      viewingChapters: [], // visible chapters
      comicImages: {} // TODO: load from storage
    }
  }

  async componentDidMount() {
    const {
      comicManager,
      onChaptersLoaded, // parent build up menu items
      onViewingChapterTitleChanged, // parent change chapter name & highlight another menu item
      viewingCID
    } = this.props;

    var chapters = await (comicManager.getChapters());
    if (onChaptersLoaded) { onChaptersLoaded(chapters) }

    var chapterObject = {};
    chapterObject[comicManager.comicID] = chapters;

    var viewingChapters = (typeof viewingCID !== 'undefined' && viewingCID) ? [this.filterChapter(chapters, viewingCID)] : [chapters[0]];
    var cid = viewingChapters[0].cid;
    if (onViewingChapterTitleChanged) {
      onViewingChapterTitleChanged(`${comicManager.comicName} - ${viewingChapters[0].title}`)
    }

    comicManager.getChapterImages(cid).then(images => {
      var comicImages = {...this.state.comicImages};
      if (typeof comicImages[cid] === "undefined") { comicImages[cid] = {} };
      comicImages[cid]["images"] = images;
      this.setState({
        viewingChapters: viewingChapters,
        chapters: chapterObject,
        comicImages: comicImages
      })
    });
  }

  componentWillReceiveProps(nextProps) {
    // * comics changes <=> comic manager changes
    // * chapter changes(new chapterID from parent component)
    // * refetch chpater info
    // * handle chapter name changed
    const {
      viewingCID,
      comicManager,
      onViewingChapterTitleChanged
    } = nextProps;

    if (typeof viewingCID !== 'undefined' && viewingCID !== this.props.viewingCID) {
      var viewingChapters = [this.filterChapter(this.state.chapters[comicManager.comicID], viewingCID)];
      var cid = viewingChapters[0].cid;

      if (typeof onViewingChapterTitleChanged !== 'undefined') {
        onViewingChapterTitleChanged(`${comicManager.comicName} - ${viewingChapters[0].title}`)
      }

      var comicImages = {...this.state.comicImages};
      this.setState({
        viewingChapters: viewingChapters
      })

      comicManager.getChapterImages(cid).then(images => {
        if (typeof comicImages[cid] === "undefined") { comicImages[cid] = {} };
        comicImages[cid]["images"] = images;
        this.setState({
          comicImages: comicImages
        })
      });
    }
  }

  filterChapter(chapters, cid) {
    return chapters.find(c => c.cid === cid)
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
