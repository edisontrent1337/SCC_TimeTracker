import React from "react";
import ReactDOM from "react-dom";

import { Link, Router } from "react-router-dom";
import { Redirect } from "react-router-dom";
import Modal from "react-modal";

import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";

export default class SmartDataServicesScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projectId: 1,
      redirectToProject: false,
      isUploadModalOpen: false,
      documentUploadCommand: {},
      selectedDocType: "",
      users: []
    };

    this.openPDFUploadModal = this.openPDFUploadModal.bind(this);
    this.openOfficeUploadModal = this.openOfficeUploadModal.bind(this);
    this.openIMGUploadModal = this.openIMGUploadModal.bind(this);
    this.openCSVUploadModal = this.openCSVUploadModal.bind(this);
    this.closeUploadModal = this.closeUploadModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    /*client({method: 'GET', path: '/api/user/'}).done(response => {
        	this.setState({users: response.entity});
        	let documentUploadCommand = Object.assign({}, this.state.documentUploadCommand);
        	console.log(this.state.users[0].oid);
        	documentUploadCommand['owner'] = this.state.users[0].oid;
    		this.setState({documentUploadCommand});
        });*/
  }

  componentDidMount() {
    this.setState({
      documentUploadCommand: { poid: `${this.state.projectId}` }
    });
  }

  openPDFUploadModal() {
    this.setState({
      selectedDocType: "pdf",
      isUploadModalOpen: true
    });
  }

  openOfficeUploadModal() {
    this.setState({
      selectedDocType: "doc",
      isUploadModalOpen: true
    });
  }

  openIMGUploadModal() {
    this.setState({
      selectedDocType: "img",
      isUploadModalOpen: true
    });
  }

  openCSVUploadModal() {
    this.setState({
      selectedDocType: "csv",
      isUploadModalOpen: true
    });
  }

  closeUploadModal() {
    this.setState({ isUploadModalOpen: false });
  }

  handleChange(event) {
    console.log(event.target.name);
    console.log(event.target.value);
    console.log(event);
    let documentUploadCommand = Object.assign(
      {},
      this.state.documentUploadCommand
    );
    if (event.target.name === "file") {
      documentUploadCommand["file"] = event.target.files[0];
    } else {
      documentUploadCommand[event.target.name] = event.target.value;
    }
    this.setState({ documentUploadCommand });
  }

  handleSubmit(event) {
    console.log(this.state);
    var formData = new FormData();
    formData.append("poid", this.state.documentUploadCommand.poid);
    formData.append("status", this.state.documentUploadCommand.status);
    formData.append("owner", this.state.documentUploadCommand.owner);
    formData.append("file", this.state.documentUploadCommand.file);

    /*fetch('http://localhost:8080/api/project/' + this.state.projectId + '/model/upload', {
            method: "POST",
            body: formData
        }).then(function (response) {
            console.log(response);
            this.setState({redirectToProject:true})
            this.closeUploadModal();
        }, function(error) {
            alert("Error while submitting form.");
        });*/
    event.preventDefault();
  }

  render() {
    if (this.state.redirectToProject) {
      return <Redirect to={`/project/${this.state.projectId}`} />;
    }

    /*if (this.state.users === undefined) {
        	return <div>Loading...</div>
        }*/

    var breadcrumbData = {
      current: "Smart Data Services",
      links: [
        {
          name: "Projects",
          link: "/project/"
        },
        {
          name: "test", //store.getState().project.name,
          link: `/project/${this.state.projectId}`
        }
      ]
    };

    return (
      <div>
        <div className="jumbotron-transparent">
          <div className="container">
            <div className="rounded-border">
              <h5>File Uploads</h5>
              <div className="row col-sm-12">
                <div className="col-sm-6">
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={this.openPDFUploadModal}
                  >
                    Upload PDF Document
                  </button>
                </div>
                <div className="col-sm-6">
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={this.openOfficeUploadModal}
                  >
                    Upload Office Document
                  </button>
                </div>
              </div>
              <div className="row col-sm-12">
                <div className="col-sm-6">
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={this.openIMGUploadModal}
                  >
                    Upload Image File
                  </button>
                </div>
                <div className="col-sm-6">
                  <a
                    className="btn btn-link"
                    href={`/project/${this.state.projectId}`}
                  >
                    Link Online File
                </a>
                </div>
              </div>
              <div className="row col-sm-12">
                <div className="col-sm-6">
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={this.openCSVUploadModal}
                  >
                    Upload CSV File
                  </button>
                </div>
              </div>
            </div>
            <div className="rounded-border">
              <h5>Data Import</h5>
              <div className="col-sm-6">
                <a
                  className="btn btn-link"
                  href={`/project/${this.state.projectId}`}
                >
                  Proload Data Import from File
              </a>
              </div>
              <div className="col-sm-6">
                <a
                  className="btn btn-link"
                  href={`/project/${this.state.projectId}`}
                >
                  Proload Data Import from Database
              </a>
              </div>
            </div>
            <div className="rounded-border">
              <h5>Data Analysis and Reporting</h5>
              <div className="row col-sm-12">
                <div className="col-sm-6">
                  <a
                    className="btn btn-link"
                    href={`/project/${this.state.projectId}`}
                  >
                    Jahresbericht
                </a>
                </div>
                <div className="col-sm-6">
                  <a
                    className="btn btn-link"
                    to={`/project/${this.state.projectId}`}
                  >
                    New Dimensioning Assessment (Bemessung DWA-A131)
                </a>
                </div>
              </div>
              <div className="row col-sm-12">
                <div className="col-sm-6">
                  <a
                    className="btn btn-link"
                    href={`/project/${this.state.projectId}`}
                  >
                    Anhang GU (hydrograv)
                </a>
                </div>
                <div className="col-sm-6">
                  <a
                    className="btn btn-link"
                    href={`/project/${this.state.projectId}`}
                  >
                    Re-Assessment (Nachbemessung DWA-A131)
                </a>
                </div>
              </div>
              <div className="row col-sm-12">
                <div className="col-sm-6">
                  <a
                    className="btn btn-link"
                    href={`/project/${this.state.projectId}`}
                  >
                    Bemessungswerte (ATV-DVWK-A198)
                </a>
                </div>
              </div>
              <div className="row col-sm-12">
                <div className="col-sm-6">
                  <a
                    className="btn btn-link"
                    href={`/project/${this.state.projectId}`}
                  >
                    Energiecheck (DWA-A216)
                </a>
                </div>
              </div>
            </div>
            <div className="rounded-border">
              <h5>Simulations</h5>
              <div className="row col-sm-12">
                <div className="col-sm-6">
                  <a
                    className="btn btn-link"
                    href={`/project/${this.state.projectId}`}
                  >
                    2D CFD Simulation
                </a>
                </div>
                <div className="col-sm-6">
                  <a
                    className="btn btn-link"
                    href={`/project/${this.state.projectId}`}
                  >
                    Biologische Simulation
                </a>
                </div>
              </div>
              <div className="row col-sm-12">
                <div className="col-sm-6">
                  <a
                    className="btn btn-link"
                    href={`/project/${this.state.projectId}`}
                  >
                    3D CFD Simulation
                </a>
                </div>
                <div className="col-sm-6">
                  <a
                    className="btn btn-link"
                    href={`/project/${
                      this.state.projectId
                    }/smartDataServices/flowSchema`}
                  >
                    Fließschema
                </a>
                </div>
              </div>
            </div>
            <Modal
              isOpen={this.state.isUploadModalOpen}
              onRequestClose={this.closeUploadModal}
            >
              <h1>Fileupload</h1>
              <form onSubmit={this.handleSubmit}>
                <div className="form-row">
                  <div className="col">
                    <input
                      id="modelName"
                      type="file"
                      className="form-control"
                      placeholder="Dateiname"
                      name="file"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <FormGroup controlId="selectOwner">
                  <ControlLabel>Processor</ControlLabel>
                  <FormControl
                    componentClass="select"
                    onChange={this.handleChange}
                    name="owner"
                  >
                    {this.state.users.map((user, ind) => {
                      return <option value={user.oid}>{user.name}</option>;
                    })}
                  </FormControl>
                </FormGroup>
                <FormGroup controlId="selectStatus">
                  <ControlLabel>Status</ControlLabel>
                  <FormControl
                    componentClass="select"
                    multiple
                    onChange={this.handleChange}
                    name="status"
                  >
                    <option value={"ACCEPTED"}>Accepted</option>
                    <option value={"REJECTED"}>Rejected</option>
                    <option value={"IN_PROGRESS"}>In progress</option>
                  </FormControl>
                </FormGroup>
                <input
                  className="btn btn-primary"
                  type="submit"
                  value="Datei hochladen"
                />
              </form>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}
