const React = require("react");
const ReactDOM = require("react-dom");

import { Link } from "react-router-dom";

export default class PrivateFooter extends React.Component {
    render() {
        return (
            <footer className="footer">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-1">
                            <Link to="/">Home</Link>
                        </div>
                        <div className="col-lg-1">
                            <Link to="/user/">Users</Link>
                        </div>
                        <div className="col-lg-1">
                            <Link to="/project/">Projects</Link>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}
