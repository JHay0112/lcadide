/**
 * Produces component symbols for components.
 */

import { splitProps, createSignal, Show } from "solid-js";

import Sheet from "../model/sheet";
import Component from "../model/components/component";
import { Orientation } from "../types";

/**
 * SVG component symbols.
 */
export default function Symbol(props) {

    // get component object from props
    const [local, _] = splitProps(props, ["component", "sheet"]);
    const component: Component = local.component;
    const sheet: Sheet = local.sheet;

    const [displayContextMenu, setDisplayContextMenu] = createSignal(false);
    const [contextMenuPosition, setContextMenuPosition] = createSignal([0, 0]);

    // register a keydown event
    // this handles keypresses that may manipulate the component
    window.addEventListener("keydown", (event) => {
        if (component == sheet.activeComponent && sheet.active) {
            switch (event.key) {
                case "r":
                    component.rotate();
                    break;
                case "Delete":
                    sheet.delete(component);
                    break;
                case "Escape":
                    sheet.placeActiveComponent();
                    break;
            }
        }
    });

    return (<>
        <svg 
            height={component.pixelHeight} 
            width={component.pixelWidth}
            class={`${sheet.active? "cursor-grabbing" : "cursor-grab"} dark:invert`}
            style={`
                stroke: ${component.color}; 
                stroke-width: 1.5; 
                fill: none;
                position: absolute;
                top: ${sheet.toPixels(component.position)[1] - (Orientation.HORIZONTAL == component.orientation? sheet.gridSpacing : 0)}px;
                left: ${sheet.toPixels(component.position)[0] + (Orientation.HORIZONTAL == component.orientation? sheet.gridSpacing : 0)}px;
                transform: rotate(${90*component.orientation}deg);
            `}
            shape-rendering="auto"
            onContextMenu={(event) => {
                setContextMenuPosition([event.clientX, event.clientY]);
                setDisplayContextMenu(true);
                event.preventDefault();
            }}
            onMouseDown={(event) => {
                if (!sheet.active && event.button == 0) { // button == 0 -> main button
                    sheet.delete(component);
                    sheet.activeComponent = component;
                }
            }}
        >
            <path d={component.path()} />
        </svg>
        <Show when={displayContextMenu()}>
            <aside 
                class="bg-primary rounded-md p-3 drop-shadow-md text-left z-50" 
                style={`
                    position: absolute;
                    top: ${contextMenuPosition()[1] - 3}px;
                    left: ${contextMenuPosition()[0] - 3}px;
                `}
                onMouseLeave={() => {
                    setDisplayContextMenu(false);
                }}
            >
                <button class="w-full hover:opacity-80" onClick={() => {sheet.delete(component)}}>Delete</button>
                <button class="w-full hover:opacity-80" onClick={() => {component.rotate()}}>Rotate</button>
            </aside>
        </Show>
    </>);  
}