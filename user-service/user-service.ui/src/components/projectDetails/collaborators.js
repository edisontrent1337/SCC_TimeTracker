import TitleAndDescription from "../titleAndDescription";
import Title from "../title";
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('../../client');

import { Form, FormGroup, FormControl, ControlLabel, Button, Grid, Row, Col } from 'react-bootstrap';

export default class ProjectDetailsCollaborators extends React.Component {

	constructor(props) {
		super(props);
	}
	
	render() {
        var collaboratorsDescriptionPlaceholder = "The project has the following collaborators";

        if (this.props.projectMembers == undefined) {
        	return <div>Loading...</div>
        }
        
		return (
				<div>
					<TitleAndDescription title="Project Collaborators" description={collaboratorsDescriptionPlaceholder}/>
					<Title text="Project Owner"/>
					<table className="table">
						<tbody>
						<tr>
							<td className="border-0 pl-0 py-1">{this.props.owner.name}</td>
							<td className="border-0 py-1">{this.props.owner.company}</td>
							<td className="border-0 pr-0 py-1">Owner</td>
						</tr>
						</tbody>
					</table>
					<Title text="Project Members"/>
					<table className="table">
						<tbody>
				        	{this.props.projectMembers.map((member, ind) => {
					          return (<tr key={ind}>
					          	<td className="border-0 pl-0 py-1">{member.name}</td>
					          	<td className="border-0 py-1">{member.company}</td>
					          	<td className="border-0 pr-0 py-1">{member.userRole}</td>
					          </tr>)
					        })
					        }
						</tbody>
					</table>
					<Title text="Invite Users"/>
					<Grid>
					  <Row>
					    <Col xs={10}>
					    	<FormControl type="text" placeholder="User email address" xs={10} />
					    </Col>
					    <Col xs={2}>
					    	<Button className="btn btn-link" xs={2}><span className="fas fa-plus"/></Button>
					    </Col>
					  </Row>
					</Grid>
		    	</div>

		);
	};
}

ProjectDetailsCollaborators.propTypes = {
	
		owner: PropTypes.object.isRequired,
		projectMembers: PropTypes.array,
};