import React from "react";
import Logo from "./logo.js";
import {Button} from "react-bootstrap";
import colors from "../web-react/colors/colors";

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
        this.state = {
            loggingOut: false
        }
    }

    logout() {
        localStorage.removeItem("user");
        window.location = "/";
    }

    render() {
        return (
            <div
                className="container"
                style={{
                    margin: "0px auto",
                    height: "56px",
                    padding: "10px",
                    marginBottom: "30px",
                    display: "flex",
                    flexDirection: "row",
                    paddingBottom: "10px",
                    fontSize: "24px",
                    textAlign: "left"
                }}
            >
                <div style={{float: "left", width: "100%"}}>
                    <a
                        href="/"
                        style={{
                            textDecoration: "none",
                            color: "#26292D"
                            , lineHeight: "95%"
                        }}
                    >
                        <div style={{float: "left"}}><Logo/></div>
                        <span style={{color:colors.blue["900"]}}>Time <br/>Tracker
                            <br/></span>
                        <span style={{color:colors.blueGrey["200"], fontSize:"18px"}}>v0.01</span>
                    </a>

                </div>

                {localStorage.getItem("user") && (
                    <Button
                        bsStyle="primary"
                        style={{
                            marginRight: "10px"
                        }}
                        onClick={this.logout}
                    >
                        Logout
                    </Button>
                )}


            </div>
        );
    }
}

export default Header;
