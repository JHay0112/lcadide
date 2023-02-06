/**
 * Handles the component sheet
 */

import { createSignal, Accessor, Setter } from "solid-js";
import Component from "./cpts/cpt";

/**
 * Component sheet class
 * Handles the list of components
 */
export default class Sheet {

    private _components: Accessor<Component[]>; 
    private _setComponents: Setter<Component[]>;
    private _activeComponent: Accessor<Component>;
    private _setActiveComponent: Setter<Component>;

    constructor() {
        // Setup components array
        [this._components, this._setComponents] = createSignal([]);
        [this._activeComponent, this._setActiveComponent] = createSignal(null);
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
        if (this.activeComponent != null) {
            this.components = [...this.components, this.activeComponent];
            this.activeComponent = null;
        }
    }

    /**
     * List of components included in the sheet.
     */
    get components()                   {return this._components()}
    set components(value: Component[]) {this._setComponents(value)}

    /**
     * Details the component being actively manipulated by the user.
     * This component should not be included in the 
     */
    get activeComponent()               {return this._activeComponent()}
    set activeComponent(cpt: Component) {this._setActiveComponent(cpt)}
}