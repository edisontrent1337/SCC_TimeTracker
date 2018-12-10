import React from "react";
import colors from "../ilma-react/colors/colors"

export default class Logo extends React.Component {
    render() {
        return (
            <i style={{color: colors.purple["500"], fontSize:"60px", paddingRight:"10px"}} className="fas fa-stopwatch"> </i>
        );
    }
}
