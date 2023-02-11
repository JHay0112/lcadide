/**
 * Ground
 */

import { Position } from "../../types";

import Component from "./component";

export default class Ground extends Component {

    WIDTH = 2;
    HEIGHT = 1;

    name = "G";
    unit = "";
    
    _nodes: Position[] = [
        [Ground.WIDTH/2, 0]
    ];

    path() {

        const WIDTH = 15;
        const HEIGHT = 14;

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