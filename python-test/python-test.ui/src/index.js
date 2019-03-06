import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ConnectedPythonTestScreen from "./screens/ConnectedPythonTestScreen";
import singleSpaReact from "single-spa-react";
import "../src/styles/solarized-dark.css";

export const pythonTest = singleSpaReact({
	React,
	ReactDOM,
	rootComponent: ConnectedPythonTestScreen,
	domElementGetter: () => document.getElementById("python-test")
});

export const bootstrap = [pythonTest.bootstrap];
export const mount = [pythonTest.mount];
export const unmount = [pythonTest.unmount];

const componentName = "PythonTest";

console.log("Rendering component '" + componentName + "' in " + MODE + " mode.");

if (MODE === null) {
	throw "Error in component configuration." +
	"Make sure, that 'MODE' has value 'standalone' or 'external-component.'";
}
if (MODE === "standalone") {
	console.log("Hurray, we are in standalone mode!");
	ReactDOM.render(<ConnectedPythonTestScreen />, document.getElementById("root"));
} else if (MODE === "external-component") {
	console.log(
		componentName +
		" is rendered as an external component and " +
		"exports lifecycle stages to single spa."
	);
}
