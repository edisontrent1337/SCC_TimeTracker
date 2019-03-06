import React from "react";
import colors from "../../web-react/colors/colors";
import "./answer.fx.css";

export default class Answer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			clicked: false
		};
	}


	render() {
		const {answer, onClick, id, selected} = this.props;
		return (
			<a className={"answer"} style={{
				border: "1px solid " + (selected ? colors.green["500"] : colors.blueGrey["100"]),
				borderRadius: "8px",
				padding: "30px 20px",
				marginBottom: "10px",
				display: "block",
				backgroundColor: selected ? colors.green["100"] : "transparent",
			}} onClick={
				() => {
					onClick(id);
				}

			}>
				<div style={{
					float: "left",
					width: "90%",
					fontSize: "20px",
					color: (selected ? colors.green["500"] : colors.blueGrey["800"])
				}}>{answer}</div>
				<div style={{marginLeft: "100%"}} className={"cf"}>
					<div className={"cf"} style={{
						width: "20px",
						borderRadius: "100%",
						height: "20px",
						marginLeft: "-20px",
						border: "1px solid " + colors.green["500"]
					}}></div>

					<div className={"radio"} style={{
						width: "10px",
						borderRadius: "100%",
						height: "10px",
						backgroundColor: selected ? colors.green["500"] : "transparent",
						margin: "-15px 10px 0 -15px"
					}}></div>
				</div>
			</a>
		);
	}
}