import React from "react";
import {client} from "../client/APIClient";
import Circle from "../ilma-react/circle/Circle";
import Tab from "../ilma-react/tab/Tab";
import colors from "../ilma-react/colors/colors";
import Button from "../ilma-react/button/Button";
import "../ilma-react/table/table.fx.css";
import Hint from "../ilma-react/hints/Hint";

export default class DashBoard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            records: []
        };

        this.loadActivities = this.loadActivities.bind(this);
        this.convertDuration = this.convertDuration.bind(this);
    }

    loadActivities() {
        client.get('/activities/records')
            .then(res => res.json())
            .then(res => this.setState({records: res.data[0]}, () => console.log(this.state.records)));
    }

    componentDidMount() {
        this.loadActivities();
    }

    render() {
        const numberOfRecords = this.state.records.length;
        return (
            <div>
                <div className="container">
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
        let minutes = Math.floor(seconds/60);
        console.log(minutes);
        let remainingSeconds = seconds % 60;
        if (remainingSeconds < 10) {
            remainingSeconds = "0" + remainingSeconds;
        }

        return minutes + ":" + remainingSeconds + " min";
    }
}