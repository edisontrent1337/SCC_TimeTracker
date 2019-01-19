import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import DashBoard from "./DashBoard";

export const dashboard = singleSpaReact({
    React,
    ReactDOM,
    rootComponent: DashBoard,
    domElementGetter: () => document.getElementById("dashboard")
});
