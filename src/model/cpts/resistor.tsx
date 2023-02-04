/**
 * Resistor component
 */

import { Component } from "./cpt";

/**
 * Ideal resistor model
 */
export default class Resistor extends Component {

    name = "R";

    forDisplay() {
        return (<>
            <svg height="100" width="50" style={`stroke: ${this.color}; stroke-width: 1;`}>
                <line x1="25" y1="05" x2="25" y2="30" />
                <line x1="25" y1="30" x2="05" y2="35" />
                <line x1="05" y1="35" x2="45" y2="45" />
                <line x1="45" y1="45" x2="05" y2="55" />
                <line x1="25" y1="70" x2="25" y2="100" />
            </svg>
        </>);        
    }


}