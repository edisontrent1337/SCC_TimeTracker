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
                padding: "10px 0px",
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

                    <div style={{float: "left", width: "70px"}}>
                        <div style={{width: "40px", margin: "0px auto"}}>
                            <Circle url={""} color={colors[decideColor(record.tag)]}
                                    title={<i className={"typcn typcn-book"}></i>}/>
                        </div>
                        <div style={{textAlign: "center", marginTop: "50px"}}>
                            <Tag tag={record.tag.toUpperCase()} color={colors[decideColor(record.tag)]["500"]}/>
                        </div>
                    </div>
                    <div style={{marginLeft: "80px", fontSize: "24px"}}>
                        {record.activityName}
                        <div style={{
                            fontSize: "14px",
                            color: colors.blue["500"],
                            margin: "0px auto",
                            paddingBottom: "5px",
                            paddingTop:"8px"
                        }}>
                            <Tag tag={this.convertTime(record.startTime).toUpperCase()}
                                 color={colors.pink["400"]}
                                 padding={"5px 25px 5px 5px"}
                            />
                            <span style={{padding: "0 0px", margin: "0 -20px 0 0px"}}>
                            <span style={{
                                width: "70px",
                                height: "26px",
                                zIndex: "-100000",
                                display: "inline-block",
                                color: colors.grey["700"],
                            }}>
                                <center style={{fontSize: "14px"}}>{this.convertDuration(record.duration)}</center>
                            </span>
                            <i style={{
                                marginLeft: "-90px",
                                borderRadius: "50%", backgroundColor: colors.pink["400"],
                                display: "inline-block",
                                color: "white",
                                textAlign: "center", width: "22px", height: "22px"
                            }} className={"typcn typcn-media-play"}></i>
                            <i style={{
                                borderRadius: "50%",
                                zIndex: "10000",
                                width: "25px",
                                height: "25px",
                                marginLeft: "66px",
                                border: "2px solid white",
                                backgroundColor: colors.blue["400"],
                                display: "inline-block",
                                textAlign: "center",
                                color: "white",
                            }}
                               className={"typcn typcn-media-pause"}></i>
                            </span>
                            <Tag tag={this.convertTime(record.startTime).toUpperCase()}
                                 padding={"5px 5px 5px 25px"}
                                 color={colors.blue["400"]}/>
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
    if(typeof result === "undefined") {
        result = "blue";
    }

    return result;
}