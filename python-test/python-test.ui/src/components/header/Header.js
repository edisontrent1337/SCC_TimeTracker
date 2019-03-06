import React from "react";
import colors from "../../web-react/colors/colors";
import robolab from "../../../img/robolab.png";

export default class Header extends React.Component{
	constructor(props) {
		super(props);

	}
	render() {
		return (
				<div style={{width: "100%", borderBottom: "1px solid" + colors.blueGrey["100"], padding:"10px"}}>
					<div style={{float:"left", width:"50px"}}>
						<div style={{width:"48px", height:"48px", borderRadius:"10px", backgroundImage: "url(" + robolab + ")", backgroundSize:"cover", backgroundRepeat: "no-repeat" }}>
						</div>
					</div>
					<div className={"cf"} style={{margin:"10px 0 0 60px"}}>
						<h3>Robolab 2019</h3>
					</div>
				</div>
		);
	}

}