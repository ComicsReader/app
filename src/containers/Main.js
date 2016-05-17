import React, {
  Component
} from 'react';
import { AppBar, Drawer, MenuItem } from 'material-ui';
import { grey800 } from 'material-ui/styles/colors';
import Waypoint from 'react-waypoint';

import DM5 from '../comics/dm5';
import ComicImage from '../components/ComicImage';

export default class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      chapterTitle: null,
      comicName: null,
      appBarTitle: "Loading...",
      chapters: [],
      images: [],
      curChapterIndex: 0,
      isLoading: false
    };
  }

  async componentDidMount() {
    // m251123, m144591, m4866
    this.dm5 = new DM5('m144591');
    var chapters = await (this.dm5.getChapters());

    this.setState({
      chapters,
      appBarTitle: this.dm5.comicName,
      comicName: this.dm5.comicName
    });

    // load latest chapter when tabs open
    this.setState({
      isLoading: true,
      chapterTitle: chapters[0].title,
      appBarTitle: `${this.state.comicName} - ${chapters[0].title}`
    })
    this.loadChapter(chapters[0].cid, () => {
      this.setState({isLoading: false})
    });
  }

  renderWaypoint() {
    if (!this.state.isLoading) {
      return (
        <Waypoint
          onEnter={this.loadNextChapter}
          onLeave={() => { console.log("way point leave!!!!") }}
          threshold={2.0}
        />
      );
    }
  }

  loadNextChapter = () => {
    console.log("waypoint enter!")
    if (!this.state.isLoading && this.state.curChapterIndex > 0) {
      console.log("not loading...")
      this.setState({
        isLoading: true,
        curChapterIndex: this.state.curChapterIndex - 1
      })
      this.loadChapter(this.state.chapters[this.state.curChapterIndex].cid, () => {
        this.setState({isLoading: false})
      });
    }
    console.log("is loading!")
  }

  handleToggle = () => {
    this.setState({drawerOpen: !this.state.drawerOpen});
  }

  handleChapterClick = (chapterItem, chapterIndex) => {
    return () => {
      this.setState({
        chapterTitle: chapterItem.title,
        appBarTitle: `${this.state.comicName} - ${chapterItem.title}`,
        drawerOpen: !this.state.drawerOpen,
        images: [],
        curChapterIndex: chapterIndex
      });

      this.loadChapter(chapterItem.cid);
    }
  }

  loadChapter = (cid, callback=null) => {
    this.dm5.fetchImagesCount(cid).then(count => {
      // var currentImageLength = this.state.images.length;
      var currentImages = this.state.images;
      this.setState({
        images: [...this.state.images, ...(new Array(count).fill(""))]
      });
      if (callback) { callback() }

      this.dm5.getChapterImages(cid, images => {
        var notLoadedCount = count - images.length
        var empty = new Array(notLoadedCount).fill("")
        this.setState({images: [...currentImages, ...images, ...empty]});
      });
    })
  }

  render() {
    return(
      <div>
        <AppBar
          title={this.state.appBarTitle}
          style={{backgroundColor: grey800, position: 'fixed'}}
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          onLeftIconButtonTouchTap={this.handleToggle}
        />
        <Drawer
          open={this.state.drawerOpen}
          docked={false}
          onRequestChange={(drawerOpen) => this.setState({drawerOpen})}
        >
          {
            this.state.chapters.map((i, chapterItem) => {
              var style = (this.state.curChapterIndex == i) ? { backgroundColor: 'rgba(0, 0, 0, 0.098)' } : {}
              return(
                <MenuItem
                  key={i}
                  onClick={this.handleChapterClick(chapterItem, i)}
                  style={style}
                >
                  {chapterItem.title}
                </MenuItem>
              )
            })
          }
        </Drawer>
        <div style={{paddingTop: 80}}>
          {
            this.state.images.map((image) => {
              return(
                <ComicImage image={image} />
              );
            })
          }
          { this.renderWaypoint() }
        </div>
      </div>
    );
  }
}
