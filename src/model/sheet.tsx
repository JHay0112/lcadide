/**
 * Handles the component sheet
 */

import {createSignal, Accessor, Setter, For} from "solid-js";
import {Component} from "./cpts/cpt";

/**
 * Component sheet class
 * Handles the list of components
 */
export default class Sheet {

    private _components: Accessor<Component[]>; 
    private _setComponents: Setter<Component[]>;

    constructor() {
        // Setup components array
        [this._components, this._setComponents] = createSignal([]);
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
     * Adds a component to the sheet
     */
    addComponent(value: Component) {
        console.log("Added ", value.name, " to sheet.");
        this.components = [...this.components, value];
    }

    get components()                   {return this._components()}
    set components(value: Component[]) {this._setComponents(value)}
}