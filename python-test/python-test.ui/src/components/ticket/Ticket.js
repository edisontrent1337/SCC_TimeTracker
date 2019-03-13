import React from "react";
import "./ticket.fx.css"
import colors from "../../web-react/colors/colors";

export default class Ticket extends React.Component {

	constructor(props) {
		super(props);

	}

	render() {
		return (
			<div className="box" style={{
				backgroundColor: colors.lightGreen["100"],
				color: colors.green["800"]
			}}>
				<div className='inner' style={{border: "2px dashed " + colors.green["600"]}}>
					<h1 style={{borderBottom: "1px solid " + colors.green["200"]}}>+++ Group Assignment +++</h1>
					<div className='info clearfix'>
						<div className='wp'>--- You are ---<h4>{this.props.matriculationNumber}</h4></div>
						<div className='wp'>--- Your Group ---<h4>{this.props.group}</h4></div>
						<div className='wp'>--- Your Room ---<h4>{this.props.room}</h4></div>
					</div>
					<div className='total clearfix' style={{borderTop: "1px solid " + colors.green["200"]}}>
						<h2>Thanks! <p>Enjoy Robolab 2019!</p></h2>
					</div>
				</div>
			</div>
		);
	}

}