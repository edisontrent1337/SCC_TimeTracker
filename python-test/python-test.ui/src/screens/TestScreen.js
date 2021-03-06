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
import Select from "../web-react/input/Select";
import Ticket from "../components/ticket/Ticket";
import Hint from "../web-react/hints/Hint";

export default class TestScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			student: localStorage.getItem("student"),
			selfEvaluation: [],
			answers: [],
			error: undefined,
			studies: "informatik",
			selfEvalAnswered: false,
			confirmationModalIsOpen: false,
			submitModalIsOpen: false,
			questionsAnswered: false,
			answersSubmitted: false,
			groupNumber: undefined,
			mounted: false,
			regularQuestions: [
				{
					question: "Which of the following statements is true in the context of object-oriented programming?",
					answers: [
						"Objects are declarations of a class.",
						"Objects are instances of a class.",
						"Objects can be part of a class.",
						"Objects describe class attributes."]
				},

				{
					question: "When writing classes in Python, the following method plays an important role. Which of the following statements is not true?",
					additionalInformation: "This is an example class that models a car.",
					code: {
						language: "python",
						code: "class Car:\n" +
							"  def __init__(self):\n" +
							"    self.wheels = 4\n" +
							"    self.doors = 5\n" +
							"    self.color = \"green\""
					},
					answers: [
						"It serves as a constructor to build objects.",
						"It can be used to call parent constructors.",
						"It serves as the destructor of objects.",
						"It sets the object's attributes to meaningful values."]
				},
				{
					question: "Which number is not part of the list?",
					code: {
						language: "python",
						code: "list = [i for i in range(0,10) if i % 2 == 0]"
					},
					answers: ["2", "6", "0", "3"]
				},

				{
					question: "What is the output printed to the Python console?",
					code: {
						language: 'python',
						code: 'Python 3.6.7 (default, Oct 22 2018, 11:32:17) \n' +
							'[GCC 8.2.0] on linux\n' +
							'Type "help", "copyright", "credits" or "license" for more information.\n' +
							'>>> first = [10]\n' +
							'>>> second = first\n' +
							'>>> second.append(1337)\n' +
							'>>> print(first)\n'
					},
					answers: [
						"[10, 1337]",
						"None",
						"[]",
						"[10]"]
				},
				{
					question: "What will happen on execution of these instructions?",
					code: {
						language: "python",
						code: 'Python 3.6.7 (default, Oct 22 2018, 11:32:17) \n' +
							'[GCC 8.2.0] on linux\n' +
							'Type "help", "copyright", "credits" or "license" for more information.\n' +
							'>>> inf = {"RoboLab": 1, "Math": 3, "RA": 2}\n' +
							'>>> print(inf[1])'
					},
					answers: [
						"RoboLab",
						"RoboLab: 1",
						"Math: 3",
						"KeyError ",
					]
				},
				{
					question: "What is the output printed to the Python console?",
					code: {
						language: 'python',
						code: 'Python 3.6.7 (default, Oct 22 2018, 11:32:17) \n' +
							'[GCC 8.2.0] on linux\n' +
							'Type "help", "copyright", "credits" or "license" for more information.\n' +
							'>>> kelvin_scale = "-273.15 °C"\n' +
							'>>> temp_indoor = "15 °C"\n' +
							'>>> print(temp_indoor in kelvin_scale)\n'
					},
					answers: [
						"288.15 K",
						"-258.15 °C",
						"15 °C in -273.15 °C",
						"True"]
				},
				{
					question: "What is the output printed to the Python console?",
					code: {
						language: 'python',
						code: 'def a():\n' +
							'    r = 0\n' +
							'    a = 1\n' +
							'    while True:\n' +
							'        a * 2\n' +
							'        r = 4 * a\n' +
							'        a += 1\n' +
							'        if a == 3:\n' +
							'          break\n' +
							'    return r\n' +
							'\n' +
							'print(a())\n'
					},
					answers: [
						"0",
						"8",
						"12",
						"64"
					]
				},

				{
					question: "Which elements are part of the resulting set?",
					code: {
						language: "python",
						code: 'super6 = [8,9,12,12,13,14]\n' +
							'super = set()\n' +
							'for x in super6:\n' +
							'    if not (x % 2):\n' +
							'        super.add(x)\n' +
							'\n' +
							'print(super)'
					},
					answers: ["{9, 13}", "{8, 12, 14}", "{9, 12, 14}", "{8, 12, 12, 14}"]
				},
				{
					question: "What is the output printed to the Python console?",
					code: {
						language: "python",
						code: 'class C:\n' +
							'    def __init__(self, v):\n' +
							'        self.value = v\n' +
							'    def __getitem__(self, item):\n' +
							'        return C(item * 2)\n' +
							'    def __mod__(self, other):\n' +
							'        return str(self.value) + str(other.value)\n' +
							'a = C(10)\n' +
							'b = a[3]\n' +
							'print(a % b)'
					},
					answers: [
						"10<__main__.C object at 0x7fac3b08fb00>",
						"4",
						"106",
						"TypeError: unsupported operand type(s) for %: 'C' and 'C'",
					]
				},

				{
					question: "What is the output printed to the Python console?",
					code: {
						language: "python",
						code: 'Python 3.6.7 (default, Oct 22 2018, 11:32:17) \n' +
							'[GCC 8.2.0] on linux\n' +
							'Type "help", "copyright", "credits" or "license" for more information.\n' +
							'>>> [x % 2 for x in map(lambda x: x[1] + x[-1], [(1,2),(2,1)])]\n'
					},
					answers: [
						"KeyError",
						"IndexError",
						"[0, 0]",
						"[0, 1]",
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
		this.handleSelect = this.handleSelect.bind(this);
		TestScreen.getRoomNumber = TestScreen.getRoomNumber.bind(this);
	}

	getAlreadySubmittedResults() {
		client.get("/pytest/results/" + this.state.student, this)
			.then(res => res.json())
			.then(res => {
				this.setState({
					mounted: true
				});
				if (!res.error) {
					this.setState({
						answersSubmitted: true,
						groupNumber: res.data[0].groupNumber
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
		});
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
				studies: this.state.studies
			}
		);
		client.post("/pytest/submit", resultJson, this)
			.then(res => res.json())
			.then(res => {
				if (!res.error) {
					this.setState({
						answersSubmitted: true
					});
					this.getAlreadySubmittedResults();
				}
				else {
					this.setState({
						error: res.error
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

	handleSelect(event) {
		this.setState({
			studies: event.target.value
		});
		event.preventDefault();
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
					<div style={{padding: "20px 0"}}>
						<Highlight className={"python"}>
							{"print('👋 Hello " + this.state.student + ".')"}
						</Highlight>
						{!this.state.groupNumber &&
						<Message heading={"Thank you. We have received your answers."} bsStyle={"success"}
								 message={"Please check back here in some minutes while we crunch the numbers for ya 🤓."}/>}
						{this.state.groupNumber !== 0 &&
						<div className={"container"}>
							<Hint heading={"🤯The oracle has spoken!🤯"}>
								<p>Our <i>super powerful</i> server crunched the numbers and came up with something
									smart.
									🤓</p>
								<p>Below, you find your not so golden ticket for your RoboLab 2019:</p>
							</Hint>
							<Ticket matriculationNumber={this.state.student}
									room={TestScreen.getRoomNumber(this.state.groupNumber)}
									group={"1" + (this.state.groupNumber < 10 ? "0" + this.state.groupNumber : this.state.groupNumber)}
							/>

							<div className={"cf"} style={{margin: "20px 0", texAlign: "left"}}>
								<Message bsStyle={"success"} heading={"Great! You've just won the group lottery. 🤩"} dismissable={true}
										 message={"Now, You only need to find your group members and get your Robot case."}/>
							</div>

						</div>
						}
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
			return <Question question={(i + 1) + ". " + q.question} answers={q.answers}
							 additionalInformation={q.additionalInformation}
							 key={i} id={i}
							 image={q.image}
							 code={q.code}
							 onChange={this.answerQuestion}/>
		});

		const logo = <i style={{color: colors.green["500"], fontSize: "60px"}}
						className="fab fa-python"> </i>;

		let selfEvalAnswered = this.state.selfEvalAnswered;
		return (

			<div className={"container"} id={"top"}>
				<Header/>

				<div style={{margin: "20px 0"}}>
					<Highlight className={"python"}>
						{"print('👋 Hello " + this.state.student + ".')"}
					</Highlight>
				</div>

				<h2>Self Evaluation</h2>
				<p>Hey there! Welcome to the Python Skill Test for RoboLab 2019. The following questions help to
					classify you in terms of your experience with software development
					in general.<br/> Only <b>one</b> answer is correct for each question.</p>
				{!selfEvalAnswered && <div>
					<Message heading={"Don't panic!"}
							 message={"This test is not part of the examination or your grade. It only serves as " +
							 "an orientation for the organizers of RoboLab to ensure balanced and fair groups."}
							 dismissable={true}/>

					<Message dismissable={true} heading={"Also, before I forget: "}
							 message={"Please answer the following self evaluation questions " +
							 "honestly. It's okay if you have only little experience in software development. That's why you are here! 👍"}/>
					<Question question={"What's your course studies?"} answers={[]}>
						<Message bsStyle={"danger"} heading={"Attention:"}
								 message={"Please make sure to select the correct course studies below."}/>
						<Select options={["Informatik", "Medieninformatik", "Physik", "Informationssystemtechnik"]}
								name={"studies"} id={"studies"} hint={["Please select your course studies."]}
								onChange={this.handleSelect}/>
					</Question>
					{selfEvalQuestionList}
					<Button validator={
						typeof this.state.selfEvaluation[0] !== "undefined" &&
						typeof this.state.selfEvaluation[1] !== "undefined" &&
						typeof this.state.studies !== "undefined"}
							value={"Continue"} color={colors.green["500"]}
							onClick={() => this.openConfirmationModal()}/>
				</div>}
				<div className={"cf"}>
					{selfEvalAnswered && regularQuestionList}
				</div>

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
				{this.state.error &&
				<div>
					<Message message={this.state.error}
							 heading={"An error occurred:"} bsStyle={"danger"}/>
				</div>}
				{selfEvalAnswered &&
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

	static getRoomNumber(groupNumber) {
		if (groupNumber < 8)
			return "E001";
		else if (groupNumber < 15)
			return "E005";
		else if (groupNumber < 22)
			return "E006";
		else if (groupNumber < 29)
			return "E007";
		else if (groupNumber < 36)
			return "E008";
		else if (groupNumber < 43)
			return "E009";
		else if (groupNumber < 50)
			return "E010";
	}
}