import React from "react";
import {client} from "../client/APIClient";
import Tab from "../web-react/tab/Tab";
import colors from "../web-react/colors/colors";
import Button from "../web-react/button/Button";
import "../web-react/table/table.fx.css";
import Hint from "../web-react/hints/Hint";
import Message from "../web-react/message/Message";
import ActivityRecord, {convertDuration} from "./components/ActivityRecord";
import Modal from "react-modal";
import {createDefaultModalStyle} from "../web-react/utils/ModalFactory";
import CredentialForm from "../web-react/forms/CredentialForm";
import {buttonFace} from "../web-react/button/ButtonFactory";

export default class DashBoard extends React.Component {

	constructor(props) {
		super(props);
		this.loadRecords = this.loadRecords.bind(this);
		this.deleteRecord = this.deleteRecord.bind(this);
		this.openDeleteModal = this.openDeleteModal.bind(this);
		this.closeDeleteModal = this.closeDeleteModal.bind(this);
		this.state = {
			records: [],
			activities: [],
			connectionError: undefined,
			refresh: setInterval(this.loadRecords, 3000)
		};
	}

	loadRecords() {
		if (this.state.refresh) {
			client.get('/activities/records', this)
				.then(res => res.json())
				.then(res => this.setState({records: res.data[0].filter((elem) => elem.state !== "STARTED")}, () => {
					return this.setState({
						refresh: false,
						connectionError: undefined
					});
				}));
		}
	}

	deleteRecord() {
		client.del('/activities/records/' + this.state.recordToBeDeleted)
			.then(res => {
				if (res.status === 200) {
					location.reload();
				}
			});
	}

	openDeleteModal(recordUuid) {
		console.log("delete " + recordUuid + "?");
		this.setState({
			isDeleteModalOpen: true,
			recordToBeDeleted: recordUuid
		});
	}

	closeDeleteModal() {
		this.setState({
			isDeleteModalOpen: false,
			recordToBeDeleted: undefined,
			requestSent: false,
		});
	}

	componentDidMount() {
		this.loadRecords();
	}

	render() {
		const numberOfRecords = this.state.records.length;
		const logo = <i style={{color: colors.blue["500"], fontSize: "60px"}}
						className="fas fa-stopwatch"> </i>;
		return (
			<div>
				<div className="container">
					{this.state.connectionError &&
					<Message bsStyle={"danger"} heading={this.state.connectionError}
							 message={"Timing Service is currently unavailable."}/>
					}
					{numberOfRecords > 0 &&
					<div>
						<div style={{height: "41px", marginBottom: "10px"}}>
							<div style={{float: "left", width: "50%"}}>
								<Tab title={"Your Records"}/>
							</div>
							<div style={{float: "right", marginRight:"-10px"}}>
								<Button value={<span><i className={"typcn typcn-spiral"}></i>Activities</span>}
										color={colors.pink["400"]}
										onClick={() => location = '/dashboard/activities'}
								/>
							</div>
							<div style={{clear: "both"}}></div>
						</div>
						{this.state.records.map((record, i) => {
							console.log(this.state.records[i]);
							let pause;
							if(i + 1 < this.state.records.length) {
								let date1 = new Date(this.state.records[i].endTime);
								let date2 = new Date(this.state.records[i+1].startTime);
								let timeDiff = Math.abs(date2.getTime() - date1.getTime());
								pause = (convertDuration((date2.getTime()-date1.getTime())/1000));
							}
							return (
								<ActivityRecord record={record} key={i} pause={pause} handleDelete={()=>this.openDeleteModal(record.uuid)}/>
							);
						})
						}
					</div>
					}
					{numberOfRecords === 0 &&
					<div>
						<Tab title={"Your Records"}/>
						<Hint heading={"Nothing here!"}
							  buttonColor={colors.pink["400"]}
							  buttonText={<span><i className={"typcn typcn-spiral"}></i>View Activities</span>}
							  text={"There seem to be no records yet. Head over to your activities to start time tracking!"}
							  callback={() => location += "/activities"}
						/>

					</div>
					}
				</div>
				<Modal ariaHideApp={false} defaultStyles={createDefaultModalStyle()}
					   isOpen={this.state.isDeleteModalOpen}
					   onRequestClose={this.closeDeleteModal}
				>
					<div className="col-lg-4" style={{margin: "50px auto"}}>
						<CredentialForm
							title="Delete Record"
							hint={"Are you sure you want to delete this record?"}
							error={this.state.connectionError || this.state.error}
							logo={logo}
							inputs={[
								{
									type: "button",
									value: buttonFace("trash", "Delete"),
									handler: this.deleteRecord,
									validator: () => true,
									loading: this.state.requestSent,
									color: colors.red["800"],
								},
								{
									type: "button",
									value: "Cancel",
									color: colors.blue["800"],
									handler: this.closeDeleteModal,
									validator: () => true
								},
							]}
						/>
					</div>
				</Modal>

			</div>
		);
	}

}
