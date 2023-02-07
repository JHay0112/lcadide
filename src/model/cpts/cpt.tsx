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
        [this._value, this._setValue] = createSignal("");
        [this._id, this._setId] = createSignal(String(Component._nextId++));
        [this._color, this._setColor] = createSignal("#252525");
        [this._position, this._setPosition] = createSignal([-255, -255]);
        [this._orientation, this._setOrientation] = createSignal(Orientation.VERTICAL);
    }

    /**
     * Returns an SVG representation of the component for the canvas
     */
    forDisplay() {

        let [displayContextMenu, setDisplayContextMenu] = createSignal(false);
        let [contextMenuPosition, setContextMenuPosition] = createSignal([0, 0]);

        let pixelPos = this.sheet.toPixels(this.position);
        // KNOWN BUG: TOFIX:
        // If rotated, this node shifting fails to place on grid
        pixelPos[0] += this.nodes[0][0];
        pixelPos[1] += this.nodes[0][1];

        return (<>
            <svg 
                height="75" width="50"
                style={`
                    stroke: ${this.color}; 
                    stroke-width: 2; 
                    fill: none;
                    position: absolute;
                    top: ${pixelPos[1]}px;
                    left: ${pixelPos[0]}px;
                    rotate: ${90*this.orientation}deg;
                `}
                onContextMenu={(event) => {
                    setContextMenuPosition([event.clientX, event.clientY]);
                    setDisplayContextMenu(true);
                    event.preventDefault();
                }}
                onClick={() => {
                    this.delete();
                    this.sheet.activeComponent = this;
                }}
            >
                <path d={this.path} />
            </svg>
            <Show when={displayContextMenu()}>
                <aside 
                    class="bg-primary rounded-md p-3 drop-shadow-md text-left" 
                    style={`
                        position: absolute;
                        top: ${contextMenuPosition()[1] - 3}px;
                        left: ${contextMenuPosition()[0] - 3}px;
                    `}
                    onMouseLeave={() => {
                        setDisplayContextMenu(false);
                    }}
                >
                    <button class="w-full hover:opacity-80" onClick={() => {this.delete()}}>Delete</button>
                    <button class="w-full hover:opacity-80" onClick={() => {this.orientation++}}>Rotate</button>
                </aside>
            </Show>
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
     * Deletes the component.
     */
    delete() {
        this.sheet.deleteComponent(this);
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
}