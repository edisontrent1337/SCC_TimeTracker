const React = require("react");
const ReactDOM = require("react-dom");

export default class ProjectsPrivateHeader extends React.Component {
    render() {
        return (
            <div>
                <a>
                    <img
                        src="/images/hamburger_placeholder.png"
                        style={{ height: "30px", width: "30px" }}
                    />
                </a>
                <span className="text-center" style={{ color: "#9013fe" }}>
                    BIMBay
                </span>
            </div>
        );
    }
}
