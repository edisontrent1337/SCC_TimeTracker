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
import {client} from "../client/APIClient";
import Highlight from "react-highlight";

export default class TestScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			student: localStorage.getItem("student"),
			selfEvaluation: [],
			answers: [],
			selfEvalAnswered: false,
			confirmationModalIsOpen: false,
			questionsAnswered: false
		};
		this.answerQuestion = this.answerQuestion.bind(this);
		this.answerSelfEvaluation = this.answerSelfEvaluation.bind(this);
		this.openConfirmationModal = this.openConfirmationModal.bind(this);
		this.closeConfirmationModal = this.closeConfirmationModal.bind(this);
		this.handleContinue = this.handleContinue.bind(this);
		this.validateQuestionForm = this.validateQuestionForm.bind(this);
		this.submitResults = this.submitResults.bind(this);
	}

	submitResults() {
		let resultJson = JSON.stringify(
			{
				matriculationNumber: this.state.student,
				answers: this.state.answers,
				selfEvaluation1: this.state.selfEvaluation[0],
				selfEvaluation2: this.state.selfEvaluation[1],
			}
		);
		console.log(resultJson);
		client.post("/pytest/submit", resultJson, this)
			.then(res => res.json())
			.then(res => console.log(res));
	}

	validateQuestionForm() {
		let answers = this.state.answers;
		for (let i = 0; i < answers.length; i++) {
			if (typeof answers[i] === 'undefined') {
				console.log("Not done yet");
				this.setState({
					questionsAnswered: false
				});
				return;
			}
		}
		console.log("DONE");
		this.setState({
			questionsAnswered: true
		});
	}

	answerQuestion(questionID, answerID) {
		let currentAnswers = this.state.answers;
		currentAnswers[questionID] = answerID;
		this.setState({
			answers: currentAnswers
		}, () => this.validateQuestionForm());
	}

	answerSelfEvaluation(questionID, answerID) {
		let currentSelfEvaluation = this.state.selfEvaluation;
		let classification = "ABC";
		currentSelfEvaluation[questionID] = classification[answerID];
		this.setState({
			selfEvaluation: currentSelfEvaluation
		});
	}

	openConfirmationModal() {
		this.setState({
			confirmationModalIsOpen: true
		});
	}

	closeConfirmationModal() {
		this.setState({
			confirmationModalIsOpen: false
		});
	}

	handleContinue() {
		this.setState({
			selfEvalAnswered: true
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
				code: {
					language: 'python',
					code: 'Python 3.6.7 (default, Oct 22 2018, 11:32:17) \n' +
						'[GCC 8.2.0] on linux\n' +
						'Type "help", "copyright", "credits" or "license" for more information.\n' +
						'>>> a = "1"\n' +
						'>>> b = "9"\n' +
						'>>> print(a + b)\n'
				},
				answers: [
					"10",
					"19",
					"TypeError",
					"1 9"]
			},
			{
				question: "What is the result of the following recursion when the starting value is n=0?",
				code: {
					language: 'c',
					code: 'int s(int n) { \n' +
						'    if(n == 20) {\n' +
						'        return 1;\n' +
						'    }\n' +
						'    return n + s(n + 5);\n' +
						'}'
				},
				answers: [
					"6",
					"16",
					"31",
					"RecursionError"]
			},

			{
				question: "Which of the listed statements causes the output 'Loop stopped' not to be printed?",
				image: "q5",
				code: {
				language: 'c',
				code: 'void loop(int n) {\n' +
					'    for (int i = 0; i < n; i++) { \n' +
					'        if (n == 19) {\n' +
					'            ???\n' +
					'         }\n' +
					'    }\n' +
					'    printf("Loop stopped!");\n' +
					'}'
				},
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
							 key={i} id={i} code={q.code}
							 onChange={this.answerSelfEvaluation}/>
		});

		const regularQuestionList = regularQuestions.map((q, i) => {
			return <Question question={(i + 1) + ".) " + q.question} answers={q.answers}
							 additionalInformation={q.additionalInformation}
							 key={i} id={i}
							 image={q.image}
							 code={q.code}
							 onChange={this.answerQuestion}/>
		});

		const logo = <i style={{color: colors.green["500"], fontSize: "60px"}}
						className="fab fa-python"> </i>;

		return (

			<div className={"container"}>
				Hello {this.state.student}.
				<Highlight className={"python"}>
					{"printf('Hello')"}
				</Highlight>
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
				{!this.state.selfEvalAnswered && selfEvalQuestionList}
				{this.state.selfEvalAnswered && regularQuestionList}
				{!this.state.selfEvalAnswered &&
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

				{this.state.selfEvalAnswered && !this.state.questionsAnswered &&
				<div className={"cf"}>
					<Message message={"Please answer all questions above first!"} heading={"Attention:"}/>
				</div>
				}
				{this.state.selfEvalAnswered &&
				<div style={{padding: "10px 0"}}>
					<Button color={colors.green["500"]} value={"Submit"} validator={this.state.questionsAnswered}
							onClick={this.submitResults}/>
				</div>
				}

				<div className={"cf"}></div>

				<Footer/>

			</div>
		);
	}

}