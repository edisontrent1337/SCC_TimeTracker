import React from "react";
import Logo from "./logo.js";
import { Button } from "react-bootstrap";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.state = {
        loggingOut : false
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
          marginBottom: "20px",
          display: "flex",
          flexDirection: "row",
          paddingBottom: "10px",
          borderBottom: "1px solid #ccc",
          fontSize: "24px",
          textAlign: "left"
        }}
      >
        <div style={{ float: "left", width: "100%" }}>
          <a
            href="/"
            style={{
              textDecoration: "none",
              color: "#26292D"
            }}
          >
            ilma platform
          </a>{" "}
          <span style={{ color: "#ccc", fontSize: "20px" }}>v0.01</span>
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

        <Logo
          style={{
            marginLeft: "100%"
          }}
        />
      </div>
    );
  }
}

export default Header;
