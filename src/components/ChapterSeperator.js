import {
	Component
} from 'react';

var styles = {
	textAlign: 'center',
	fontSize: '1.5rem',
	padding: '.5em 0',
	color: 'white'
}

export default class ChapterSeperator extends Component {
	render() {
		const { chapter } = this.props;

		return(
			<div style={styles}>
				-- { chapter } 結束 --
			</div>
		);
	}
}
