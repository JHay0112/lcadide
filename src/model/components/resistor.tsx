/**
 * Resistor component
 */

import { Position } from "../../types";

import Component from "./component";

export default class Resistor extends Component {

    private readonly height = 4;
    private readonly width = 2;

    private readonly pixelHeight = this.sheet.gridSpacing * this.height;
    private readonly pixelWidth = this.sheet.gridSpacing * this.width;

    name = "R";
    unit = "\\Omega";

    _middle: Position = [1, 2];
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