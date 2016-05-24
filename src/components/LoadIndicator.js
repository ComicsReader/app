import {
	Component
} from 'react';

export default class LoadIndicator extends Component {
	render() {
		return(
			<div
				style={{
					width: '100%',
					height: 500,
					background: 'url(http://i.imgur.com/ybQEnOQ.gif) 50% no-repeat'
				}}
			/>
		)
	}
}
