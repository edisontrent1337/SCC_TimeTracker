import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import Header from "./header.js";

export const header = singleSpaReact({
    React,
    ReactDOM,
    rootComponent: Header,
    domElementGetter: () => document.getElementById("header")
});
