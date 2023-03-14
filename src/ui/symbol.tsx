/**
 * Produces component symbols for components.
 */

import { splitProps, Show, createSignal, onMount } from "solid-js";

import Sheet from "../model/sheet";
import Component from "../model/components/component";
import Wire from "../model/wire";

import ContextMenu from "./contextmenu";

/**
 * SVG component symbols.
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
        <aside ref={contextMenuRef}>
            <Show when={displayMenu()}>
                <ContextMenu sheet={sheet} component={component} onExit={() => {setDisplayMenu(false)}} />
            </Show>
        </aside>
    </>);

    // add the context menu to the document when the 
    onMount(() => {
        document.body.appendChild(contextMenuRef);
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