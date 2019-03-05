import React from "react";
import {connect} from "react-redux";
import CredentialForm from "../../../web-react/forms/CredentialForm.js";
import {Jumbotron} from 'react-bootstrap';
import {userActions} from "../../actions/user.actions.js";
import colors from "../../../web-react/colors/colors.js";

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
		window.postMessage("loggedIn", "*");
	}

	render() {
		const logo = <i style={{color: colors.blue["500"], fontSize: "60px"}}
						className="fas fa-stopwatch"> </i>;

		return (
			<Jumbotron
				style={{
					backgroundColor: colors.blue["500"],
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
									fontSize: "48px",
									textAlign: "center"
								}}
							>
								<span style={{color: "#ffffff", fontSize: "24px"}}>
									<i style={{paddingRight: "10px"}} className="fas fa-bed"> </i>
									<i style={{paddingRight: "10px"}} className="fas fa-graduation-cap"> </i>
									<i style={{paddingRight: "10px"}} className="fas fa-utensils"> </i>
									<i style={{paddingRight: "10px"}} className="fas fa-football-ball"> </i>
									<i style={{paddingRight: "10px"}} className="fas fa-hammer"> </i>
									<i style={{paddingRight: "10px"}} className="fas fa-laptop-code"> </i>
									<i style={{paddingRight: "10px"}} className="fas fa-dumbbell"> </i>
									<i style={{paddingRight: "10px"}} className="fas fa-building"> </i>
									<i style={{paddingRight: "10px"}} className="fas fa-theater-masks"> </i>
									<i style={{paddingRight: "10px"}} className="fas fa-book"> </i>
									<i style={{paddingRight: "10px"}} className="fas fa-shower"> </i>
								</span>
								<br/>
								Your time is precious. <br/> Track your investments!
							</h1>
							TimeTracker is a tool that allows you to track the amount of time for different activities
							that you take part in daily in your life.
							<br/> TimeTracker helps to find hot spots or recognize patterns in the way you spend your
							time.
							<br/> We offer the following features:
							<ul>
								<li>
									Create Activities and categories
								</li>
								<li>
									Store time records of your activities
								</li>
								<li>
									See statistics and find patterns in your time management.
								</li>
							</ul>

						</div>
						<div className="col-lg-4">

							<CredentialForm
								color={colors.blue["500"]}
								title={<span>Sign in to <br/> TimeTracker</span>}
								onChange={this.handleChange}
								error={this.props.error}
								logo={logo}
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
							By signing up you accept the TimeTracker privacy policies and general
							terms.
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
