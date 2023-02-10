/**
 * Handles the component sheet
 */

import { createSignal, Accessor, Setter } from "solid-js";

import { Position } from "../types";
import { PositionMap } from "../tools";

import Component from "./components/component";

/**
 * Component sheet class
 * Handles the list of components
 */
export default class Sheet {

    private _components: Accessor<Component[]>; 
    private _setComponents: Setter<Component[]>;

    private _active: Accessor<boolean>;
    private _setActive: Setter<boolean>;

    private _activeComponent: Accessor<Component>;
    private _setActiveComponent: Setter<Component>;

    private _gridSpacing: Accessor<number>;
    private _setGridSpacing: Setter<number>;

    /**
     * Tracks the number of instances of a node in the sheet.
     */
    private _nodeInstances = new PositionMap<number>();

    constructor() {
        // Setup components array
        [this._components, this._setComponents] = createSignal([]);
        [this._active, this._setActive] = createSignal(false);
        [this._activeComponent, this._setActiveComponent] = createSignal(undefined);
        [this._gridSpacing, this._setGridSpacing] = createSignal(25);
        this.active = false;
    }

    /**
     * Produces a netlist suitable for passing to lcapy
     */
    forLcapy(): string {
        let out: string = "\n";
        for (let component of this.components) {
            out.concat(component.forLcapy().concat("\n"));
        }
        return out;
    }

    /**
     * Places the active component down in its current position.
     */
    placeActiveComponent() {
        if (this.active) {
            this.components = [...this.components, this.activeComponent];
            this.active = false;

            // add in the nodes from the active component
            this.activeComponent.nodes.forEach((node) => {
                const pos: Position = [
                    this.activeComponent.position[0] + node[0],
                    this.activeComponent.position[1] + node[1]
                ]; // TODO: factor in component rotation!

                if (this._nodeInstances.has(pos)) {
                    this._nodeInstances.set(pos, this._nodeInstances.get(pos) + 1);
                } else {
                    this._nodeInstances.set(pos, 1);
                }
            });
        }

        console.log(this._nodeInstances.keys());
    }

    /**
     * Deletes a component in the sheet.
     * Places any active components before deletion.
     * 
     * This will not error out if the component cannot be found
     */
    deleteComponent(cpt: Component) {
        this.placeActiveComponent();
        // shallow copy of components
        let newComponents = this.components.slice();
        const index = this.components.indexOf(cpt);

        if (index > -1) {

            const oldComponent = newComponents[index];
            newComponents.splice(index, 1);
            // decrement or remove nodes from node instances
            oldComponent.nodes.forEach((node) => {

                const pos: Position = [
                    this.activeComponent.position[0] + node[0],
                    this.activeComponent.position[1] + node[1]
                ]; // TODO: factor in component rotation!

                if (this._nodeInstances.get(pos) <= 1) {
                    this._nodeInstances.delete(pos);
                } else {
                    this._nodeInstances.set(pos, this._nodeInstances.get(pos) - 1);
                }
            });
        }
        this.components = newComponents;
    }

    /**
     * Converts a pixel based position to grid position
     */
    toGrid(pixelPos: Position): Position {
        return pixelPos.map((v) => Math.floor(v / this.gridSpacing)) as Position;
    }

    /**
     * Converts a grid position to a pixel based position
     */
    toPixels(gridPos: Position): Position {
        return gridPos.map((v) => v * this.gridSpacing) as Position;
    }

    /**
     * List of components included in the sheet.
     */
    get components()                   {return this._components()}
    set components(value: Component[]) {this._setComponents(value)}

    /**
     * Tracks whether a component is currently considered "active".
     */
    get active()               {return this._active()}
    set active(value: boolean) {this._setActive(value)}

    /**
     * Details the component being actively manipulated by the user.
     * This component should not be included in the components list.
     * 
     * Assignment automatically sets the active flag...
     */
    get activeComponent() {return this._activeComponent()}
    set activeComponent(cpt: Component) {
        this._setActiveComponent(cpt)
        this.active = true;
    }

    /**
     * Defines the grid spacing of the document.
     * The goal is to update this to always be close to a multiple of the
     * schematic viewport width, this is the responsibility of the schematic however.
     */
    get gridSpacing()                {return this._gridSpacing()}
    set gridSpacing(spacing: number) {this._setGridSpacing(spacing)}
}