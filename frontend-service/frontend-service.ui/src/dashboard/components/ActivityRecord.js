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
                padding: "10px 10px",
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
                        <div style={{width: "40px", margin: "0px auto"}}>
                            <Circle url={""} color={colors[this.decideColor(record.tag)]}
                                    title={<i className={"typcn typcn-book"}></i>}/>
                        </div>
                        <div style={{textAlign: "right", marginTop: "50px"}}>
                            <Tag tag={record.tag.toUpperCase()} color={colors[this.decideColor(record.tag)]["500"]}/>
                        </div>
                    </div>
                    <div style={{marginLeft: "60px", fontSize: "24px"}}>
                        <div style={{
                            fontSize: "14px",
                            color: colors.blue["500"],
                            margin: "0px auto",
                            paddingBottom: "5px"
                        }}>
                            <Tag tag={this.convertTime(record.startTime).toUpperCase()}
                                 color={colors.blue["400"]}
                                 padding={"5px 25px 5px 5px"}
                            />
                            <span style={{padding: "0 0px", margin: "0 -20px 0 0px"}}>
                            <span style={{
                                width: "100px",
                                height: "26px",
                                marginBottom: "-8px",
                                zIndex: "-100000",
                                display: "inline-block",
                                color: colors.blue["200"]
                            }}>
                                <center>{this.convertDuration(record.duration)}</center>
                            </span>
                            <span style={{
                                borderRadius: "50%",
                                width: "22px",
                                height: "22px",
                                zIndex: "10000",
                                marginLeft: "-122px",
                                backgroundColor: colors.blue["400"],
                                display: "inline-block",
                                color:"white",
                                textAlign:"center"
                            }}><i className={"typcn typcn-media-play"}></i></span>
                            <span style={{
                                borderRadius: "50%",
                                width: "26px",
                                height: "26px",
                                zIndex: "10000",
                                marginLeft: "100px",
                                border: "2px solid white",
                                backgroundColor: colors.pink["400"],
                                display: "inline-block",
                                textAlign:"center",
                                color:"white",
                            }}><i className={"typcn typcn-media-pause"}></i></span>
                            </span>
                            <Tag tag={this.convertTime(record.startTime).toUpperCase()}
                                 padding={"5px 5px 5px 25px"}
                                 color={colors.pink["400"]}/>
                        </div>
                        {record.activityName}
                        <div style={{fontSize: "14px", color: colors.blue["400"]}}>
                            <div style={{marginTop: "-5px"}}><i style={{color: colors.blue["500"], fontSize: "16px"}}
                                                                className="fas fa-stopwatch"> </i> <span
                                style={{
                                    color: colors.blue["200"],
                                    fontSize: "20px"
                                }}> {this.convertDuration(record.duration)}</span>
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

    decideColor(tag) {
        const colors = {
            "sport": "red",
            "relax": "blue",
            "studies": "yellow",
            "work": "pink",
            "travel": "purple",
            "self-care": "orange",
            "hobby": "green"
        };

        return colors[tag.toLowerCase()];
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