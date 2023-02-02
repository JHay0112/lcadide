/**
 * Handles the component sheet
 */

import {createSignal, Accessor, Setter} from "solid-js";

import {Component} from "./cpts/cpt";

/**
 * Component sheet class
 * Handles the list of components
 */
export class Sheet {

    private _components: Accessor<Component[]>; 
    private _setComponents: Setter<Component[]>;

    constructor() {
        // Setup components array
        [this._components, this._setComponents] = createSignal([]);
    }

    /**
     * Produces the displayable jsx sheet component
     */
    forDisplay() {

        return (<>
        
        </>);
    }

    /**
     * Adds a component to the sheet
     */
    addComponent(value: Component) {
        this._setComponents([...this.components, value]);
    }

    get components()                   {return this._components()}
    set components(value: Component[]) {this._setComponents(value)}
}