import { Form, FormGroup, FormControl, ControlLabel, InputGroup } from 'react-bootstrap';

const React = require('react');
const ReactDOM = require('react-dom');



export default class FlowDetailsPanel extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
			typeOptions: [
				{
					type:"round",
					text:"Rundbecken"},
				{
					type:"rect",
					text:"Rechteckbecken"
				}
			],
			structures: [
				{
					structure:"BIO_NKB",
					text:"Biolog. Stufe | Nachklärung"
				},
                {
                    structure:"MECH_NKB",
                    text:"Mechan. Stufe | Nachklärung"
                },
                {
                    structure:"OZON_NKB",
                    text:"Ozonoier. Stufe | Nachklärung"
                },
				{
                    structure:"BIO_VKB",
                    text:"Biolog. Stufe | Vorklärung"
                },
                {
                    structure:"MECH_VKB",
                    text:"Mechan. Stufe | Vorklärung"
                },
                {
                    structure:"OZON_VKB",
                    text:"Ozonoier. Stufe | Vorklärung"
                },
			],
		};

		this.onChange = this.onChange.bind(this);
    }

    onChange(event){
    	let data = this.props.data;
    	if(!!event.target.name) {
            data[event.target.name] = event.target.value;
            this.props.onDataChange(data);
        }
	}



	render() {
		return (
				<form>
					<FormGroup>
						<ControlLabel>Struktur</ControlLabel>
						<FormControl componentClass="select" name="structure" onChange={this.onChange}>
                            {this.state.structures.map((structure, ind) => {
                                var selected = "";
                                if(structure.structure == this.props.data.structure){
                                    selected="selected";
                                }
                                return (
									<option value={structure.structure} selected={selected}>{structure.text}</option>
                                )
                            })}
						</FormControl>
					</FormGroup>
					<FormGroup>
						<ControlLabel>Name</ControlLabel>
						<FormControl type="text" name="name" value={this.props.data.name} onChange={this.onChange}/>
					</FormGroup>
					<hr/>
					<FormGroup>
						<ControlLabel>Breite</ControlLabel>
						<FormControl type="text" name="width" value={this.props.data.width} onChange={this.onChange}/>
					</FormGroup>
					<FormGroup>
						<ControlLabel>Länge</ControlLabel>
						<FormControl type="text" name="length" value={this.props.data.length} onChange={this.onChange}/>
					</FormGroup>
					<hr/>
					<FormGroup>
						<ControlLabel>Typ</ControlLabel>
						<FormControl componentClass="select" placeholder="select" name="type" onChange={this.onChange}>
                            {this.state.typeOptions.map((typeOption, ind) => {
                            	var selected = "";
                            	if(typeOption.type == this.props.data.type){
                            		selected="selected";
								}
                                return (
									<option value={typeOption.type} selected={selected}>{typeOption.text}</option>
                                )
                            })}
						</FormControl>
					</FormGroup>
					<FormGroup>
						<ControlLabel>Fläche</ControlLabel>
						<InputGroup>
							<FormControl type="text" value={this.props.data.area} name="area" onChange={this.onChange}/>
							<InputGroup.Addon>m²</InputGroup.Addon>
						</InputGroup>
					</FormGroup>
					<FormGroup>
						<ControlLabel>qSV</ControlLabel>
						<InputGroup>
							<FormControl type="text" value={this.props.data.qSV} name="qSV" onChange={this.onChange}/>
							<InputGroup.Addon>l/m²h</InputGroup.Addon>
						</InputGroup>
					</FormGroup>
				</form>
		);
	}
}