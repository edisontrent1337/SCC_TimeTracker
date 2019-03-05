import React from "react";
import Message from "../web-react/message/Message";
import Button from "../web-react/button/Button";
import colors from "../web-react/colors/colors";

export default class TestScreen extends React.Component {
	constructor(props) {
		super(props);

	}

	render() {
		if (!localStorage.getItem("student")) {
			return (
				<div className={"container"}>
					<Message bsStyle={"danger"} heading={"An error occurred."}
							 message={"You are not authorized to participate. Please enter your matriculation number " +
							 "at the login page."}/>
					<Button value={"Go Back"} color={colors.green["500"]} onClick={() => window.location = "/"}/>
				</div>
			);
		}
		return (
			<div>
				Hello {localStorage.getItem("student")}.
			</div>
		);
	}

}