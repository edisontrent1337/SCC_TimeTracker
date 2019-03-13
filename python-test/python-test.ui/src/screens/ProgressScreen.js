import React from 'react'
import {client} from "../client/APIClient";
import Hint from "../web-react/hints/Hint";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

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
					progress: res.data[0]
				});
			});
	}

	render() {
		return (
			<div className={"container"}>
				<Header/>
				<Hint>
					{this.state.progress &&
					<div>
						<h1>
							{Math.round((this.state.progress.studentsThatAnswered / this.state.progress.totalStudents) * 100)}
							% of you have already answered!
						</h1>
						<h1>
							{this.state.progress.studentsThatAnswered} of you have done it!
						</h1>
						<h1>
							{this.state.progress.totalStudents - this.state.progress.studentsThatAnswered} are still
							missing!
						</h1>
					</div>}
				</Hint>
				<Footer/>
			</div>
		);
	}

}