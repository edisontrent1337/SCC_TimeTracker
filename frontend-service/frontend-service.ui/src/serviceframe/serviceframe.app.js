import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import ServiceFrame from "./serviceframe.js";

export const serviceFrame = singleSpaReact({
	React,
	ReactDOM,
	rootComponent: ServiceFrame,
	domElementGetter: () => document.getElementById("service-sidebar")
});
