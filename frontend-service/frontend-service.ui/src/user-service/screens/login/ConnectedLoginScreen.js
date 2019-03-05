import React from "react";
import {Provider} from "react-redux";
import LoginScreen from "./LoginScreen.js";
import SignUpScreen from "../signup/SignUpScreen.js";
import store from "../../store/index.js";
import {BrowserRouter, Route, Switch} from "react-router-dom";

class ConnectedLoginScreen extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<BrowserRouter>
					<Switch>
						<Route exact path="/" component={LoginScreen}/>
						<Route exact path="/signup" component={SignUpScreen}/>
					</Switch>
				</BrowserRouter>
			</Provider>
		);
	}
}

export default ConnectedLoginScreen;
