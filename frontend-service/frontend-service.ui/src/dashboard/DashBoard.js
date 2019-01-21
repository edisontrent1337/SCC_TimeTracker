import React from "react";
import {client} from "../client/APIClient";
import Circle from "../web-react/circle/Circle";
import Tab from "../web-react/tab/Tab";
import colors from "../web-react/colors/colors";
import Button from "../web-react/button/Button";
import "../web-react/table/table.fx.css";
import Hint from "../web-react/hints/Hint";
import Message from "../web-react/message/Message";
import ActivityRecord from "./components/ActivityRecord";

export default class DashBoard extends React.Component {

    constructor(props) {
        super(props);
        this.loadRecords = this.loadRecords.bind(this);
        this.convertDuration = this.convertDuration.bind(this);
        this.conevertTime = this.convertTime.bind(this);
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
                .then(res => this.setState({records: res.data[0].filter((elem) => elem.state !== "STARTED")}, () => {
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
                                <Button value={<span><i className={"typcn typcn-spiral"}></i>Activities</span>}
                                        color={colors.pink["400"]}
                                        onClick={() => location = '/dashboard/activities'}
                                />
                            </div>
                            <div style={{clear: "both"}}></div>
                        </div>
                        {this.state.records.map((record, i) => {
                            return (
                                <ActivityRecord record={record} key={i}/>
                            );
                        })
                        }
                    </div>
                    }
                    {numberOfRecords === 0 &&
                    <div>
                        <Tab title={"Your Records"}/>
                        <Hint heading={"Nothing here!"}
                              buttonColor={colors.pink["400"]}
                              buttonText={<span><i className={"typcn typcn-spiral"}></i>View Activities</span>}
                              text={"There seem to be no records yet. Head over to your activities to start time tracking!"}
                              callback={() => location += "/activities"}
                        />

                    </div>
                    }
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