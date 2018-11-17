const React = require('react');
const ReactDOM = require('react-dom');
const client = require('../client');

export default class Description extends React.Component {

	render() {

        var config = {
            text: this.props.text,
        };

		return (
				<p>{config.text}</p>
		);
	};
}