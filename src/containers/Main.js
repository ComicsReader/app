import React, {
  Component
} from 'react';
import { AppBar, Drawer, MenuItem } from 'material-ui';
import { grey800 } from 'material-ui/styles/colors';

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
      images: []
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
  }

  handleToggle = () => {
    this.setState({drawerOpen: !this.state.drawerOpen});
  }

  handleChapterClick = (chapterItem) => {
    return () => {
      this.setState({
        chapterTitle: chapterItem.title,
        appBarTitle: `${this.state.comicName} - ${chapterItem.title}`,
        drawerOpen: !this.state.drawerOpen,
        images: []
      });

      this.dm5.fetchImagesCount(chapterItem.cid).then(count => {
        this.setState({images: new Array(count).fill("")});

        this.dm5.getChapterImages(chapterItem.cid, images => {
          var notLoadedCount = count - images.length
          var empty = new Array(notLoadedCount).fill("")
          this.setState({images: [...images, ...empty]});
        });
      })
    }
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
              return(<MenuItem key={i} onClick={this.handleChapterClick(chapterItem)}>{chapterItem.title}</MenuItem>)
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
        </div>
      </div>
    );
  }
}
