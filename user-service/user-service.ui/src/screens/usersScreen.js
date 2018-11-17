const React = require('react');
const ReactDOM = require('react-dom');

import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import PrivateHeader from '../components/header/privateHeader.js';
import PrivateFooter from '../components/privateFooter.js';

import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

export default class UserListScreen extends React.Component {

	constructor(props) {
		super(props);

		this.state = {users: [],
				isCreateModalOpen: false,
				userCreateCommand: {userRole: 'ADMINISTRATOR'}};
		this.openCreateModal = this.openCreateModal.bind(this);
		this.closeCreateModal = this.closeCreateModal.bind(this);

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.loadUsers = this.loadUsers.bind(this);
		this.loadUsers();

		this.deleteUser = this.deleteUser.bind(this);
	}

    openCreateModal() {
    	this.setState({isCreateModalOpen: true});
    }

    closeCreateModal() {
    	this.setState({isCreateModalOpen: false});
    }

    handleChange(event) {
    	let userCreateCommand = Object.assign({}, this.state.userCreateCommand);
    	userCreateCommand[event.target.name] = event.target.value;
		this.setState({userCreateCommand});
	}

	handleSubmit(event) {
		/*client({
			method: 'POST',
			path: '/api/user/',
			entity: this.state.userCreateCommand,
			headers: {'Content-Type': 'application/json'}
		}).done(response => {
			this.loadUsers();
			this.closeCreateModal();
		});*/
		event.preventDefault();
	}

	loadUsers() {
		/*client({method: 'GET', path: '/api/user/'}).done(response => {
        	this.setState({users: response.entity});
        });*/
	}

	deleteUser(user) {
		/*client({method: 'DELETE', path: '/api/user/' + user.oid}).done(response => {
        	this.loadUsers();
        });*/
	}

	render() {
		return (
			<div>
				<div><PrivateHeader /></div>
				<div className="jumbotron-transparent">
				  <div className="container">
				    <h1>Users</h1>
				    <table className="table">
				      <thead>
				        <tr>
				          <th>Name</th>
				          <th>Company</th>
				          <th>User role</th>
						  <td align="right">
							<button className="btn btn-success" onClick={this.openCreateModal}>New User</button>
						  </td>
				        </tr>
				      </thead>
				      <tbody>
				        {this.state.users.map((user, ind) => {
				          return (<tr key={ind}>
				          	<td>{user.name}</td>
				          	<td>{user.company}</td>
				          	<td>{user.userRole}</td>
				          	<td align="right"><Button onClick={() => this.deleteUser(user)} className="btn btn-link"><span className="fas fa-trash-alt"/></Button></td>
				          </tr>)
				        })
				        }
				      </tbody>
				    </table>
				    <Modal isOpen={this.state.isCreateModalOpen} onRequestClose={this.closeCreateModal}>
				    	<h1>Create new user</h1>
				    	<form onSubmit={this.handleSubmit}>
						<div className="form-group">
							<label htmlFor="inputName">Name</label>
							<input id="inputName" type="text" className="form-control" placeholder="Username" name="username" onChange={this.handleChange} />
						</div>
						<div className="form-group">
							<label htmlFor="inputCompany">Company</label>
							<input id="inputCompany" type="text" className="form-control" placeholder="Company" name="company" onChange={this.handleChange} />
						</div>
						<FormGroup controlId="selectUserRole">
							<ControlLabel>User role</ControlLabel>
							<FormControl componentClass="select" defaultValue="ADMINISTRATOR" onChange={this.handleChange} name="userRole">
								<option value={"ADMINISTRATOR"}>Administrator</option>
								<option value={"USER"}>User</option>
							</FormControl>
						</FormGroup>
						<input className="btn btn-primary" type="submit" value="Create" />
					</form>
				    </Modal>
				  </div>
				</div>
			    <div><PrivateFooter /></div>
			</div>
		);
	}
}
