import React from "react";
import {client} from "../client/APIClient";

export default class DashBoard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activities: []
        };

        this.loadActivities = this.loadActivities.bind(this);
    }

    loadActivities() {
        client.get('/activities/records')
            .then(res => res.json())
            .then(res => console.log(res));
    }

    componentDidMount() {
        this.loadActivities();
    }

    render() {
        return (
            <div>Hello World.</div>
        );
    }
}