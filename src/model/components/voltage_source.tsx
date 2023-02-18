/**
 * Voltage source
 */

import { Position } from "../../types";

import Component from "./component";

export default class VoltageSource extends Component {

    private readonly height = 4;
    private readonly width = 2;

    private readonly pixelHeight = this.sheet.gridSpacing * this.height;
    private readonly pixelWidth = this.sheet.gridSpacing * this.width;

    name = "V";
    unit = "V";

    middle: Position = [1, 2];
    
    _nodes: Position[] = [
        [this.width/2, 0],
        [this.width/2, this.height]
    ];

    path() {

        const RADIUS = 18;
        const OFFSET = 5;

        return `
            M ${this.pixelWidth/2}, 0
            l 0, ${this.pixelHeight/2 - RADIUS}
            m ${-RADIUS}, ${RADIUS}
            a ${RADIUS}, ${RADIUS} 0 1, 0 ${2*RADIUS}, 0
            a ${RADIUS}, ${RADIUS} 0 1, 0 -${2*RADIUS}, 0
            m ${RADIUS}, ${-RADIUS + 3*OFFSET}
            l 0, ${-2*OFFSET}
            m ${-OFFSET}, ${OFFSET}
            l ${2*OFFSET}, 0
            m ${-2*OFFSET}, ${2*RADIUS - 4*OFFSET}
            l ${2*OFFSET}, 0
            m ${-OFFSET}, ${2*OFFSET}
            L ${this.pixelWidth/2}, ${this.pixelHeight}
        `;
    }
}