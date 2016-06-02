import {
	Component
} from 'react';

import { Link } from 'react-router';

import TextField from 'material-ui/TextField';

import { grey800, grey50 } from 'material-ui/styles/colors';
import { AppBar, Drawer, MenuItem } from 'material-ui';

import DM5 from '../comics/dm5';
import SearchBar from '../components/SearchBar';
import ComicBook from '../components/ComicBook';
import LoadIndicator from '../components/LoadIndicator';

export default class Explorer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			comics: [],
			current_page: 1,
			total_page: 0,
			isLoading: false
		};
	}

	componentDidMount() {
		this.onSubmit('美');
	}

	onSubmit = (value) => {
		this.setState({isLoading: true});
		DM5.search(value).then(r => {
			this.setState({
				comics: r.comics,
				current_page: r.current_page,
				total_page: r.total_page
			});

			if (r.total_page > 1) {
				// var page_groups = [...Array(r.total_page - 1).keys()].map(i => i+2).reduce((prev, cur) => {
				// 	var cur_page = parseInt(cur / 5);
				// 	if (typeof prev[cur_page] === 'undefined') { prev[cur_page] = []; }
				// 	prev[cur_page] = [...prev[cur_page], cur];
				// 	return prev;
				// }, []);

				Promise.all([...Array(r.total_page - 1).keys()].map(i => i+2).map(page => DM5.search(value, page))).then(otherResults => {

					var comics = otherResults.reduce((prev, cur) => {
						return [...prev, ...cur.comics];
					}, []);

					this.setState({comics: [...r.comics, ...comics], current_page: r.current_page, total_page: r.total_page});
					this.setState({isLoading: false});
				});
			} else {
				this.setState({isLoading: false});
			}
		});
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

				<div style={{padding: '80px 8% 20px', textAlign: 'center'}}>
					{
						this.state.comics.map(comic => {
							return(<ComicBook {...comic} key={comic.comicID}/>);
						})
					}
					{ this.state.isLoading ? <LoadIndicator style={{height: 100}}/> : null }
				</div>
			</div>
		);
	}
}
