import React from "react";
import colors from "../../web-react/colors/colors"
import Button from "../../web-react/button/Button";
import Tag from "../../web-react/tag/Tag";
import InputField from "../../web-react/input/InputField";
import {client} from "../../client/APIClient";
import "./activityIndicator.fx.css"
import TextArea from "../../web-react/input/TextArea";
import Circle from "../../web-react/circle/Circle";
import {convertDuration, decideColor, decideIcon} from "./ActivityRecord";
import {buttonFace, createDeleteButton} from "../../web-react/button/ButtonFactory";
import Modal from "react-modal";
import {createDefaultModalStyle} from "../../web-react/utils/ModalFactory";
import CredentialForm from "../../web-react/forms/CredentialForm";
import Select from "../../web-react/input/Select";
import Message from "../../web-react/message/Message";

export default class ActivityIndicator extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			time: 0,
			isOn: false,
			start: 0,
			editActivityFormIsValid: false,
			editActivityRequestSent: false,
			activity: this.props.activity,
			isEditModalOpen:false,
			editActivityData: {}
		};
		this.startTimer = this.startTimer.bind(this);
		this.stopTimer = this.stopTimer.bind(this);
		this.resetTimer = this.resetTimer.bind(this);
		this.resumeTimer = this.resumeTimer.bind(this);
		this.toggleTimer = this.toggleTimer.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.validateForm = this.validateForm.bind(this);
		this.postRecord = this.postRecord.bind(this);
		this.msToTime = this.msToTime.bind(this);
		this.openEditModal = this.openEditModal.bind(this);
		this.closeEditModal = this.closeEditModal.bind(this);
	}

	componentDidMount() {
		this.setState({
			activity: this.props.activity
		})
		;
	}

	openEditModal() {
		this.setState({
			isEditModalOpen: true
		});
	}

	closeEditModal() {
		this.setState({
			isEditModalOpen: false
		});
	}

	componentWillMount() {
		if (this.state.activity.state === "STARTED") {
			this.setState({
				isOn: true,
				time: this.state.activity.duration * 1000
			});
			this.resumeTimer(Date.now() - this.state.activity.duration * 1000);
		}
	}

	postRecord() {
		client.post('/activities/' + this.state.activity.uuid + "/records")
			.then(res => res.json())
			.then(res => {
				this.props.updateActivity(res.data[0]);
				return res;
			});
	}

	startTimer() {
		this.setState({
			isOn: true,
			time: this.state.time,
			start: Date.now() - this.state.time,
			lastRecordedTime: false
		});
		this.timer = setInterval(() => this.setState({
			time: Date.now() - this.state.start
		}), 20);
		this.postRecord();
	}

	resumeTimer(from) {
		this.setState({
			isOn: true,
			time: this.state.time,
			start: from
		});
		this.timer = setInterval(() => this.setState({
			time: Date.now() - this.state.start
		}), 20);
	}

	stopTimer() {
		this.setState({isOn: false});
		clearInterval(this.timer);
		this.setState({lastRecordedTime:convertDuration(this.state.time/1000)});
		this.postRecord();
	}

	resetTimer() {
		this.setState({time: 0, isOn: false});
	}

	toggleTimer() {
		if (this.state.time !== 0 && !this.state.isOn) {
			this.resetTimer();
		}
		if (this.state.isOn) {
			this.stopTimer();
			this.resetTimer();
		}
		else {
			this.startTimer();
		}
	}

	validateForm() {
		let data = this.state.editActivityData;
		let name = data.name || "";
		let description = data.description || "";
		let tag = data.tag || "";
		return name.length >= 3 && description.length >= 10 && tag.length > 0 && !this.state.editActivityRequestSent;
	}

	handleSubmit(event) {
		this.setState({editActivityRequestSent: true});
		client.put('/activities/', JSON.stringify(this.state.editActivityData), this)
			.then(res => res.json())
			.then((res) => {
				if (res.error) {
					this.setState({
						error: res.error
					});
				}
				else {
					this.setState({
						activity: res.data[0],
						editActivityData: res.data[0],
						editActivityRequestSent: false
					});
					location.reload();
				}
			});

		event.preventDefault();
	}


	handleChange(event) {
		let activityData = Object.assign(
			{},
			this.state.editActivityData
		);
		activityData[event.target.name] = event.target.value;

		if (typeof activityData.description === "undefined") {
			activityData.description = this.state.activity.description;
		}

		if (typeof activityData.name === "undefined") {
			activityData.name = this.state.activity.name;
		}

		if (typeof activityData.uuid === "undefined") {
			activityData.uuid = this.state.activity.uuid;
		}

		if (typeof activityData.tag === "undefined") {
			activityData.tag = this.state.activity.tag;
		}

		this.setState({
			editActivityData: activityData,

		}, () => {
			this.setState({
				editActivityFormIsValid: this.validateForm()
			});
		});
	}


	render() {
		const {activity, handleDelete} = this.props;
		let isOn = this.state.isOn;
		const color = (isOn ? colors.pink["400"] : colors.blue["200"]);
		const borderWidth = "1px";
		const logo = <i style={{color: colors.blue["500"], fontSize: "60px"}}
						className="fas fa-stopwatch"> </i>;
		return (
			<div style={{
				padding: "20px 10px",
				color: colors.grey["500"],
				border: borderWidth + " solid " + color,
				borderRadius: "8px",
				marginBottom: "15px",
			}}>
				{this.state.lastRecordedTime && <Message dismissable={true} icon={"far fa-check-circle"} message={"Recorded " + this.state.lastRecordedTime + " of " + activity.name + "!"}/>}

				<Modal ariaHideApp={false} defaultStyles={createDefaultModalStyle()}
					   isOpen={this.state.isEditModalOpen}
					   onRequestClose={this.closeEditModal}
				>
					<div className="col-lg-4" style={{margin: "50px auto"}}>
						<CredentialForm
							title={"Edit " + activity.name}
							error={this.state.connectionError || this.state.error}
							logo={logo}
							inputs={[
								{
									type: "button",
									value: buttonFace("arrow-up-outline", "Update"),
									color: colors.green["600"],
									handler: this.handleSubmit,
									validator: this.state.editActivityFormIsValid
								},
								{
									type: "button",
									value: "Cancel",
									color: colors.red["600"],
									handler: this.closeEditModal,
									validator: () => true
								},
							]}
						>
							<InputField name={"name"} clickable={true} placeholder={activity.name}
										label={"NAME"}
										pattern={".{3,}"}
										handler={this.handleSubmit}
										onChange={this.handleChange}
										color={colors.blue["600"]}
										hint={["Use at least 3 characters."]}/>
							<Select
								id={ "tag"}
								options={["Studies", "Sport", "Relax", "Work", "Hobby", "Travel", "Self-care"]}
								label={"TAG"}
								selectedOption={activity.tag}
								onChange={this.handleChange}
								hint={["Tag your activity."]}
							/>
							<TextArea name={"description"} clickable={true}
									  label={"DESCRIPTION"}
									  placeholder={activity.description}
									  handler={this.handleSubmit}
									  onChange={this.handleChange}
									  pattern={".{10,}"} hint={["Use at least 10 characters."]}
									  editValidator={this.state.editActivityFormIsValid}
									  loading={this.state.editActivityRequestSent}
									  width={250}/>

						</CredentialForm>

					</div>
				</Modal>

				<div style={{float: "left"}}>
					<div style={{float: "left", width: "70px"}}>
						<div style={{width: "40px", margin: "0px auto"}}>
							<Circle url={""} color={colors[decideColor(activity.tag)]}
									title={<i className={"typcn typcn-" + decideIcon(activity.tag)}></i>}/>
						</div>
						<div style={{textAlign: "center", marginTop: "50px"}}>
							<Tag tag={activity.tag.toUpperCase()} color={colors[decideColor(activity.tag)]["500"]}/>
						</div>
					</div>
					<div style={{marginLeft: "80px", width: "170px"}}>
						<InputField name={"name"} placeholder={activity.name}
									pattern={".{3,}"}
									clickable={true}
									color={colors.blue["600"]}
									hint={["Use at least 3 characters."]}
									width={190}/>
					</div>
					<div style={{marginLeft: "80px", width: "190px"}} className={"cf"}>
					<TextArea name={"description"}
							  placeholder={activity.description}
							  pattern={".{10,}"} hint={["Use at least 10 characters."]}
							  clickable={true}
							  width={250}/>
						<div style={{fontSize: "18px"}}>
							<i className={"fas fa-stopwatch" + (isOn ? " pulse" : "")}
							   style={{color: color, marginRight: (isOn ? "10px" : "5px")}}></i>
							<span style={{color: colors.blue["200"]}}>{this.msToTime(this.state.time)}</span>

						</div>
					</div>
					<div className="cf"></div>

				</div>
				<div className="cf" style={{float: "right"}}>
					<div className="cf">
						<Button
							width={"120px"}
							value={buttonFace(isOn ? "media-pause-outline" : "media-play-outline", isOn ? "Stop" : "Start")}
							color={colors.blue["600"]}
							onClick={this.toggleTimer}
						/>
					</div>
					<div style={{marginTop: "15px", marginBottom: "15px"}}>
						<div className="cf">

							<Button
								width={"120px"}
								value={<span>
							<i className={"typcn typcn-edit"}></i>Edit</span>}
								color={colors.green["600"]}
								onClick={this.openEditModal}
							/>
						</div>
					</div>
					<div style={{marginTop: "15px"}}>
						{createDeleteButton(handleDelete)}
					</div>
				</div>
				<div className={"cf"}></div>
			</div>
		);
	}

	msToTime(duration) {
		let milliseconds = parseInt((duration % 1000) / 10),
			seconds = parseInt((duration / 1000) % 60),
			minutes = parseInt((duration / (1000 * 60)) % 60),
			hours = parseInt((duration / (1000 * 60 * 60)) % 24);

		hours = (hours < 10) ? "0" + hours : hours;
		minutes = (minutes < 10) ? "0" + minutes : minutes;
		seconds = (seconds < 10) ? "0" + seconds : seconds;
		milliseconds = (milliseconds < 10) ? "0" + milliseconds : milliseconds;

		return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
	}

}