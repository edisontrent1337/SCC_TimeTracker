import React from "react";
import { navigateToUrl } from "single-spa";

export default class ServiceButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const service = this.props.service;
    return (
      <li
        style={{
          float: "left"
        }}
      >
        <a
          href={"/services/" + service.serviceId}
          onClick={navigateToUrl}
          className=""
          style={{
            display: "block",
            paddingRight: "14px"
          }}
        >
          {service.serviceName}
        </a>
      </li>
    );
  }
}
