import React from "react";
import colors from "../../web-react/colors/colors";

export default class Footer extends React.Component{
	constructor(props) {
		super(props);

	}

	render() {
		return (
			<div style={{marginTop:"20px"}}>
				<center style={{color:colors.blueGrey["600"]}}>
					crafted with ❤️ by <a href={"https://github.com/edisontrent1337"}> Sinthujan Thanabalasingam</a>
					<br/>
					&copy; 2019 Robolab TU Dresden
				</center>
			</div>
		);
	}

}