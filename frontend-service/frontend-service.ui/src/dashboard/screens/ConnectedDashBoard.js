import React from "react";
import ActivityScreen from "./ActivityScreen";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import ActivityDetailScreen from "./ActivityDetailScreen";
import DashBoard from "../DashBoard";

export default class ConnectedFacilityOverviewScreen extends React.Component {

	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route exact path="/dashboard/activities" component={ActivityScreen}/>
					<Route exact path="/dashboard/activities/:activityId" component={ActivityDetailScreen}/>
					<Route exact path="/dashboard" component={DashBoard}/>
				</Switch>
			</BrowserRouter>
		);
	}
}

