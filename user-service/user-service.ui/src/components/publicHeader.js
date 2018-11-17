import BimbayLogo from "./header/bimbayLogo";

const React = require("react");
const ReactDOM = require("react-dom");

export default class PublicHeader extends React.Component {
    render() {
        return (
            <header style={{padding:"10px", backgroundColor:"#FFF"}}>
                <div className="logo">
                    <BimbayLogo />
                </div>
            </header>
        );
    }
}
