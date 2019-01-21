import React from "react";
import colors from "../../web-react/colors/colors"
import Button from "../../web-react/button/Button";
import Tag from "../../web-react/tag/Tag";
import InputField from "../../web-react/input/InputField";
import {client} from "../../client/APIClient";
import "./activityIndicator.fx.css"
import TextArea from "../../web-react/input/TextArea";

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
	}

	componentDidMount() {
		this.setState({
			activity: this.props.activity
		})
		;
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
			});
	}

	startTimer() {
		this.setState({
			isOn: true,
			time: this.state.time,
			start: Date.now() - this.state.time
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
		console.log(this.state.activity);
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
		const color = (isOn ? colors.pink["300"] : colors.blue["200"]);
		const borderWidth = "1px";
		return (
			<div style={{
				padding: "20px 10px",
				color: colors.grey["500"],
				border: borderWidth + " solid " + color,
				borderRadius: "8px",
				marginBottom: "15px",
			}} className="activityButton">
				<div style={{float: "left"}}>
					<Tag tag={activity.tag.toUpperCase()} color={colors.blue["500"]}/>
					<div className={"cf"} style={{marginBottom: "20px"}}></div>

					<InputField name={"name"} clickable={true} placeholder={activity.name}
								handler={this.handleSubmit} onChange={this.handleChange}
								pattern={".{3,}"}
								color={colors.blue["600"]}
								hint={["Use at least 3 characters."]}
								width={300}/>
					<TextArea name={"description"} clickable={true}
							  placeholder={activity.description}
							  handler={this.handleSubmit}
							  onChange={this.handleChange}
							  pattern={".{10,}"} hint={["Use at least 10 characters."]}
							  editValidator={this.state.editActivityFormIsValid}
							  loading={this.state.editActivityRequestSent}
							  width={300}/>
					<div className="cf"></div>
					<div style={{fontSize: "18px"}}>

						<i className={"fas fa-stopwatch" + (isOn ? " pulse" : "")}
						   style={{color: color, marginRight: (isOn ? "10px" : "5px")}}></i>


						<span
							style={{color: colors.blue["200"]}}>{this.msToTime(this.state.time)}</span>
					</div>

				</div>
				<div className="cf" style={{float: "right"}}>
					<div className="cf">
						<Button
							width={"120px"}
							value={<span><i
								className={"typcn typcn-media-" + (isOn ? "pause" : "play") + "-outline"}></i>{isOn ? "Stop" : "Start"}</span>}
							color={colors.blue["600"]}
							onClick={this.toggleTimer}
						/>
					</div>
					<div style={{paddingTop: "15px"}}>
						<Button
							width={"120px"}
							value={<span>
							<i className={"typcn typcn-trash"}></i>Delete</span>}
							color={colors.red["600"]}
							onClick={handleDelete}
						/>
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