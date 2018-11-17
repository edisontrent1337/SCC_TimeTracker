const React = require('react');
const ReactDOM = require('react-dom');
const client = require('../client');

import {Link} from 'react-router-dom';
import {Redirect} from 'react-router-dom';
import PrivateHeader from "../components/privateHeader/privateHeader";
import BreadCrumb from "../components/breadcrumb";
import store from '../store/index.js';

export default class UploadIFCModelScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            deserializers: [{NULL: ''}],
            bimUploadCommand: {},
            redirectToProject: false,
            projectId: this.props.match.params.projectId,
            selectedFile: '\u00A0',
            selectedDeserializer: '\u00A0',
            uploadStatusText: '\u00A0',
            uploadFinished: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        client({method: 'GET', path: `/api/project/${this.state.projectId}/bim/deserializers`}).done(response => {
            console.log(response);
            let x = this.state.deserializers.concat(response.entity);
            this.setState({deserializers: x});
        });

        this.setState({
            bimUploadCommand: {
                'poid': `${this.state.projectId}`,
                'deserializerOid': ''
            }
        });
    }

    handleChange(event) {
        let bimUploadCommand = Object.assign({}, this.state.bimUploadCommand);
        if (event.target.name === 'file') {
            bimUploadCommand['file'] = event.target.files[0];
            this.setState({selectedFile: '✓'});

            client({
                method: 'GET',
                path: `/api/project/${this.state.projectId}/bim/suggesteddeserializer/${event.target.value.split('.').pop()}`
            }).done(response => {
                console.log(response);
                let x = response.entity;
                this.state.deserializers.forEach(
                    (deserializer, ind) => {
                        if (deserializer.oid === x.oid) {
                            if (bimUploadCommand['deserializerOid'] !== deserializer.oid) {
                                bimUploadCommand['deserializerOid'] = deserializer.oid;
                                this.setState({selectedDeserializer: '✓'});
                                let desoptions = document.getElementById('modelType');
                                desoptions.value = x.name;
                            }
                        }
                    }
                )
            });
        }
        else if (event.target.name === 'modelType') {
            this.state.deserializers.forEach(
                (deserializer, ind) => {
                    if (deserializer.name === event.target.value) {
                        if (bimUploadCommand['deserializerOid'] !== deserializer.oid) {
                            bimUploadCommand['deserializerOid'] = deserializer.oid;
                            this.setState({selectedDeserializer: '✓'});
                        }
                    }
                }
            );
        }
        else {
            bimUploadCommand[event.target.name] = event.target.value;
        }
        document.getElementById("uploadModelButton").disabled = false;
        this.setState({bimUploadCommand});
    }

    handleSubmit(event) {
        console.log("submitting data to server");
        console.log(this.state);
        document.getElementById("uploadModelButton").disabled = true;
        this.setState({uploadFinished: 'signal', uploadStatusText: ''});


        var formData = new FormData();
        formData.append('poid', this.state.bimUploadCommand.poid);
        formData.append('deserializerOid', this.state.bimUploadCommand.deserializerOid);
        formData.append('file', this.state.bimUploadCommand.file);

        fetch('http://localhost:8080/api/project/' + this.state.projectId + '/model/checkin', {
            method: "POST",
            body: formData
        }).then((response) => {
            console.log(response);
            if (response.ok === true)
                this.setState({uploadFinished: '', uploadStatusText: '✓'});
            else {
                alert("Server error");
                this.setState({uploadFinished: '', uploadStatusText: 'X'});
                document.getElementById("uploadModelButton").disabled = false;
            }
        }, (error) => {
            alert("Error while submitting form.");
            this.setState({uploadFinished: '', uploadStatusText: 'X'});
            document.getElementById("uploadModelButton").disabled = false;
        });
        event.preventDefault();
    }

    render() {
        let breadcrumbData = {
            current: "Upload IFC BIM Modell",
            links: [{name: "Projects", link: '/project/'}, {
                name: store.getState().project.name,
                link: `/project/${this.state.projectId}`
            }]
        };

        return (
            <div>
                <div><PrivateHeader/></div>
                <div className="jumbotron-transparent">
                    <div className="container">
                        <div><BreadCrumb data={breadcrumbData}/></div>
                        <div className="rounded-border pb-3 mb-3">
                            <h5>Modell Upload</h5>
                            <form onSubmit={this.handleSubmit}>
                                <div class="form-row">
                                    <div class="col-sm-2 col-form-label">
                                        <label>Datei</label>
                                    </div>
                                    <div class="col">
                                        <input id="modelName" type="file" className="form-control"
                                               placeholder="Dateiname" name="file" onChange={this.handleChange}/>
                                    </div>
                                    <div class="col-2">
                                        <select id="modelType" type="text" className="form-control"
                                                placeholder="Dateityp" name="modelType" onChange={this.handleChange}>
                                            {this.state.deserializers.map((deserializer, ind) => {
                                                return (
                                                    <option>{deserializer.name}</option>
                                                )
                                            })
                                            }
                                        </select>
                                    </div>
                                    <div class="col-3">
                                        <input id="uploadModelButton" className="btn btn-primary" type="submit"
                                               value="BIM Modell hochladen"/>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="rounded-border">
                            <div class="row">
                                <div class="col-md-5 offset-md-3">
                                    <div class="col-sm">
                                        <h5>Import Fortschritt</h5>
                                        <div className="container pt-3 pb-3 pl-5">
                                            <div class="row">
                                                <div class="col-1">{this.state.selectedFile}</div>
                                                <div class="col">Datei ausgewählt</div>
                                            </div>
                                            <div class="row">
                                                <div class="col-1">{this.state.selectedDeserializer}</div>
                                                <div class="col">Deserialisierer ausgewählt</div>
                                            </div>
                                            <div class="row">
                                                <div class="col-1"><span
                                                    className={this.state.uploadFinished}/>{this.state.uploadStatusText}
                                                </div>
                                                <div class="col">Import abgeschlossen</div>
                                            </div>
                                        </div>
                                        <div className="container pt-2">
                                            <div class="row">
                                                <div class="col-md-auto">
                                                    <Link className="btn btn-primary" role="button"
                                                          to={`/project/${this.props.projectId}/uploadIFCModel`}>3D
                                                        Preview</Link>
                                                </div>
                                                <div class="col pl-0">
                                                    <Link className="btn btn-primary" role="button"
                                                          to={`/project/${this.state.projectId}`}>Import abschließen</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        );
    }
}