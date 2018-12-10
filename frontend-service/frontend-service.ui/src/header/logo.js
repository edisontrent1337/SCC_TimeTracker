import React from "react";
import ReactDOM from "react-dom";
import logo from "../images/logo.png";

export default class Logo extends React.Component {
    render() {
        return (
            <div>
                <img src={logo} />
            </div>
        );
    }
}
