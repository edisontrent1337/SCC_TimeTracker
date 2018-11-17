import BimbayLogo from "./bimbayLogo";
import ProjectsPrivateHeader from "./projects";
import UserPrivateHeader from "./user";

const React = require('react');
const ReactDOM = require('react-dom');

export default class PrivateHeader extends React.Component {

	render() {
		return (
			<header className="header bg-white border border-right-0 border-top-0 border-left-0">
				<div className="container">
					<div className="d-flex justify-content-between">
						<div className="w-25">
							<ProjectsPrivateHeader/>
						</div>
						<div className="logo">
							<BimbayLogo/>
						</div>
						<div className="w-25">
							<UserPrivateHeader/>
						</div>
					</div>
				</div>
			</header>
		);
	}
}
