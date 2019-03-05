import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ConnectedLoginScreen from "./screens/login/ConnectedLoginScreen.js";
import singleSpaReact from "single-spa-react";

export const login = singleSpaReact({
    React,
    ReactDOM,
    rootComponent: ConnectedLoginScreen,
    domElementGetter: () => document.getElementById("user-service")
});


