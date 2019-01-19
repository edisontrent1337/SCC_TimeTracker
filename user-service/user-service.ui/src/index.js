import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ConnectedLoginScreen from "./screens/login/ConnectedLoginScreen.js";
import singleSpaReact, { SingleSpaContext } from "single-spa-react";

export const login = singleSpaReact({
    React,
    ReactDOM,
    rootComponent: ConnectedLoginScreen,
    domElementGetter: () => document.getElementById("user-service")
});

export const bootstrap = [login.bootstrap];
export const mount = [login.mount];
export const unmount = [login.unmount];

const componentName = "LoginScreen";

console.log("Rendering component '" + componentName + "' in " + MODE + " mode.");

if (MODE === null) {
    throw "Error in component configuration." +
        "Make sure, that 'MODE' has value 'standalone' or 'external-component.'";
}
if (MODE === "standalone") {
    console.log("Hurray, we are in standalone mode!");
    ReactDOM.render(<ConnectedLoginScreen />, document.getElementById("root"));
} else if (MODE === "external-component") {
    console.log(
        componentName +
            " is rendered as an external component and " +
            "exports lifecycle stages to single spa."
    );
}
