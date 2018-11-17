const React = require('react');
const ReactDOM = require('react-dom');
const client = require('../client');

import { Link, Router } from 'react-router-dom';
import Modal from 'react-modal';
import PrivateHeader from '../components/privateHeader/privateHeader.js';
import PrivateFooter from '../components/privateFooter.js';
import BreadCrumb from '../components/breadcrumb';

import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

export default class ProjectListScreen extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {projects: [], 
				users: [],
				isCreateModalOpen: false, 
				projectCreateCommand: {schema: 'ifc4'},
				redirectToProjects: false};
		this.openCreateModal = this.openCreateModal.bind(this);
		this.closeCreateModal = this.closeCreateModal.bind(this);
		
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.loadProjects = this.loadProjects.bind(this);
		
		this.loadProjects();
		
		
	}

	componentDidMount() {
		console.log("projects screen mounted");
	}
	
    openCreateModal() {
    	client({method: 'GET', path: '/api/user/'}).done(response => {
    		console.log(response.entity);
        	this.setState({users: response.entity});
        	let projectCreateCommand = Object.assign({}, this.state.projectCreateCommand);
        	console.log(this.state.users[0].oid);
        	projectCreateCommand['owner'] = this.state.users[0].oid;
    		this.setState({projectCreateCommand});
        });
    	this.setState({isCreateModalOpen: true});
    }
    
    closeCreateModal() {
    	this.setState({isCreateModalOpen: false});
    }
    
    handleChange(event) {
    	let projectCreateCommand = Object.assign({}, this.state.projectCreateCommand);
    	projectCreateCommand[event.target.name] = event.target.value;
		this.setState({projectCreateCommand});
	}
	
	handleSubmit(event) {
		console.log(this.state)
		
		client({
			method: 'POST',
			path: '/api/project/',
			entity: this.state.projectCreateCommand,
			headers: {'Content-Type': 'application/json'}
		}).done(response => {
			this.loadProjects();
			this.closeCreateModal();
		});
		event.preventDefault();
	}
    
	loadProjects() {
		client({method: 'GET', path: '/api/project/'}).done(response => {
        	this.setState({projects: response.entity});
        });
	}
	
	render() {
		return (
			<div>
				<div><PrivateHeader /></div>
				<div className="jumbotron-transparent">
				  <div className="container">
				    <div className="jumbotron">
				      <h1>Start building information models today!</h1>
				      Projects are the cornerstone of all collaboration. Below you find a list of all projects you have created or you have been granted access to.
				      <hr />
				      Learn more about managing building information models in projects or start creating a new one.
				      <br />
						<br />
							<Link className="btn btn-primary" role="button" to={'http://www.buildingsmart-tech.org/'}>Learn more</Link>
					</div>
				    <h1>Your Projects</h1>
				    <table className="table">
				      <thead>
				        <tr>
				          <th>Project</th>
				          <th>Description</th>
						  <td align="right">
							<button className="btn btn-success" onClick={this.openCreateModal}>New Project</button>
						  </td>
				        </tr>
				      </thead>
				      <tbody>
				        {this.state.projects.map((project, ind) => {
				          return (<tr key={ind}>
				          	<td>{project.name}</td>
				          	<td>{project.description}</td>
							<td align="right"><Link className="btn btn-link" role="button" to={`/project/${project.id}`}><span className="fas fa-eye"/></Link></td>
				          </tr>)
				        })
				        }
				      </tbody>
				    </table>
				    <Modal isOpen={this.state.isCreateModalOpen} onRequestClose={this.closeCreateModal}>
				    	<h1>Create new project</h1>
				    	<form onSubmit={this.handleSubmit}>
				    	<FormGroup>
				    		<FormGroup controlId="inputName">
				    			<ControlLabel>Name</ControlLabel>
				    			<FormControl type="text" placeholder="Project name" name="name" onChange={this.handleChange} />
				    		</FormGroup>
	                        
				    		<FormGroup controlId="inputDescription">
				    			<ControlLabel>Description</ControlLabel>
				    			<FormControl componentClass="textarea" placeholder="Project description" name="description" onChange={this.handleChange} />
				    		</FormGroup>

		    				<FormGroup controlId="selectOwner">
								<ControlLabel>Owner</ControlLabel>
								<FormControl componentClass="select" onChange={this.handleChange} name="owner" >
									{this.state.users.map((user, ind) => {
										return (
											<option value={user.oid}>{user.name}</option>
										)
									})}	
								</FormControl>
							</FormGroup>
							<FormGroup controlId="selectMembers">
								<ControlLabel>Project member</ControlLabel>
								<FormControl componentClass="select" multiple onChange={this.handleChange} name="members">
									{this.state.users.map((user, ind) => {
										return (
											<option value={user.oid}>{user.name}</option>
										)
									})}	
								</FormControl>
							</FormGroup>
							<FormGroup controlId="selectSchema">
								<ControlLabel>Schema</ControlLabel>
								<FormControl componentClass="select" defaultValue="ifc4" onChange={this.handleChange} name="schema">
									<option value={"ifc2x3tc1"}>Ifc2x3tc1</option>
									<option value={"ifc4"}>Ifc4</option>
								</FormControl>
							</FormGroup>
						</FormGroup>
						<input className="btn btn-primary" type="submit" value="Create" />
					</form>
				    </Modal>
				  </div>
				</div>
			</div>
		);		
	}
}