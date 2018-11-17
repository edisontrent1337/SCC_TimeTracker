const React = require('react');
const ReactDOM = require('react-dom');
const client = require('../client');

import store from '../store/index.js';
import { openProject } from '../actions/actions.js';

import { Link } from 'react-router-dom';
import PrivateHeader from '../components/privateHeader/privateHeader.js';
import BreadCrumb from '../components/breadcrumb';
import PrivateFooter from '../components/privateFooter.js';
import ProjectDetailsDocumentsAndData from "../components/projectDetails/documentsAndData";
import ProjectDetailsCollaborators from "../components/projectDetails/collaborators";
import ProjectDetailsDescription from "../components/projectDetails/description";
import ProjectDetailsBuildingInformationModals from "../components/projectDetails/buildingInformationModals";

export default class ProjectDetailsScreen extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = { projectId: this.props.match.params.projectId,
		        project: undefined,
				isCreateModalOpen: false,
				redirectToProjects: false};
		
        client({method: 'GET', path: '/api/project/'+this.state.projectId}).done(response => {
        	this.setState({project: response.entity});
        	store.dispatch(openProject(this.state.project));
        });
	}

	render() {
        if (this.state.redirectToProjects) {
            return  <Redirect to={`/project`}/>;
        }

        var projectDetailsDescriptionPlaceholder = "There is a short description text that explains the objective of the given project. Furthermore, project related metadata ca be edited from this panel.";
        var bimDescriptionPlaceholder = "This panel enables access on the different variants and model versions of IFC models stored in the given Project.";
        var collaboratorsDescriptionPlaceholder = "The project has the following collaborators";
        var documentsAndDataDescriptionPlaceholder = "This panel enables access on the various data and document types that may be uploaded or derived for the given building.";

        if (this.state.project === undefined) {
        	return <div>Loading...</div>
        }
        var breadcrumbData = {
            current : this.state.project.name,
            links : [{name: "Projects", link: '/project/'}]
        };

        return (
			<div>
				<div><PrivateHeader /></div>
				<div className="jumbotron-transparent">
                    <div className="container">
                        <BreadCrumb data={breadcrumbData}/>
                        <div className="row mb-3">
                            <div className="col-lg-7 pl-0">
                                <div className="rounded-border mb-3">
                                    <ProjectDetailsDescription projectId={this.state.projectId} projectDescription={this.state.project.description}/>
                                </div>
                                <div className="rounded-border">
                                    <ProjectDetailsBuildingInformationModals projectId={this.state.projectId} />
                                </div>
                            </div>
                            <div className="col-lg-5 rounded-border">
                                <ProjectDetailsCollaborators owner={this.state.project.owner} projectMembers={this.state.project.members}/>
                            </div>
                        </div>
                    </div>
                    <div className="container rounded-border">
                        <ProjectDetailsDocumentsAndData projectId={this.state.projectId}/>
				    </div>
				</div>
			</div>
		);		
	}
}