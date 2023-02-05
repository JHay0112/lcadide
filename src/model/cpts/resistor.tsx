/**
 * Resistor component
 */

import Component from "./cpt";

/**
 * Ideal resistor model
 */
export default class Resistor extends Component {
    name = "R";
    path = `
        M 25 , 0
        L 25 , 20
        l 20 , 5
        l -40, 5
        l 40 , 5
        l -40, 5
        l 40 , 5
        l -40, 5
        l 20 , 5
        L 25, 75
    `
}