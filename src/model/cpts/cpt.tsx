/**
 * Handles circuit components
 */

import { createSignal, Accessor, Setter } from "solid-js";

import { Color, Position } from "../../types";

/**
 * Base class for circuit components
 * Specific components need to derive from this base class
 */
export abstract class Component {

    private _name: string;

    private _value: Accessor<string>;
    private _setValue: Setter<string>;

    private _color: Accessor<Color>;
    private _setColor: Setter<Color>;

    private _position: Accessor<Position>;
    private _setPosition: Setter<Position>;

    constructor(name: string) {
        this._name = name;

        [this._value, this._setValue] = createSignal("");
        [this._color, this._setColor] = createSignal("#252525");
        [this._position, this._setPosition] = createSignal([0, 0]);
    }

    /**
     * Returns a representation of the component for the canvas
     */
    abstract forDisplay();

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

    get name() {return this._name}

    get value()              {return this._value()}
    set value(value: string) {this._setValue(value)}

    get color()             {return this._color()}
    set color(color: Color) {this._setColor(color)}

    get position()             {return this._position()}
    set position(pos: Position) {this._setPosition(pos)}
}