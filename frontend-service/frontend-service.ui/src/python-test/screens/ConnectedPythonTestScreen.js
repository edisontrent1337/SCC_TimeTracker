import React from "react";
import {Route, Switch} from "react-router";
import {BrowserRouter} from "react-router-dom";
import EnterTestScreen from "./EnterTestScreen";
import TestScreen from "./TestScreen";

export default class ConnectedPythonTestScreen extends React.Component {
	constructor(props) {
		super(props);

	}

	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route exact path="/" component={EnterTestScreen}/>
					<Route exact path="/test" component={TestScreen}/>
				</Switch>
			</BrowserRouter>
		);
	}

}