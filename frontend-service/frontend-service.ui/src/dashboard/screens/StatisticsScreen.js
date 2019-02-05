import React from "react";
import LoadingIndicator from "../../web-react/indicators/LoadingIndicator";
import {client} from "../../client/APIClient";
import Message from "../../web-react/message/Message";
import Tag from "../../web-react/tag/Tag";
import {convertDuration, decideColor} from "../components/ActivityRecord";
import Container from "../../web-react/container/Container";

export default class StatisticsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            statisticsData: undefined,
            mostActiveUser: undefined
        };
        this.loadStatisticsData = this.loadStatisticsData.bind(this);
        this.loadStatisticsData();
    }

    loadStatisticsData() {
        client.get("/stats", this)
            .then(res => res.json())
            .then(res => {
                console.log(res.data[0]);
                this.setState({
                        statisticsData: res.data[0]
                    }, () => client.getUserName(this.state.statisticsData.mostActiveUserUUID)
                        .then(res => res.json())
                        .then(res => this.setState({
                            mostActiveUser: res.username
                        }))
                )
            });
    }


    render() {
        if (this.state.statisticsData === undefined || this.state.mostActiveUser === undefined) {
            return <LoadingIndicator width={64} height={64}/>
        }
        else {
            const stats = this.state.statisticsData;
            return (
                <div className={"container"}>
                    <Container>
                        <div>Total number of users: {stats.timeTrackingUsers} </div>
                        <div>Most active user: {this.state.mostActiveUser} with {convertDuration(stats.timeForUserWithMostTrackedTime)}</div>
                        <div>Most tracked tag: <Tag color={decideColor(stats.mostTrackedTag)}
                                                    tag={stats.mostTrackedTag}/> with {convertDuration(stats.mostTrackedTagTime)}</div>
                        <div>Total created activities: {stats.totalCreatedActivities}</div>
                        <div>Total created records: {stats.totalTrackedRecords}</div>
                    </Container>
                </div>
            );
        }
    }

}