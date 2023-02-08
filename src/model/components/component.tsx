/**
 * Handles circuit components
 */

import { createSignal, Accessor, Setter, Show } from "solid-js";

import { Color, Orientation, Position } from "../../types";

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
     * Describes the position of nodes 
     * (points at which other components may connect)
     * relative to the position of the component.
     * 
     * For single port (two-node) components the convention holds
     * that the first listed node is "positive" and the second
     * listed node is "negative".
     */
    public abstract readonly nodes: Position[];

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

    /**
     * The sheet that the component is a part of.
     */
    private sheet: Sheet;

    constructor(sheet: Sheet) {
        this.sheet = sheet;
        [this._id, this._setId] = createSignal(String(Component.nextId++));
        [this._value, this._setValue] = createSignal("");
        [this._color, this._setColor] = createSignal("#252525");
        [this._position, this._setPosition] = createSignal([-255, -255]);
        [this._orientation, this._setOrientation] = createSignal(Orientation.VERTICAL);
    }

    /**
     * Produces an SVG path describing the graphical representation of the component.
     */
    abstract path(): string;

    /**
     * Generates a string representation of the component for lcapy
     */
    forLcapy(): string {
        // TODO
        return this.name;
    }

    /**
     * Rotates the component.
     */
    rotate() {
        this.orientation = (this.orientation + 1) % 2;
    }

    /**
     * Component id. Automatically assigned.
     */
    get id()           {return this._id()}
    set id(id: string) {this._setId(id)}

    /**
     * Symbolic or numerical value of the component.
     */
    get value()              {return this._value()}
    set value(value: string) {this._setValue(value)}

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
     * The orientation of the component.
     */
    get orientation()                 {return this._orientation()}
    set orientation(ori: Orientation) {this._setOrientation(ori)}

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
}