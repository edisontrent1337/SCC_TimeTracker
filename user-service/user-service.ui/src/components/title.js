const React = require('react');
const ReactDOM = require('react-dom');
const client = require('../client');

export default class Title extends React.Component {

	render() {

        var config = {
            text: this.props.text,
        };

		return (
				<h5>{config.text}</h5>

		);
	};
}