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
import Header from "../components/header/Header";
import LoadingIndicator from "../web-react/indicators/LoadingIndicator";

export default class TestScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			student: localStorage.getItem("student"),
			selfEvaluation: [],
			answers: [],
			selfEvalAnswered: false,
			confirmationModalIsOpen: false,
			submitModalIsOpen: false,
			questionsAnswered: false,
			answersSubmitted: false,
			mounted: false,
			regularQuestions: [
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
			]

		};
		this.answerQuestion = this.answerQuestion.bind(this);
		this.answerSelfEvaluation = this.answerSelfEvaluation.bind(this);
		this.openConfirmationModal = this.openConfirmationModal.bind(this);
		this.closeConfirmationModal = this.closeConfirmationModal.bind(this);
		this.openSubmitModal = this.openSubmitModal.bind(this);
		this.closeSubmitModal = this.closeSubmitModal.bind(this);
		this.handleContinue = this.handleContinue.bind(this);
		this.submitResults = this.submitResults.bind(this);
		this.getAlreadySubmittedResults = this.getAlreadySubmittedResults.bind(this);
	}

	getAlreadySubmittedResults() {
		client.get("/pytest/results/" + this.state.student, this)
			.then(res => res.json())
			.then(res => {
				this.setState({
					mounted: true
				});
				console.log(res);
				if (!res.error) {
					this.setState({
						answersSubmitted: true
					})
				}
			});
	}

	componentDidMount() {
		let initializedAnswers = [];
		this.state.regularQuestions.forEach(() => {
			initializedAnswers.push(-1);
		});
		this.setState({
			answers: initializedAnswers,
		}, () => console.log(this.state.answers));
		this.getAlreadySubmittedResults();
	}


	submitResults() {
		this.closeSubmitModal();
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
			.then(res => {
				if (!res.error) {
					this.setState({
						answersSubmitted: true
					});
				}
			});
	}

	answerQuestion(questionID, answerID) {
		let currentAnswers = this.state.answers;
		currentAnswers[questionID] = answerID;
		this.setState({
			answers: currentAnswers
		});
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

	openSubmitModal() {
		this.setState({
			submitModalIsOpen: true
		});
	}

	closeSubmitModal() {
		this.setState({
			submitModalIsOpen: false
		});
	}

	handleContinue() {
		this.setState({
			selfEvalAnswered: true
		});
		this.closeConfirmationModal();
		window.scrollTo(0, 0);
	}

	render() {
		if (!this.state.mounted) {
			return <LoadingIndicator width={64} height={64}/>
		}
		if (!this.state.student) {
			return (

				<div className={"container"}>
					<Header/>
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
		if (this.state.answersSubmitted) {
			return (
				<div className={"container"}>
					<Header/>
					<div>
						<Message heading={"Thank you."}
								 message={"We received your submitted your answers."}/>
					</div>
					<div className={"cf"}>
						<Button value={"Go Back"} color={colors.green["500"]} onClick={() => window.location = "/"}/>
					</div>
					<Footer/>
				</div>
			)
		}

		const selfEvalQuestions = [
			{
				question: "How would you rate your programming skills?",
				answers: ["🤓 Good to very good knowledge", "🙂 Basic knowledge", "🙁 Some or no knowledge"]
			},
			{
				question: "How much experience do you have with collaborative software development (e.g. projects on Github)?",
				answers: ["🤓 Good to very good experience", "🙂 Basic experience", "🙁 Some or no experience"]
			}
		];
		const selfEvalQuestionList = selfEvalQuestions.map((q, i) => {
			return <Question question={q.question} answers={q.answers} additionalInformation={q.additionalInformation}
							 key={i} id={i} code={q.code}
							 onChange={this.answerSelfEvaluation}/>
		});

		const regularQuestionList = this.state.regularQuestions.map((q, i) => {
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

			<div className={"container"} id={"top"}>
				<Header/>

				<div style={{margin: "20px 0"}}>
					<Highlight className={"python"}>
						{"printf('👋 Hello " + this.state.student + ".')"}
					</Highlight>
				</div>
				<h2>Self Evaluation</h2>
				<p>The following questions help to classify you in terms of your experience with software development
					in general.<br/> Only <b>one</b> answer is correct for each question.</p>
				{!this.state.selfEvalAnswered && <Message heading={"Important Hint:"}
														  message={"This test is not part of the examination or your grade. It only serves as " +
														  "an orientation for the organizers of Robolab to ensure balanced and fair groups."}
														  dismissable={true}/>}

				{!this.state.selfEvalAnswered && <Message dismissable={true} heading={"Important Hint:"}
														  message={"Please answer the following self evaluation questions " +
														  "honestly. It's okay if you have only little experience in software development. That's why you are here! 👍"}/>}
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


				<Modal ariaHideApp={false} defaultStyles={createDefaultModalStyle()}
					   isOpen={this.state.submitModalIsOpen}
					   onRequestClose={this.closeSubmitModal}
				>
					<div className="col-lg-4" style={{margin: "50px auto"}}>
						<CredentialForm
							title="Submit your answers"
							hint={"Are you sure you want to submit your answers?"}
							error={this.state.connectionError || this.state.error}
							logo={logo}
							inputs={[
								{
									type: "button",
									value: buttonFace("arrow-forward-outline", "Continue"),
									validator: () => true,
									loading: this.state.requestSent,
									handler: this.submitResults,
									color: colors.green["800"],
								},
								{
									type: "button",
									value: "Cancel",
									color: colors.red["800"],
									handler: this.closeSubmitModal,
									validator: () => true
								},
							]}
						/>
					</div>
				</Modal>

				{this.state.connectionError &&
				<div>
					<Message message={this.state.connectionError + ": Python Test Service is unavailable."}
							 heading={"Connection Error:"} bsStyle={"danger"}/>
				</div>}
				{this.state.selfEvalAnswered &&
				<div style={{padding: "10px 0"}}>
					<Button color={colors.green["500"]} value={"Submit"} validator={true}
							onClick={() => this.openSubmitModal()}/>
				</div>
				}

				<div className={"cf"}></div>


				<Footer/>

			</div>
		);
	}

}