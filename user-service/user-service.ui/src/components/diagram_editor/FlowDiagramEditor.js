
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import GraphView from 'react-digraph'
import FlowDiagramConfig from './FlowDiagramConfig' // Configures node/edge
													// types
import { Button } from 'react-bootstrap';






// NOTE: Edges must have 'source' & 'target' attributes
// In a more realistic use case, the graph would probably originate
// elsewhere in the App or be generated from some other state upstream of this
// component.


export default class FlowDiagramEditor extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
        graph: this.props.graph ? this.props.graph : {"nodes": [],"edges": []},
	    graphConfig: this.props.graphConfig,
        selected: {}
    }
    

  }

  render() {
    const nodes = this.state.graph.nodes;
    const edges = this.state.graph.edges;
    const selected = this.state.selected;

    const NodeTypes = FlowDiagramConfig.NodeTypes;
    const NodeSubtypes = FlowDiagramConfig.NodeSubtypes;
    const EdgeTypes = FlowDiagramConfig.EdgeTypes;

    return (
    		<div>
	      <div id='graph' style={styles.graph}>
	      
	        <GraphView  ref={(el) => this.GraphView = el}
	                    nodeKey={this.props.nodeKey}
	                    emptyType={this.props.emptyType}
	                    nodes={this.props.graph.nodes}
	                    edges={this.props.graph.edges}
	                    selected={selected}
	                    nodeTypes={NodeTypes}
	                    nodeSubtypes={NodeSubtypes}
	                    edgeTypes={EdgeTypes}
                        getViewNode={this.props.getViewNode}
                        onSelectNode={this.props.onSelectNode}
                        onCreateNode={this.props.onCreateNode}
                        onUpdateNode={this.props.onUpdateNode}
                        onDeleteNode={this.props.onDeleteNode}
                        onSelectEdge={this.props.onSelectEdge}
                        onCreateEdge={this.props.onCreateEdge}
                        onSwapEdge={this.props.onSwapEdge}
                        onDeleteEdge={this.props.onDeleteEdge}
                        renderNode={this.props.renderNode}
                        renderEdge={this.props.renderEdge}/>
	    </div>
	 	<div style={styles.palette}>
            {this.props.types.map((type, ind) => {
                return (
					<Button bsStyle="primary" onClick={() =>this.props.addModelElement(type.type)}>{type.name}</Button>
                )
            })}
		</div>
	</div>

    );
  }

}


const styles = {
	  graph: {
	    height: '400px',
	    width: '100%',
	    position:'relative',
	  },
	  palette: {
		  marginTop: '10px',
	  }
	};