import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ConnectedPythonTestScreen from "./screens/ConnectedPythonTestScreen";
import singleSpaReact from "single-spa-react";
import "./styles/solarized-dark.css";

export const pythonTest = singleSpaReact({
	React,
	ReactDOM,
	rootComponent: ConnectedPythonTestScreen,
	domElementGetter: () => document.getElementById("python-test")
});

