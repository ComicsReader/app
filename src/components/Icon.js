import {Component, PropTypes} from 'react';

import Radium from 'radium';

@Radium
export default class Icon extends Component {
	static propTypes = {
		style: PropTypes.object,
		iconName: PropTypes.string,
		onClick: PropTypes.func
	}

	render() {
		const {style, iconName, onClick} = this.props;

		return(
			<i className="material-icons" style={[style]} onClick={onClick}>{iconName}</i>
		);

	}
}
