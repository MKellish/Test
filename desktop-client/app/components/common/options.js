import React, { Component, PropTypes } from "react";
import ReactDom from "react-dom";

// Options is a light React wrapper around select
class Options extends Component {
	state = {
		value: ""
	}

	handleChange = e => {
		this.setState({value: e.target.value}, () => { 
			this.props.onChange(this.state.value);
		});
	}

	render() {
		return (
			<div style={this.props.style}>
			<select onChange={this.handleChange} value={this.state.value}>
				{
					this.props.options.map( item => {
						return (
							<option value={item.value} key={item.key}>{item.text}</option>
						)
					})
				}
			</select>
			</div>
		);
	}
}

Options.propTypes = {
	options: PropTypes.array.isRequired,
}

export default Options;
