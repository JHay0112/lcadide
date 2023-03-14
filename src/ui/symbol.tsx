/**
 * Produces component symbols for components.
 * 
 * Usage
 * -----
 * ```tsx
 * import Symbol from "./ui/symbol"
 * ```
 */

import { splitProps, createSignal, onMount, onCleanup } from "solid-js";

import Sheet from "../model/sheet";
import Component from "../model/components/component";
import Wire from "../model/wire";

import ContextMenu from "./contextmenu";

/**
 * SVG component symbols.
 * 
 * Props
 * -----
 * @param component
 *  The component to represent as a symbol.
 * @param sheet
 *  The sheet of which the component should belong.
 */
export default function Symbol(props) {

    // get component object from props
    const [local, _] = splitProps(props, ["component", "sheet"]);
    const component: Component | Wire = local.component;
    const sheet: Sheet = local.sheet;

    // track whether to display the context menu
    const [displayMenu, setDisplayMenu] = createSignal(false);

    // define the context menu
    let contextMenuRef;
    const contextMenu = (<>
        <div ref={contextMenuRef}>
            <ContextMenu when={displayMenu()} sheet={sheet} component={component} onExit={() => {setDisplayMenu(false)}} />
        </div>
    </>);

    // add the context menu to the document when mounted
    onMount(() => {
        document.body.appendChild(contextMenuRef);
    });

    // and remove context menu when dismounted
    onCleanup(() => {
        document.body.removeChild(contextMenuRef);
    });

    return (<>
        <g
            class={`${sheet.active? "cursor-grabbing" : "cursor-grab"} dark:invert`}
            shape-rendering="auto"

            transform={`
                translate(${sheet.toPixels(component.position)[0]} ${sheet.toPixels(component.position)[1]})
                rotate(${-90*component.orientation} ${sheet.toPixels(component.middle)[0]} ${sheet.toPixels(component.middle)[1]})
            `}
        >
            <path 
                style={`
                    stroke: ${component.color}; 
                    fill: none;
                    stroke-width: 1.5; 
                `}

                d={component.path()}
            />
            <path 
                style={`
                    stroke: rgba(0, 0, 0, 0);
                    fill: none;
                    stroke-width: 10; 
                `}

                d={component.path()} 

                onContextMenu={(event) => {
                    setDisplayMenu(true);
                    event.preventDefault();
                }}
                onMouseDown={(event) => {
                    if (!sheet.active && event.button == 0) { // button == 0 -> main button
                        sheet.delete(component);
                        sheet.activeComponent = component;
                    }
                }}  
            />
        </g>
    </>);  
}  