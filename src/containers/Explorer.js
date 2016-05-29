import React, {
	Component
} from 'react';

import TextField from 'material-ui/TextField';

import { grey800, grey50 } from 'material-ui/styles/colors';
import { AppBar, Drawer, MenuItem } from 'material-ui';

import DM5 from '../comics/dm5';
import SearchBar from '../components/SearchBar';

export default class Explorer extends Component {

	componentDidMount() {
		DM5.search("哈").then((r) => {
			console.log(r)
		})
	}

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
				<SearchBar onSubmit={(value) => console.log(value)}/>
				</AppBar>
			</div>
		);
	}
}
