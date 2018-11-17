const React = require("react");
const ReactDOM = require("react-dom");

import { browserHistory } from "react-router";

export default class UserPrivateHeader extends React.Component {
    render() {
        return (
            <div>
                <a href="/" className="float-right">
                    <img
                        src="/images/user_placeholder.png"
                        style={{ height: "40px", width: "70px" }}
                    />
                </a>
            </div>
        );
    }
}
