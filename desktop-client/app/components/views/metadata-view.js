import React, { Component } from "react";
import SelectItem from '../common/selectitem'

const optionsMap = {
    testResults: ['-Neg', '+Pos', 'N/A'],
    papResults: ["Normal", "ASC-US", "LSIL", "HSIL", "N/A"],
    bxResults: ["Normal", "CIN1", "CIN2", "CIN3", "N/A"],
    ageBrackets: ['<21', '21-29', '30-65', '>65']
}

/*  will use if we create select entries by iterating over this array
const selectItems = [
    {name: 'hivHx', textlabel: (<span>Most recent <b>HIV</b> test:</span>), options: optionsMap.testResults},
    {name: 'hpvHx', textlabel: (<span>Most recent <b>HPV</b> test:</span>), options: optionsMap.testResults},
]
*/


const entryElementStyle = {
    marginLeft: '5px',
}

class MetadataView extends Component {

    state = {
        patientID: '',
        papHx: '',
        hpvHx: '',
        hivHx: '',
        bxHx: '',
        ageBracket: '',
        viaDx: ''
    };

    handleInputChange = event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit = () => {
        const storage = require('electron-storage')
        storage.set('metadata.json', this.state)
            .then(() => {
                console.log('The file was successfully written to the storage.');
            })
            .catch(err => {
                console.error(err);
            });
    }

    render() {
        return (
            <div style={{textAlign: 'center'}}>
                <h1> Study Metadata </h1>
                <form onSubmit={this.handleSubmit}>
                    <label className="labelformat">
                        <b>Patient ID:</b>
                        <input
                            style={entryElementStyle}
                            name="patientID"
                            type="text"
                            value={this.state.patientID}
                            onChange={this.handleInputChange}
                        />
                    </label>

                    <SelectItem
                        name="hivHx"
                        textlabel={(<span>Most recent <b>HIV</b> test:</span>)}
                        value={this.state.hivHx}
                        onChange={this.handleInputChange}
                        options={optionsMap.testResults}
                    />

                    <SelectItem
                        name="hpvHx"
                        textlabel={(<span>Most recent <b>HPV</b> test:</span>)}
                        value={this.state.hpvHx}
                        onChange={this.handleInputChange}
                        options={optionsMap.testResults}
                    />

                    <SelectItem
                        name="hpvHx"
                        textlabel={(<span>Most recent <b>PAP</b> test:</span>)}
                        value={this.state.papHx}
                        onChange={this.handleInputChange}
                        options={optionsMap.papResults}
                    />

                    <SelectItem
                        name="bxHx"
                        textlabel={(<span><b>Boiopsy</b>:</span>)}
                        value={this.state.bxHx}
                        onChange={this.handleInputChange}
                        options={optionsMap.bxResults}
                    />

                    <SelectItem
                        name="ageBracket"
                        textlabel={(<span><b>Age</b> Bracket:</span>)}
                        value={this.state.ageBracket}
                        onChange={this.handleInputChange}
                        options={optionsMap.ageBrackets}
                    />

                    <SelectItem
                        name="viaDx"
                        textlabel={(<span><b>VIA</b> diagnosis:</span>)}
                        value={this.state.viaDx}
                        onChange={this.handleInputChange}
                        options={optionsMap.testResults}
                    />

                    <input
                        type="submit"
                        value="Submit"
                    />
                </form>
            </div>

        );
    }

}

export default MetadataView;
