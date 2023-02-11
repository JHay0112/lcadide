/**Resistor
 * Current source
 */

import { Position } from "../../types";

import Component from "./component";

export default class CurrentSource extends Component {

    name = "I";
    unit = "A";
    
    _nodes: Position[] = [
        [CurrentSource.WIDTH/2, 0              ],
        [CurrentSource.WIDTH/2, CurrentSource.HEIGHT]
    ];

    path() {

        const RADIUS = 20;
        const OFFSET = 5;

        return `
            M ${this.pixelWidth/2}, 0
            l 0, ${this.pixelHeight/2 - RADIUS}
            m ${-RADIUS}, ${RADIUS}
            a ${RADIUS}, ${RADIUS} 0 1, 0 ${2*RADIUS}, 0
            a ${RADIUS}, ${RADIUS} 0 1, 0 -${2*RADIUS}, 0
            m ${RADIUS}, ${-RADIUS + OFFSET}
            l ${-OFFSET}, ${OFFSET}
            m ${2*OFFSET}, 0
            l ${-OFFSET}, ${-OFFSET}
            l 0, ${2*RADIUS - 2*OFFSET}
            m 0, ${OFFSET}
            L ${this.pixelWidth/2}, ${this.pixelHeight}
        `;
    }
}