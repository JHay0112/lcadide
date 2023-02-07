/**
 * Resistor component
 */

import { Position } from "../../types";

import Component from "./cpt";

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
    `;
    nodes: Position[] = [
        [25, 0],
        [25, 75]
    ];
}