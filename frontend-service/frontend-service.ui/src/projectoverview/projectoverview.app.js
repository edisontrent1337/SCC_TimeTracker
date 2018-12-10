import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import ProjectOverviewScreen from "./ProjectOverviewScreen.js";

export const serviceFrame = singleSpaReact({
	React,
	ReactDOM,
	rootComponent: ProjectOverviewScreen,
	domElementGetter: () => document.getElementById("content")
});
