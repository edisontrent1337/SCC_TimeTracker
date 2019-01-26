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
						<div style={{width: "40px", margin: "0px auto"}}>
							<Circle url={""} color={colors[decideColor(record.tag)]}
									title={<i className={"typcn typcn-book"}></i>}/>
						</div>
						<div style={{textAlign: "center", marginTop: "50px"}}>
							<Tag tag={record.tag.toUpperCase()} color={colors[decideColor(record.tag)]["500"]}/>
						</div>
						<div style={{width:"60px", margin:"10px auto 0 auto", display:"block"}}>
							<Button value={buttonFace("trash", "")} width={60} color={colors.red["600"]} onClick={handleDelete}/>
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
								width: "120px",
								marginLeft: "18px",
								background: "linear-gradient(to bottom," + colors.pink["100"] + "," + colors.blue["100"] + ")",
							}}>
								<div style={{
									fontSize: "16px",
									padding: "10px 0",
									paddingLeft: "10px",
									marginLeft: "4px",
									backgroundColor: "white",
									color:colors.grey["700"],
									height: "60px"
								}}>
									{record.activityName}
									<br/>
									<span style={{color:colors.green["500"], fontWeight:"bold"}}>
									<i style={{color: colors.green["400"], paddingRight: "5px"}}
									   className="fas fa-stopwatch"> </i>
									{this.convertDuration(record.duration)}
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
								height: "60px"
							}}>
								<center style={{
									fontSize: "14px",
									padding: "10px 0",
									paddingLeft: "5px",
									marginLeft: "4px",
									backgroundColor: "white",
									height: "60px"
								}}>
								</center>
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


	convertDuration(seconds) {
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