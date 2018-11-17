import TitleAndDescription from "../titleAndDescription";
import { Link } from 'react-router-dom';
import Title from "../title";
import Modal from 'react-modal';

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('../../client');



export default class ProjectDetailsDescription extends React.Component {

    constructor(props) {
        super(props);

		this.state = { isModalOpen: false,
			description: props.projectDescription,
			value: props.projectDescription};

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.handleChanges = this.handleChanges.bind(this);
        this.saveDescription = this.saveDescription.bind(this);
    }

    openModal() {
        this.setState({isModalOpen: true});
    }

    closeModal() {
        this.setState({isModalOpen: false});
    }

    handleChanges(event){
        this.setState({value: event.target.value});
	}

    saveDescription(){
        this.setState({description: this.state.value});

        //TODO add request to add project description
        console.log(this.state)
        client({
            method: 'POST',
            path: '/api/project/'+this.props.projectId+'/description',
            entity: this.state.description,
            headers: {'Content-Type': 'text/plain'}
        }).done(response => {
            this.setState({isModalOpen: false});
        });

	}

	render() {
		return (
				<div>
					<button className="btn btn-primary float-right" onClick={this.openModal}>Edit Details</button>
					<TitleAndDescription title="Project Details" description={this.state.description}/>

					<Modal isOpen={this.state.isModalOpen} onRequestClose={this.closeModal} className="modal-dialog modal-lg">

						<div className="modal-content">

							<div className="modal-header">
								<h4 className="modal-title">Edit Project Description</h4>
								<button type="button" className="close" onClick={this.closeModal}>
									<span aria-hidden="true">×</span>
								</button>
							</div>
							<div className="modal-body">
								<form>
									<textarea className="form-control" style={{height: '200px'}} onChange={this.handleChanges} value={this.state.value} />
								</form>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-primary" onClick={this.saveDescription}>Save changes</button>
								<button type="button" className="btn btn-secondary" onClick={this.closeModal}>Close</button>
							</div>
						</div>

					</Modal>

				</div>
		);
	};
}