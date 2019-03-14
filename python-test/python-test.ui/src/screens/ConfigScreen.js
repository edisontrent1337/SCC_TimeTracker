import React from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Button from "../web-react/button/Button";
import colors from "../web-react/colors/colors";
import {client} from "../client/APIClient";
import Message from "../web-react/message/Message";
import TextArea from "../web-react/input/TextArea";
import CredentialForm from "../web-react/forms/CredentialForm";

export default class ConfigScreen extends React.Component {


	constructor(props) {
		super(props);
		this.resetTest = this.resetTest.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.validateForm = this.validateForm.bind(this);
		this.handleSubmitCorrectAnswers = this.handleSubmitCorrectAnswers.bind(this);
		this.concludeTest = this.concludeTest.bind(this);
		this.getResults = this.getResults.bind(this);
		this.handleSubmitWeight = this.handleSubmitWeight.bind(this);
		this.state = {
			resetMessage: undefined,
			results: undefined,
			resultRequestSent: false,
			validForm: false,
			conclusionResult: undefined,
			addParticipantsMessage: undefined,
			setCorrectAnswersMessage: undefined,
			setWeightMessage: undefined,
			correctAnswers: undefined,
			numberOfResults: 0,
			forgottenMatriculationNumber: undefined
		};
	}

	handleSubmitCorrectAnswers(event) {
		let answers = this.state.correctAnswers.split(',');
		client.post("/pytest/config/answers", JSON.stringify({answers: answers}), this)
			.then(res => res.json())
			.then((res) => {
				if (res.error) {
					this.setState({
						error: res.error
					})
				}
				else {
					this.setState({
						setCorrectAnswersMessage: "Set answers to: " + res.data[0].answers
					});
				}
			});

		event.preventDefault();
	}


	handleSubmitWeight() {
		client.post("/pytest/config/weight", JSON.stringify({weight: this.state.weight}), this)
			.then(res => res.json())
			.then((res) => {
				if (res.error) {
					this.setState({
						error: res.error
					})
				}
				else {
					this.setState({
						setWeightMessage: "Set question weight to: " + res.data[0].weight
					});
				}
			});
	}

	handleSubmit(event) {
		this.setState({
			addParticipantsMessage: undefined,
			enterRequestSent: true
		});

		client.post("/pytest/config/participants", JSON.stringify({matriculationNumbers: [this.state.forgottenMatriculationNumber]}), this)
			.then(res => res.json())
			.then((res) => {
				if (res.error) {
					this.setState({
						error: res.error,
						requestSent: false
					})
				}
				else {
					this.setState({
						addParticipantsMessage: res.data[1]
					});
				}
			});

		event.preventDefault();
	}

	handleChange(event) {
		this.setState({
			[event.target.name]: event.target.value,
			addParticipantsMessage: undefined,
			setCorrectAnswersMessage: undefined,
			setWeightMessage: undefined
		}, () => {
			this.setState({
				validForm: this.validateForm()
			});
		});

	}

	validateForm() {
		return this.state.forgottenMatriculationNumber > 1000000 && this.state.forgottenMatriculationNumber <= 9999999;
	}

	getResults() {
		client.get("/pytest/results", this)
			.then(res => res.json())
			.then(res => this.setState({
				results: res.data[0].csv,
				numberOfResults: res.data[0].count,
				conclusionResult: undefined,
				resultRequestSent: true
			}));
	}

	resetTest() {
		client.get("/pytest/reset", this)
			.then(res => res.text())
			.then(res => this.setState({
				resetMessage: res,
				results: undefined,
				conclusionResult: undefined
			}));
	}

	concludeTest() {
		client.get("/pytest/conclude", this)
			.then(res => res.text())
			.then(res => this.setState({
				conclusionResult: res
			}));
	}

	handleAuthentication() {
		client.authenticate("/login", JSON.stringify({
			username: this.state.username,
			password: this.state.password,
			role: "user"
		})).then(res => res.json()).then(res => {
			console.log(res);
			if (res.error) {
				this.setState({
					error: res.error
				});
			}
			else {
				localStorage.setItem("user", JSON.stringify(res));
				location.reload();
			}
		});
	}


	render() {
		if (!localStorage.getItem("user")) {
			return <div className={"container"}>
				<Header/>

				<div className="col-lg-4" style={{margin: "20px auto"}}>
					<div>
						<Message heading={"As if I would leave this unprotected..."} message={"Nice try."}/>
					</div>
					<CredentialForm
						color={colors.green["500"]}
						title={<span>Sign in to <br/> edit the configuration</span>}
						onChange={this.handleChange}
						error={this.props.error}
						inputs={[
							{
								id: "username",
								type: "text",
								label: "USERNAME "
							},
							{
								id: "password",
								type: "password",
								label: "PASSWORD",
							},
							{
								type: "button",
								value: "Sign In",
								handler: this.handleAuthentication.bind(this),
								mode: "big"
							}
						]}
					/>
				</div>
				<Footer/>
			</div>
		}
		return (
			<div className={"container"}>
				<Header/>
				<div className={"cf"}>
					<div className="col-lg-4" style={{margin: "20px auto"}}>
						{this.state.addParticipantsMessage &&
						<Message bsStyle={"success"} heading={"Success!"} message={this.state.addParticipantsMessage}/>
						}
						<CredentialForm
							color={colors.green["500"]}
							title={<span>Add a missing student</span>}
							onChange={this.handleChange}
							error={this.state.error}
							inputs={[
								{
									id: "forgottenMatriculationNumber",
									type: "text",
									label: "MATRICULATION NUMBER",
									pattern: "[\\d]{7}",
									maxLength: 7,
									hint: ["Enter the matriculation number."]
								},
								{
									type: "button",
									value: "Add Student",
									mode: "big",
									handler: this.handleSubmit,
									validator: this.state.validForm
								}
							]}
						/>
					</div>
				</div>
				<div className={"cf"}>
					<div className="col-lg-4" style={{margin: "20px auto"}}>
						{this.state.setCorrectAnswersMessage &&
						<Message bsStyle={"success"} heading={"Success!"}
								 message={this.state.setCorrectAnswersMessage}/>
						}
						<CredentialForm
							color={colors.green["500"]}
							title={<span>Set the correct answers</span>}
							onChange={this.handleChange}
							error={this.state.error}
							inputs={[
								{
									id: "correctAnswers",
									type: "text",
									label: "CORRECT ANSWERS",
									hint: ["Enter the correct answers sequence. 0 = First answer, 1 = Second answer ..."]
								},
								{
									type: "button",
									value: "Set correct answers",
									mode: "big",
									handler: this.handleSubmitCorrectAnswers
								}
							]}
						/>
					</div>
				</div>

				<div className={"cf"}>
					<div className="col-lg-4" style={{margin: "20px auto"}}>
						{this.state.setWeightMessage &&
						<Message bsStyle={"success"} heading={"Success!"}
								 message={this.state.setWeightMessage}/>
						}
						<CredentialForm
							color={colors.green["500"]}
							title={<span>Set weight of difficult questions</span>}
							onChange={this.handleChange}
							error={this.state.error}
							inputs={[
								{
									id: "weight",
									type: "text",
									label: "WEIGHT",
									hint: ["Enter the weight for difficult questions. 4 = less, 3 = more etc."]
								},
								{
									type: "button",
									value: "Set weight",
									mode: "big",
									handler: this.handleSubmitWeight
								}
							]}
						/>
					</div>
				</div>

				<div className={"cf"}
					 style={{padding: "20px 0", borderBottom: "1px solid " + colors.blueGrey["100"]}}>
					<h3>Get Test Results</h3>
					<p>Reset all results of existing participants.</p>
					<div className={"cf"} style={{marginBottom: "20px"}}>
						<Button value={"Get Results"} color={colors.green["500"]} onClick={this.getResults}/>
					</div>
					{(this.state.numberOfResults < 6 && this.state.resultRequestSent) &&
					<div style={{marginTop: "20px"}}><Message heading={"Attention:"}
															  message={this.state.numberOfResults === 0 ? "No results yet submitted." : "Not enough results have been submitted to start group assignment."}/>
					</div>}
					{this.state.results &&
					<div className={"cf"}>
						<Message heading={"Success!"} bsStyle={"success"}
								 message={this.state.numberOfResults + " Students have already answered."}/>
						<TextArea height={600} value={this.state.results}/>
					</div>
					}
				</div>

				<div className={"cf"}
					 style={{padding: "20px 0", borderBottom: "1px solid " + colors.blueGrey["100"]}}>
					<h3>Conclude Test</h3>
					<p>Concludes the test, dividing the students into groups.</p>
					<div className={"cf"} style={{margin: "20px 0"}}>
						<Button value={"Conclude Test"} color={colors.green["500"]} onClick={this.concludeTest}/>
					</div>
					{this.state.conclusionResult &&
					<div className={"cf"}>
						<Message bsStyle={"success"} heading={"Success!"}
								 message={"Here are the results of the group assignments:"}/>
						<TextArea height={600} value={this.state.conclusionResult}/>
					</div>}
				</div>
				<Footer/>
			</div>
		);
	}
}