import Title from "./title";
import Description from "./description";

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('../client');

export default class TitleAndDescription extends React.Component {



	render() {

        var config = {
            title: this.props.title,
            description: this.props.description,
        };

		return (
			<div>
				<Title text={config.title}/>
				<Description text={config.description}/>
			</div>
		);
	};
}