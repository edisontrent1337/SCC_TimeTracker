import React from "react";
import {client} from "../client/APIClient";
import Circle from "../web-react/circle/Circle";
import Tab from "../web-react/tab/Tab";
import colors from "../web-react/colors/colors";
import Button from "../web-react/button/Button";
import "../web-react/table/table.fx.css";
import Hint from "../web-react/hints/Hint";
import Message from "../web-react/message/Message";

export default class DashBoard extends React.Component {

	constructor(props) {
		super(props);
		this.loadRecords = this.loadRecords.bind(this);
		this.convertDuration = this.convertDuration.bind(this);
		this.state = {
			records: [],
			activities: [],
			connectionError: undefined,
			refresh: setInterval(this.loadRecords, 3000)
		};
	}

	loadRecords() {
		if (this.state.refresh) {
			client.get('/activities/records', this)
				.then(res => res.json())
				.then(res => this.setState({records: res.data[0]}, () => {
					return this.setState({
						refresh: false,
						connectionError: undefined
					});
				}));
		}
	}

	componentDidMount() {
		this.loadRecords();
	}

	render() {
		const numberOfRecords = this.state.records.length;
		return (
			<div>
				<div className="container">
					{this.state.connectionError &&
					<Message bsStyle={"danger"} heading={this.state.connectionError}
							 message={"Timing Service is currently unavailable."}/>
					}
					{numberOfRecords > 0 &&
					<div>
						<div style={{borderBottom: "1px solid #eceff1", height: "41px", marginBottom: "10px"}}>
							<div style={{float: "left", width: "50%"}}>
								<Tab title={"Your Records"}/>
							</div>
							<div style={{float: "right"}}>
								<Button value="+ New"
										color={colors.green["800"]}
										onClick={this.openCreateModal}
								/>
							</div>
							<div style={{clear: "both"}}></div>
						</div>

						<table>
							<thead>
							<tr>
								<th>Name</th>
								<th>Duration</th>
								<th></th>
							</tr>
							</thead>
							<tbody>
							{this.state.records.map((record, i) => {
								return (
									<tr key={i}>
										<td width="30%">
											<Circle url={""} title={record.activityName}/>
											<a href={""} style={{
												margin: "8px 0px 0px 10px",
												display: "inline-block",
												padding: "0",
												fontWeight: "bold",
												color: colors.grey["800"]
											}}>
												{record.activityName}
											</a>
										</td>
										<td width="50%" style={{color: colors.grey["600"]}}>
											{this.convertDuration(record.duration)}
										</td>
										<td width="20%">
											<div align="right" style={{float: "right"}}>
												<Button
													style={{float: "right"}}
													value={"Details"}
													color={colors.blue["600"]}
													onClick={() => location.href = url}
												/>
											</div>
										</td>
									</tr>
								);
							})}
							</tbody>
						</table>
					</div>
					}
					{numberOfRecords === 0 &&
					<div>
						<Tab title={"Your Records"}/>
						<Hint heading={"Nothing here!"}
							  buttonText={"Create Record"}
							  text={"There seem to be no records yet. But don't worry - You can start collaboration now by creating your very first project!"}
						/>

					</div>
					}
				</div>
			</div>
		);
	}

	convertDuration(seconds) {
		let minutes = Math.floor(seconds / 60);
		console.log(minutes);
		let remainingSeconds = seconds % 60;
		if (remainingSeconds < 10) {
			remainingSeconds = "0" + remainingSeconds;
		}

		return minutes + ":" + remainingSeconds + " min";
	}
}