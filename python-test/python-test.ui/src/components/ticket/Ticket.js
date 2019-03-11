import React from "react";
import "./ticket.fx.css"

export default class Ticket extends React.Component {

	constructor(props) {
		super(props);

	}

	render() {
		return (
			<div className="box">
				<div className='inner'>
					<h1>Student {this.props.matriculationNumber}</h1>
					<div className='info clearfix'>
						<div className='wp'>Group<h2>{this.props.group}</h2></div>
						<div className='wp'>Room<h2>{this.props.room}</h2></div>
					</div>
					<div className='total clearfix'>
						<h2>Enjoy your internship!</h2>
					</div>
				</div>
			</div>
		);
	}

}