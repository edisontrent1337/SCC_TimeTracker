import React from 'react';
import {client} from "../../client/APIClient";

export default class ActivityScreen extends React.Component {


	constructor(props) {
		super(props);
		this.state = {
			activities: []
		};
		console.log("hsdfsdf");
		this.loadActivities = this.loadActivities.bind(this);
	}

	loadActivities() {
		client.get('/activities/records', this)
			.then(res => res.json())
			.then(res => this.setState({activities: res.data[0]}, () => console.log(this.state.activities)));
	}

	render() {
		return "Hellsdsa dsdo";
	}



}