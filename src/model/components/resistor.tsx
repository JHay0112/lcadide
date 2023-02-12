/**
 * Resistor component
 */

import { Position } from "../../types";

import Component from "./component";

export default class Resistor extends Component {

    width = 2;
    height = 4;

    name = "R";
    unit = "\\Omega";
    
    _nodes: Position[] = [
        [this.width/2, 0],
        [this.width/2, this.height]
    ];

    path() {
        return `
            M ${this.pixelWidth/2} ,  0
            l   0                  , ${(this.pixelHeight - 30)/2}
            l  10                  ,  5
            l -20                  ,  5
            l  20                  ,  5
            l -20                  ,  5
            l  20                  ,  5
            l -20                  ,  5
            l  10                  ,  5
            L ${this.pixelWidth/2} , ${this.pixelHeight}
        `;
    }
}