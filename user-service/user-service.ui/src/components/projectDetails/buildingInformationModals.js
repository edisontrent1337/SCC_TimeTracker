const React = require('react');
const ReactDOM = require('react-dom');
const client = require('../../client');
const request = require('superagent');

import TitleAndDescription from "../titleAndDescription";
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

export default class ProjectDetailsBuildingInformationModals extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
				isCreateModalOpen: false, 
				bimUploadCommand: {},
				projectId: props.projectId};
		
        client({method: 'GET', path: '/api/project/' + this.state.projectId + '/model/'}).done(response => {
    		this.setState({models: response.entity});
        });		
		
		this.openCreateModal = this.openCreateModal.bind(this);
		this.closeCreateModal = this.closeCreateModal.bind(this);
		
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		
	}
	
	openCreateModal() {
		console.log("Open create modal!");
    	this.setState({isCreateModalOpen: true});
    }
    
    closeCreateModal() {
    	this.setState({isCreateModalOpen: false});
    }
	
    handleChange(event) {
    	let bimUploadCommand = Object.assign({}, this.state.bimUploadCommand);
    	bimUploadCommand['file'] = event.target.files[0];
		this.setState({bimUploadCommand});
    }
    
    handleSubmit(event) {
		var formData = new FormData();
		formData.append('poid', this.state.poid)
		formData.append('file', this.state.bimUploadCommand.file);

		fetch('http://localhost:8080/api/model/', {
			method: "POST",
			body: formData
		}).then(function (response) {
			console.log(response);
		}, function(error) {
			alert("Error while submitting form.");
		});
		event.preventDefault();
	}

	render() {
        var bimDescriptionPlaceholder = "This panel enables access on the different variants and model versions of IFC models stored in the given Project.";

        if (this.state.models === undefined) {
        	return <div>Loading...</div>
        }
        
		return (
				<div>
					<Link className="btn btn-success float-right" role="button" to={`/project/${this.props.projectId}/uploadIFCModel`}>Add Model</Link>

					<TitleAndDescription title="Building Information Models" description={bimDescriptionPlaceholder}/>
					<table className="table">
						<tbody>
				        	{this.state.models.map((model, ind) => {
					          return (<tr key={ind}>
					            <td className="pl-0 py-1 align-middle">{model.name}</td>
					          	<td align="right"><a href={"https://bimbay.devboost.de/apps/bimviews/?page=Project&poid=" + this.state.projectId + "&tab=threedview"} target="_blank"><span className="fas fa-external-link-alt" /></a></td>
					          </tr>)
					        })
				        	}
			        	</tbody>
					</table>


				    <Modal isOpen={this.state.isCreateModalOpen} onRequestClose={this.closeCreateModal}>
				    	<h1>Upload model</h1>
				    	<form onSubmit={this.handleSubmit}>
					    	<FormGroup>
						        <FormGroup controlId="documentFormId">
							        <ControlLabel>File</ControlLabel>
							        <FormControl id="documentFormControlId" type="file" label="File" onChange={this.handleChange}/>
						        </FormGroup>
							</FormGroup>
							<input className="btn btn-primary" type="submit" value="Create" />
						</form>
				    </Modal>
				</div>

		);
	};
}