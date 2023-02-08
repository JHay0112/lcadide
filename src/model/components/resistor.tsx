/**
 * Resistor component
 */

import { Position } from "../../types";

import Component from "./component";

export default class Resistor extends Component {

    name = "R";
    
    nodes: Position[] = [
        [Resistor.WIDTH/2, 0              ],
        [Resistor.WIDTH/2, Resistor.HEIGHT]
    ];

    path() {
        return `
            M ${this.pixelWidth/2} ,  0
            l   0                  , ${(this.pixelHeight - 35)/2}
            l  20                  ,  5
            l -40                  ,  5
            l  40                  ,  5
            l -40                  ,  5
            l  40                  ,  5
            l -40                  ,  5
            l  20                  ,  5
            L ${this.pixelWidth/2} , ${this.pixelHeight}
        `;
    }
}