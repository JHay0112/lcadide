/**
 * Inductor component
 */

import { Position } from "../../types";

import Component from "./component";

export default class Inductor extends Component {

    private readonly height = 4;
    private readonly width = 2;

    private readonly pixelHeight = this.sheet.gridSpacing * this.height;
    private readonly pixelWidth = this.sheet.gridSpacing * this.width;
    
    name = "L";
    unit = "H";

    _middle: Position = [1, 2];
    _nodes: Position[] = [
        [this.width/2, 0],
        [this.width/2, this.height]
    ];

    path() {

        const WIDTH = 8;
        const HEIGHT = -15;

        return `
            M ${this.pixelWidth/2}, 0
            l 0, ${(this.pixelHeight - WIDTH*4)/2}
            m -2, 0
            q ${-HEIGHT}, ${WIDTH/2}, 0, ${WIDTH}
            q ${-HEIGHT}, ${WIDTH/2}, 0, ${WIDTH}
            q ${-HEIGHT}, ${WIDTH/2}, 0, ${WIDTH}
            q ${-HEIGHT}, ${WIDTH/2}, 0, ${WIDTH}
            m 2, 0
            L ${this.pixelWidth/2}, ${this.pixelHeight}
        `;
    }
}