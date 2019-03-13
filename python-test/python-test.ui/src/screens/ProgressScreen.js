import React from 'react'
import {client} from "../client/APIClient";
import Hint from "../web-react/hints/Hint";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import LoadingIndicator from "../web-react/indicators/LoadingIndicator";
import {ProgressBar} from "react-bootstrap";
import "./test.css";
import Tag from "../web-react/tag/Tag";
import colors from "../web-react/colors/colors";
export default class ProgressScreen extends React.Component {
	constructor(props) {
		super(props);
		this.loadProgress = this.loadProgress.bind(this);
		this.state = {
			refresh: setInterval(this.loadProgress, 2000)
		};
	}

	loadProgress() {
		client.get('/pytest/progress', this)
			.then(res => res.json())
			.then(res => {
				this.setState({
					progress: res.data[0],
				});
			});
	}

	render() {
		if (!this.state.progress) {
			return (
				<div className={"container"}>
					<Header/>
					<LoadingIndicator width={128} height={128}/>
					<Footer/>
				</div>
			);
		}
		else {
			let {studentsThatAnswered, totalStudents} = this.state.progress;
			let progress = Math.round((studentsThatAnswered / totalStudents) * 100);
			return (
				<div className={"container"}>
					<Header/>
					<Hint>
						{this.state.progress &&
						<div className={"progressHolder"}>
							<h2>
								This course counts <Tag fontSize={"40px"} color={colors.green["500"]} tag={totalStudents} /> enrolled students.
							</h2>
							<h2>
								<Tag fontSize={"40px"} color={colors.purple["500"]} tag={progress + "%"} /> of you have already answered this little quiz,
							</h2>
							<h2>
								<Tag fontSize={"40px"} color={colors.green["500"]} tag={studentsThatAnswered +"/"+ totalStudents} />  have done it to be more precise 🤓!
							</h2>
							<h2>
								<Tag fontSize={"40px"} color={colors.red["500"]} tag={totalStudents - studentsThatAnswered} /> are still missing!
							</h2>
							<i>Hurry up my friends!</i>
							<center>✌️</center>
							<i>Peace</i>
						</div>}
					</Hint>
					<ProgressBar striped animated variant="info" now={progress}/>
					<Footer/>
				</div>
			);
		}
	}
}