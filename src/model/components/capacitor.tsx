/**
 * Capacitor component
 */

import { Position } from "../../types";

import Component from "./component";

export default class Capacitor extends Component {

    private readonly height = 4;
    private readonly width = 2;

    private readonly pixelHeight = this.sheet.gridSpacing * this.height;
    private readonly pixelWidth = this.sheet.gridSpacing * this.width;

    name = "C";
    unit = "F";

    _middle: Position = [1, 2];
    _nodes: Position[] = [
        [this.width/2, 0],
        [this.width/2, this.height]
    ];

    path() {

        const PLATE_SEP = 5;
        const PLATE_WIDTH = 2*this.pixelWidth/3;

        return `
            M ${this.pixelWidth/2} ,  0
            l 0                    , ${this.pixelHeight/2 - PLATE_SEP/2}
            m ${-PLATE_WIDTH/2}    , 0
            l ${PLATE_WIDTH}       , 0
            m 0                    , ${PLATE_SEP}
            l ${-PLATE_WIDTH}      , 0
            m ${PLATE_WIDTH/2}     , 0   
            L ${this.pixelWidth/2} , ${this.pixelHeight}
        `;
    }
}