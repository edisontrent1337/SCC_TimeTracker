const React = require('react');
const ReactDOM = require('react-dom');

export default class DescriptionPanel extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
			  <h1>{this.props.header}</h1>
			  <div>
			    {this.props.description}
			  </div>
			</div>
		);
	}
}
