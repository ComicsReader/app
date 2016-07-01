import {Component, PropTypes} from 'react';

import Radium from 'radium';

@Radium
export default class Icon extends Component {
	static propTypes = {
		style: PropTypes.object,
		iconName: PropTypes.string
	}

	render() {
		const {style, iconName} = this.props;

		return(
			<i className="material-icons" style={style}>{iconName}</i>
		);

	}
}
