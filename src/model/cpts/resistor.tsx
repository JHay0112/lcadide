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

    forCanvas() {
        return (<>
            <p></p>
        </>);        
    }


}