import React from "react";

import fetchServices from "../../single-spa.config.js";
import ServiceButton from "./components/ServiceButton.js";

export default class ServiceFrame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      services: []
    };
    fetchServices().then(result => {
      this.updateServiceDataWhenMounted(result);
    });
  }

  updateServiceDataWhenMounted(data) {
    if (this.mounted) {
      this.setState({
        services: data.services
      });
    }
    console.log(this.state);
  }

  componentDidMount() {
    this.mounted = true;
    document.getElementById("smart-service").style.display = "block";
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const availableServices = this.state.services.map((service, i) => {
      return <ServiceButton key={i} service={service} />;
    });
    return (
      <div
        style={{
          display: "block",
          padding: "10px",
          backgroundColor: "#F5F8FA"
        }}
      >
        <p>Available Smart Services:</p>
        <ul
          style={{
            listStyleType: "none",
            margin: 0,
            padding: 0,
            overflow: "hidden"
          }}
        >
          {availableServices}
        </ul>
      </div>
    );
  }
}
