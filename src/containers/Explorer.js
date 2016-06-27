import {
	Component
} from 'react';

import { Link } from 'react-router';

import Radium from 'radium';
import Promise from 'bluebird';

import TextField from 'material-ui/TextField';
import { grey800, grey700, grey50 } from 'material-ui/styles/colors';
import { AppBar, Drawer, MenuItem } from 'material-ui';

import {comicManagers} from '../services';
import Icon from '../components/Icon';
import SearchBar from '../components/SearchBar';
import ComicBook from '../components/ComicBook';
import LoadIndicator from '../components/LoadIndicator';

const DM5 = comicManagers.dm5;

const styles = {
	iconStyle: {fontSize: 22, verticalAlign: 'middle', marginRight: 30}
};

@Radium
export default class Explorer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			comics: [],
			current_page: 1,
			total_page: 0,
			isLoading: false,
			drawerOpen: false
		};
	}

	componentDidMount() {
		this.onSubmit.bind(this)('美');
	}

	onSubmit = (value) => {
		this.setState({isLoading: true, comics: []});
		DM5.search(value).then(r => {
			this.setState({
				comics: r.comics,
				current_page: r.current_page,
				total_page: r.total_page
			});

			if (r.total_page > 1) {
				Promise.reduce([...Array(r.total_page - 1).keys()].map(i => i+2), (comics, page) => {
					return DM5.search(value, page).then(r => {
						var c = [...comics, ...r.comics];
						this.setState({comics: c, current_page: r.current_page, total_page: r.total_page});
						return c;
					});
				}, []).then(comics => {
					this.setState({comics: comics});
				});
				this.setState({isLoading: false});

			} else {
				this.setState({isLoading: false});
			}
		});
	}

	render() {
		return(
			<div style={{height: '100%', overflow: 'hidden'}}>
				<AppBar
					title="Explore"
					style={{backgroundColor: grey800, position: 'fixed'}}
					// iconElementRight={<Link to="/"><FlatButton label="收藏" /></Link>}
					// iconElementRight={ <i className="material-icons md-36">face</i> }
					onLeftIconButtonTouchTap={() => { this.setState({drawerOpen: !this.state.drawerOpen}); }}
				>
					<SearchBar onSubmit={this.onSubmit.bind(this)}/>
				</AppBar>

				<Drawer
					open={this.state.drawerOpen}
					containerStyle={{backgroundColor: grey800}}
					width={300}
					docked={false}
					onRequestChange={(drawerOpen) => this.setState({drawerOpen})}
					overlayStyle={{backgroundColor: 'transparent'}}
					style={{color: grey50}}
				>
					<MenuItem style={{color: grey50, paddingLeft: 10, lineHeight: '60px'}}>
						<Icon iconName="search" style={styles.iconStyle} />
							Search
					</MenuItem>
					<MenuItem style={{color: grey50, paddingLeft: 10, lineHeight: '60px'}}>
						<Icon iconName="history" style={styles.iconStyle} />
							Recent
					</MenuItem>
					<MenuItem style={{color: grey50, paddingLeft: 10, lineHeight: '60px'}}>
						<Icon iconName="library_books" style={styles.iconStyle} />
							Collection
					</MenuItem>
				</Drawer>

				<div style={{padding: '80px 20px 0', textAlign: 'center', height: 'calc(100% - 80px)', 'overflow-y': 'scroll'}}>
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
