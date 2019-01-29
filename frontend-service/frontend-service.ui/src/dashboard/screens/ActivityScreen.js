import React from 'react';
import {client} from "../../client/APIClient";
import Message from "../../web-react/message/Message";
import Button from "../../web-react/button/Button";
import colors from "../../web-react/colors/colors";
import ActivityIndicator from "../components/ActivityIndicator";
import Modal from "react-modal";
import CredentialForm from "../../web-react/forms/CredentialForm";
import TabBar from "../../web-react/tab/TabBar";
import Hint from "../../web-react/hints/Hint";
import {buttonFace} from "../../web-react/button/ButtonFactory";
import {createDefaultModalStyle} from "../../web-react/utils/ModalFactory";

export default class ActivityScreen extends React.Component {


	constructor(props) {
		super(props);
		this.loadActivities = this.loadActivities.bind(this);
		this.loadStartedRecords = this.loadStartedRecords.bind(this);
		this.reloadActivities = this.reloadActivities.bind(this);
		this.openCreateModal = this.openCreateModal.bind(this);
		this.openDeleteModal = this.openDeleteModal.bind(this);
		this.closeDeleteModal = this.closeDeleteModal.bind(this);
		this.closeCreateModal = this.closeCreateModal.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.filterActivities = this.filterActivities.bind(this);
		this.updateActivity = this.updateActivity.bind(this);
		this.deleteActivity = this.deleteActivity.bind(this);
		this.state = {
			activities: [],
			displayedActivities: [],
			records: [],
			tags: [],
			connectionError: undefined,
			refresh: setInterval(this.reloadActivities, 3000),
			createActivityData: {},
			createActivityFormIsValid: false,
			requestSent: false

		};
		this.loadActivities();
		this.loadStartedRecords();
	}

	openCreateModal() {
		this.setState({
			isEditModalOpen: true
		});
	}

	openDeleteModal(activityUuid) {
		console.log("delete " + activityUuid + "?");
		this.setState({
			isDeleteModalOpen: true,
			recordToBeDeleted: activityUuid
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
	}


	closeCreateModal() {
		this.setState({
			isEditModalOpen: false,
			requestSent: false,
			createActivityData: {},
		});
	}

	updateActivity(activity) {
		let old = this.state.activities.find(x => x.uuid === activity.activityuuid);
		old.state = activity.state;
		this.setState({
			activities: Object.assign(this.state.activities, old),
			displayedActivities: Object.assign(this.state.displayedActivities, old)
		});
	}

	deleteActivity() {
		client.del('/activities/' + this.state.recordToBeDeleted)
			.then(res => {
				if (res.status === 200) {
					location.reload();
				}
			});
	}

	loadActivities() {
		client.get('/activities/', this)
			.then(res => res.json())
			.then(res => this.setState({
				activities: res.data[0].sort((a, b) => {
					if (a.tag < b.tag)
						return -1;
					if (a.tag > b.tag)
						return 1;
					return 0;
				}),
				displayedActivities: res.data[0].sort((a, b) => {
					if (a.tag < b.tag)
						return -1;
					if (a.tag > b.tag)
						return 1;
					return 0;
				})
			}, () => {
				let tags = ["All (" + this.state.activities.length + ")"];
				for (let i = 0; i < this.state.activities.length; i++) {
					tags.push(this.state.activities[i].tag);
				}
				let uniqueTags = tags.filter((item, pos) => {
					return tags.indexOf(item) === pos;
				});
				this.setState({
					tags: uniqueTags
				});
				return this.setState({refresh: false});
			}));
	}

	loadStartedRecords() {
		client.get('/activities/records?state=STARTED', this)
			.then(res => res.json())
			.then(res => this.setState({records: res.data[0]}, () => {
				return this.setState({refresh: false});
			}));
	}

	filterActivities(name) {
		if (name.includes("ALL (")) {
			this.setState({
				displayedActivities: this.state.activities
			});
			return;
		}
		let activities = this.state.activities;
		let filteredActivities = activities.filter((item) => {
			return item.tag.toUpperCase() === name.toUpperCase();
		});
		this.setState({
			displayedActivities: filteredActivities
		});
	}


	reloadActivities() {
		if (this.state.refresh) {
			client.get('/activities/', this)
				.then(res => res.json())
				.then(res => this.setState({activities: res.data[0]}, () => {
					console.log("new fetch");
					return this.setState({refresh: false});
				}))
		}
	}

	validateForm() {
		let data = this.state.createActivityData;
		let name = data.name || "";
		let description = data.description || "";
		let tag = data.tag || "";
		return name.length > 2
			&& description.length >= 10
			&& tag.length > 0
			&& !this.state.requestSent;
	}

	handleChange(event) {
		let activityData = Object.assign(
			{},
			this.state.createActivityData
		);
		activityData[event.target.name] = event.target.value;
		this.setState({
			createActivityData: activityData,

		}, () => {
			this.setState({
				createActivityFormIsValid: this.validateForm()
			})
		});
	}

	handleSubmit(event) {

		let name = this.state.createActivityData.name;
		let description = this.state.createActivityData.description;

		if (typeof description === 'undefined') {
			this.setState({
					createActivityData: {
						name: name,
						description: ""
					}
				}
			);
		}
		this.setState({facilityCreationRequestSent: true},
			() => this.setState({createFacilityFormIsValid: this.validateForm()}));

		client.post('/activities/', JSON.stringify(this.state.createActivityData), this)
			.then(res => res.json())
			.then((res) => {
				if (res.error) {
					this.setState({
						error: res.error,
						requestSent: false
					});
				}
				else {
					this.closeCreateModal();
					this.loadActivities();
				}
			});

		event.preventDefault();
	}

	render() {
		const numberOfActivities = this.state.activities.length;
		const logo = <i style={{color: colors.blue["500"], fontSize: "60px"}}
						className="fas fa-stopwatch"> </i>;
		return (
			<div>
				<div className="container">
					{this.state.connectionError &&
					<Message bsStyle={"danger"} heading={this.state.connectionError}
							 message={"Timing Service is currently unavailable."}/>
					}
					{(numberOfActivities === 0) &&
					<div>
						<Hint heading={"Nothing here!"}
							  buttonText={<span><i className={"typcn typcn-plus-outline"}></i>New Activity</span>}
							  buttonColor={colors.pink["400"]}
							  callback={this.openCreateModal}
							  text={"There seem to be no activities yet. But don't worry - You can start time tracking now by creating the very first activity!"}
						/>

					</div>
					}
					{numberOfActivities > 0 &&
					<div>

						<div style={{height: "41px", marginBottom: "50px"}}>
							<div style={{float: "left", width: "50%"}}>
								<TabBar titles={this.state.tags} switchCallback={this.filterActivities}/>
							</div>
							<div style={{float: "right", marginRight:"-10px"}}>
								<Button value={buttonFace("plus-outline", "New...")}
										color={colors.green["800"]}
										onClick={this.openCreateModal}
								/></div>
							<div style={{float: "right"}}>
								<Button value={buttonFace("document-text", "Records")}
										color={colors.blue["600"]}
										onClick={() => location = "/dashboard"}
								/>
							</div>
						</div>
						<div className={"cf"}></div>
						{this.state.displayedActivities.map((activity, i) => {
							return (<ActivityIndicator key={activity.uuid} activity={activity}
													   handleDelete={() => this.openDeleteModal(activity.uuid)}
													   updateActivity={this.updateActivity}/>);
						})}

					</div>
					}

					<Modal ariaHideApp={false} defaultStyles={createDefaultModalStyle()}
						   isOpen={this.state.isEditModalOpen}
						   onRequestClose={this.closeCreateModal}
					>
						<div className="col-lg-4" style={{margin: "50px auto"}}>
							<CredentialForm
								title="Create a new Activity"
								onChange={this.handleChange}
								error={this.state.connectionError || this.state.error}
								logo={logo}
								inputs={[
									{
										id: "name",
										type: "text",
										label: "NAME OF NEW ACTIVITY",
										pattern: "[a-zA-Z0-9 \-_]{3,}",
										hint: ["Use at least 3 characters."],

									},
									{
										id: "description",
										type: "textarea",
										label: "DESCRIPTION",
										pattern: "[a-zA-Z0-9._\\-]+",
										hint: ["Describe shortly what the activity is all about. Use at least 10 characters."]
									},
									{
										id: "tag",
										type: "select",
										options: ["Studies", "Sport", "Relax", "Work", "Hobby", "Travel", "Self-care"],
										label: "TAG",
										hint: ["Tag your activity."]
									},
									{
										type: "button",
										value: "Create activity",
										handler: this.handleSubmit,
										validator: this.state.createActivityFormIsValid,
										loading: this.state.requestSent,
										color: colors.green["800"],

									},
									{
										type: "button",
										value: "Cancel",
										color: colors.red["800"],
										handler: this.closeCreateModal,
										validator: () => true
									},
								]}
							/>
						</div>
					</Modal>
					<Modal ariaHideApp={false} defaultStyles={createDefaultModalStyle()}
						   isOpen={this.state.isDeleteModalOpen}
						   onRequestClose={this.closeDeleteModal}
					>
						<div className="col-lg-4" style={{margin: "50px auto"}}>
							<CredentialForm
								title="Delete activity"
								hint={"Are you sure you want to delete this activity?"}
								error={this.state.connectionError || this.state.error}
								logo={logo}
								inputs={[
									{
										type: "button",
										value: buttonFace("trash", "Delete"),
										handler: this.deleteActivity,
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
			</div>
		);
	}


}