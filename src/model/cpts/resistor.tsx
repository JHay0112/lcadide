/**
 * Resistor component
 */

import { Component } from "./cpt";

/**
 * Ideal resistor model
 */
export default class Resistor extends Component {

    constructor() {
        super("R");
    }

    forDisplay() {
        return (<>
            <svg height="100" width="50" style={`stroke: ${this.color}; stroke-width: 2;`}>
                <line x1="25" y1="0" x2="25" y2="20" />
            </svg>
        </>);        
    }


}