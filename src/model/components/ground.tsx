/**
 * Ground
 */

import { Position } from "../../types";

import Component from "./component";

export default class Ground extends Component {

    width = 2;
    height = 2;

    name = "G";
    unit = "";
    
    _nodes: Position[] = [
        [this.width/2, 0]
    ];

    path() {

        const WIDTH = 15;
        const HEIGHT = this.pixelHeight * 0.25;

        return `
            M ${this.pixelWidth/2} , 0
            l 0                    , 10
            l -${WIDTH}            , 0
            l ${WIDTH}             , ${HEIGHT}
            l ${WIDTH}             , -${HEIGHT}
            l -${WIDTH}            , 0
        `;
    }
}