/**
 * Produces component symbols for components.
 */

import { splitProps, createSignal, Show } from "solid-js";

import Popup from "./popup";

import Sheet from "../model/sheet";
import Component from "../model/components/component";

/**
 * SVG component symbols.
 */
export default function Symbol(props) {

    // get component object from props
    const [local, _] = splitProps(props, ["component", "sheet"]);
    const component: Component = local.component;
    const sheet: Sheet = local.sheet;

    const [displayContextMenu, setDisplayContextMenu] = createSignal(false);

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
                top: ${sheet.toPixels(component.position)[1]}px;
                left: ${sheet.toPixels(component.position)[0]}px;
                rotate: ${90*component.orientation}deg;
            `}
            shape-rendering="auto"
            onContextMenu={(event) => {
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
            <Popup title={component.name} onExit={() => {setDisplayContextMenu(false)}}>
                <button class="w-full hover:opacity-80" onClick={() => {sheet.delete(component)}}>Delete</button>
                <button class="w-full hover:opacity-80" onClick={() => {component.rotate()}}>Rotate</button>
            </Popup>
        </Show>
    </>);  
}