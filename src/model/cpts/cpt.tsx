/**
 * Handles circuit components
 */

/**
 * Base class for circuit components
 * Specific components need to derive from this base class
 */
export abstract class Component {

    private _name: string;
    private _value: string;

    /**
     * Returns a representation of the component for the canvas
     * 
     * TODO: Set return type
     */
    abstract forCanvas();

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
    forLcapy() {
        // TODO
    }

    get name()  {return this._name}
    get value() {return this._value}
}