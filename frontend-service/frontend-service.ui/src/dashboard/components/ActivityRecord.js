import React from "react";
import colors from "../../web-react/colors/colors";
import Circle from "../../web-react/circle/Circle";
import Tag from "../../web-react/tag/Tag";
import Button from "../../web-react/button/Button";
import {buttonFace} from "../../web-react/button/ButtonFactory";

export default class ActivityRecord extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {record, handleDelete} = this.props;
		return (
			<div style={{
				color: colors.grey["500"],
				borderRadius: "8px",
			}}>
				<div style={{
					margin: "0px 0px 0px 10px",
					display: "inline-block",
					padding: "0",
					color: colors.blue["400"]
				}}>

					<div style={{float: "left", width: "70px"}}>
						<div style={{width: "60px", margin: "0px auto 0 auto", display: "block"}}>
							<div className={"cf"}>
								<Button value={buttonFace("edit", "")} width={60} color={colors.green["600"]}/>
							</div>
							<div style={{marginTop: "10px"}}>
								<Button value={buttonFace("trash", "")} width={60} color={colors.red["600"]}
										onClick={handleDelete}/>
							</div>
						</div>

					</div>
					<div style={{marginLeft: "80px", fontSize: "24px"}}>

						<div style={{
							fontSize: "14px",
							color: colors.blue["500"],
							width: "150px",
						}}>
							<i style={{
								marginRight: "-20px",
								borderRadius: "50% 0px 0px 50%",
								backgroundColor: colors.pink["400"],
								display: "inline-block",
								color: "white",
								textAlign: "center", width: "22px", height: "22px"
							}} className={"typcn typcn-media-play"}></i>
							<Tag tag={this.convertTime(record.startTime).toUpperCase()}
								 color={colors.pink["400"]}
								 padding={"5px 5px 5px 25px"}
							/>
							<div style={{
								margin: "14px, 0",
								display: "block",
								width: "200px",
								marginLeft: "18px",
								background: "linear-gradient(to bottom," + colors.pink["100"] + "," + colors.blue["100"] + ")",
							}}>
								<div style={{
									fontSize: "16px",
									padding: "10px 0",
									paddingLeft: "10px",
									marginLeft: "4px",
									backgroundColor: "white",
									color: colors.blue["700"],
									height: "100px"
								}}>

									<div style={{marginLeft: "-32px"}}>
										<Circle url={""} color={colors[decideColor(record.tag)]}
												title={<i className={"typcn typcn-" + decideIcon(record.tag)}></i>}/>
									</div>
									<span style={{marginLeft: "10px", display: "inline-block"}}>
											{record.activityName}
										<div style={{display: "block", marginTop: "8px"}}>
											<Tag tag={record.tag.toUpperCase()}
												 color={colors[decideColor(record.tag)]["500"]}/>
									</div>

									<span style={{
										color: colors.green["500"],
										display: "inline-block",
										marginTop: "8px"
									}}>
									<i style={{color: colors.green["400"], paddingRight: "5px"}}
									   className="fas fa-stopwatch"> </i>
										{convertDuration(record.duration)}
									</span>
		<div>
									</div>

									</span>

								</div>
							</div>

							<i style={{
								borderRadius: "50% 0px 0px 50%",
								width: "22px",
								height: "22px",
								marginRight: "-20px",
								backgroundColor: colors.blue["400"],
								display: "inline-block",
								textAlign: "center",
								color: "white",
							}}
							   className={"typcn typcn-media-pause"}></i>
							<Tag tag={this.convertTime(record.endTime).toUpperCase()}
								 padding={"5px 5px 5px 25px"}
								 color={colors.blue["400"]}/>

							<div style={{
								margin: "14px, 0",
								display: "block",
								width: "120px",
								marginLeft: "18px",
								background: "linear-gradient(to bottom," + colors.blue["100"] + "," + colors.pink["100"] + ")",
								height: "70px",
							}}>
								<div style={{
									fontSize: "14px",
									padding: "10px 0",
									paddingLeft: "5px",
									marginLeft: "4px",
									backgroundColor: "white",
									height: "70px",
									paddingTop: "35px"
								}}>
									<hr style={{
										height: "1px",
										margin: "0 0 -25px -100px",
										padding: "0",
										display: "block"
									}}/>


									<div style={{marginLeft: "-25px"}}>

										<div>
											<Circle fontSize={"16px"} url={""} color={colors.grey}
													title={<i style={{paddingTop:"10px"}} className="fas fa-stop-circle"></i>}/>
										</div>
										<span style={{color:colors.grey["400"], backgroundColor:"white", margin:"7px 0 0 10px", padding:"5px", display:"inline-block"}}>
											{this.props.pause}
										</span>
									</div>
								</div>
							</div>
						</div>

					</div>
				</div>

			</div>
		);
	}

	convertTime(time) {
		return new Date(time).toString().substr(0, 11) + new Date(time).toString().substr(16, 5);
	}


}

export function convertDuration(seconds) {
	let minutes = Math.floor(seconds / 60);
	let hours = Math.floor(minutes / 60);
	let remainingSeconds = seconds % 60;
	let remainingMinutes = minutes % 60;
	if (remainingSeconds < 10) {
		remainingSeconds = "0" + remainingSeconds;
	}
	if (remainingMinutes < 10) {
		remainingMinutes = "0" + remainingMinutes;
	}

	let suffix = (hours > 0 ? "h" : (minutes > 0 ? "min" : "s"));

	return (hours > 0 ? hours + ":" : "") + remainingMinutes + ":" + remainingSeconds + " " + suffix;
}

export function decideColor(tag) {
	const colors = {
		"sport": "red",
		"relax": "blue",
		"studies": "yellow",
		"work": "pink",
		"travel": "purple",
		"self-care": "orange",
		"hobby": "green"
	};

	let result = colors[tag.toLowerCase()];
	if (typeof result === "undefined") {
		result = "blue";
	}

	return result;
}

export function decideIcon(tag) {
	const colors = {
		"sport": "social-dribbble",
		"relax": "weather-sunny",
		"studies": "mortar-board",
		"work": "coffee",
		"travel": "plane-outline",
		"self-care": "heart-outline",
		"hobby": "leaf"
	};

	let result = colors[tag.toLowerCase()];
	if (typeof result === "undefined") {
		result = "blue";
	}

	return result;
}