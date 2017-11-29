import React, { Component } from "react";
import './selectstyle.css';

class SelectItem extends Component {

    render() {
        return (
            <label className="labelformat">
                {this.props.textlabel}
                <select
                    className="entryformat"
                    name={this.props.name}
                    value={this.props.value}
                    onChange={this.props.onChange}>
                    { this.props.options.map((item) => <option key={item} value={item}> {item} </option> ) }
                </select>
            </label>
        );
    }

}

export default SelectItem;
