/**
 * Voltage source
 */

import { Position } from "../../types";

import Component from "./component";

export default class VoltageSource extends Component {

    name = "V";
    unit = "V";
    
    _nodes: Position[] = [
        [VoltageSource.WIDTH/2, 0              ],
        [VoltageSource.WIDTH/2, VoltageSource.HEIGHT]
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