/**
 * Handles the component sheet
 */

import { createSignal, Accessor, Setter } from "solid-js";

import { Position } from "../types";
import { PositionMap, PositionBiMap } from "../tools/position_map";

import Component from "./components/component";
import Ground from "./components/ground";

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

    private _nodeInstances: Accessor<PositionMap<Component[]>>;
    private _setNodeInstances: Setter<PositionMap<Component[]>>;

    constructor() {
        // Setup components array
        [this._components, this._setComponents] = createSignal([]);
        [this._active, this._setActive] = createSignal(false);
        [this._activeComponent, this._setActiveComponent] = createSignal(undefined);
        [this._gridSpacing, this._setGridSpacing] = createSignal(25);
        [this._nodeInstances, this._setNodeInstances] = createSignal(new PositionMap<Component[]>());
        this.active = false;
    }

    /**
     * Produces a netlist suitable for passing to lcapy
     */
    forLcapy(): string {
        let out: string = "\n";
        for (let component of this.components) {
            if (!(component instanceof Ground)) {
                out = out.concat(component.forLcapy(), "\n");
            }
        }
        return out;
    }

    /**
     * Registers the nodes of a component with the sheet.
     */
    register(cpt: Component) {
        cpt.nodes.forEach((node) => {
            let nodeInstances = this._nodeInstances().copy();
            if (nodeInstances.has(node)) {
                nodeInstances.set(node, [...nodeInstances.get(node), cpt]);
            } else {
                nodeInstances.set(node, [cpt]);
            }
            this._setNodeInstances(nodeInstances);
        });
    }

    /**
     * Deregister the nodes of a component with the sheet
     */
    deregister(cpt: Component) {
        cpt.nodes.forEach((node) => {
            let nodeInstances = this._nodeInstances().copy();
            if (nodeInstances.get(node).length <= 1) {
                nodeInstances.delete(node);
            } else {
                const cpts = nodeInstances.get(node);
                let index = -1;
                cpts.forEach((registeredCpt, i) => {
                    if (
                        registeredCpt.name == cpt.name &&
                        registeredCpt.id   == cpt.id
                    ) {
                        index = i;
                    }
                });
                if (index != -1) {
                    cpts.splice(index, 1);
                }
                nodeInstances.set(node, cpts);
            }
            this._setNodeInstances(nodeInstances);
        });
    }

    /**
     * Places the active component down in its current position.
     */
    placeActiveComponent() {
        if (this.active) {
            this.components = [...this.components, this.activeComponent];
            this.active = false;

            // add in the nodes from the active component
            this.register(this.activeComponent);
        }
    }

    /**
     * Deletes a component in the sheet.
     * Places any active components before deletion.
     * 
     * This will not error out if the component cannot be found
     */
    delete(cpt: Component) {
        this.placeActiveComponent();
        // shallow copy of components
        let newComponents = this.components.slice();
        const index = this.components.indexOf(cpt);

        if (index > -1) {

            const oldComponent = newComponents[index];
            newComponents.splice(index, 1);
            // decrement or remove nodes from node instances
            this.deregister(oldComponent);
        }
        this.components = newComponents;
    }

    /**
     * Gets the number of connections at a grid position.
     */
    connections(pos: Position): number {
        if (this._nodeInstances().has(pos)) {
            return this._nodeInstances().get(pos).length;
        } else {
            return 0;
        }
    }

    /**
     * Supplies a node with a unique identifier.
     * If the node cannot be found in the sheet -1 will be returned.
     */
    identify(node: Position): number {
        // check if grounded first
        if (this.isGround(node)) {
            return 0;
        }
        // else go through and find where this node falls in node hierarchy
        let id = -1;
        this.nodes.forEach((sheetNode, i) => {
            if (node[0] == sheetNode[0] && node[1] == sheetNode[1]) {
                id = i + 1; // exclude zero, which is for ground
            }
        });
        return id;
    }

    /**
     * Determines if a node is connected to a ground
     */
    isGround(node: Position): boolean {
        let grounded = false;
        this._nodeInstances().get(node).forEach((cpt) => {
            if (cpt instanceof Ground) {
                grounded = true;
            }
        });
        return grounded;
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

    /**
     * All nodes included in the sheet
     */
    get nodes() {return this._nodeInstances().keys()}
}