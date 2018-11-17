const React = require('react');
const ReactDOM = require('react-dom');
const client = require('../../client');

import FileSaver from 'file-saver';

import { Link } from 'react-router-dom';
import TitleAndDescription from "../titleAndDescription";
import { Button } from 'react-bootstrap';

export default class ProjectDetailsDocumentsAndData extends React.Component {
    constructor(props) {
        super(props);

        this.state = {projectId: props.projectId};
        
        client({method: 'GET', path: '/api/project/' + this.state.projectId + '/document/'}).done(response => {
    		this.setState({documents: response.entity});
        });
        
        this.downloadDocument = this.downloadDocument.bind(this);
    }

    downloadDocument(document) {
    	console.log("Download document triggered");
    	console.log(document);
    	
        client({method: 'GET', path: '/api/document/' + document.id}).done(response => {
        	console.log(response);
        	var blob = new Blob([JSON.stringify(response.entity)], {type: response.entity.mimeType});
        	FileSaver.saveAs(blob, document.filename);
        });
    }
    
	render() {
        var documentsAndDataDescriptionPlaceholder = "This panel enables access on the various data and document types that may be uploaded or derived for the given building.";

        if (this.state.documents === undefined) {
        	return <div>Loading...</div>
        }
        
		return (
				<div>
					<Link className="btn btn-primary float-right" role="button" to={`/project/${this.props.projectId}/smartDataServices`}>Smart Services <span className="fas fa-caret-down"/></Link>
					<TitleAndDescription title="Documents and Data"  description={documentsAndDataDescriptionPlaceholder}/>
					<table className="table">
						<thead>
						<tr>
							<th className="border-0 pl-0">Name</th>
                            <th className="border-0">Processor</th>
							<th className="border-0">Type</th>
                            <th className="border-0">Status</th>
                            <th className="border-0">Last Update</th>
							<th className="border-0 xs-1"></th>
							<th className="border-0 xs-1"></th>
						</tr>
						</thead>
						<tbody>
				        	{this.state.documents.map((document, ind) => {
					          return (<tr key={ind}>
					          	<td>{document.filename}</td>
					          	<td>{document.owner.name}</td>
					          	<td>{document.extension}</td>
					          	<td>{document.status}</td>
					          	<td>{document.lastUpdate}</td>
					          	<td align="right"><Button className="btn btn-link"><span className="fas fa-edit"/></Button></td>
					          	<td align="right"><Button onClick={() => this.downloadDocument(document)} className="btn btn-link"><span className="fas fa-download"/></Button></td>
					          </tr>)
					        })
				        	}
			        	</tbody>
					</table>
				</div>

		);
	};
}