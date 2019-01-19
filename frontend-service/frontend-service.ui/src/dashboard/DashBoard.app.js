import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import ConnectedDashBoard from "./screens/ConnectedDashBoard";

export const dashboard = singleSpaReact({
    React,
    ReactDOM,
    rootComponent: ConnectedDashBoard,
    domElementGetter: () => document.getElementById("dashboard")
});
