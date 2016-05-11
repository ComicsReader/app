import React, {
  Component
} from 'react';
import { AppBar, Drawer, MenuItem } from 'material-ui';
import { grey800 } from 'material-ui/styles/colors';

import DM5 from '../comics/dm5';

export default class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      appBarTitle: "Title"
    };
  }

  componentDidMount() {
    window.dm5 = new DM5('m251123');
    window.dm5.getChapters();
  }

  handleToggle() {
    this.setState({drawerOpen: !this.state.drawerOpen});
  }

  render() {
    return(
      <div>
        <AppBar
          title={this.state.appBarTitle}
          style={{backgroundColor: grey800}}
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          onLeftIconButtonTouchTap={this.handleToggle.bind(this)}
        />
        <Drawer
          open={this.state.drawerOpen}
          docked={false}
          onRequestChange={(drawerOpen) => this.setState({drawerOpen})}
        >
          <MenuItem>Menu Item</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
        </Drawer>
      </div>
    );
  }
}
