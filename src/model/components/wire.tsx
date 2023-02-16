/**
 * Wire component
 */

import { Position } from "../../types";

import Component from "./component";

export default class Wire extends Component {

    width = 2;
    height = 4;

    name = "W";
    unit = "";
    
    _nodes: Position[] = [
        [this.width/2, 0],
        [this.width/2, this.height]
    ];

    path() {

        return `
            M ${this.pixelWidth/2} ,  0
            L ${this.pixelWidth/2} , ${this.pixelHeight}
        `;
    }
}