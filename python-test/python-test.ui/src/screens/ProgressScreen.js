import React from 'react'
import {client} from "../client/APIClient";
import Hint from "../web-react/hints/Hint";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import LoadingIndicator from "../web-react/indicators/LoadingIndicator";
import {ProgressBar} from "react-bootstrap";
import "./test.css";
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
						<div>
							<h1>
								{totalStudents} are enrolled this year.
							</h1>
							<h1>
								{progress} % of you have already answered!
							</h1>
							<h1>
								{studentsThatAnswered} of you have done it!
							</h1>
							<h1>
								{totalStudents - studentsThatAnswered} are still
								missing!
							</h1>
						</div>}
					</Hint>
					<ProgressBar striped animated variant="info" now={progress}/>
					<Footer/>
				</div>
			);
		}
	}
}