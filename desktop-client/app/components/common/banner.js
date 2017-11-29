import React, { Component, PropTypes } from "react";
import './banner/banner.css'

class Banner extends Component {

    render() {
        return (
        <div
            className="banner"
            style={this.props.style}>
            {this.props.text}
        </div>
        )
    }
}

export default Banner;
