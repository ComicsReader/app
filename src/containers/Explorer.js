import React, {
	Component
} from 'react';

import { Link } from 'react-router'

import TextField from 'material-ui/TextField';

import { grey800, grey50 } from 'material-ui/styles/colors';
import { AppBar, Drawer, MenuItem } from 'material-ui';

import DM5 from '../comics/dm5';
import SearchBar from '../components/SearchBar';

export default class Explorer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			comics: [],
			current_page: 1,
			total_page: 0
		}
	}

	componentDidMount() {
	}

	onSubmit = (value) => {
		DM5.search(value).then((r) => {
			this.setState({comics: r.comics, current_page: r.current_page, total_page: r.total_page})
		})
	}

	renderComic = (comic) => {
		return(
			<div>
				<img src={comic.cover_img} />
				<Link to={`/reader/dm5/${comic.latest_chapter}`}>{comic.comicName}</Link>
				{comic.comicID}
			</div>
		);
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
				<SearchBar onSubmit={this.onSubmit}/>
				</AppBar>

				<div style={{paddingTop: 80}}>
					{
						this.state.comics.map(comic => {
							return this.renderComic(comic)
						})
					}
				</div>
			</div>
		);
	}
}
