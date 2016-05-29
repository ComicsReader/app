import React, {
	Component
} from 'react';

import TextField from 'material-ui/TextField';

import { grey800, grey50 } from 'material-ui/styles/colors';
import { AppBar, Drawer, MenuItem } from 'material-ui';

export default class Explorer extends Component {
	render() {
		return(
			<div>
				<AppBar
					title="Explore"
					style={{backgroundColor: grey800, position: 'fixed'}}
					// iconElementRight={<Link to="/"><FlatButton label="收藏" /></Link>}
					// iconElementRight={ <i className="material-icons md-36">face</i> }
					// onLeftIconButtonTouchTap={this.handleToggle}
				>
				<TextField
		      hintText="Hint Text"
		    />
				</AppBar>
			</div>
		);
	}
}
