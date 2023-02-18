import { Position } from "../../types";

import Component from "./component";

/**
 * Wire component
 */
export default class Wire extends Component {

    name = "W";
    unit = "";
    
    _middle = undefined;
    _nodes: Position[] = [
        [-255, -255],
        [-255, -255]
    ];

    path() {
        const start = this.sheet.toPixels(this.nodes[0]);
        const end = this.sheet.toPixels(this.nodes[1]);
        return `
            M ${start[0]}, ${start[1]}
            L ${end[0]}, ${start[1]}
        `;
    }

    get middle(): Position {

        const start = this.nodes[0];
        const end = this.nodes[1];

        return [
            (end[0] - start[0])/2,
            (end[1] - start[1])/2
        ];
    }
}