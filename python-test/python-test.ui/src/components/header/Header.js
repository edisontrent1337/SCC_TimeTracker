import React from "react";
import colors from "../../web-react/colors/colors";
import robolab from "../../../img/robolab.png";

export default class Header extends React.Component {
	constructor(props) {
		super(props);

	}
	render() {
		return (
			<div style={{width: "100%", borderBottom: "1px solid" + colors.blueGrey["100"], padding: "10px"}}>
				<div style={{float: "left", width: "50px"}}>
					<a href={"/"} style={{
						width: "48px",
						height: "48px",
						display: "block",
						borderRadius: "10px",
						backgroundImage: "url(" + robolab + ")",
						backgroundSize: "cover",
						backgroundRepeat: "no-repeat"
					}}>
					</a>
				</div>
				<div className={"cf"} style={{margin: "0px 0 0 60px"}}>
					<h3>RoboLab 2019</h3>
					<h5 style={{marginTop:"-15px", color: colors.green["800"]}}>Python Skill Test</h5>
				</div>
			</div>
		);
	}

}