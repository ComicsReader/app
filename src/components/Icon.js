import {Component, PropTypes} from 'react';

import Radium from 'radium';

@Radium
export default class Icon extends Component {
	static propTypes = {
		iconName: PropTypes.string,
		onClick: PropTypes.func,
		style: PropTypes.object
	}

	render() {
		const {style, iconName, onClick} = this.props;

		return(
			<div style={{textAlign: 'center'}}>
				<i className="material-icons" style={style} onClick={onClick}>{iconName}</i>
			</div>
		);

	}
}
