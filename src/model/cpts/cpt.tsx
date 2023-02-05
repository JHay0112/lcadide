/**
 * Handles circuit components
 */

import { createSignal, Accessor, Setter } from "solid-js";

import { Color, Position } from "../../types";

/**
 * Base class for circuit components
 * Specific components need to derive from this base class
 * Derived visual components implement reactive behaviours with SolidJS
 */
export default abstract class Component {

    /**
     * Lcapy component identifier
     * Typically a single character, e.g. R for resistor
     */
    public abstract readonly name: string;

    /**
     * SVG path description of the component.
     * Limited to fit withing a 75h x 50w box.
     */
    public abstract readonly path: string;

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

    private static _nextId: number = 0;
    private _id: Accessor<number>;
    private _setId: Setter<number>;

    private _value: Accessor<string>;
    private _setValue: Setter<string>;

    private _color: Accessor<Color>;
    private _setColor: Setter<Color>;

    private _position: Accessor<Position>;
    private _setPosition: Setter<Position>;

    constructor() {
        [this._value, this._setValue] = createSignal("");
        [this._id, this._setValue] = createSignal(Component._nextId++);
        [this._color, this._setColor] = createSignal("#252525");
        [this._position, this._setPosition] = createSignal([0, 0]);
    }

    /**
     * Returns an SVG representation of the component for the canvas
     */
    forDisplay() {
        return (<>
            <svg height="75" width="50" style={`stroke: ${this.color}; stroke-width: 1; fill: none;`}>
                <path d={this.path} />
            </svg>
        </>);  
    }

    /**
     * Returns a SOLID JS representation of the component for the sidebar
     */
    forSidebar() {
        // TODO
        return (<>
            
        </>);
    }

    /**
     * Generates a string representation of the component for lcapy
     */
    forLcapy(): string {
        // TODO
        return this.name;
    }

    /**
     * Component id. Automatically assigned.
     */
    get id()           {return this._id()}
    set id(id: number) {this._setId(id)}

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
    get position()             {return this._position()}
    set position(pos: Position) {this._setPosition(pos)}
}