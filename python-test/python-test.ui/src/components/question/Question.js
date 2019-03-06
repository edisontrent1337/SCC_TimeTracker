import React from 'react';
import colors from "../../web-react/colors/colors";
import Answer from "./Answer";
import q3 from "../../../img/q3_x4.png";
import q4 from "../../../img/q4.png";
import q5 from "../../../img/q5.png";
import q6 from "../../../img/q6.png";
import q7 from "../../../img/q7.png";
import q8 from "../../../img/q8.png";
import Highlight from "react-highlight";

export default class Question extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			numberOfAnswers: this.props.answers.length,
			answers: this.props.answers,
			clickedAnswer: undefined,
			id: this.props.id
		};
		this.selectAnswer = this.selectAnswer.bind(this);
		this.getImage = this.getImage.bind(this);
	}

	selectAnswer(id, i) {
		this.setState({
			clickedAnswer: i
		});
		this.props.onChange(id, i);
	}

	render() {
		const {question, answers, additionalInformation} = this.props;
		const answerList = answers.map((answer, i) => {
			return <Answer key={i} id={i} selected={i === this.state.clickedAnswer} answer={answer}
						   onClick={() => this.selectAnswer(this.state.id, i)}/>
		});
		return (
			<div style={{color: colors.blueGrey["800"], marginBottom:"30px"}}>
				<h4><i style={{padding:"0 10px 0 0"}} className="far fa-lightbulb"></i>{question}</h4>
				<i style={{fontSize:"20px"}}>{additionalInformation}</i>
				<div style={{padding:"10px 0", maxWidth: "100%"}}>

					{this.props.code && <Highlight className={this.props.code.language}> {this.props.code.code}</Highlight>}
				</div>
				{answerList}
			</div>
		);
	}

	getImage() {
		const {image} = this.props;
		if (image === "q3") {
			return q3;
		}
		if (image === "q4") {
			return q4;
		}
		if (image === "q5") {
			return q5;
		}
		if (image === "q6") {
			return q6;
		}
		if (image === "q7") {
			return q7;
		}
		if (image === "q8") {
			return q8;
		}
	}

}