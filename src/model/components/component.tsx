/**
 * Handles circuit components
 */

import { createSignal, Accessor, Setter } from "solid-js";

import { Color, Orientation, Position } from "../../types";

import { unitPrefix } from "../../tools";

import Sheet from "../sheet";

/**
 * Base class for circuit components
 * Specific components need to derive from this base class
 * Derived visual components implement reactive behaviours with SolidJS
 * 
 * @param sheet
 *  The sheet that the component is a part of.
 */
export default abstract class Component {

    /**
     * Component graphical as a multiple of the grid spacing.
     */
    public static readonly HEIGHT: number = 4;

    /**
     * Component graphical width as a multiple of the grid spacing.
     */
    public static readonly WIDTH: number = 2;

    /**
     * Lcapy component identifier
     * Typically a single character, e.g. R for resistor
     */
    public abstract readonly name: string;

    /**
     * Units associated with the device,
     * String with LaTeX formatting.
     */
    public abstract readonly unit: string;

    /**
     * The nodes of the device relative to the device origin.
     */
    protected abstract readonly _nodes: Position[];

    private static nextId: number = 1;
    private _id: Accessor<string>;
    private _setId: Setter<string>;

    private _value: Accessor<string>;
    private _setValue: Setter<string>;

    private _color: Accessor<Color>;
    private _setColor: Setter<Color>;

    private _position: Accessor<Position>;
    private _setPosition: Setter<Position>;

    private _orientation: Accessor<Orientation>;
    private _setOrientation: Setter<Orientation>;

    private _prefix: Accessor<string>;
    private _setPrefix: Setter<string>;

    /**
     * The sheet that the component is a part of.
     */
    private sheet: Sheet;

    constructor(sheet: Sheet) {
        this.sheet = sheet;
        [this._id, this._setId] = createSignal(String(Component.nextId++));
        [this._value, this._setValue] = createSignal();
        [this._color, this._setColor] = createSignal("#252525");
        [this._position, this._setPosition] = createSignal([-255, -255]);
        [this._orientation, this._setOrientation] = createSignal(Orientation.VERTICAL);
        [this._prefix, this._setPrefix] = createSignal("");
    }

    /**
     * Produces an SVG path describing the graphical representation of the component.
     */
    abstract path(): string;

    /**
     * Generates a string representation of the component for lcapy
     */
    forLcapy(): string {
        let outStr = `${this.name}${this.id}`;
        this.nodes.forEach((node) => {
            const index = this.sheet.identify(node);
            outStr = outStr.concat(` ${index}`);
        });
        outStr = outStr.concat(` {${this.value}};`)
        return outStr;
    }

    /**
     * Rotates the component.
     * Forces a refresh of the component in sheet.
     */
    rotate() {
        const active = this.sheet.active && this == this.sheet.activeComponent;
        if (!active) this.sheet.deregisterNodes(this.nodes);
        this._setOrientation((this.orientation + 1) % 2);
        if (!active) this.sheet.registerNodes(this.nodes);
    }

    /**
     * Component id. Automatically assigned.
     */
    get id()           {return this._id()}
    set id(id: string) {this._setId(id)}

    /**
     * Symbolic or numerical value of the component.
     */
    get value() {
        if (this._value() === undefined || this._value() === null) {
            return `${this.name}_{${this.id}}`;
        } else {
            return this._value();
        }
    }
    set value(value: string) {
        // check if value ends with a power of 10
        const index = value.search(/(\*10\^{-?\d*})$/);
        if (index != -1) {
            const power = value.slice(index + 5, -1);
            this.prefix = unitPrefix(Number(power));
            if (this.prefix != "") {
                this._setValue(value.slice(0, index));
            } else {
                this._setValue(value);
            }
        } else {
            this._setValue(value);
        }
    }

    /**
     * Stroke colour for the component.
     */
    get color()             {return this._color()}
    set color(color: Color) {this._setColor(color)}

    /**
     * The position of the component.
     * Node positions are derived from this with
     * axes extending to the right (x) and down (y)
     * from the component "position";
     */
    get position()              {return this._position()}
    set position(pos: Position) {this._setPosition(pos)}

    /**
     * Unit prefix.
     * LaTeX formatted string.
     */
    get prefix() {return this._prefix()}
    private set prefix(p: string) {this._setPrefix(p)} 

    /**
     * The orientation of the component.
     */
    get orientation() {return this._orientation()}

    /**
     * The graphical height of the component.
     * This avoids exposing the sheet attribute publicly.
     */
    get pixelHeight() {return this.sheet.gridSpacing * Component.HEIGHT}

    /**
     * The graphical width of the component.
     * This avoids exposing the sheet attribute publicly.
     */
    get pixelWidth()  {return this.sheet.gridSpacing * Component.WIDTH}

    /**
     * The nodes of the device given with absolute grid coordinates.
     * If the component has been rotated these will be adjusted so to match.
     */
    get nodes() {

        let outNodes: Position[] = [];

        if (this.orientation == Orientation.HORIZONTAL) {
            this._nodes.forEach((node) => {
                outNodes = [...outNodes, [
                    node[1] - 1 + this.position[0], 
                    node[0] + 1 + this.position[1]
                ]];
            });
        } else {
            this._nodes.forEach((node) => {
                outNodes = [...outNodes, [
                    node[0] + this.position[0],
                    node[1] + this.position[1]
                ]];
            });
        }

        return outNodes;
    }
}