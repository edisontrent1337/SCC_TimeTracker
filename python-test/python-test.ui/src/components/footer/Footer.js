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
					crafted with 🧠 and  ️❤️ by <a href={"https://github.com/edisontrent1337"}> Sinthujan Thanabalasingam</a>
					<div>
						<a href="/config">Configuration</a> | <a href="/progress">Progress</a>
					</div>
					&copy; 2019 RoboLab TU Dresden
				</center>
			</div>
		);
	}

}