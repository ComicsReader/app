import {
	Component,
	PropTypes
} from 'react';

import Radium from 'radium';

@Radium
export default class LoadIndicator extends Component {
	static propTypes = {
		style: PropTypes.object
	}

	render() {
		return(
			<div
				style={[{
					width: '100%',
					height: 500,
					background: 'url(http://i.imgur.com/ybQEnOQ.gif) 50% no-repeat'
				}, this.props.style]}
			/>
		);
	}
}
