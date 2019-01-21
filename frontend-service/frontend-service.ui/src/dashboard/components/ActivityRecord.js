import React from "react";
import colors from "../../web-react/colors/colors";
import Circle from "../../web-react/circle/Circle";
import Tag from "../../web-react/tag/Tag";

export default class ActivityRecord extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {record} = this.props;
        return (
            <div style={{
                padding: "20px 10px",
                color: colors.grey["500"],
                border: "1px solid " + colors.blue["200"],
                borderRadius: "8px",
                marginBottom: "15px",
            }}>
                <div style={{
                    margin: "0px 0px 0px 10px",
                    display: "inline-block",
                    padding: "0",
                    color: colors.blue["400"]
                }}>
                    <div style={{float: "left", width: "50px"}}>
                        <Circle url={""} title={<i className={"typcn typcn-book"}></i>}/>
                        <div className={"cf"} style={{marginTop: "50px"}}>
                            <Tag tag={record.tag.toUpperCase()} color={colors.blue["500"]}/>
                        </div>
                    </div>
                    <div style={{marginLeft: "60px", fontSize: "24px"}}>
                        {record.activityName}
                        <div style={{fontSize:"14px", color:colors.grey["500"]}}>
                            <div>from: <span style={{color:colors.blue["400"]}}> {this.convertTime(record.startTime)}</span></div>
                            <div>to: <span style={{color:colors.blue["400"]}}> {this.convertTime(record.endTime)}</span></div>
                            <div>Duration: <span style={{color:colors.blue["400"]}}> {this.convertDuration(record.duration)}</span></div>
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