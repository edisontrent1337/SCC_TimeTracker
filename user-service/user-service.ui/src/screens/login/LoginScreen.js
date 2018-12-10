import React from "react";
import {connect} from "react-redux";
import CredentialForm from "../../ilma-react/forms/CredentialForm.js";
import {Jumbotron} from 'react-bootstrap';
import {userActions} from "../../actions/user.actions.js";
import colors from "../../ilma-react/colors/colors.js";

class LoginScreen extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			username: "",
			password: "",
			loginSubmitted: false,
			validForm: false
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.validateForm = this.validateForm.bind(this);
	}

	componentDidMount() {
	}

	handleChange(event) {
		this.setState({
			[event.target.name]: event.target.value,

		}, () => this.setState({
			validForm: this.validateForm()
		}));

	}

	validateForm() {
		return this.state.username.length > 0 && this.state.password.length > 0;
	}

	handleSubmit(event) {
		event.preventDefault();
		const credentials = {
			username: this.state.username,
			password: this.state.password
		};

		this.props.dispatch(userActions.login(credentials));
		this.setState({
			loginSubmitted: true
		});
		window.postMessage("loggedIn","*");
	}

	render() {
		return (
			<Jumbotron
				style={{
					backgroundColor: "#263238",
					borderRadius: "0px",
					color: "#FFF"
				}}
			>
				<div
					className="container"
				>
					<div className="row">
						<div
							className="col-lg-8"
							style={{
								fontSize: "18px"
							}}
						>
							<h1
								style={{
									fontSize: "48px"
								}}
							>
								Built with <br/> Collaboration in mind.
							</h1>
							Ilma offers a free collaboration infrastructure for all parties
							involved in building projects. Start today and use it for:
							<ul>
								<li>
									Distributed collaboration on design, maintenance, operation
									and optimization of buildings,
								</li>
								<li>
									Centralized storage and versioning of Building Information
									Models(BIM IFC),
								</li>
								<li>
									Automation of complex planing and reporting tasks using
									Smart Services.
								</li>
							</ul>
							By signing up you accept the Ilma privacy policies and general
							terms.
						</div>
						<div className="col-lg-4">

							<CredentialForm
								color={colors.blue["500"]}
								title="Sign in to Ilma"
								onChange={this.handleChange}
								error={this.props.error}
								inputs={[
									{
										id: "username",
										type: "text",
										label: "USERNAME or EMAIL"
									},
									{
										id: "password",
										type: "password",
										label: "PASSWORD",
									},
									{
										type: "button",
										value: "Sign In",
										handler: this.handleSubmit,
										validator: this.state.validForm,
										mode: "big"
									}
								]}
								links={[{
									href: "/signup",
									value: "New here? Create an account!"
								}]}
							/>
						</div>
					</div>
				</div>
			</Jumbotron>
		);
	}
}

function mapStateToProps(state) {
	const {token, error} = state.authReducer;
	return {
		token,
		error
	};
}

LoginScreen = connect(mapStateToProps)(LoginScreen);
export default LoginScreen;
