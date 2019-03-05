import React from "react";
import CredentialForm from "../web-react/forms/CredentialForm";
import colors from "../web-react/colors/colors";
import Message from "../web-react/message/Message";
import {client} from "../client/APIClient";

export default class EnterTestScreen extends React.Component {
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.state = {
			givenAnswers: [],
			enterRequestSent: false,
			validForm: false,
			matriculationNumber: undefined
		};
		localStorage.removeItem("student");
	}

	handleSubmit(event) {
		this.setState({
			enterRequestSent: true
		});

		client.post("/pytest/enter", JSON.stringify({matriculationNumbers: [this.state.matriculationNumber]}), this)
			.then(res => res.json())
			.then((res) => {
				if (res.error) {
					this.setState({
						error: res.error,
						requestSent: false
					})
				}
				else {
					localStorage.setItem("student", res.data[0].matriculationNumbers[0]);
					window.location = "/test";
				}
			});

		event.preventDefault();
	}

	handleChange(event) {
		this.setState({
			[event.target.name]: event.target.value,

		}, () => {
			this.setState({
				validForm: this.validateForm()
			});
		});

	}

	validateForm() {
		return this.state.matriculationNumber > 1000000 && this.state.matriculationNumber <= 9999999;
	}

	render() {
		const logo = <i style={{color: colors.green["500"], fontSize: "60px"}}
						className="fab fa-python"> </i>;
		return (
			<div>
				<div className="container">
					<Message heading={"Important hint"}
							 message={"This test is not part of the examination or your grade. It only serves as " +
							 "an orientation for the organizers of Robolab to ensure balanced and fair groups."}
							 dismissable={true}/>
					<div className="col-lg-4" style={{margin: "50px auto"}}>
						<CredentialForm
							color={colors.green["500"]}
							title={<span>Robolab 2019 <br/> Python Test</span>}
							onChange={this.handleChange}
							error={this.state.error}
							logo={logo}
							inputs={[
								{
									id: "matriculationNumber",
									type: "text",
									label: "MATRICULATION NUMBER",
									pattern: "[\\d]{7}",
									maxLength: 7,
									hint: ["Enter your matriculation number. If you have difficulties to log in, please" +
									" talk to the organizers."]
								},
								{
									type: "button",
									value: "Enter",
									mode: "big",
									handler: this.handleSubmit,

									validator: this.state.validForm
								}
							]}
						/>


					</div>
				</div>
			</div>
		);
	}
}