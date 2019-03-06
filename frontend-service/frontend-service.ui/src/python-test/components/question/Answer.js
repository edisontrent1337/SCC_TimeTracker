import React from "react";
import colors from "../../web-react/colors/colors";

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
			<a style={{
				border: "1px solid " + colors.blueGrey["100"],
				borderRadius: "8px",
				padding: "20px 20px",
				marginBottom: "20px",
				display: "block"
			}} onClick={
				() => {
					onClick(id);
				}

			}>
				<div style={{float: "left", width: "90%",}}>{answer}</div>
				<div style={{marginLeft: "90%"}}>
					<div className={"cf"} style={{
						width: "20px",
						borderRadius: "100%",
						height: "20px",
						border: "1px solid " + colors.green["500"]
					}}></div>
					<div className={"cf"} style={{
						width: "10px",
						borderRadius: "100%",
						height: "10px",
						backgroundColor: selected ? colors.green["500"] : "transparent",
						margin: "-15px 10px 0 5px"
					}}></div>
				</div>
			</a>
		);
	}
}