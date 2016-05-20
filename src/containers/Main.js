import React, {
  Component
} from 'react';
import { AppBar, Drawer, MenuItem } from 'material-ui';
import { grey800 } from 'material-ui/styles/colors';
import Waypoint from 'react-waypoint';

import DM5 from '../comics/dm5';
import ComicImage from '../components/ComicImage';
import ComicListView from '../components/ComicListView';

export default class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      appBarTitle: "Loading...",
      chapters: [],
      isLoading: false,
      comicManager: null,
      viewingCID: null,
    };
  }

  async componentDidMount() {
    // m251123, m144591, m4866
    var dm5 = new DM5('m144591');
    this.setState({
      comicManager: dm5
    })
  }

  handleToggle = () => {
    this.setState({drawerOpen: !this.state.drawerOpen});
  }

  handleChapterClick = (chapterItem) => {
    return () => {
      this.setState({
        viewingCID: chapterItem.cid,
        drawerOpen: !this.state.drawerOpen
      })
    }
  }

  renderComicListView = () => {
    if (this.state.comicManager) {
      return(
        <ComicListView
          comicManager={this.state.comicManager}
          onChaptersLoaded={(chapters) => { this.setState({chapters}) }}
          onViewingChapterChanged={(title, cid) => { this.setState({appBarTitle: title, viewingCID: cid}) }}
          viewingCID={this.state.viewingCID}
        />
      )
    }
    return null;
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
            this.state.chapters.map((chapterItem) => {
              var style = (this.state.viewingCID === chapterItem.cid) ? { backgroundColor: 'rgba(0, 0, 0, 0.098)' } : {}
              return(
                <MenuItem
                  onClick={this.handleChapterClick(chapterItem)}
                  style={style}
                >
                  {chapterItem.title}
                </MenuItem>
              )
            })
          }
        </Drawer>
        <div style={{paddingTop: 80}}>
          { this.renderComicListView() }
        </div>
      </div>
    );
  }
}
