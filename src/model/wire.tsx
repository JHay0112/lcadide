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
    public position: Position = [0, 0];
    public orientation = Orientation.HORIZONTAL;

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

    path() {
        return `
            M ${this.start[0]}, ${this.start[1]}
            L ${this.end[0]}, ${this.end[1]}
        `;
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
}