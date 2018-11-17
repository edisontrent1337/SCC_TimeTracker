const React = require('react');
const ReactDOM = require('react-dom');
const client = require('../client');

import { Link } from 'react-router-dom'

export default class BreadCrumb extends React.Component {
    constructor(props) {
        super(props);
    }
/*

                    <span><Link to = {crumb.link}>{crumb.name}  &frasl; </Link></span>
*/
    render() {

        return (
            <div className="mb-4">
                {this.props.data.links.map((crumb,ind) => {
                    return (
                        <span key={ind}>
                            <Link to = {crumb.link}>{crumb.name}</Link>
                            <span> &frasl; </span>
                        </span>
                )
                })}
                <span>{this.props.data.current}</span>
            </div>
        );
    }
}