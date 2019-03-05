import React from "react";
import Message from "../web-react/message/Message";
import Button from "../web-react/button/Button";
import colors from "../web-react/colors/colors";
import Footer from "../components/footer/Footer";
import Question from "../components/question/Question";
import Modal from "react-modal";
import CredentialForm from "../web-react/forms/CredentialForm";
import {createDefaultModalStyle} from "../web-react/utils/ModalFactory";
import {buttonFace} from "../web-react/button/ButtonFactory";

export default class TestScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			student: localStorage.getItem("student"),
			selfEvaluation: [],
			answers: [],
			evaluationAnswered: false,
			confirmationModalIsOpen: false
		};
		this.answerQuestion = this.answerQuestion.bind(this);
		this.answerSelfEvaluation = this.answerSelfEvaluation.bind(this);
		this.openConfirmationModal = this.openConfirmationModal.bind(this);
		this.closeConfirmationModal = this.closeConfirmationModal.bind(this);
		this.handleContinue = this.handleContinue.bind(this);
	}

	answerQuestion(questionID, answerID) {
		let currentAnswers = this.state.answers;
		currentAnswers[questionID] = answerID;
		this.setState({
			answers: currentAnswers
		}, () => console.log(this.state));
	}

	answerSelfEvaluation(questionID, answerID) {
		let currentSelfEvaluation = this.state.selfEvaluation;
		let classification = "ABC";
		currentSelfEvaluation[questionID] = classification[answerID];
		this.setState({
			selfEvaluation: currentSelfEvaluation
		}, () => console.log(this.state));
	}

	openConfirmationModal() {
		this.setState({
			confirmationModalIsOpen: true
		});
		console.log("sfdsfds");
	}

	closeConfirmationModal() {
		this.setState({
			confirmationModalIsOpen: false
		});
	}

	handleContinue() {
		this.setState({
			evaluationAnswered: true
		});
		this.closeConfirmationModal();
	}

	render() {
		if (!this.state.student) {
			return (
				<div className={"container"}>
					<Message bsStyle={"danger"} heading={"An error occurred."}
							 message={"You are not authorized to participate. Please enter your matriculation number " +
							 "at the login page."}/>
					<div className={"cf"}>
						<Button value={"Go Back"} color={colors.green["500"]} onClick={() => window.location = "/"}/>
					</div>
					<Footer/>
				</div>
			);
		}

		const selfEvalQuestions = [
			{
				question: "How would you rate your programming skills?",
				answers: ["Good to very good knowledge", "Basic knowledge", "Some or no knowledge"]
			},
			{
				question: "How much experience do you have with collaborative software development (e.g. projects on Github)?",
				answers: ["Good to very good experience", "Basic experience", "Some or no experience"]
			}
		];

		const regularQuestions = [

			{
				question: "What distinguishes objects from classes in object-oriented programming?",
				answers: [
					"Objects are declarations of a class",
					"Objects are instances of a class",
					"Objects are part of a class",
					"Objects describe class attributes"]
			},
			{
				question: "Which approach would you use to implement the following task with as little code as possible?",
				additionalInformation: "Gather all leaves of a binary tree",
				answers: [
					"Imperative approach",
					"Iterative approach",
					"Recursive approach"]
			},
			{
				question: "What is the output on the Python console?",
				image: "q3",
				answers: [
					"10",
					"19",
					"TypeError",
					"1 9"]
			},
			{
				question: "What is the result of the following recursion when the starting value is n=0?",
				image: "q4",
				answers: [
					"6",
					"16",
					"31",
					"RecursionError"]
			},

			{
				question: "Which of the listed statements causes the output 'Loop stopped' not to be printed?",
				image: "q5",
				answers: [
					"continue;",
					"return;",
					"break;"]
			},

			{
				question: "You see the following error message in the python console. Which python statement is missing " +
					"for  the code to work?",
				image: "q6",
				answers: [
					"import sqrt",
					"from math import sqrt",
					"import math",
					"import math.sqrt",
				]
			},
			{
				question: "What is printed on the python console?",
				image: "q7",
				answers: [
					"TypeError",
					"Hello <__main__Container object at 0x7fb7f3f7668>",
					"Hello",
					"Hello 1337",
				]
			},

			{
				question: "What is printed on the python console?",
				image: "q8",
				answers: [
					"[1]",
					"IndexError",
					"[1,2]",
					"[2]",
				]
			},
		];

		const selfEvalQuestionList = selfEvalQuestions.map((q, i) => {
			return <Question question={q.question} answers={q.answers} additionalInformation={q.additionalInformation}
							 key={i} id={i}
							 onChange={this.answerSelfEvaluation}/>
		});

		const regularQuestionList = regularQuestions.map((q, i) => {
			return <Question question={(i + 1) + ".) " + q.question} answers={q.answers}
							 additionalInformation={q.additionalInformation}
							 key={i} id={i}
							 image={q.image}
							 onChange={this.answerQuestion}/>
		});

		const logo = <i style={{color: colors.green["500"], fontSize: "60px"}}
						className="fab fa-python"> </i>;

		return (

			<div className={"container"}>
				Hello {this.state.student}.
				<h2>Self Evaluation</h2>
				<p>The following questions help to classify you in terms of your experience with software development
					in general.</p>
				<Message heading={"Important Hint:"}
						 message={"This test is not part of the examination or your grade. It only serves as " +
						 "an orientation for the organizers of Robolab to ensure balanced and fair groups."}
						 dismissable={true}/>
				<Message dismissable={true} heading={"Important Hint:"}
						 message={"Please answer the following self evaluation questions " +
						 "honestly. It's okay if you have only little experience in software development. That's why you are here! 👍"}/>
				{!this.state.evaluationAnswered && selfEvalQuestionList}
				{this.state.evaluationAnswered && regularQuestionList}
				{!this.state.evaluationAnswered &&
				<Button validator={
					typeof this.state.selfEvaluation[0] !== "undefined" &&
					typeof this.state.selfEvaluation[1] !== "undefined"}
						value={"Continue"} color={colors.green["500"]}
						onClick={() => this.openConfirmationModal()}/>}

				<div className={"cf"}></div>

				<Modal ariaHideApp={false} defaultStyles={createDefaultModalStyle()}
					   isOpen={this.state.confirmationModalIsOpen}
					   onRequestClose={this.closeConfirmationModal}
				>
					<div className="col-lg-4" style={{margin: "50px auto"}}>
						<CredentialForm
							title="Continue to coding questions"
							hint={"Are you sure you want to continue? Please check if your answers to the self evaluation reflect your skills."}
							error={this.state.connectionError || this.state.error}
							logo={logo}
							inputs={[
								{
									type: "button",
									value: buttonFace("arrow-forward-outline", "Continue"),
									validator: () => true,
									loading: this.state.requestSent,
									handler: this.handleContinue,
									color: colors.green["800"],
								},
								{
									type: "button",
									value: "Cancel",
									color: colors.red["800"],
									handler: this.closeConfirmationModal,
									validator: () => true
								},
							]}
						/>
					</div>
				</Modal>
				<Footer/>

			</div>
		);
	}

}