/**
 * Provides description of wires.
 */

import { createSignal, Accessor, Setter } from "solid-js";

import { Position, Orientation } from "../types";

import Sheet from "./sheet";

/**
 * Wire component
 */
export default class Wire {

    public readonly name = "W";
    public value = "";
    public prefix = "";
    public unit = "";
    public color = "#252525";
    public orientation = Orientation.VERTICAL;

    private static nextId: number = 1;
    private _id: Accessor<string>;
    private _setId: Setter<string>;

    private _start: Accessor<Position>;
    private _setStart: Setter<Position>;

    private _end: Accessor<Position>;
    private _setEnd: Setter<Position>;

    private sheet: Sheet;

    constructor(sheet: Sheet) {
        this.sheet = sheet;
        [this._id, this._setId] = createSignal(String(Wire.nextId++));
        [this._start, this._setStart] = createSignal([-255, -255]);
        [this._end, this._setEnd] = createSignal([-255, -255]);
    }

    forLcapy(): string {
        let outStr = `${this.name}${this.id}`;
        const startIndex = this.sheet.identify(this.start);
        outStr = outStr.concat(` ${startIndex}`);
        const endIndex = this.sheet.identify(this.end);
        outStr = outStr.concat(` ${endIndex};`);
        return outStr;
    }

    path() {

        const start = this.sheet.toPixels(this.start);
        const end = this.sheet.toPixels(this.end);

        // return no path if start and end not initialised
        if (
            (this.start[0] == -255 && this.start[1] == -255) ||
            (this.end[0] == -255 && this.end[1] == -255)
        ) {
            return "";
        } else {
            return `
                M 0, 0
                L ${end[0] - start[0]}, ${end[1] - start[1]}
            `;
        }
    }

    /**
     * Wire id. Automatically assigned.
     */
    get id()           {return this._id()}
    set id(id: string) {this._setId(id)}

    get start()              {return this._start()}
    set start(pos: Position) {this._setStart(pos)}

    get end()              {return this._end()}
    set end(pos: Position) {this._setEnd(pos)}

    get middle(): Position {
        return [
            (this.end[0] - this.start[0])/2,
            (this.end[1] - this.start[1])/2
        ];
    }

    get position() {return this.start};
}