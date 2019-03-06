import React from 'react';
import colors from "../../web-react/colors/colors";
import Answer from "./Answer";
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
	}

}